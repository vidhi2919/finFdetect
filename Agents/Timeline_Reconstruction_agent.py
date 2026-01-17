# import csv
# from datetime import datetime, timedelta

# class TimelineReconstructionAgent:
#     def __init__(self, burst_window_seconds=60, hop_window_seconds=60):
#         self.burst_window = timedelta(seconds=burst_window_seconds)
#         self.hop_window = timedelta(seconds=hop_window_seconds)

#     def analyze(self, transfers):
#         transfers.sort(key=lambda x: x["timestamp"])

#         bursts = self.detect_bursts(transfers)
#         chains = self.detect_rapid_chains(transfers)

#         coordination_score = len(bursts) * 2 + len(chains) * 3

#         return {
#             "total_transactions": len(transfers),
#             "bursts_detected": len(bursts),
#             "rapid_chains_detected": len(chains),
#             "coordination_score": coordination_score,
#             "bursts": bursts,
#             "rapid_chains": chains
#         }

#     def detect_bursts(self, transfers):
#         bursts = []
#         current = [transfers[0]]

#         for i in range(1, len(transfers)):
#             if transfers[i]["timestamp"] - current[-1]["timestamp"] <= self.burst_window:
#                 current.append(transfers[i])
#             else:
#                 if len(current) >= 3:
#                     bursts.append(current)
#                 current = [transfers[i]]

#         if len(current) >= 3:
#             bursts.append(current)

#         return bursts

#     def detect_rapid_chains(self, transfers):
#         chains = []
#         for i in range(len(transfers) - 1):
#             t1 = transfers[i]
#             t2 = transfers[i + 1]

#             if (
#                 t1["receiver"] == t2["sender"] and
#                 abs(t1["amount"] - t2["amount"]) <= 5 and
#                 t2["timestamp"] - t1["timestamp"] <= self.hop_window
#             ):
#                 chains.append([t1, t2])

#         return chains


# # =============================
# # READ FROM GRAPH OUTPUT
# # =============================
# def load_transfers_from_csv(path):
#     transfers = []
#     with open(path, newline="") as f:
#         reader = csv.DictReader(f)
#         for row in reader:
#             transfers.append({
#                 "sender": row["sender"],
#                 "receiver": row["receiver"],
#                 "amount": float(row["amount"]),
#                 "timestamp": datetime.fromisoformat(row["timestamp"])
#             })
#     return transfers


# if __name__ == "__main__":
#     transfers = load_transfers_from_csv("graph_output/transfers.csv")

#     agent = TimelineReconstructionAgent(
#         burst_window_seconds=60,
#         hop_window_seconds=60
#     )

#     result = agent.analyze(transfers)

#     print("\n===== TIMELINE RECONSTRUCTION AGENT OUTPUT =====")
#     print(f"Total Transactions: {result['total_transactions']}")
#     print(f"Bursts Detected: {result['bursts_detected']}")
#     print(f"Rapid Chains Detected: {result['rapid_chains_detected']}")
#     print(f"Coordination Score: {result['coordination_score']}")




# import csv
# from datetime import datetime, timedelta
# from typing import List, Dict
# from langchain_anthropic import ChatAnthropic
# from langchain_core.prompts import PromptTemplate

# class TimelineReconstructionAgent:
#     def __init__(self, burst_window_seconds=60, hop_window_seconds=60):
#         self.burst_window = timedelta(seconds=burst_window_seconds)
#         self.hop_window = timedelta(seconds=hop_window_seconds)

#         # Initialize Claude LLM via LangChain
#         self.llm = ChatAnthropic(
#             model="claude-3-haiku-20240307",
#             temperature=0.1,
#             anthropic_api_key="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"
#         )

#     def analyze(self, transfers: List[Dict]):
#         transfers.sort(key=lambda x: x["timestamp"])

#         bursts = self.detect_bursts(transfers)
#         chains = self.detect_rapid_chains(transfers)

#         coordination_score = len(bursts) * 2 + len(chains) * 3

#         # Generate reasoning
#         reasoning = self.generate_reasoning(bursts, chains, coordination_score)

#         return {
#                 "total_transactions": len(transfers),
#                 "bursts_detected": len(bursts),
#                 "rapid_chains_detected": len(chains),
#                 "coordination_score": coordination_score,
#                 "bursts": bursts,
#                 "rapid_chains": chains,
#                 "llm_reasoning": reasoning
#             }

