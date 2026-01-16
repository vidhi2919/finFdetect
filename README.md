# Financial Fraud Micro-Transaction Tracing MVP

This repository contains the Version-1 MVP of an explainable and deterministic financial fraud investigation system.  
The system is designed to help investigators understand and prioritize fraud cases where money is split into multiple micro-transactions and moved rapidly across accounts.

This is not a prediction system.  
This is not a machine learning system.  
This is not a black-box scoring engine.  

It is a graph-based forensic analysis tool that focuses on explainability, auditability, and legal defensibility.

---

## Core Idea

Fraud using micro-transactions works because:
- Money is split into many small transfers
- Transfers are sent to many accounts
- Funds are moved again to hide the trail
- Each transaction alone looks normal

Fraud becomes visible only when:
- Account relationships
- Money flow structure
- Timing and coordination  
are analyzed together.

This MVP converts raw transaction logs into:
- A money flow graph
- Rule-based fraud patterns
- Timeline coordination signals
- Deterministic risk scores
- Legal and regulatory explanations using RAG

---

## System Flow

transactions.csv and metadata.csv  
→ Transaction Graph Builder  
→ Four Parallel Analysis Agents  
→ Rule-Based Risk Scoring  
→ RAG Legal Explanation Layer  
→ Explainable Fraud Report and Investigator Dashboard  

---

## Input Data

Only synthetic CSV data is used.

transactions.csv fields:
- transaction_id  
- account_id  
- date  
- time  
- description  
- credit  
- debit  
- balance  

Each real transfer has two rows:
- Debit row represents the sender  
- Credit row represents the receiver  

metadata.csv fields:
- transaction_id  
- timestamp  
- counterparty_account_id  

Not included in V1:
- IP addresses  
- Device identifiers  
- Location data  
- KYC or identity data  

This is intentional to keep the MVP simple and realistic.

---

## Transaction Graph Builder

All analysis is based on a directed money-flow graph.

Graph definition:
- Node represents a bank account (account_id)
- Directed edge represents money movement from sender to receiver
- Edge attributes:
  - transaction_id
  - amount
  - timestamp

Logic:
- If debit > 0, the account is the sender
- If credit > 0, the account is the receiver
- Rows with the same transaction_id are paired
- A directed edge is created from sender to receiver

The graph is the single source of truth for the system.

---

## Analysis Agents

All agents:
- Run independently
- Use the same transaction graph
- Do not communicate with each other
- Are stateless and deterministic
- Output normalized scores between 0 and 1

1. Transaction Analysis Agent  
Purpose: Analyze money flow structure  
Computes:
- In-degree and out-degree
- Total sent and received
- Flow concentration
- Structural importance  
This agent does not detect fraud patterns.

2. Pattern Detection Agent  
Purpose: Detect known fraud structures  
Detects:
- Smurfing (one to many small transfers)
- Layering (multi-hop movement)
- Cycles (money returning to origin)  
Uses graph paths, amounts, and time gaps.

3. Correlation Agent  
Purpose: Detect coordinated behavior  
Finds:
- Accounts with similar transaction patterns
- Shared recipients
- Similar timing and amounts  
Accounts may be linked even without direct transfers.

4. Timeline Reconstruction Agent  
Purpose: Detect temporal coordination  
Analyzes:
- Event ordering
- Burst activity
- Rapid multi-hop movement
- Speed of fund propagation  

---

## Risk Scoring

Risk scoring is fully rule-based.

Each agent outputs a score between 0 and 1.

Example formula:

Final Risk =  
0.30 × Transaction Flow Score  
0.30 × Pattern Detection Score  
0.20 × Correlation Score  
0.20 × Timeline Coordination Score  

Risk categories:
- High risk: immediate investigation
- Medium risk: analyst review
- Low risk: monitoring

This prevents alert flooding and keeps prioritization practical.

---

## RAG Legal Explanation Layer

The RAG layer does not analyze transactions directly.

Only these are embedded:
- AML laws
- RBI guidelines
- Fraud typologies
- Legal definitions
- Case summaries  

Not embedded:
- Transactions
- Graphs
- Agent outputs
- Risk scores  

The RAG system:
- Retrieves relevant legal and regulatory context
- Maps detected patterns to legal meaning
- Generates human-readable explanations
- Does not issue legal judgments  

Example:
“This behavior matches AML structuring due to repeated sub-threshold transfers within a short time window.”

---

## Final Outputs

Explainable Fraud Report:
- Why an account is suspicious
- Which pattern was detected
- Timeline explanation
- Graph-based evidence
- Legal and regulatory mapping  

Investigator Dashboard:
- Transaction graph visualization
- Timelines
- Ranked risky accounts
- Search and filtering

---

## Technology Stack

Graph Engine: NetworkX  
Vector Database: Qdrant  
Agent Runtime: LiveKit  
Mode: Real-time  
Data: Synthetic CSV  
Machine Learning: None (V1)

---

## What This MVP Does Not Do

- No prediction
- No deep learning
- No neural networks
- No black-box scoring
- No GNNs
- No identity resolution
- No real bank integration
- No automatic legal judgments

---

## Development Order

1. Transaction graph construction  
2. Pattern detection rules  
3. Timeline reconstruction  
4. Risk scoring  
5. RAG explanation layer  

This order must be followed.

---

## Dataset Scale

Accounts: around 300  
Transaction rows: around 10,000  
Real transfers: around 5,000  

This is sufficient for:
- Validating graph logic
- Demonstrating fraud patterns
- Showing explainability

---

## Design Philosophy

This MVP prioritizes:
- Determinism over prediction
- Explainability over model accuracy
- Legal defensibility over automation
- Graph reasoning over black-box models  

The system is built to assist investigators, not replace them.
