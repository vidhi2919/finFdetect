"""
Pattern Detection Agent - Core Detection Logic (V1)
====================================================
Deterministic, rule-based fraud pattern detection.
NO ML. NO black-box scoring. Pure graph analysis.

Detects three primary patterns:
1. Smurfing: One account → many small transfers
2. Layering: Multi-hop fund movement (obfuscation)
3. Cycles: Money returning to origin (round-tripping)

All detections are threshold-based and fully explainable.
"""

import networkx as nx
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
from collections import deque

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
import os
from dotenv import load_dotenv
from neo4j import GraphDatabase
from datetime import datetime

load_dotenv()  


class FraudPattern(Enum):
    """Enumeration of detectable fraud patterns."""
    SMURFING = "smurfing"
    LAYERING = "layering"
    CYCLE = "cycle"
    BURST = "burst"
    HUB = "hub"


@dataclass
class PatternDetection:
    """
    Container for a single pattern detection result.
    Fully serializable for downstream agents.
    """
    pattern_type: FraudPattern
    account_id: str
    severity: float  # 0.0 to 1.0
    evidence: Dict
    timestamp: datetime
    
    def to_dict(self) -> Dict:
        return {
            'pattern_type': self.pattern_type.value,
            'account_id': self.account_id,
            'severity': self.severity,
            'evidence': self.evidence,
            'timestamp': self.timestamp.isoformat()
        }


