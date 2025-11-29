"""
Database Migration Script for CareerConnect
============================================

Run this script to fix the messages table schema issue.

The error "table messages has no column named employer_sender_id" occurs because
the database was created before those columns were added to the Message model.

OPTION 1: Delete and recreate database (if you don't have important data)
--------------------------------------------------------------------------
Simply delete the career_fair.db file and restart the Flask server.
The database will be recreated with all the correct columns.

    Windows:
        del career_fair.db
        python app.py

    Mac/Linux:
        rm career_fair.db
        python app.py


OPTION 2: Run this migration script (to preserve existing data)
---------------------------------------------------------------
    python migrate_db.py

"""

import sqlite3
import os

def migrate_messages_table():
    """Add missing columns to the messages table"""
    
    # Check both possible locations
    possible_paths = [
        'instance/career_fair.db',  # Flask default location
        'career_fair.db',            # Root backend folder
    ]
    
    db_path = None
    for path in possible_paths:
        if os.path.exists(path):
            db_path = path
            break
    
    if not db_path:
        print("❌ Database not found!")
        print("   Looked in:")
        for path in possible_paths:
            print(f"      - {path}")
        print("\n   Run 'python app.py' first to create the database.")
        return
    
    print(f"📂 Found database at: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check current columns in messages table
    cursor.execute("PRAGMA table_info(messages)")
    columns = [col[1] for col in cursor.fetchall()]
    
    print(f"📋 Current columns in messages table: {columns}")
    
    migrations_needed = []
    
    # Check for missing columns
    if 'employer_sender_id' not in columns:
        migrations_needed.append(
            "ALTER TABLE messages ADD COLUMN employer_sender_id INTEGER REFERENCES employer_profiles(id)"
        )
    
    if 'student_recipient_id' not in columns:
        migrations_needed.append(
            "ALTER TABLE messages ADD COLUMN student_recipient_id INTEGER REFERENCES student_profiles(id)"
        )
    
    if not migrations_needed:
        print("✅ Database schema is already up to date!")
        conn.close()
        return
    
    print(f"🔧 Running {len(migrations_needed)} migration(s)...")
    
    for migration in migrations_needed:
        try:
            print(f"   Running: {migration}")
            cursor.execute(migration)
            print(f"   ✅ Success")
        except sqlite3.OperationalError as e:
            print(f"   ❌ Error: {e}")
    
    conn.commit()
    conn.close()
    
    print("\n✅ Database migration complete!")
    print("   Restart your Flask server to apply changes.")


if __name__ == '__main__':
    print("=" * 60)
    print("CareerConnect Database Migration")
    print("=" * 60)
    migrate_messages_table()