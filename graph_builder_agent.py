"""
Graph Builder Agent with Neo4j Integration (V1)
================================================
Extends GraphBuilderAgent with Neo4j export and query capabilities.

Features:
- All original GraphBuilderAgent functionality
- Neo4j CSV export (admin import format)
- Direct Neo4j connection (py2neo)
- Pre-generated fraud detection Cypher queries
- NO Claude API in V1 (keeping it deterministic)

NO entity resolution. NO ML. Pure graph operations.
"""

import pandas as pd
import networkx as nx
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import json
import os


class GraphBuilderAgent:
    """
    Enhanced Graph Builder with Neo4j integration.
    
    Graph Structure:
    - Nodes: Account IDs
    - Edges: Directed money flows (sender → receiver)
    - Edge attributes: amount, count, first_time, last_time, transaction_ids
    - Persistence: CSV files + Neo4j graph database
    """
    
    def __init__(self):
        self.graph = nx.DiGraph()
        self.schema_map = {}
        self.neo4j_connector = None
        
    # =========================================================================
    # ORIGINAL GRAPH BUILDER METHODS (UNCHANGED)
    # =========================================================================
    
    def infer_schema(self, df: pd.DataFrame) -> Dict[str, str]:
        """Auto-detect column names for required fields."""
        columns = df.columns.str.lower()
        
        patterns = {
            'transaction_id': ['transaction_id', 'txn_id', 'trans_id', 'id'],
            'account_id': ['account_id', 'acc_id', 'account', 'account_number'],
            'credit': ['credit', 'cr', 'credit_amount'],
            'debit': ['debit', 'dr', 'debit_amount'],
            'timestamp': ['timestamp', 'datetime', 'date_time'],
            'date': ['date', 'txn_date', 'transaction_date'],
            'time': ['time', 'txn_time', 'transaction_time'],
            'counterparty': ['counterparty_account_id', 'counterparty', 'other_account']
        }
        
        schema = {}
        for field, keywords in patterns.items():
            for keyword in keywords:
                if keyword in columns.values:
                    schema[field] = df.columns[columns == keyword].tolist()[0]
                    break
        
        required = ['transaction_id', 'account_id', 'credit', 'debit']
        missing = [f for f in required if f not in schema]
        if missing:
            raise ValueError(f"Missing required fields: {missing}")
        
        self.schema_map = schema
        return schema
    
    def standardize_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Rename columns to standard internal schema."""
        std_df = df.copy()
        
        rename_map = {v: k for k, v in self.schema_map.items()}
        std_df.rename(columns=rename_map, inplace=True)
        
        if 'timestamp' not in std_df.columns:
            if 'date' in std_df.columns and 'time' in std_df.columns:
                std_df['timestamp'] = pd.to_datetime(
                    std_df['date'].astype(str) + ' ' + std_df['time'].astype(str),
                    errors='coerce'
                )
            elif 'date' in std_df.columns:
                std_df['timestamp'] = pd.to_datetime(std_df['date'], errors='coerce')
        else:
            std_df['timestamp'] = pd.to_datetime(std_df['timestamp'], errors='coerce')
        
        if 'counterparty' not in std_df.columns:
            std_df['counterparty'] = None
        
        return std_df
    
    def extract_transfers(self, df: pd.DataFrame) -> List[Dict]:
        """Convert dual-entry transactions into single directed transfers."""
        transfers = []
        grouped = df.groupby('transaction_id')
        
        for txn_id, group in grouped:
            if len(group) < 2:
                continue
            
            debit_rows = group[group['debit'] > 0]
            credit_rows = group[group['credit'] > 0]
            
            if len(debit_rows) == 0 or len(credit_rows) == 0:
                continue
            
            for _, debit_row in debit_rows.iterrows():
                for _, credit_row in credit_rows.iterrows():
                    transfer = {
                        'transaction_id': txn_id,
                        'sender': debit_row['account_id'],
                        'receiver': credit_row['account_id'],
                        'amount': debit_row['debit'],
                        'timestamp': debit_row['timestamp']
                    }
                    transfers.append(transfer)
        
        return transfers
    
    def build_graph(self, transfers: List[Dict]) -> nx.DiGraph:
        """Construct directed graph with edge aggregation."""
        self.graph.clear()
        edge_data = {}
        
        for transfer in transfers:
            sender = transfer['sender']
            receiver = transfer['receiver']
            amount = transfer['amount']
            timestamp = transfer['timestamp']
            txn_id = transfer['transaction_id']
            
            if sender not in self.graph:
                self.graph.add_node(sender, account_id=sender)
            if receiver not in self.graph:
                self.graph.add_node(receiver, account_id=receiver)
            
            edge_key = (sender, receiver)
            
            if edge_key not in edge_data:
                edge_data[edge_key] = {
                    'total_amount': 0,
                    'count': 0,
                    'first_time': timestamp,
                    'last_time': timestamp,
                    'transaction_ids': []
                }
            
            edge_data[edge_key]['total_amount'] += amount
            edge_data[edge_key]['count'] += 1
            edge_data[edge_key]['transaction_ids'].append(txn_id)
            
            if timestamp < edge_data[edge_key]['first_time']:
                edge_data[edge_key]['first_time'] = timestamp
            if timestamp > edge_data[edge_key]['last_time']:
                edge_data[edge_key]['last_time'] = timestamp
        
        for (sender, receiver), data in edge_data.items():
            time_delta = (data['last_time'] - data['first_time']).total_seconds() / 3600
            
            self.graph.add_edge(
                sender, 
                receiver,
                total_amount=data['total_amount'],
                count=data['count'],
                first_time=data['first_time'],
                last_time=data['last_time'],
                time_window_hours=time_delta,
                transaction_ids=data['transaction_ids'],
                avg_amount=data['total_amount'] / data['count']
            )
        
        return self.graph
    
    def process_transactions(self, csv_path: str) -> nx.DiGraph:
        """End-to-end processing: CSV → Graph"""
        df = pd.read_csv(csv_path)
        print(f"Loaded {len(df)} transaction rows")
        
        schema = self.infer_schema(df)
        print(f"Detected schema: {schema}")
        
        df_std = self.standardize_dataframe(df)
        transfers = self.extract_transfers(df_std)
        print(f"Extracted {len(transfers)} directed transfers")
        
        graph = self.build_graph(transfers)
        print(f"Graph: {graph.number_of_nodes()} nodes, {graph.number_of_edges()} edges")
        
        return graph
    
    def get_graph_summary(self) -> Dict:
        """Generate graph statistics for validation."""
        if self.graph.number_of_nodes() == 0:
            return {"error": "Graph is empty"}
        
        return {
            "nodes": self.graph.number_of_nodes(),
            "edges": self.graph.number_of_edges(),
            "total_amount": sum(
                data['total_amount'] 
                for _, _, data in self.graph.edges(data=True)
            ),
            "avg_degree": sum(dict(self.graph.degree()).values()) / self.graph.number_of_nodes(),
            "weakly_connected_components": nx.number_weakly_connected_components(self.graph),
            "strongly_connected_components": nx.number_strongly_connected_components(self.graph)
        }
    
    # =========================================================================
    # CSV EXPORT METHODS (FROM ORIGINAL)
    # =========================================================================
    
    def export_to_csv(self, output_dir: str = './graph_output'):
        """Export graph to 3 CSV files for persistence and analysis."""
        os.makedirs(output_dir, exist_ok=True)
        
        if self.graph.number_of_nodes() == 0:
            raise ValueError("Cannot export empty graph")
        
        # Export nodes
        nodes_data = []
        for node in self.graph.nodes():
            nodes_data.append({
                'account_id': node,
                'in_degree': self.graph.in_degree(node),
                'out_degree': self.graph.out_degree(node),
                'total_degree': self.graph.degree(node),
                'total_received': sum(
                    data['total_amount'] 
                    for _, _, data in self.graph.in_edges(node, data=True)
                ),
                'total_sent': sum(
                    data['total_amount'] 
                    for _, _, data in self.graph.out_edges(node, data=True)
                ),
                'num_receivers': self.graph.out_degree(node),
                'num_senders': self.graph.in_degree(node)
            })
        
        nodes_df = pd.DataFrame(nodes_data)
        nodes_path = os.path.join(output_dir, 'nodes.csv')
        nodes_df.to_csv(nodes_path, index=False)
        print(f"✓ Saved {len(nodes_df)} nodes → {nodes_path}")
        
        # Export edges
        edges_data = []
        for sender, receiver, data in self.graph.edges(data=True):
            edges_data.append({
                'sender': sender,
                'receiver': receiver,
                'total_amount': data['total_amount'],
                'transaction_count': data['count'],
                'avg_amount': data['avg_amount'],
                'first_timestamp': data['first_time'],
                'last_timestamp': data['last_time'],
                'time_window_hours': data['time_window_hours'],
                'transaction_ids': '|'.join(data['transaction_ids'])
            })
        
        edges_df = pd.DataFrame(edges_data)
        edges_path = os.path.join(output_dir, 'edges.csv')
        edges_df.to_csv(edges_path, index=False)
        print(f"✓ Saved {len(edges_df)} edges → {edges_path}")
        
        # Export transfers
        transfers_data = []
        for sender, receiver, data in self.graph.edges(data=True):
            for txn_id in data['transaction_ids']:
                transfers_data.append({
                    'transaction_id': txn_id,
                    'sender': sender,
                    'receiver': receiver,
                    'amount': data['avg_amount'],
                    'timestamp': data['first_time']
                })
        
        transfers_df = pd.DataFrame(transfers_data)
        transfers_path = os.path.join(output_dir, 'transfers.csv')
        transfers_df.to_csv(transfers_path, index=False)
        print(f"✓ Saved {len(transfers_df)} transfers → {transfers_path}")
        
        print(f"\n✅ Graph exported to {output_dir}/")
        return {
            'nodes': nodes_path,
            'edges': edges_path,
            'transfers': transfers_path
        }
    
    def load_from_csv(self, edges_path: str):
        """Load graph from previously exported edges.csv"""
        edges_df = pd.read_csv(edges_path)
        self.graph.clear()
        
        for _, row in edges_df.iterrows():
            sender = row['sender']
            receiver = row['receiver']
            
            if sender not in self.graph:
                self.graph.add_node(sender, account_id=sender)
            if receiver not in self.graph:
                self.graph.add_node(receiver, account_id=receiver)
            
            self.graph.add_edge(
                sender,
                receiver,
                total_amount=row['total_amount'],
                count=row['transaction_count'],
                avg_amount=row['avg_amount'],
                first_time=pd.to_datetime(row['first_timestamp']),
                last_time=pd.to_datetime(row['last_timestamp']),
                time_window_hours=row['time_window_hours'],
                transaction_ids=row['transaction_ids'].split('|')
            )
        
        print(f"✓ Loaded graph: {self.graph.number_of_nodes()} nodes, {self.graph.number_of_edges()} edges")
        return self.graph
    
    # =========================================================================
    # NEO4J INTEGRATION (NEW)
    # =========================================================================
    
    def export_to_neo4j_csv(self, output_dir: str = './neo4j_import'):
        """
        Export graph in Neo4j admin import CSV format.
        This is the FASTEST way to import into Neo4j.
        
        Creates:
        - nodes.csv: Neo4j-compatible node format
        - relationships.csv: Neo4j-compatible edge format
        - import_script.sh: Shell script for neo4j-admin import
        - cypher_queries.txt: Pre-generated fraud detection queries
        """
        os.makedirs(output_dir, exist_ok=True)
        
        if self.graph.number_of_nodes() == 0:
            raise ValueError("Cannot export empty graph")
        
        # ===== EXPORT NODES FOR NEO4J =====
        nodes_data = []
        for node in self.graph.nodes():
            in_amount = sum(
                data['total_amount'] 
                for _, _, data in self.graph.in_edges(node, data=True)
            )
            out_amount = sum(
                data['total_amount'] 
                for _, _, data in self.graph.out_edges(node, data=True)
            )
            
            nodes_data.append({
                'accountId:ID': node,
                ':LABEL': 'Account',
                'in_degree:int': self.graph.in_degree(node),
                'out_degree:int': self.graph.out_degree(node),
                'total_received:float': in_amount,
                'total_sent:float': out_amount,
                'net_flow:float': in_amount - out_amount
            })
        
        nodes_df = pd.DataFrame(nodes_data)
        nodes_path = os.path.join(output_dir, 'nodes.csv')
        nodes_df.to_csv(nodes_path, index=False)
        print(f"✓ Neo4j nodes → {nodes_path}")
        
        # ===== EXPORT RELATIONSHIPS FOR NEO4J =====
        rels_data = []
        for sender, receiver, data in self.graph.edges(data=True):
            rels_data.append({
                ':START_ID': sender,
                ':END_ID': receiver,
                ':TYPE': 'TRANSFERRED_TO',
                'total_amount:float': data['total_amount'],
                'transaction_count:int': data['count'],
                'avg_amount:float': data['avg_amount'],
                'first_timestamp:datetime': data['first_time'].isoformat(),
                'last_timestamp:datetime': data['last_time'].isoformat(),
                'time_window_hours:float': data['time_window_hours'],
                'transaction_ids:string[]': '|'.join(data['transaction_ids'])
            })
        
        rels_df = pd.DataFrame(rels_data)
        rels_path = os.path.join(output_dir, 'relationships.csv')
        rels_df.to_csv(rels_path, index=False)
        print(f"✓ Neo4j relationships → {rels_path}")
        
        # ===== GENERATE IMPORT SCRIPT =====
        import_script = f"""#!/bin/bash
