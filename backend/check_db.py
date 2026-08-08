import os
import sys
import sqlite3

sys.stdout.reconfigure(encoding='utf-8')


db_path = "sql_app.db"
if not os.path.exists(db_path):
    print(f"Database file {db_path} does not exist!")
    sys.exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

tables = [row[0] for row in cursor.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall() if not row[0].startswith('sqlite')]

print("=" * 50)
print("📂 MEDICARE AI DATABASE DIAGNOSTIC CHECK")
print("=" * 50)
print(f"Database File: {os.path.abspath(db_path)}")
print(f"Database Size: {os.path.getsize(db_path) / 1024:.2f} KB")
print(f"Total Tables Found: {len(tables)}")
print("-" * 50)

for table in tables:
    count = cursor.execute(f"SELECT count(*) FROM {table}").fetchone()[0]
    cols = [col[1] for col in cursor.execute(f"PRAGMA table_info({table})").fetchall()]
    print(f"Table: '{table}' | Row Count: {count} | Columns ({len(cols)}): {', '.join(cols)}")

print("-" * 50)

# Verify seeded admin
admin = cursor.execute("SELECT id, email, full_name, role, is_active FROM users WHERE role='admin'").fetchone()
if admin:
    print(f"✅ Admin Account Verified: ID #{admin[0]} | {admin[1]} ({admin[2]}) | Active: {bool(admin[4])}")
else:
    print("⚠️ No admin account found in database.")

print("=" * 50)
conn.close()
