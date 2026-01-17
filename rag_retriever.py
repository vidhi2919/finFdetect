# import os
# from qdrant_client import QdrantClient
# from sentence_transformers import SentenceTransformer

# COLLECTION = "aml_knowledge"
# EMBED_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# class RagRetriever:
#     def __init__(self):
#         self.client = QdrantClient(
#         url="https://6b8b39a7-e092-4db1-993a-617f40874161.europe-west3-0.gcp.cloud.qdrant.io:6333", 
#         api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.ZzO2h406HRr2dZwM3OYlbbhIMTdpBGF4w1quqXBguPc",)
#         self.model = SentenceTransformer(EMBED_MODEL_NAME)

#     def search(self, query: str, top_k: int = 5):
#         qvec = self.model.encode([query])[0].tolist()
#         hits = self.client.search(
#             collection_name=COLLECTION,
#             query_vector=qvec,
#             limit=top_k
#         )
#         results = []
#         for h in hits:
#             results.append({
#                 "score": h.score,
#                 "category": h.payload.get("category"),
#                 "source_path": h.payload.get("source_path"),
#                 "text": h.payload.get("text")
#             })
#         return results

import os
from typing import List, Dict
from dotenv import load_dotenv

from qdrant_client import QdrantClient
from qdrant_client.models import NamedVector

from sentence_transformers import SentenceTransformer

load_dotenv()

class RagRetriever:
    def __init__(self, collection_name: str = "aml_knowledge"):
        self.collection_name = collection_name

        self.client = QdrantClient(
            url=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY"),
            check_compatibility=False
        )

        # Use same model as indexing
        self.embedder = SentenceTransformer(
            os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        )

    def embed(self, text: str) -> List[float]:
        return self.embedder.encode(text, normalize_embeddings=True).tolist()

    def search(self, query_text: str, top_k: int = 6) -> List[Dict]:
        """
        Takes query TEXT, embeds it, and retrieves relevant chunks from Qdrant.
        """
        query_vector = self.embed(query_text)

        # If your collection uses a named vector "text"
        # res = self.client.query_points(
        #     collection_name=self.collection_name,
        #     query=NamedVector(name="text", vector=query_vector),
        #     limit=top_k,
        #     with_payload=True,
        #     with_vectors=False
        # )
        res = self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            limit=top_k,
            with_payload=True,
            with_vectors=False
        )

        hits = res.points if hasattr(res, "points") else []

        out = []
        for p in hits:
            payload = p.payload or {}
            out.append({
                "score": float(p.score) if p.score is not None else 0.0,
                "text": payload.get("text", ""),
                "source": payload.get("source", payload.get("file", "unknown")),
                "metadata": payload
            })

        return out
