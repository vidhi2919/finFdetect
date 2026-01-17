import json
from pathlib import Path
from typing import Dict, List
import os
from rag_retriever import RagRetriever
from langchain_anthropic import ChatAnthropic
from dotenv import load_dotenv
load_dotenv()

OUTPUT_DIR = Path("outputs")

def load_json(path: str):
    return json.loads(Path(path).read_text())

def build_query(account_id: str, risk_entry: Dict, patterns: List[Dict], timeline: Dict) -> str:
    # Turn “technical evidence” into a retrieval query
    pattern_types = list({p["pattern_type"] for p in patterns if p["account_id"] == account_id})
    return f"""
Explain AML/KYC relevance for:
- Risk score: {risk_entry["risk_score"]} ({risk_entry["risk_band"]})
- Patterns: {pattern_types}
- Evidence: { [p.get("evidence") for p in patterns if p["account_id"] == account_id][:2] }
- Timeline: bursts={len(timeline.get("bursts", []))}, chains={len(timeline.get("chains", []))}
Need: AML structuring/smurfing, layering, round-tripping definitions; RBI/KYC reporting expectations; investigator next checks.
""".strip()

def main():
    final_risks = load_json(OUTPUT_DIR / "final_risk_scores.json")
    patterns = load_json(OUTPUT_DIR / "pattern_detections.json")
    timeline = load_json(OUTPUT_DIR / "timeline_reconstruction.json")

    retriever = RagRetriever()
    llm = ChatAnthropic(
        model="claude-3-haiku-20240307",
        temperature=0.1,
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
    )

    # Only explain HIGH + MEDIUM in MVP
    targets = [r for r in final_risks if r["risk_band"] in ("HIGH", "MEDIUM")][:20]

    reports = []
    for r in targets:
        acc = r["account_id"]
        query = build_query(acc, r, patterns, timeline)
        ctx = retriever.search(query, top_k=6)

        context_block = "\n\n".join(
            [f"[{i+1}] {c['text']}" for i, c in enumerate(ctx)]
        )

        prompt = f"""
You are an AML investigation assistant.

You MUST:
- Use ONLY the provided context for regulatory/legal statements.
- Avoid claiming guilt or legal judgment.
- Refer to findings as "suspicious indicators".
- If context is insufficient, say "insufficient context" rather than guessing.

CASE INPUT (technical):
Account: {acc}
Risk: {r["risk_score"]} ({r["risk_band"]})
Components: {r["components"]}

DETECTIONS (if any):
{[p for p in patterns if p["account_id"] == acc][:5]}

TIMELINE SUMMARY:
Bursts: {len(timeline.get("bursts", []))}
Chains: {len(timeline.get("chains", []))}
Coordination Score: {timeline.get("coordination_score")}

RETRIEVED CONTEXT:
{context_block}

Write:
1) What happened (plain English)
2) Why it is suspicious (typology mapping)
3) Regulatory/legal context (quote/paraphrase from retrieved context + reference [#])
4) What to check next (investigator checklist)
""".strip()

        resp = llm.invoke(prompt)

        reports.append({
            "account_id": acc,
            "risk": r,
            "retrieval": ctx,
            "report": resp.content
        })

    (OUTPUT_DIR / "rag_reports.json").write_text(json.dumps(reports, indent=2), encoding="utf-8")
    print(f"✅ Saved {len(reports)} RAG reports → outputs/rag_reports.json")

if __name__ == "__main__":
    main()