# Neo4j Admin Import Script
# Generated: {datetime.now().isoformat()}

neo4j-admin database import full \\
    --nodes={nodes_path} \\
    --relationships={rels_path} \\
    --overwrite-destination=true \\
    fraud-detection

echo "✅ Graph imported to 'fraud-detection' database"
echo "Start Neo4j and run: :use fraud-detection"
"""
        
        script_path = os.path.join(output_dir, 'import_script.sh')
        with open(script_path, 'w') as f:
            f.write(import_script)
        os.chmod(script_path, 0o755)
        print(f"✓ Import script → {script_path}")
        
        # ===== GENERATE CYPHER QUERIES =====
        self._generate_fraud_queries(output_dir)
        
        print(f"\n✅ Neo4j files ready in {output_dir}/")
        print("\n📖 To import:")
        print("  1. Stop Neo4j: neo4j stop")
        print(f"  2. Run: {script_path}")
        print("  3. Start Neo4j: neo4j start")
        print("  4. Open Neo4j Browser and run queries from cypher_queries.txt")
        
        return {
            'nodes': nodes_path,
            'relationships': rels_path,
            'script': script_path
        }
    
    def _generate_fraud_queries(self, output_dir: str):
        """Generate Cypher queries for fraud detection patterns."""
        queries_path = os.path.join(output_dir, 'cypher_queries.txt')
        
        queries = """# FRAUD DETECTION CYPHER QUERIES