class PatternDetectionAgent:
    """
    Deterministic pattern detection using graph analysis.
    
    Detection Methods:
    - Smurfing: High out-degree + low amount variance + rapid timing
    - Layering: Long transaction chains (3-5+ hops)
    - Cycles: Circular money flows
    - Burst: Rapid-fire transactions
    - Hub: Central accounts with many connections
    
    NO machine learning. ALL thresholds are configurable.
    """


    def __init__(self, graph: nx.DiGraph, config: Optional[Dict] = None):
        self.graph = graph
        self.config = config or self._default_config()
        self.detections: List[PatternDetection] = []
        self.MAX_HOPS = 4
        self.MAX_BRANCH = 3
        self.MIN_AMOUNT = 10000
        self.llm = ChatAnthropic(
        model="claude-3-haiku-20240307",
        temperature=0.2,
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
        )
        
    def _default_config(self) -> Dict:
        """Default detection thresholds (can be tuned per jurisdiction)."""
        return {
            'smurfing': {
                'min_recipients': 10,  # Minimum outgoing connections
                'max_amount_variance_pct': 0.25,  # 25% coefficient of variation
                'max_time_window_hours': 24,  # Transactions within 24 hours
                'min_total_amount': 50000  # INR threshold
            },
            'layering': {
                'min_hops': 3,
                'max_hops': 6,
                'min_chain_amount': 10000
            },
            'cycle': {
                'min_cycle_length': 2,
                'max_cycle_length': 5,
                'min_cycle_amount': 5000
            },
            'burst': {
                'min_transactions': 5,
                'max_time_window_hours': 1.0,
                'min_total_amount': 20000
            },
            'hub': {
                'min_total_degree': 20,
                'min_total_flow': 100000
            }
        }
    
    def detect_all_patterns(self) -> List[PatternDetection]:
        """
        Run all pattern detection methods.
        Returns list of detections sorted by severity.
        """
        print("🔍 Running pattern detection...")
        
        self.detections = []
        
        # Run all detectors
        
        self.detections.extend(self._detect_smurfing())
        
        self.detections.extend(self._detect_layering())
        self.detections.extend(self._detect_cycles())
        self.detections.extend(self._detect_bursts())
        self.detections.extend(self._detect_hubs())
        
        # Sort by severity
        self.detections.sort(key=lambda d: d.severity, reverse=True)
        
        print(f"✓ Detected {len(self.detections)} suspicious patterns")
        
        return self.detections
    
    # =========================================================================
    # PATTERN 1: SMURFING DETECTION
    # =========================================================================
    
    def _detect_smurfing(self) -> List[PatternDetection]:
        """
        Detect smurfing: Splitting large amounts into many small transfers.
        
        Criteria:
        - High out-degree (many recipients)
        - Low amount variance (similar transfer sizes)
        - Rapid timing (transactions clustered in time)
        - Above monetary threshold
        """
        detections = []
        config = self.config['smurfing']
        
        for node in self.graph.nodes():
            out_edges = list(self.graph.out_edges(node, data=True))
            
            if len(out_edges) < config['min_recipients']:
                continue
            
            # Extract amounts and timing
            amounts = [edge[2]['avg_amount'] for edge in out_edges]
            time_windows = [edge[2]['time_window_hours'] for edge in out_edges]
            total_sent = sum(edge[2]['total_amount'] for edge in out_edges)
            
            # Check total amount threshold
            if total_sent < config['min_total_amount']:
                continue
            
            # Calculate amount variance (coefficient of variation)
            mean_amount = sum(amounts) / len(amounts)
            variance = sum((x - mean_amount)**2 for x in amounts) / len(amounts)
            std_dev = variance ** 0.5
            cv = std_dev / mean_amount if mean_amount > 0 else 1.0
            
            # Check variance threshold
            if cv > config['max_amount_variance_pct']:
                continue
            
            # Check timing (average time window)
            avg_time_window = sum(time_windows) / len(time_windows)
            if avg_time_window > config['max_time_window_hours']:
                continue
            
            # Calculate severity score
            severity = self._calculate_smurfing_severity(
                num_recipients=len(out_edges),
                cv=cv,
                time_window=avg_time_window,
                total_amount=total_sent
            )
            
            # Create detection
            detection = PatternDetection(
                pattern_type=FraudPattern.SMURFING,
                account_id=node,
                severity=severity,
                evidence={
                    'num_recipients': len(out_edges),
                    'total_sent': total_sent,
                    'avg_amount': mean_amount,
                    'amount_variance': cv,
                    'avg_time_window_hours': avg_time_window,
                    'recipient_accounts': [edge[1] for edge in out_edges]
                },
                timestamp=datetime.now()
            )
            detections.append(detection)
        
        print(f"  → Smurfing: {len(detections)} detections")
        return detections
    
    def _calculate_smurfing_severity(self, num_recipients: int, cv: float,
                                     time_window: float, total_amount: float) -> float:
        """Calculate normalized severity score for smurfing."""
        # More recipients = higher severity
        recipient_score = min(num_recipients / 50, 1.0)
        
        # Lower variance = higher severity (more uniform = more suspicious)
        variance_score = 1.0 - min(cv / 0.25, 1.0)
        
        # Faster timing = higher severity
        timing_score = 1.0 - min(time_window / 24, 1.0)
        
        # Higher amount = higher severity
        amount_score = min(total_amount / 500000, 1.0)
        
        # Weighted combination
        severity = (
            0.35 * recipient_score +
            0.25 * variance_score +
            0.25 * timing_score +
            0.15 * amount_score
        )
        
        return round(severity, 3)
    
    def _calculate_layering_severity(self, hops: int, total_amount: float) -> float:
        """
        Calculate severity for layering patterns.
        More hops + more money = higher laundering risk.
        """
        hop_score = min(hops / 6, 1.0)
        amount_score = min(total_amount / 200000, 1.0)
        return round(0.6 * hop_score + 0.4 * amount_score, 3)

    def _calculate_cycle_severity(self, length: int, total_amount: float) -> float:
        length_score = min(length / 5, 1.0)
        amount_score = min(total_amount / 100000, 1.0)
        return round(0.5 * length_score + 0.5 * amount_score, 3)

    def _detect_layering(self) -> List[PatternDetection]:
        """
        Optimized layering detection using bounded BFS.
        Complexity becomes O(candidates × MAX_BRANCH^MAX_HOPS).
        Safe for 10k+ transactions.
        """
        detections = []
        cfg = self.config["layering"]

    # Step 1: reduce starting nodes drastically
        candidates = [
            n for n in self.graph.nodes()
            if self.graph.out_degree(n) >= 2
        ]

        print(f"Starting layering detection on {len(candidates)} source nodes...")

        for source in candidates:
            queue = deque()
            visited = set()

            # (current_node, path, hops, bottleneck_amount)
            queue.append((source, [source], 0, float("inf")))

            while queue:
                node, path, hops, flow = queue.popleft()

                state = (node, hops)
                if state in visited:
                    continue
                visited.add(state)

                if hops >= self.MAX_HOPS:
                    continue

                neighbors = list(self.graph.out_edges(node, data=True))
                neighbors = sorted(
                    neighbors,
                    key=lambda x: x[2]["total_amount"],
                    reverse=True
                )[:self.MAX_BRANCH]

                for _, nxt, data in neighbors:
                    if nxt in path:
                        continue

                    if data["total_amount"] < self.MIN_AMOUNT:
                        continue

                    new_flow = min(flow, data["total_amount"])
                    new_path = path + [nxt]
                    new_hops = hops + 1

                    if new_hops >= cfg["min_hops"] and new_flow >= cfg["min_chain_amount"]:
                        detections.append(
                            PatternDetection(
                                pattern_type=FraudPattern.LAYERING,
                                account_id=source,
                                severity=self._calculate_layering_severity(
                                    new_hops, new_flow
                                ),
                                evidence={
                                    "origin": source,
                                    "path": new_path,
                                    "hops": new_hops,
                                    "total_amount": new_flow
                                },
                                timestamp=datetime.now()
                            )
                        )

                    queue.append((nxt, new_path, new_hops, new_flow))

        print(f"  → Layering: {len(detections)} detections")
        return detections




    def _detect_cycles(self) -> List[PatternDetection]:
        """
        Optimized cycle detection:
        - Only small cycles (2 to 4)
        - Only high money edges
        - Bounded DFS instead of global enumeration
        """

        detections = []
        cfg = self.config["cycle"]

        MAX_CYCLE_PER_NODE = 2
        MAX_TOTAL_CYCLES = 300

        for start in self.graph.nodes():
            found = 0
            stack = [(start, [start], 0)]

            while stack:
                node, path, depth = stack.pop()

                if depth >= cfg["max_cycle_length"]:
                    continue

                # Explore strongest money paths only
                neighbors = sorted(
                    self.graph.out_edges(node, data=True),
                    key=lambda x: x[2]["total_amount"],
                    reverse=True
                )[:3]  # Limit branching

                for _, nxt, data in neighbors:
                    if data["total_amount"] < cfg["min_cycle_amount"]:
                        continue

                    if nxt == start and len(path) >= cfg["min_cycle_length"]:
                        total = 0
                        for i in range(len(path)):
                            u = path[i]
                            v = start if i == len(path) - 1 else path[i + 1]
                            total += self.graph[u][v]["total_amount"]

                        detections.append(
                            PatternDetection(
                                pattern_type=FraudPattern.CYCLE,
                                account_id=start,
                                severity=self._calculate_cycle_severity(len(path), total),
                                evidence={
                                    "cycle": path + [start],
                                    "length": len(path),
                                    "total_amount": total
                                },
                                timestamp=datetime.now()
                            )
                        )
                        found += 1
                        if found >= MAX_CYCLE_PER_NODE:
                            break

                    elif nxt not in path:
                        stack.append((nxt, path + [nxt], depth + 1))

                if found >= MAX_CYCLE_PER_NODE:
                    break

            if len(detections) >= MAX_TOTAL_CYCLES:
                break

        print(f"  → Cycles: {len(detections)} detections")
        return detections

    # =========================================================================
    # PATTERN 4: BURST DETECTION
    # =========================================================================
    
    def _detect_bursts(self) -> List[PatternDetection]:
        """
        Detect burst activity: Rapid-fire transactions.
        """
        detections = []
        config = self.config['burst']
        
        for node in self.graph.nodes():
            for _, _, edge_data in self.graph.out_edges(node, data=True):
                if edge_data['count'] < config['min_transactions']:
                    continue
                if edge_data['time_window_hours'] > config['max_time_window_hours']:
                    continue
                if edge_data['total_amount'] < config['min_total_amount']:
                    continue
                
                severity = self._calculate_burst_severity(
                    count=edge_data['count'],
                    time_window=edge_data['time_window_hours'],
                    amount=edge_data['total_amount']
                )
                
                detection = PatternDetection(
                    pattern_type=FraudPattern.BURST,
                    account_id=node,
                    severity=severity,
                    evidence={
                        'transaction_count': edge_data['count'],
                        'time_window_hours': edge_data['time_window_hours'],
                        'total_amount': edge_data['total_amount'],
                        'avg_amount': edge_data['avg_amount']
                    },
                    timestamp=datetime.now()
                )
                detections.append(detection)
        
        print(f"  → Bursts: {len(detections)} detections")
        return detections
    
    def _calculate_burst_severity(self, count: int, time_window: float,
                                   amount: float) -> float:
        """Calculate severity for burst patterns."""
        count_score = min(count / 20, 1.0)
        timing_score = 1.0 - min(time_window / 1.0, 1.0)
        amount_score = min(amount / 100000, 1.0)
        return round(0.4 * count_score + 0.3 * timing_score + 0.3 * amount_score, 3)
    
    # =========================================================================
    # PATTERN 5: HUB DETECTION
    # =========================================================================
    
    def _detect_hubs(self) -> List[PatternDetection]:
        """
        Detect hub accounts: Central nodes with many connections.
        """
        detections = []
        config = self.config['hub']
        
        for node in self.graph.nodes():
            in_deg = self.graph.in_degree(node)
            out_deg = self.graph.out_degree(node)
            total_deg = in_deg + out_deg
            
            if total_deg < config['min_total_degree']:
                continue
            
            # Calculate total flow
            total_in = sum(
                data['total_amount']
                for _, _, data in self.graph.in_edges(node, data=True)
            )
            total_out = sum(
                data['total_amount']
                for _, _, data in self.graph.out_edges(node, data=True)
            )
            total_flow = total_in + total_out
            
            if total_flow < config['min_total_flow']:
                continue
            
            severity = self._calculate_hub_severity(
                degree=total_deg,
                flow=total_flow
            )
            
            detection = PatternDetection(
                pattern_type=FraudPattern.HUB,
                account_id=node,
                severity=severity,
                evidence={
                    'in_degree': in_deg,
                    'out_degree': out_deg,
                    'total_degree': total_deg,
                    'total_received': total_in,
                    'total_sent': total_out,
                    'total_flow': total_flow
                },
                timestamp=datetime.now()
            )
            detections.append(detection)
        
        print(f"  → Hubs: {len(detections)} detections")
        return detections
    
    def _calculate_hub_severity(self, degree: int, flow: float) -> float:
        """Calculate severity for hub patterns."""
        degree_score = min(degree / 50, 1.0)
        flow_score = min(flow / 1000000, 1.0)
        return round(0.5 * degree_score + 0.5 * flow_score, 3)
    
    # =========================================================================
    # OUTPUT METHODS
    # =========================================================================
    
    def get_detections_dataframe(self) -> pd.DataFrame:
        """Export detections as DataFrame for analysis."""
        if not self.detections:
            return pd.DataFrame()
        
        data = []
        for detection in self.detections:
            row = {
                'account_id': detection.account_id,
                'pattern': detection.pattern_type.value,
                'severity': detection.severity,
                'timestamp': detection.timestamp
            }
            row.update(detection.evidence)
            data.append(row)
        
        return pd.DataFrame(data)
    
    def export_to_json(self, filepath: str):
        """Export detections to JSON file."""
        import json
        data = [d.to_dict() for d in self.detections]
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"✓ Exported {len(data)} detections → {filepath}")
    
    def get_summary(self) -> Dict:
        """Get detection summary statistics."""
        if not self.detections:
            return {'total_detections': 0}
        
        pattern_counts = {}
        for detection in self.detections:
            pattern = detection.pattern_type.value
            pattern_counts[pattern] = pattern_counts.get(pattern, 0) + 1
        
        return {
            'total_detections': len(self.detections),
            'by_pattern': pattern_counts,
            'high_severity_count': sum(1 for d in self.detections if d.severity > 0.7),
            'unique_accounts': len(set(d.account_id for d in self.detections)),
            'avg_severity': sum(d.severity for d in self.detections) / len(self.detections)
        }
        # =========================================================================
    # LLM REASONING LAYER
    # =========================================================================

    def explain_detection_with_llm(self, detection: PatternDetection) -> str:
        """
        Uses Claude to explain a deterministic fraud detection in simple language.
        LLM does NOT detect fraud. It only explains evidence.
        """

        prompt = f"""
You are a financial crime investigator.

Explain the following fraud detection clearly and simply.

Structure:
1. What pattern was detected
2. Why it is suspicious
3. Evidence from data
4. What an analyst should check next

Detection:
Pattern: {detection.pattern_type.value}
Account: {detection.account_id}
Severity: {detection.severity}
Evidence: {detection.evidence}
"""

        response = self.llm.invoke([
            HumanMessage(content=prompt)
        ])
        return response.content

    def generate_llm_reasoning_for_all(self, detections_subset=None) -> List[Dict]:
        results = []
        detections_to_use = detections_subset or self.detections
        print(f"\n🧠 Generating LLM explanations for {len(detections_to_use)} detections...")

        for i, d in enumerate(detections_to_use, 1):
            explanation = self.explain_detection_with_llm(d)
            results.append({
                "detection": d.to_dict(),
                "llm_reasoning": explanation
            })
            if i % 10 == 0:
                print(f"  → Processed {i}/{len(detections_to_use)}")

        print(f"✓ Generated reasoning for {len(results)} detections")
        return results
    


    @staticmethod
    def load_transfers_from_neo4j():
        """
        Connects to Neo4j using the official driver and returns a list of transfers.
        Each transfer is a dict: {"sender", "receiver", "amount", "timestamp"}
        """
        from neo4j import GraphDatabase
        import os
        from datetime import datetime

        uri = os.getenv("NEO4J_URI")          # neo4j+s://.... (Aura)
        user = os.getenv("NEO4J_USERNAME")
        password = os.getenv("NEO4J_PASSWORD")

        driver = GraphDatabase.driver(uri, auth=(user, password))

        transfers = []

        query = """
        MATCH (a:Account)-[t:TRANSFER]->(b:Account)
        RETURN 
            a.account_id AS sender,
            b.account_id AS receiver,
            t.avg_amount AS amount,
            t.first_time AS timestamp
        ORDER BY timestamp
        """

        with driver.session() as session:
            result = session.run(query)
            for r in result:
                if r["amount"] is None or r["timestamp"] is None:
                    continue
                transfers.append({
                    "sender": r["sender"],
                    "receiver": r["receiver"],
                    "amount": float(r["amount"]),
                    "timestamp": datetime.fromisoformat(r["timestamp"].replace("Z",""))
                })

        driver.close()
        print(f"✓ Loaded {len(transfers)} transfers from Neo4j")
        return transfers






    @staticmethod
    def build_graph_from_neo4j_transfers(transfers):
            """
            Build a networkx DiGraph directly from Neo4j transfers list.
            Aggregates multiple transfers between same accounts.
            """
            G = nx.DiGraph()

            # Aggregate transfers
            edge_data = {}
            for t in transfers:
                key = (t['sender'], t['receiver'])
                if key not in edge_data:
                    edge_data[key] = {
                        'total_amount': 0,
                        'count': 0,
                        'first_time': t['timestamp'],
                        'last_time': t['timestamp'],
                        'transaction_ids': [],
                    }

                e = edge_data[key]
                e['total_amount'] += t.get('amount', 0)
                e['count'] += 1
                e['first_time'] = min(e['first_time'], t['timestamp'])
                e['last_time'] = max(e['last_time'], t['timestamp'])
                e['transaction_ids'].append(t.get('transaction_id'))

            # Add edges to graph
            for (sender, receiver), data in edge_data.items():
                time_window_hours = (data['last_time'] - data['first_time']).total_seconds() / 3600
                avg_amount = data['total_amount'] / data['count'] if data['count'] > 0 else 0

                G.add_node(sender)
                G.add_node(receiver)
                G.add_edge(sender, receiver, 
                        total_amount=data['total_amount'],
                        count=data['count'],
                        first_time=data['first_time'],
                        last_time=data['last_time'],
                        avg_amount=avg_amount,
                        time_window_hours=time_window_hours,
                        transaction_ids=data['transaction_ids'])

            print(f"✓ Built graph with {len(G.nodes)} accounts and {len(G.edges)} edges")
            return G

