from databases import Database
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import declarative_base
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")

DATABASE_URL = os.getenv("DATABASE_URL")

# databases requires postgresql:// instead of postgres:// 
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

database = Database(DATABASE_URL)
metadata = MetaData()
Base = declarative_base(metadata=metadata)

# We create a synchronous engine for creating tables if needed, 
# though for production migrations Alembic is recommended.
engine = create_engine(DATABASE_URL)
