import json
from pathlib import Path
import streamlit as st
import pandas as pd

OUTPUT_DIR = Path("outputs")
REPORTS_PATH = OUTPUT_DIR / "final_case_reports.json"

st.set_page_config(page_title="Fraud Investigator Dashboard", layout="wide")

def load_reports():
    return json.loads(REPORTS_PATH.read_text())

reports = load_reports()

# ---- Top table ----
rows = []
for r in reports:
    rows.append({
        "account_id": r["account_id"],
        "final_score": r["risk"]["final_score"],
        "band": r["risk"]["band"],
        "patterns": ", ".join(
            sorted(set([p.get("pattern_type", p.get("pattern")) for p in r.get("patterns_detected", []) if p]))
        )
    })

df = pd.DataFrame(rows).sort_values("final_score", ascending=False)

st.title("🕵️ Fraud Investigator Dashboard (MVP)")
st.write("Ranked alerts + explainable case file per account")

st.subheader("🔔 Ranked Alerts")
st.dataframe(df, use_container_width=True)

# ---- Select account ----
acc = st.selectbox("Select an account", df["account_id"].tolist())
report = next(r for r in reports if r["account_id"] == acc)

col1, col2 = st.columns(2)

with col1:
    st.subheader("Risk Summary")
    st.json(report["risk"])

    st.subheader("Graph Evidence")

    graph_path = report.get("graph_visual_path")

    if graph_path:
        img_path = Path(graph_path)

        if img_path.exists():
            st.image(
                str(img_path),
                caption=f"Transaction Graph for {report['account_id']}",
                use_container_width=True
            )
        else:
            st.warning(f"Graph image not found at {img_path}")

    # still show raw graph metrics
    st.markdown("**Graph Metrics**")
    st.json(report["graph_evidence"])


with col2:
    st.subheader("Patterns Detected")
    st.json(report["patterns_detected"])

    st.subheader("Timeline Evidence")
    st.json(report["timeline_evidence"])

st.subheader("Legal / Regulatory Mapping (RAG)")
st.json(report["legal_mapping"])

st.subheader("Next Actions")
for a in report["next_actions"]:
    st.checkbox(a, value=False)
