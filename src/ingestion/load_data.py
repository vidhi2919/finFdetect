import pandas as pd
from config.settings import TRANSACTIONS_FILE, METADATA_FILE

def load_data():
    transactions = pd.read_csv(TRANSACTIONS_FILE)
    metadata = pd.read_csv(METADATA_FILE)
    return transactions, metadata
