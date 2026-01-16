import os
from datetime import datetime
from typing import List, Dict, TypedDict

import networkx as nx
from neo4j import GraphDatabase
from langgraph.graph import StateGraph, END
from dotenv import load_dotenv

load_dotenv()  # Load NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD from .env

# =====================
# Agent State Schema
# =====================

class AgentState(TypedDict):
    transfers: List[Dict]
    graph: nx.DiGraph
    degrees: Dict
    total_flow: Dict
    centrality: Dict

# =====================
# Load transfers from Neo4j
# =====================

def load_transfers_from_neo4j() -> List[Dict]:
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

# =====================
# LangGraph Nodes
# =====================

def build_graph_node(state: AgentState):
    G = nx.DiGraph()
    for t in state["transfers"]:
        G.add_edge(t["sender"], t["receiver"], amount=t["amount"])
    return {**state, "graph": G}

def degree_node(state: AgentState):
    G = state["graph"]
    degrees = {}
    for node in G.nodes:
        degrees[node] = {
            "in_degree": G.in_degree(node),
            "out_degree": G.out_degree(node)
        }
    return {**state, "degrees": degrees}

def total_flow_node(state: AgentState):
    G = state["graph"]
    flow = {}
    for node in G.nodes:
        sent = sum(G[u][v]["amount"] for u, v in G.out_edges(node))
        received = sum(G[u][v]["amount"] for u, v in G.in_edges(node))
        flow[node] = {"sent": sent, "received": received}
    return {**state, "total_flow": flow}

def centrality_node(state: AgentState):
    G = state["graph"]
    # Use betweenness centrality to see who controls flow
    centrality = nx.betweenness_centrality(G, weight="amount")
    return {**state, "centrality": centrality}

# =====================
# Runner
# =====================

if __name__ == "__main__":
    transfers = load_transfers_from_neo4j()

    agent = StateGraph(AgentState)
    agent.add_node("build_graph", build_graph_node)
    agent.add_node("compute_degrees", degree_node)
    agent.add_node("compute_total_flow", total_flow_node)
    agent.add_node("compute_centrality", centrality_node)

    agent.set_entry_point("build_graph")
    agent.add_edge("build_graph", "compute_degrees")
    agent.add_edge("compute_degrees", "compute_total_flow")
    agent.add_edge("compute_total_flow", "compute_centrality")
    agent.add_edge("compute_centrality", END)

    # ✅ Compile the agent before invoking
    agent = agent.compile()  # <-- This is the key fix

    initial_state: AgentState = {
        "transfers": transfers
    }

    result = agent.invoke(initial_state)


    initial_state: AgentState = {
        "transfers": transfers
    }

    result = agent.invoke(initial_state)

    # =====================
    # Display Summary
    # =====================
    print("\n===== TRANSACTION ANALYSIS AGENT OUTPUT =====")
    print(f"Total Accounts: {len(result['graph'].nodes)}")
    print(f"Total Transfers: {len(result['transfers'])}")

    print("\nSample Degrees:")
    for k, v in list(result["degrees"].items())[:5]:
        print(f"{k}: {v}")

    print("\nSample Total Flow:")
    for k, v in list(result["total_flow"].items())[:5]:
        print(f"{k}: {v}")

    print("\nSample Centrality (Top 5):")
    top_central = sorted(result["centrality"].items(), key=lambda x: x[1], reverse=True)[:5]
    for node, cent in top_central:
        print(f"{node}: {cent:.4f}")



