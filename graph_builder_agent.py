"""
Graph Builder Agent (V1)
========================
Converts transaction CSV into directed NetworkX graph with:
- Automated schema inference
- Dynamic edge aggregation
- Time window tracking

NO entity resolution. NO ML. Pure deterministic logic.
"""

import pandas as pd
import networkx as nx
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import json


class GraphBuilderAgent:
    """
    Builds transaction graph from bank statement CSV data.
    
    Graph Structure:
    - Nodes: Account IDs
    - Edges: Directed money flows (sender → receiver)
    - Edge attributes: amount, count, first_time, last_time, transaction_ids
    """
    
    def __init__(self):
        self.graph = nx.DiGraph()
        self.schema_map = {}
        
    def infer_schema(self, df: pd.DataFrame) -> Dict[str, str]:
        """
        Auto-detect column names for required fields.
        Handles variations like 'txn_id' vs 'transaction_id'.
        
        Returns mapping: {standard_name: actual_column_name}
        """
        columns = df.columns.str.lower()
        
        # Define search patterns for each field
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
                    # Get original case-sensitive column name
                    schema[field] = df.columns[columns == keyword].tolist()[0]
                    break
        
        # Validation
        required = ['transaction_id', 'account_id', 'credit', 'debit']
        missing = [f for f in required if f not in schema]
        if missing:
            raise ValueError(f"Missing required fields: {missing}")
        
        self.schema_map = schema
        return schema
    
    def standardize_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Rename columns to standard internal schema.
        Create unified timestamp if split across date/time.
        """
        std_df = df.copy()
        
        # Rename columns
        rename_map = {v: k for k, v in self.schema_map.items()}
        std_df.rename(columns=rename_map, inplace=True)
        
        # Create unified timestamp
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
        
        # Fill missing counterparty if available from metadata
        if 'counterparty' not in std_df.columns:
            std_df['counterparty'] = None
        
        return std_df
    
    def extract_transfers(self, df: pd.DataFrame) -> List[Dict]:
        """
        Convert dual-entry transactions into single directed transfers.
        
        Each real transfer has 2 rows:
        - Debit row (sender): debit > 0
        - Credit row (receiver): credit > 0
        
        Returns list of transfers: {txn_id, sender, receiver, amount, timestamp}
        """
        transfers = []
        
        # Group by transaction_id
        grouped = df.groupby('transaction_id')
        
        for txn_id, group in grouped:
            # Skip if only one row (incomplete transaction)
            if len(group) < 2:
                continue
            
            # Find debit and credit rows
            debit_rows = group[group['debit'] > 0]
            credit_rows = group[group['credit'] > 0]
            
            if len(debit_rows) == 0 or len(credit_rows) == 0:
                continue
            
            # Handle multiple debits/credits (rare, but possible)
            for _, debit_row in debit_rows.iterrows():
                for _, credit_row in credit_rows.iterrows():
                    transfer = {
                        'transaction_id': txn_id,
                        'sender': debit_row['account_id'],
                        'receiver': credit_row['account_id'],
                        'amount': debit_row['debit'],  # Use debit amount
                        'timestamp': debit_row['timestamp']
                    }
                    transfers.append(transfer)
        
        return transfers
    
    def build_graph(self, transfers: List[Dict]) -> nx.DiGraph:
        """
        Construct directed graph with edge aggregation.
        
        Multiple transfers A→B are aggregated into single edge with:
        - total_amount: sum of all transfers
        - count: number of transfers
        - first_time: earliest transfer
        - last_time: latest transfer
        - transaction_ids: list of all txn IDs
        """
        self.graph.clear()
        
        # Track aggregated edges
        edge_data = {}
        
        for transfer in transfers:
            sender = transfer['sender']
            receiver = transfer['receiver']
            amount = transfer['amount']
            timestamp = transfer['timestamp']
            txn_id = transfer['transaction_id']
            
            # Add nodes if not exist
            if sender not in self.graph:
                self.graph.add_node(sender, account_id=sender)
            if receiver not in self.graph:
                self.graph.add_node(receiver, account_id=receiver)
            
            # Create edge key
            edge_key = (sender, receiver)
            
            # Initialize or update edge data
            if edge_key not in edge_data:
                edge_data[edge_key] = {
                    'total_amount': 0,
                    'count': 0,
                    'first_time': timestamp,
                    'last_time': timestamp,
                    'transaction_ids': []
                }
            
            # Aggregate
            edge_data[edge_key]['total_amount'] += amount
            edge_data[edge_key]['count'] += 1
            edge_data[edge_key]['transaction_ids'].append(txn_id)
            
            # Update time window
            if timestamp < edge_data[edge_key]['first_time']:
                edge_data[edge_key]['first_time'] = timestamp
            if timestamp > edge_data[edge_key]['last_time']:
                edge_data[edge_key]['last_time'] = timestamp
        
        # Add aggregated edges to graph
        for (sender, receiver), data in edge_data.items():
            # Calculate time window duration (in hours)
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
        """
        End-to-end processing: CSV → Graph
        
        Steps:
        1. Load CSV
        2. Infer schema
        3. Standardize columns
        4. Extract transfers
        5. Build graph
        """
        # Load data
        df = pd.read_csv(csv_path)
        print(f"Loaded {len(df)} transaction rows")
        
        # Infer and standardize schema
        schema = self.infer_schema(df)
        print(f"Detected schema: {schema}")
        
        df_std = self.standardize_dataframe(df)
        
        # Extract transfers
        transfers = self.extract_transfers(df_std)
        print(f"Extracted {len(transfers)} directed transfers")
        
        # Build graph
        graph = self.build_graph(transfers)
        print(f"Graph: {graph.number_of_nodes()} nodes, {graph.number_of_edges()} edges")
        
        return graph
    
    def get_graph_summary(self) -> Dict:
        """
        Generate graph statistics for validation.
        """
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
    
    def export_to_csv(self, output_dir: str = './graph_output'):
        """
        Export graph to 3 CSV files for persistence and analysis.
        
        Creates:
        - nodes.csv: Account nodes with degree metrics
        - edges.csv: Aggregated transfer edges
        - transfers.csv: Individual transaction records
        
        Args:
            output_dir: Directory to save CSV files
        """
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        if self.graph.number_of_nodes() == 0:
            raise ValueError("Cannot export empty graph")
        
        # ===== 1. EXPORT NODES =====
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
        
        # ===== 2. EXPORT EDGES (AGGREGATED) =====
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
                'transaction_ids': '|'.join(data['transaction_ids'])  # Pipe-separated
            })
        
        edges_df = pd.DataFrame(edges_data)
        edges_path = os.path.join(output_dir, 'edges.csv')
        edges_df.to_csv(edges_path, index=False)
        print(f"✓ Saved {len(edges_df)} edges → {edges_path}")
        
        # ===== 3. EXPORT INDIVIDUAL TRANSFERS =====
        # Reconstruct from edge transaction_ids
        transfers_data = []
        for sender, receiver, data in self.graph.edges(data=True):
            # Note: We don't have individual amounts stored, so we use avg
            # This is acceptable for V1 audit trail
            for txn_id in data['transaction_ids']:
                transfers_data.append({
                    'transaction_id': txn_id,
                    'sender': sender,
                    'receiver': receiver,
                    'amount': data['avg_amount'],  # Approximation
                    'timestamp': data['first_time']  # Approximation
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
        """
        Load graph from previously exported edges.csv
        
        Args:
            edges_path: Path to edges.csv file
        
        Returns:
            Loaded NetworkX graph
        """
        edges_df = pd.read_csv(edges_path)
        
        self.graph.clear()
        
        for _, row in edges_df.iterrows():
            sender = row['sender']
            receiver = row['receiver']
            
            # Add nodes
            if sender not in self.graph:
                self.graph.add_node(sender, account_id=sender)
            if receiver not in self.graph:
                self.graph.add_node(receiver, account_id=receiver)
            
            # Add edge with attributes
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


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    # Initialize agent
    builder = GraphBuilderAgent()
    
    # ===== WORKFLOW 1: Build and Export =====
    # Process transactions
    graph = builder.process_transactions('transactions.csv')
    
    # Get summary
    summary = builder.get_graph_summary()
    print(json.dumps(summary, indent=2))
    
    # Export to CSV
    paths = builder.export_to_csv(output_dir='./graph_output')
    print(f"Saved to: {paths}")
    
    # ===== WORKFLOW 2: Load Existing Graph =====
    builder_new = GraphBuilderAgent()
    graph = builder_new.load_from_csv('./graph_output/edges.csv')
    
    # Example: Access graph
    for sender, receiver, data in graph.edges(data=True):
        if data['count'] > 5:  # High frequency edges
            print(f"{sender} → {receiver}: ₹{data['total_amount']} ({data['count']} transfers)")
    
    print("Graph Builder Agent initialized. Ready to process transaction data.")