# import os
# from datetime import datetime
# from typing import List, Dict, TypedDict

# import networkx as nx
# from neo4j import GraphDatabase
# from langgraph.graph import StateGraph, END
# from dotenv import load_dotenv

# load_dotenv()  # Load NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD from .env

# # =====================
# # Agent State Schema
# # =====================

# class AgentState(TypedDict):
#     transfers: List[Dict]
#     graph: nx.DiGraph
#     degrees: Dict
#     total_flow: Dict
#     centrality: Dict

# # =====================
# # Load transfers from Neo4j
# # =====================

# def load_transfers_from_neo4j() -> List[Dict]:
#     uri = os.getenv("NEO4J_URI")
#     user = os.getenv("NEO4J_USERNAME")
#     password = os.getenv("NEO4J_PASSWORD")

#     driver = GraphDatabase.driver(uri, auth=(user, password))
#     transfers = []

#     query = """
#     MATCH (a:Account)-[t:TRANSFER]->(b:Account)
#     RETURN 
#         a.account_id AS sender,
#         b.account_id AS receiver,
#         t.avg_amount AS amount,
#         t.first_time AS timestamp
#     ORDER BY timestamp
#     """

#     with driver.session() as session:
#         result = session.run(query)
#         for r in result:
#             if r["amount"] is None or r["timestamp"] is None:
#                 continue
#             transfers.append({
#                 "sender": r["sender"],
#                 "receiver": r["receiver"],
#                 "amount": float(r["amount"]),
#                 "timestamp": datetime.fromisoformat(r["timestamp"].replace("Z",""))
#             })

#     driver.close()
#     print(f"✓ Loaded {len(transfers)} transfers from Neo4j")
#     return transfers

# # =====================
# # LangGraph Nodes
# # =====================

# def build_graph_node(state: AgentState):
#     G = nx.DiGraph()
#     for t in state["transfers"]:
#         G.add_edge(t["sender"], t["receiver"], amount=t["amount"])
#     return {**state, "graph": G}

# def degree_node(state: AgentState):
#     G = state["graph"]
#     degrees = {}
#     for node in G.nodes:
#         degrees[node] = {
#             "in_degree": G.in_degree(node),
#             "out_degree": G.out_degree(node)
#         }
#     return {**state, "degrees": degrees}

# def total_flow_node(state: AgentState):
#     G = state["graph"]
#     flow = {}
#     for node in G.nodes:
#         sent = sum(G[u][v]["amount"] for u, v in G.out_edges(node))
#         received = sum(G[u][v]["amount"] for u, v in G.in_edges(node))
#         flow[node] = {"sent": sent, "received": received}
#     return {**state, "total_flow": flow}

# def centrality_node(state: AgentState):
#     G = state["graph"]
#     # Use betweenness centrality to see who controls flow
#     centrality = nx.betweenness_centrality(G, weight="amount")
#     return {**state, "centrality": centrality}

# # =====================
# # Runner
# # =====================

# if __name__ == "__main__":
#     transfers = load_transfers_from_neo4j()

#     agent = StateGraph(AgentState)
#     agent.add_node("build_graph", build_graph_node)
#     agent.add_node("compute_degrees", degree_node)
#     agent.add_node("compute_total_flow", total_flow_node)
#     agent.add_node("compute_centrality", centrality_node)

#     agent.set_entry_point("build_graph")
#     agent.add_edge("build_graph", "compute_degrees")
#     agent.add_edge("compute_degrees", "compute_total_flow")
#     agent.add_edge("compute_total_flow", "compute_centrality")
#     agent.add_edge("compute_centrality", END)

#     # ✅ Compile the agent before invoking
#     agent = agent.compile()  # <-- This is the key fix

#     initial_state: AgentState = {
#         "transfers": transfers
#     }

#     result = agent.invoke(initial_state)


#     initial_state: AgentState = {
#         "transfers": transfers
#     }

#     result = agent.invoke(initial_state)

#     # =====================
#     # Display Summary
#     # =====================
#     print("\n===== TRANSACTION ANALYSIS AGENT OUTPUT =====")
#     print(f"Total Accounts: {len(result['graph'].nodes)}")
#     print(f"Total Transfers: {len(result['transfers'])}")