# Generated: {datetime}
# Use these in Neo4j Browser for fraud pattern detection
========================================================================

// ===== 1. SMURFING DETECTION =====
// Find accounts distributing money to many recipients with similar amounts

MATCH (source:Account)-[r:TRANSFERRED_TO]->(target:Account)
WITH source, 
     count(DISTINCT target) as num_recipients,
     avg(r.avg_amount) as avg_amount,
     stdev(r.avg_amount) as stdev_amount,
     sum(r.total_amount) as total_sent
WHERE num_recipients > 10 
  AND stdev_amount < (avg_amount * 0.2)
RETURN source.accountId as suspicious_account,
       num_recipients,
       avg_amount,
       total_sent
ORDER BY num_recipients DESC
LIMIT 20;

========================================================================

// ===== 2. LAYERING DETECTION =====
// Find multi-hop money flows (3-5 hops)

MATCH path = (start:Account)-[:TRANSFERRED_TO*3..5]->(end:Account)
WHERE start <> end
WITH start, end, path,
     [r in relationships(path) | r.total_amount] as amounts,
     length(path) as hops
RETURN start.accountId as origin,
       end.accountId as destination,
       hops,
       reduce(total = 0, amount IN amounts | total + amount) as total_moved
ORDER BY hops DESC, total_moved DESC
LIMIT 50;