#     def detect_bursts(self, transfers: List[Dict]):
#         bursts = []
#         if not transfers:
#             return bursts

#         current = [transfers[0]]
#         for i in range(1, len(transfers)):
#             if transfers[i]["timestamp"] - current[-1]["timestamp"] <= self.burst_window:
#                 current.append(transfers[i])
#             else:
#                 if len(current) >= 3:
#                     bursts.append(current)
#                 current = [transfers[i]]
#         if len(current) >= 3:
#             bursts.append(current)
#         return bursts

#     def detect_rapid_chains(self, transfers: List[Dict]):
#         chains = []
#         for i in range(len(transfers) - 1):
#             t1 = transfers[i]
#             t2 = transfers[i + 1]
#             if (
#                 t1["receiver"] == t2["sender"]
#                 and abs(t1["amount"] - t2["amount"]) <= 5
#                 and t2["timestamp"] - t1["timestamp"] <= self.hop_window
#             ):
#                 chains.append([t1, t2])
#         return chains

#     def generate_reasoning(self, bursts, chains, coordination_score):
#         prompt = f"""
#     You are a financial forensic analyst.

#     We detected the following suspicious coordination patterns:

#     Bursts detected: {len(bursts)}
#     Rapid chains detected: {len(chains)}
#     Coordination score: {coordination_score}

#     Explain what this means in simple investigative language.
#     Do NOT claim legal judgment.
#     Explain only suspicion patterns.
#     """

#         response = self.llm.invoke(prompt)

#         # LangChain now returns an AIMessage object
#         return response.content



# def load_transfers_from_csv(path):
#     transfers = []
#     with open(path, newline="") as f:
#         reader = csv.DictReader(f)
#         for row in reader:
#             transfers.append({
#                 "sender": row["sender"],
#                 "receiver": row["receiver"],
#                 "amount": float(row["amount"]),
#                 "timestamp": datetime.fromisoformat(row["timestamp"])
#             })
#     return transfers


# # ========== RUN ==========

# if __name__ == "__main__":
#     transfers = load_transfers_from_csv("graph_output/transfers.csv")
#     agent = TimelineReconstructionAgent(
#         burst_window_seconds=60,
#         hop_window_seconds=60
#     )
#     result = agent.analyze(transfers)

#     print("\n===== TIMELINE RECONSTRUCTION AGENT OUTPUT =====")
#     print(f"Total Transactions: {result['total_transactions']}")
#     print(f"Bursts Detected: {result['bursts_detected']}")
#     print(f"Rapid Chains Detected: {result['rapid_chains_detected']}")
#     print(f"Coordination Score: {result['coordination_score']}")
#     print("\n== Claude Explanation ==\n")
#     print(result["llm_reasoning"])




import os
import csv
from datetime import datetime, timedelta
from typing import List, Dict, TypedDict
import json
from datetime import datetime
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic

from dotenv import load_dotenv
import os

from py2neo import Graph as NeoGraph
import networkx as nx

load_dotenv()  

# =====================
# Agent State Schema
# =====================

class AgentState(TypedDict):
    transfers: List[Dict]
    bursts: List[List[Dict]]
    chains: List[List[Dict]]
    coordination_score: int
    reasoning: str


# =====================
# Utility Functions
# =====================

BURST_WINDOW = timedelta(seconds=60)
HOP_WINDOW = timedelta(seconds=60)


def detect_bursts(transfers: List[Dict]):
    bursts = []
    if not transfers:
        return bursts

    current = [transfers[0]]

    for i in range(1, len(transfers)):
        if transfers[i]["timestamp"] - current[-1]["timestamp"] <= BURST_WINDOW:
            current.append(transfers[i])
        else:
            if len(current) >= 3:
                bursts.append(current)
            current = [transfers[i]]

    if len(current) >= 3:
        bursts.append(current)

    return bursts


def detect_rapid_chains(transfers: List[Dict]):
    chains = []

    for i in range(len(transfers) - 1):
        t1 = transfers[i]
        t2 = transfers[i + 1]

        if (
            t1["receiver"] == t2["sender"]
            and abs(t1["amount"] - t2["amount"]) <= 5
            and t2["timestamp"] - t1["timestamp"] <= HOP_WINDOW
        ):
            chains.append([t1, t2])

    return chains