#     print("\nSample Degrees:")
#     for k, v in list(result["degrees"].items())[:5]:
#         print(f"{k}: {v}")

#     print("\nSample Total Flow:")
#     for k, v in list(result["total_flow"].items())[:5]:
#         print(f"{k}: {v}")

#     print("\nSample Centrality (Top 5):")
#     top_central = sorted(result["centrality"].items(), key=lambda x: x[1], reverse=True)[:5]
#     for node, cent in top_central:
#         print(f"{node}: {cent:.4f}")







# import os
# from datetime import datetime
# from typing import List, Dict, TypedDict
# import json
# import networkx as nx
# from neo4j import GraphDatabase
# from langgraph.graph import StateGraph, END
# from langchain_anthropic import ChatAnthropic
# from langchain_core.messages import HumanMessage
# from dotenv import load_dotenv

# load_dotenv()  # Load NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, ANTHROPIC_API_KEY from .env

# # =====================
# # Agent State Schema
# # =====================
# # class AgentState(TypedDict, total=False):
# #     transfers: List[Dict]
# #     graph: nx.DiGraph
# #     degrees: Dict
# #     total_flow: Dict
# #     centrality: Dict
# #     llm_reasoning: str
# class AgentState(TypedDict, total=False):
#     transfers: List[Dict]
#     graph: nx.DiGraph
#     in_degree: Dict
#     out_degree: Dict
#     total_degree: Dict
#     total_flow: Dict
#     centrality: Dict
#     llm_reasoning: str


# # =====================
# # Load transfers from Neo4j
# # =====================
# def load_transfers_from_neo4j() -> List[Dict]:
#     uri = os.getenv("NEO4J_URI")
#     user = os.getenv("NEO4J_USERNAME")
#     password = os.getenv("NEO4J_PASSWORD")

#     driver = GraphDatabase.driver(uri, auth=(user, password))
#     transfers = []

#     query = """
#     MATCH (a:Account)-[t:TRANSFER]->(b:Account)
#     RETURN 
#         a.account_id AS sender,
#         b.account_id AS receiver,
#         t.avg_amount AS amount,
#         t.first_time AS timestamp
#     ORDER BY timestamp
#     """

#     with driver.session() as session:
#         result = session.run(query)
#         for r in result:
#             if r["amount"] is None or r["timestamp"] is None:
#                 continue
#             transfers.append({
#                 "sender": r["sender"],
#                 "receiver": r["receiver"],
#                 "amount": float(r["amount"]),
#                 "timestamp": datetime.fromisoformat(r["timestamp"].replace("Z",""))
#             })

#     driver.close()
#     print(f"✓ Loaded {len(transfers)} transfers from Neo4j")
#     return transfers

# # =====================
# # LangGraph Node Functions
# # =====================
# def build_graph_node(state: AgentState):
#     G = nx.DiGraph()
#     for t in state["transfers"]:
#         G.add_edge(t["sender"], t["receiver"], amount=t["amount"])
#     return {**state, "graph": G}

# # def degree_node(state: AgentState):
# #     G = state["graph"]
# #     degrees = {}
# #     for node in G.nodes:
# #         degrees[node] = {
# #             "in_degree": G.in_degree(node),
# #             "out_degree": G.out_degree(node)
# #         }
# #     return {**state, "degrees": degrees}
# def degree_node(state: AgentState):
#     G = state["graph"]

#     in_degree = {}
#     out_degree = {}
#     total_degree = {}

#     for node in G.nodes:
#         in_d = G.in_degree(node)
#         out_d = G.out_degree(node)

#         in_degree[node] = in_d
#         out_degree[node] = out_d
#         total_degree[node] = in_d + out_d

#     return {
#         **state,
#         "in_degree": in_degree,
#         "out_degree": out_degree,
#         "total_degree": total_degree
#     }


# def total_flow_node(state: AgentState):
#     G = state["graph"]
#     flow = {}
#     for node in G.nodes:
#         sent = sum(G[u][v]["amount"] for u, v in G.out_edges(node))
#         received = sum(G[u][v]["amount"] for u, v in G.in_edges(node))
#         flow[node] = {"sent": sent, "received": received}
#     return {**state, "total_flow": flow}