# =============================================================================
# USAGE EXAMPLE
# =============================================================================
if __name__ == "__main__":
    from graph_builder_agent import GraphBuilderAgent

    print("Pattern Detection Agent (V1) - Deterministic Analysis")
    print("=" * 60)
    
    print("Anthropic key:", os.getenv("ANTHROPIC_API_KEY"))

    # 🔗 Load transactions from Neo4j instead of CSV
    transactions = PatternDetectionAgent.load_transfers_from_neo4j()

    if not transactions:
        print("❌ No transactions loaded from Neo4j. Check your DB.")
        exit()

    print(f"✓ Loaded {len(transactions)} transactions from Neo4j")


    # 🏗 Build graph directly from transfers
    graph = PatternDetectionAgent.build_graph_from_neo4j_transfers(transactions)

    # 🔍 Run pattern detection
    detector = PatternDetectionAgent(graph)
    detections = detector.detect_all_patterns()

    
    # 📊 Display summary
    summary = detector.get_summary()
    print("\n📊 Detection Summary:")
    print(f"  Total detections: {summary['total_detections']}")
    print(f"  High severity (>0.7): {summary['high_severity_count']}")
    print(f"  Unique accounts flagged: {summary['unique_accounts']}")
    print(f"  Average severity: {summary['avg_severity']:.3f}")
    print("\n  By pattern type:")
    for pattern, count in summary['by_pattern'].items():
        print(f"    {pattern}: {count}")

    # 💾 Export results
    df = detector.get_detections_dataframe()
    df.to_csv('pattern_detections.csv', index=False)
    detector.export_to_json('pattern_detections.json')

    # ------------------- ADD LLM REASONING HERE -------------------
    print("\n🧠 Generating LLM explanations for high-severity patterns...")

    high_severity = [d for d in detector.detections if d.severity > 0.7]
    explained = detector.generate_llm_reasoning_for_all(high_severity)

    # Optional: save reasoning to JSON
    import json
    with open('pattern_detections_reasoning.json', 'w') as f:
        json.dump(explained, f, indent=2)

    print(f"✓ LLM explanations generated for {len(explained)} high-severity detections")