# =====================
# LangGraph Nodes
# =====================

def burst_node(state: AgentState):
    transfers = sorted(state["transfers"], key=lambda x: x["timestamp"])
    bursts = detect_bursts(transfers)
    return {**state, "bursts": bursts}


def chain_node(state: AgentState):
    transfers = sorted(state["transfers"], key=lambda x: x["timestamp"])
    chains = detect_rapid_chains(transfers)
    return {**state, "chains": chains}


def score_node(state: AgentState):
    score = len(state["bursts"]) * 2 + len(state["chains"]) * 3
    return {**state, "coordination_score": score}


def reasoning_node(state: AgentState):
    llm = ChatAnthropic(
        model="claude-3-haiku-20240307",
        temperature=0.1,
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
    )

    prompt = f"""
You are a financial forensic analyst.

We detected the following suspicious coordination patterns:

Bursts detected: {len(state['bursts'])}
Rapid chains detected: {len(state['chains'])}
Coordination score: {state['coordination_score']}

Explain what this means in simple investigative language.
Do NOT claim legal judgment.
Explain only suspicion patterns.
"""

    response = llm.invoke(prompt)

    return {**state, "reasoning": response.content}


# =====================
# Graph Construction
# =====================

def build_agent():
    graph = StateGraph(AgentState)

    graph.add_node("burst_detection", burst_node)
    graph.add_node("chain_detection", chain_node)
    graph.add_node("scoring", score_node)
    graph.add_node("reasoning", reasoning_node)

    graph.set_entry_point("burst_detection")

    graph.add_edge("burst_detection", "chain_detection")
    graph.add_edge("chain_detection", "scoring")
    graph.add_edge("scoring", "reasoning")
    graph.add_edge("reasoning", END)

    return graph.compile()


# =====================
# CSV Loader
# =====================

# =====================
# Neo4j Loader
# =====================

def load_transfers_from_neo4j():
    from py2neo import Graph
    import os
    from datetime import datetime

    graph = Graph(
        os.getenv("NEO4J_URI"),
        auth=(os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD")),
        name=os.getenv("NEO4J_DATABASE")
    )

    query = """
    MATCH (a:Account)-[t:TRANSFER]->(b:Account)
    RETURN 
        a.account_id AS sender,
        b.account_id AS receiver,
        toFloat(t.avg_amount) AS amount,
        t.first_time AS timestamp
    ORDER BY timestamp
    """

    data = graph.run(query)

    transfers = []
    for r in data:
        transfers.append({
            "sender": r["sender"],
            "receiver": r["receiver"],
            "amount": float(r["amount"]),
            "timestamp": datetime.fromisoformat(r["timestamp"].replace("Z",""))
        })

    print(f"Loaded {len(transfers)} transfers from Neo4j")
    print("Sample:", transfers[:3])
    return transfers




# =====================
# Runner
# =====================

if __name__ == "__main__":
    transfers = load_transfers_from_neo4j()  

    agent = build_agent()

    initial_state: AgentState = {
        "transfers": transfers,
        "bursts": [],
        "chains": [],
        "coordination_score": 0,
        "reasoning": ""
    }

    result = agent.invoke(initial_state)

    print("\n===== LANGGRAPH TIMELINE RECONSTRUCTION AGENT OUTPUT =====")
    print(f"Total Transactions: {len(transfers)}")
    print(f"Bursts Detected: {len(result['bursts'])}")
    print(f"Rapid Chains Detected: {len(result['chains'])}")
    print(f"Coordination Score: {result['coordination_score']}")

    print("\n== Claude Explanation ==\n")
    print(result["reasoning"])

    

    output = {
        "generated_at": datetime.now().isoformat(),
        "bursts": result["bursts"],
        "chains": result["chains"],
        "coordination_score": result["coordination_score"],
        "reasoning": result["reasoning"]
    }

    with open("outputs/timeline_reconstruction.json", "w") as f:
        json.dump(output, f, indent=2, default=str)

    print("💾 Saved → outputs/timeline_reconstruction.json")