# def centrality_node(state: AgentState):
#     G = state["graph"]
#     centrality = nx.betweenness_centrality(G, weight="amount")
#     return {**state, "centrality": centrality}

# def llm_reasoning_node(state: AgentState):
#     llm = ChatAnthropic(
#         model="claude-3-haiku-20240307",
#         temperature=0.2,
#         anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
#     )

#     # Take top 3 accounts by centrality as examples
#     top_accounts = sorted(state["centrality"].items(), key=lambda x: x[1], reverse=True)[:3]

#     prompt = f"""
# You are a financial crime investigator. Analyze these top accounts from a transaction network.

# For each account, summarize:
# 1. Its in-degree and out-degree
# 2. Total sent and received amounts
# 3. Betweenness centrality
# 4. Whether the account is potentially suspicious and why
# Accounts Data:
# {[(acct, state['total_degree'][acct], state['total_flow'][acct], central) for acct, central in top_accounts]}
# """

#     response = llm.invoke([HumanMessage(content=prompt)])
#     return {**state, "llm_reasoning": response.content}

# # =====================
# # Main Runner
# # =====================
# if __name__ == "__main__":
#     transfers = load_transfers_from_neo4j()
#     if not transfers:
#         print("❌ No transfers loaded. Check Neo4j connection.")
#         exit()

#     agent = StateGraph(AgentState)
#     agent.add_node("build_graph", build_graph_node)
#     agent.add_node("compute_degrees", degree_node)
#     agent.add_node("compute_total_flow", total_flow_node)
#     agent.add_node("compute_centrality", centrality_node)
#     agent.add_node("llm_reasoning", llm_reasoning_node)

#     agent.set_entry_point("build_graph")
#     agent.add_edge("build_graph", "compute_degrees")
#     agent.add_edge("compute_degrees", "compute_total_flow")
#     agent.add_edge("compute_total_flow", "compute_centrality")
#     agent.add_edge("compute_centrality", "llm_reasoning")
#     agent.add_edge("llm_reasoning", END)

#     agent = agent.compile()  # Must compile after edges added

#     initial_state: AgentState = {"transfers": transfers}
#     result = agent.invoke(initial_state)

#     # =====================
#     # Display Summary
#     # =====================
#     print("\n===== TRANSACTION ANALYSIS AGENT OUTPUT =====")
#     print(f"Total Accounts: {len(result['graph'].nodes)}")
#     print(f"Total Transfers: {len(result['transfers'])}")

#     print("\nSample Degrees:")
#     for k, v in list(result["total_degree"].items())[:5]:
#         print(f"{k}: {v}")

#     print("\nSample Total Flow:")
#     for k, v in list(result["total_flow"].items())[:5]:
#         print(f"{k}: {v}")

#     print("\nSample Centrality (Top 5):")
#     top_central = sorted(result["centrality"].items(), key=lambda x: x[1], reverse=True)[:5]
#     for node, cent in top_central:
#         print(f"{node}: {cent:.4f}")

#     print("\n🧠 LLM Reasoning Summary:")
#     print(result["llm_reasoning"])

    
#     with open("outputs/transaction_analysis.json", "w") as f:
#         json.dump({
#           "in_degree": result["in_degree"],
#             "out_degree": result["out_degree"],
#             "total_degree": result["total_degree"],       
#                 "total_flow": result["total_flow"],
#                 "centrality": result["centrality"],
#                 "llm_reasoning": result.get("llm_reasoning", "")
#         }, f, indent=2)




import os
from datetime import datetime
from typing import List, Dict, TypedDict, Tuple
import json
import networkx as nx
from neo4j import GraphDatabase
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()  # Load NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, ANTHROPIC_API_KEY from .env


