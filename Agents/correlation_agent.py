
from typing import TypedDict, Dict, List
from langgraph.graph import StateGraph, END
from neo4j import GraphDatabase
import networkx as nx
import os
import json
from datetime import datetime
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()


# ============================================================
# STATE
# ============================================================

class CorrelationState(TypedDict):
    transfers: List[Dict]
    graph: nx.DiGraph
    in_degree: Dict
    out_degree: Dict
    total_sent: Dict
    total_received: Dict
    centrality: Dict


# ============================================================
# NEO4J LOADER NODE
# ============================================================

def load_from_neo4j_node(state: CorrelationState):
    uri = os.getenv("NEO4J_URI")
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
        for r in session.run(query):
            if r["amount"] is None or r["timestamp"] is None:
                continue

            transfers.append({
                "sender": r["sender"],
                "receiver": r["receiver"],
                "amount": float(r["amount"]),
                "timestamp": datetime.fromisoformat(r["timestamp"].replace("Z", ""))
            })

    driver.close()
    print(f"✓ Loaded {len(transfers)} transfers from Neo4j")
    return {**state, "transfers": transfers}


# ============================================================
# BUILD GRAPH NODE
# ============================================================

def build_graph_node(state: CorrelationState):
    G = nx.DiGraph()
    for t in state["transfers"]:
        G.add_edge(
            t["sender"],
            t["receiver"],
            amount=t["amount"],
            timestamp=t["timestamp"]
        )

    print(f"✓ Built graph with {G.number_of_nodes()} nodes and {G.number_of_edges()} edges")
    return {**state, "graph": G}


# ============================================================
# DEGREE NODE
# ============================================================

def degree_node(state: CorrelationState):
    G = state["graph"]
    return {
        **state,
        "in_degree": dict(G.in_degree()),
        "out_degree": dict(G.out_degree())
    }


# ============================================================
# FLOW NODE
# ============================================================

def flow_node(state: CorrelationState):
    G = state["graph"]
    sent = {}
    received = {}

    for u, v, data in G.edges(data=True):
        sent[u] = sent.get(u, 0) + data["amount"]
        received[v] = received.get(v, 0) + data["amount"]

    return {
        **state,
        "total_sent": sent,
        "total_received": received
    }


# ============================================================
# CENTRALITY NODE
# ============================================================

def centrality_node(state: CorrelationState):
    G = state["graph"]
    centrality = nx.betweenness_centrality(G)
    return {**state, "centrality": centrality}


# ============================================================
# BUILD LANGGRAPH
# ============================================================

def build_agent():
    graph = StateGraph(CorrelationState)

    graph.add_node("load_neo4j", load_from_neo4j_node)
    graph.add_node("build_graph", build_graph_node)
    graph.add_node("degree", degree_node)
    graph.add_node("flow", flow_node)
    graph.add_node("centrality", centrality_node)

    graph.set_entry_point("load_neo4j")

    graph.add_edge("load_neo4j", "build_graph")
    graph.add_edge("build_graph", "degree")
    graph.add_edge("degree", "flow")
    graph.add_edge("flow", "centrality")
    graph.add_edge("centrality", END)

    return graph.compile()


# ============================================================
# RUNNER
# ============================================================

if __name__ == "__main__":
    print("🔗 Correlation Agent (LangGraph)")
    print("=" * 60)

    agent = build_agent()

    initial_state: CorrelationState = {
        "transfers": [],
        "graph": None,
        "in_degree": {},
        "out_degree": {},
        "total_sent": {},
        "total_received": {},
        "centrality": {}
    }

    result = agent.invoke(initial_state)

    G = result["graph"]

    print("\n📊 Correlation Summary:")
    print(f"Total Accounts: {len(G.nodes())}")
    print(f"Total Transfers: {len(G.edges())}")

    print("\n💸 Top 5 by Total Sent:")
    for acc, amt in sorted(result["total_sent"].items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  {acc}: {amt:.2f}")

    print("\n💰 Top 5 by Total Received:")
    for acc, amt in sorted(result["total_received"].items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  {acc}: {amt:.2f}")

    print("\n🧠 Top 5 Central Accounts:")
    for acc, score in sorted(result["centrality"].items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  {acc}: {score:.5f}")



    output = {
        "generated_at": datetime.now().isoformat(),
        "in_degree": result["in_degree"],
        "out_degree": result["out_degree"],
        "total_sent": result["total_sent"],
        "total_received": result["total_received"],
        "centrality": result["centrality"]
    }

    with open("outputs/correlation_agent.json", "w") as f:
        json.dump(output, f, indent=2)

    print("💾 Saved → outputs/correlation_agent.json")
