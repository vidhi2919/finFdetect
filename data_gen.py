import csv
import random
import uuid
from datetime import datetime, timedelta

# =========================
# CONFIG
# =========================
NUM_TRANSACTIONS = 10000
NUM_ACCOUNTS = 300
START_TIME = datetime(2026, 1, 10, 9, 0, 0)

TRANSACTION_CSV = "transactions.csv"
METADATA_CSV = "metadata.csv"

# =========================
# SETUP
# =========================
accounts = [f"ACC{str(i).zfill(4)}" for i in range(1, NUM_ACCOUNTS + 1)]
balances = {acc: random.randint(20000, 150000) for acc in accounts}

transactions_rows = []
metadata_rows = []

current_time = START_TIME

# =========================
# TRANSACTION GENERATOR
# =========================
def generate_transaction(sender, receiver, amount, time):
    txn_id = "TXN" + uuid.uuid4().hex[:10].upper()

    # Sender row
    balances[sender] -= amount
    transactions_rows.append([
        txn_id,
        sender,
        time.date(),
        time.time(),
        f"UPI Transfer to {receiver}",
        0,
        amount,
        balances[sender]
    ])

    metadata_rows.append([
        txn_id,
        time,
        receiver
    ])

    # Receiver row
    balances[receiver] += amount
    transactions_rows.append([
        txn_id,
        receiver,
        time.date(),
        time.time(),
        f"UPI Received from {sender}",
        amount,
        0,
        balances[receiver]
    ])

    metadata_rows.append([
        txn_id,
        time,
        sender
    ])

# =========================
# NORMAL TRANSACTIONS
# =========================
for _ in range(int(NUM_TRANSACTIONS * 0.85)):
    sender, receiver = random.sample(accounts, 2)
    amount = random.randint(500, 25000)

    generate_transaction(sender, receiver, amount, current_time)
    current_time += timedelta(seconds=random.randint(30, 120))

# =========================
# FRAUD: MICRO-TRANSACTIONS
# =========================
fraud_source = random.choice(accounts)
fraud_targets = random.sample(accounts, 40)

for target in fraud_targets:
    amount = random.randint(9000, 9900)  # micro-transactions
    generate_transaction(fraud_source, target, amount, current_time)
    current_time += timedelta(seconds=random.randint(10, 30))

# =========================
# WRITE CSV FILES
# =========================
with open(TRANSACTION_CSV, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "transaction_id",
        "account_id",
        "date",
        "time",
        "description",
        "credit",
        "debit",
        "balance"
    ])
    writer.writerows(transactions_rows[:NUM_TRANSACTIONS])

with open(METADATA_CSV, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "transaction_id",
        "timestamp",
        "counterparty_account_id"
    ])
    writer.writerows(metadata_rows[:NUM_TRANSACTIONS])

print("✅ Data generation complete")
print(f"Transactions saved to: {TRANSACTION_CSV}")
print(f"Metadata saved to: {METADATA_CSV}")
print(f"Total rows generated: {NUM_TRANSACTIONS}")
