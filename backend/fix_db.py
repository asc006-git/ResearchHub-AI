import asyncio
from database import database

async def main():
    await database.connect()

    queries = [
        # Users table additions
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS institution VARCHAR;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS research_field VARCHAR;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS llm_model VARCHAR DEFAULT 'llama-3.3-70b-versatile';",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS temperature FLOAT DEFAULT 0.7;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS max_tokens INTEGER DEFAULT 1024;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS enable_history BOOLEAN DEFAULT TRUE;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS enable_analytics BOOLEAN DEFAULT TRUE;",

        # Workspaces table — ensure description column exists
        "ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS description TEXT;",

        # Papers table — ensure all necessary columns exist and rename url to source_url
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS published_date VARCHAR;",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS workspace_id INTEGER;",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS owner_id INTEGER;",
        # Rename url to source_url if it exists
        "DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='papers' AND column_name='url') THEN ALTER TABLE papers RENAME COLUMN url TO source_url; END IF; END $$;",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS source_url TEXT;",
        "ALTER TABLE papers ADD COLUMN IF NOT EXISTS imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;",

        # Research Notes table
        "CREATE TABLE IF NOT EXISTS research_notes (id SERIAL PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, is_ai_generated BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP, workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE);",

        # Activity logs — normalise column names
        # action_type is referenced in spec but model uses 'action'; keep 'action' as canonical
        "ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS action VARCHAR;",
        "ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS details TEXT;",
        # Security questions
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS security_question TEXT;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer_hash TEXT;",
    ]

    for q in queries:
        try:
            await database.execute(q)
            print(f"OK: {q}")
        except Exception as e:
            print(f"SKIP ({e}): {q}")

    await database.disconnect()
    print("\nMigration complete.")


if __name__ == '__main__':
    asyncio.run(main())