# =====================
# Agent State Schema
# =====================
class AgentState(TypedDict, total=False):
    transfers: List[Dict]
    graph: nx.DiGraph

    in_degree: Dict[str, int]
    out_degree: Dict[str, int]
    total_degree: Dict[str, int]

    total_flow: Dict[str, Dict[str, float]]
    centrality: Dict[str, float]

    # ✅ NEW: aggregated edges for UI graph rendering
    edges: List[Dict[str, object]]

    llm_reasoning: str


# =====================
# Load transfers from Neo4j
# =====================
def load_transfers_from_neo4j() -> List[Dict]:
    uri = os.getenv("NEO4J_URI")
    user = os.getenv("NEO4J_USERNAME")
    password = os.getenv("NEO4J_PASSWORD")

    if not uri or not user or not password:
        raise RuntimeError("Missing NEO4J credentials in .env (NEO4J_URI/NEO4J_USERNAME/NEO4J_PASSWORD)")

    driver = GraphDatabase.driver(uri, auth=(user, password))
    transfers: List[Dict] = []

    query = """
    MATCH (a:Account)-[t:TRANSFER]->(b:Account)
    RETURN 
        a.account_id AS sender,
        b.account_id AS receiver,
        toFloat(t.avg_amount) AS amount,
        t.first_time AS timestamp
    ORDER BY timestamp
    """

    with driver.session() as session:
        result = session.run(query)
        for r in result:
            if r["amount"] is None or r["timestamp"] is None:
                continue

            # some datasets store ISO with Z; normalize safely
            ts = str(r["timestamp"]).replace("Z", "")
            transfers.append({
                "sender": r["sender"],
                "receiver": r["receiver"],
                "amount": float(r["amount"]),
                "timestamp": datetime.fromisoformat(ts)
            })

    driver.close()
    print(f"✓ Loaded {len(transfers)} transfers from Neo4j")
    return transfers


# =====================
# LangGraph Node Functions
# =====================
def build_graph_node(state: AgentState):
    """
    Build a DiGraph with edge attribute `amount` as the *sum* across transfers.
    Also store a transfer count per edge for better UI signals.
    """
    G = nx.DiGraph()

    # We'll accumulate sum + count
    for t in state["transfers"]:
        s = t["sender"]
        r = t["receiver"]
        amt = float(t["amount"])

        if G.has_edge(s, r):
            G[s][r]["amount"] += amt
            G[s][r]["count"] += 1
        else:
            G.add_edge(s, r, amount=amt, count=1)

    return {**state, "graph": G}


def degree_node(state: AgentState):
    G = state["graph"]

    in_degree: Dict[str, int] = {}
    out_degree: Dict[str, int] = {}
    total_degree: Dict[str, int] = {}

    for node in G.nodes:
        in_d = int(G.in_degree(node))
        out_d = int(G.out_degree(node))
        in_degree[node] = in_d
        out_degree[node] = out_d
        total_degree[node] = in_d + out_d

    return {**state, "in_degree": in_degree, "out_degree": out_degree, "total_degree": total_degree}


def total_flow_node(state: AgentState):
    """
    Total flow is computed from aggregated edge weights (sum amounts).
    """
    G = state["graph"]
    flow: Dict[str, Dict[str, float]] = {}

    for node in G.nodes:
        sent = sum(float(G[u][v].get("amount", 0.0)) for u, v in G.out_edges(node))
        received = sum(float(G[u][v].get("amount", 0.0)) for u, v in G.in_edges(node))
        flow[node] = {"sent": sent, "received": received}

    return {**state, "total_flow": flow}


def centrality_node(state: AgentState):
    """
    Betweenness centrality. Note: networkx uses edge weights as "distance",
    but we are using amount as weight. It's okay for MVP ranking; later you can invert.
    """
    G = state["graph"]

    # If you want larger amount = stronger connection, you can later use distance=1/amount.
    centrality = nx.betweenness_centrality(G, weight="amount", normalized=True)
    return {**state, "centrality": centrality}


def edges_node(state: AgentState):
    """
    ✅ NEW NODE: Export edges in a frontend-friendly format.
    """
    G = state["graph"]

    edges: List[Dict[str, object]] = []
    for u, v, data in G.edges(data=True):
        edges.append({
            "source": u,
            "target": v,
            "amount": float(data.get("amount", 0.0)),
            "count": int(data.get("count", 1)),
        })

    # Optional: keep only top edges by amount if file gets huge.
    # edges = sorted(edges, key=lambda e: e["amount"], reverse=True)[:5000]

    return {**state, "edges": edges}


