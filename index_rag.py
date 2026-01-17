import os
import uuid
from pathlib import Path
from typing import List, Dict

from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer

DOCS_DIR = Path("rag_docs")
COLLECTION = "aml_knowledge"

# Use a light, strong baseline embedding model for V1
# (You can switch later without changing your pipeline)
EMBED_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

def read_all_text_files(base_dir: Path) -> List[Dict]:
    docs = []
    for path in base_dir.rglob("*"):
        if path.suffix.lower() not in [".txt", ".md"]:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore").strip()
        if not text:
            continue
        docs.append({
            "doc_id": str(uuid.uuid4()),
            "source_path": str(path),
            "category": path.parent.name,
            "text": text
        })
    return docs

def chunk_text(text: str, chunk_size: int = 900, overlap: int = 150) -> List[str]:
    # simple char-based chunking (V1). Later: token chunking.
    chunks = []
    i = 0
    while i < len(text):
        chunk = text[i:i+chunk_size]
        chunks.append(chunk)
        i += (chunk_size - overlap)
    return chunks

def main():
    client = QdrantClient(
    url="https://6b8b39a7-e092-4db1-993a-617f40874161.europe-west3-0.gcp.cloud.qdrant.io:6333", 
    api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.ZzO2h406HRr2dZwM3OYlbbhIMTdpBGF4w1quqXBguPc",)

    model = SentenceTransformer(EMBED_MODEL_NAME)

    # Create collection if not exists
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION not in existing:
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(
                size=model.get_sentence_embedding_dimension(),
                distance=Distance.COSINE
            )
        )

    docs = read_all_text_files(DOCS_DIR)
    points = []

    for d in docs:
        chunks = chunk_text(d["text"])
        embeddings = model.encode(chunks, show_progress_bar=False)

        for chunk, vec in zip(chunks, embeddings):
            points.append(
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=vec.tolist(),
                    payload={
                        "doc_id": d["doc_id"],
                        "source_path": d["source_path"],
                        "category": d["category"],
                        "text": chunk
                    }
                )
            )

    if points:
        BATCH_SIZE = 64  # cloud-safe

        for i in range(0, len(points), BATCH_SIZE):
            batch = points[i:i + BATCH_SIZE]
            client.upsert(
                collection_name=COLLECTION,
                points=batch
            )
            print(f"✓ Uploaded batch {i // BATCH_SIZE + 1}")


    print(f"✅ Indexed {len(points)} chunks into Qdrant collection '{COLLECTION}'")

if __name__ == "__main__":
    main()