========================================================================

// ===== 3. CYCLE DETECTION =====
// Find circular money flows (money returns to origin)

MATCH path = (start:Account)-[:TRANSFERRED_TO*2..4]->(start)
WITH start, path,
     [r in relationships(path) | r.total_amount] as amounts,
     length(path) as cycle_length
RETURN start.accountId as account,
       cycle_length,
       reduce(total = 0, amount IN amounts | total + amount) as cycle_amount,
       [n in nodes(path) | n.accountId] as cycle_path
ORDER BY cycle_length DESC
LIMIT 30;

========================================================================

// ===== 4. BURST DETECTION =====
// Rapid-fire transactions (>5 transfers in <1 hour)

MATCH (a:Account)-[r:TRANSFERRED_TO]->()
WHERE r.transaction_count > 5 
  AND r.time_window_hours < 1.0
RETURN a.accountId as account,
       r.transaction_count as transfers,
       r.time_window_hours as hours,
       r.total_amount as amount
ORDER BY r.transaction_count DESC
LIMIT 50;

========================================================================

// ===== 5. HUB ACCOUNTS =====
// Find central accounts with many connections

MATCH (a:Account)
WHERE a.out_degree > 15 OR a.in_degree > 15
RETURN a.accountId as account,
       a.in_degree as incoming,
       a.out_degree as outgoing,
       a.total_received as received,
       a.total_sent as sent,
       a.net_flow as net_flow