def llm_reasoning_node(state: AgentState):
    llm = ChatAnthropic(
        model="claude-3-haiku-20240307",
        temperature=0.2,
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
    )

    # Take top 3 accounts by centrality
    top_accounts = sorted(state["centrality"].items(), key=lambda x: float(x[1]), reverse=True)[:3]

    prompt = f"""
You are a financial crime investigator. Analyze these top accounts from a transaction network.

For each account, summarize:
1) In-degree and out-degree
2) Total sent and received amounts
3) Betweenness centrality
4) Whether the account is potentially suspicious and why (no legal judgment)

Accounts Data:
{[(acct,
   {"in": state["in_degree"].get(acct, 0), "out": state["out_degree"].get(acct, 0)},
   state["total_flow"].get(acct, {}),
   float(central)
) for acct, central in top_accounts]}
"""

    response = llm.invoke([HumanMessage(content=prompt)])
    return {**state, "llm_reasoning": response.content}


# =====================
# Main Runner
# =====================
if __name__ == "__main__":
    transfers = load_transfers_from_neo4j()
    if not transfers:
        print("❌ No transfers loaded. Check Neo4j connection.")
        exit()

    agent = StateGraph(AgentState)
    agent.add_node("build_graph", build_graph_node)
    agent.add_node("compute_degrees", degree_node)
    agent.add_node("compute_total_flow", total_flow_node)
    agent.add_node("compute_centrality", centrality_node)

    # ✅ new node
    agent.add_node("export_edges", edges_node)

    agent.add_node("llm_reasoning", llm_reasoning_node)

    agent.set_entry_point("build_graph")
    agent.add_edge("build_graph", "compute_degrees")
    agent.add_edge("compute_degrees", "compute_total_flow")
    agent.add_edge("compute_total_flow", "compute_centrality")

    # ✅ run edges export after centrality
    agent.add_edge("compute_centrality", "export_edges")
    agent.add_edge("export_edges", "llm_reasoning")

    agent.add_edge("llm_reasoning", END)
    agent = agent.compile()

    initial_state: AgentState = {"transfers": transfers}
    result = agent.invoke(initial_state)

    # =====================
    # Display Summary
    # =====================
    print("\n===== TRANSACTION ANALYSIS AGENT OUTPUT =====")
    print(f"Total Accounts: {len(result['graph'].nodes)}")
    print(f"Total Transfers: {len(result['transfers'])}")
    print(f"Total Edges (aggregated): {len(result.get('edges', []))}")

    print("\nSample Degrees:")
    for k in list(result["total_degree"].keys())[:5]:
        print(f"{k}: in={result['in_degree'][k]}, out={result['out_degree'][k]}, total={result['total_degree'][k]}")

    print("\nSample Total Flow:")
    for k in list(result["total_flow"].keys())[:5]:
        print(f"{k}: {result['total_flow'][k]}")

    print("\nSample Centrality (Top 5):")
    top_central = sorted(result["centrality"].items(), key=lambda x: float(x[1]), reverse=True)[:5]
    for node, cent in top_central:
        print(f"{node}: {cent:.4f}")

    print("\n🧠 LLM Reasoning Summary:")
    print(result.get("llm_reasoning", ""))

    # =====================
    # Save Output JSON
    # =====================
    out = {
        "generated_at": datetime.now().isoformat(),
        "in_degree": result["in_degree"],
        "out_degree": result["out_degree"],
        "total_degree": result["total_degree"],
        "total_flow": result["total_flow"],
        "centrality": result["centrality"],
        "edges": result.get("edges", []),  # ✅ THIS is what GraphView needs
        "llm_reasoning": result.get("llm_reasoning", ""),
    }

    os.makedirs("outputs", exist_ok=True)
    with open("outputs/transaction_analysis.json", "w") as f:
        json.dump(out, f, indent=2)

    print("💾 Saved → outputs/transaction_analysis.json")
