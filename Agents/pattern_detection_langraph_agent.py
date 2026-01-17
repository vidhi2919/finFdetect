from typing import Dict, List, TypedDict
from langgraph.graph import StateGraph, END
import networkx as nx
from datetime import datetime
import os
from dotenv import load_dotenv
import json
from pattern_detection import PatternDetectionAgent  # your big class above

load_dotenv()

# =========================
# 1. STATE DEFINITION
# =========================

class PatternState(TypedDict):
    transfers: List[Dict]
    graph: nx.DiGraph
    detections: List[Dict]
    summary: Dict


# =========================
# 2. LANGGRAPH NODES
# =========================

def load_from_neo4j(state: PatternState) -> PatternState:
    print("🔌 Loading transactions from Neo4j...")
    transfers = PatternDetectionAgent.load_transfers_from_neo4j()
    return {"transfers": transfers}


def build_graph(state: PatternState) -> PatternState:
    print("🏗 Building graph from transactions...")
    G = PatternDetectionAgent.build_graph_from_neo4j_transfers(state["transfers"])
    return {"graph": G}


def run_pattern_detection(state: PatternState) -> PatternState:
    print("🔍 Running Pattern Detection Engine...")
    detector = PatternDetectionAgent(state["graph"])
    detections = detector.detect_all_patterns()
    return {
        "detections": [d.to_dict() for d in detections],
        "summary": detector.get_summary()
    }


def finish(state: PatternState) -> PatternState:
    print("\n✅ LangGraph Pattern Detection Pipeline Complete")
    print("\n📊 Final Summary:")
    for k, v in state["summary"].items():
        print(f"{k}: {v}")
    return state


# =========================
# 3. BUILD LANGGRAPH
# =========================

def build_pattern_langgraph():
    graph = StateGraph(PatternState)

    graph.add_node("load_neo4j", load_from_neo4j)
    graph.add_node("build_graph", build_graph)
    graph.add_node("detect_patterns", run_pattern_detection)
    graph.add_node("finish", finish)

    graph.set_entry_point("load_neo4j")
    graph.add_edge("load_neo4j", "build_graph")
    graph.add_edge("build_graph", "detect_patterns")
    graph.add_edge("detect_patterns", "finish")
    graph.add_edge("finish", END)

    return graph.compile()


# =========================
# 4. RUN AGENT
# =========================

if __name__ == "__main__":
    print("\n🧠 Pattern Detection Agent (LangGraph Powered)")
    print("=" * 60)

    agent = build_pattern_langgraph()
    final_state = agent.invoke({})

    print("\n📂 Detections Saved In Memory")
    print(f"Total Detections: {len(final_state['detections'])}")

    # Optional persistence
    
    with open("outputs/pattern_detections_langgraph.json", "w") as f:
        json.dump(final_state["detections"], f, indent=2)

    print("💾 Saved → pattern_detections_langgraph.json")