ORDER BY (a.in_degree + a.out_degree) DESC
LIMIT 30;

========================================================================

// ===== 6. COMBINED SUSPICIOUS PATTERN =====
// High out-degree + rapid transfers + similar amounts

MATCH (a:Account)-[r:TRANSFERRED_TO]->(target:Account)
WITH a, 
     count(DISTINCT target) as num_targets,
     sum(r.transaction_count) as total_txns,
     avg(r.time_window_hours) as avg_time_window,
     stdev(r.avg_amount) as amount_variance,
     sum(r.total_amount) as total_sent
WHERE num_targets > 8
  AND avg_time_window < 2.0
  AND amount_variance < 5000
RETURN a.accountId as high_risk_account,
       num_targets as recipients,
       total_txns as transactions,
       avg_time_window as avg_hours,
       total_sent as total_amount
ORDER BY num_targets DESC
LIMIT 20;

========================================================================
""".format(datetime=datetime.now().isoformat())
        
        with open(queries_path, 'w') as f:
            f.write(queries)
        
        print(f"✓ Cypher queries → {queries_path}")
    
    def connect_to_neo4j(self, uri: str = "bolt://localhost:7687",
                         user: str = "neo4j",
                         password: str = "password"):
        """
        Connect to Neo4j database directly (requires py2neo).
        
        Args:
            uri: Neo4j connection URI
            user: Neo4j username
            password: Neo4j password
        """
        try:
            from py2neo import Graph
            self.neo4j_connector = Graph(uri, auth=(user, password))
            print(f"✓ Connected to Neo4j at {uri}")
            return True
        except ImportError:
            print("⚠️  py2neo not installed. Run: pip install py2neo")
            return False
        except Exception as e:
            print(f"❌ Neo4j connection failed: {e}")
            return False
    
    def push_to_neo4j(self):
        """
        Push current NetworkX graph directly to Neo4j.
        Requires active Neo4j connection via connect_to_neo4j().
        
        This is slower than CSV import but more flexible for development.
        """
        if self.neo4j_connector is None:
            raise ConnectionError("Not connected to Neo4j. Call connect_to_neo4j() first.")
        
        from py2neo import Node, Relationship
        
        print(f"Pushing {self.graph.number_of_nodes()} nodes to Neo4j...")
        
        # Clear existing data
        self.neo4j_connector.run("MATCH (n) DETACH DELETE n")
        
        # Create nodes
        node_map = {}
        for node_id in self.graph.nodes():
            in_amount = sum(
                data['total_amount'] 
                for _, _, data in self.graph.in_edges(node_id, data=True)
            )
            out_amount = sum(
                data['total_amount'] 
                for _, _, data in self.graph.out_edges(node_id, data=True)
            )
            
            node = Node("Account",
                       accountId=node_id,
                       in_degree=self.graph.in_degree(node_id),
                       out_degree=self.graph.out_degree(node_id),
                       total_received=in_amount,
                       total_sent=out_amount)
            
            self.neo4j_connector.create(node)
            node_map[node_id] = node
        
        print(f"✓ Pushed {len(node_map)} nodes")
        print(f"Pushing {self.graph.number_of_edges()} relationships...")
        
        # Create relationships
        for sender, receiver, data in self.graph.edges(data=True):
            rel = Relationship(
                node_map[sender],
                "TRANSFERRED_TO",
                node_map[receiver],
                total_amount=data['total_amount'],
                transaction_count=data['count'],
                avg_amount=data['avg_amount'],
                first_timestamp=data['first_time'].isoformat(),
                last_timestamp=data['last_time'].isoformat(),
                time_window_hours=data['time_window_hours']
            )
            self.neo4j_connector.create(rel)
        
        print(f"✓ Pushed {self.graph.number_of_edges()} relationships")
        print("✅ Graph successfully pushed to Neo4j")
    
    def query_neo4j(self, cypher_query: str) -> pd.DataFrame:
        """
        Execute Cypher query on Neo4j and return results.
        
        Args:
            cypher_query: Cypher query string
        
        Returns:
            Query results as DataFrame
        """
        if self.neo4j_connector is None:
            raise ConnectionError("Not connected to Neo4j. Call connect_to_neo4j() first.")
        
        result = self.neo4j_connector.run(cypher_query)
        return result.to_data_frame()


# =============================================================================
# USAGE EXAMPLES
# =============================================================================

if __name__ == "__main__":
    print("Graph Builder Agent with Neo4j Integration (V1)")
    print("=" * 60)
    
    # ===== WORKFLOW 1: Build Graph & Export to Neo4j CSV =====
    print("\n📊 WORKFLOW 1: CSV Export for Neo4j Admin Import")
    print("-" * 60)
    
    builder = GraphBuilderAgent()
    
    # Process transactions
    graph = builder.process_transactions('transactions.csv')
    
    # Export for Neo4j
    neo4j_paths = builder.export_to_neo4j_csv(output_dir='./neo4j_import')
    
    # Then run: ./neo4j_import/import_script.sh
    
    # ===== WORKFLOW 2: Direct Neo4j Connection =====
    print("\n🔗 WORKFLOW 2: Direct Neo4j Push")
    print("-" * 60)
    
    # Connect to Neo4j
    builder.connect_to_neo4j(
        uri="neo4j+s://95f7a2b6.databases.neo4j.io",
        user="neo4j",
        password="jSE1DuZDxet9DZc8PcaRDlZ-d5XynxlHkmcIzY9YbXw"
    )
    
    # Push graph
    builder.push_to_neo4j()
    
    # Run fraud detection query
    # smurfing = builder.query_neo4j("""
    #     MATCH (a:Account)-[r:TRANSFERRED_TO]->()
    #     WHERE a.out_degree > 10
    #     RETURN a.accountId, a.out_degree
    #     ORDER BY a.out_degree DESC
    #     LIMIT 10
    # """)
    # print(smurfing)
    
    print("\n✅ Agent ready. Use workflows above to integrate with Neo4j.")