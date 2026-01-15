#!/bin/bash
# Neo4j Admin Import Script
# Generated: 2026-01-15T21:35:07.921698

neo4j-admin database import full \
    --nodes=./neo4j_import/nodes.csv \
    --relationships=./neo4j_import/relationships.csv \
    --overwrite-destination=true \
    fraud-detection

echo "✅ Graph imported to 'fraud-detection' database"
echo "Start Neo4j and run: :use fraud-detection"
