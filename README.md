# ResearchHub AI

ResearchHub AI is an intelligent, agentic AI-powered research paper management platform designed to help researchers efficiently discover, organize, and analyze academic literature.  

The system integrates FastAPI for backend processing, React + TypeScript for frontend development, and Groq’s Llama 3.3 70B model for advanced research-focused AI assistance.

---

## Project Overview

With the exponential growth of research publications, manually searching and analyzing papers is time-consuming.  

ResearchHub AI solves this by:

- Providing intelligent academic paper search
- Organizing papers into workspaces
- Enabling AI-powered contextual analysis
- Implementing semantic search using vector embeddings
- Securing user data with JWT authentication

---

# Pre-requisites

Before setting up and running ResearchHub AI, ensure the following tools and knowledge are available.

---

## System Requirements

- Python 3.9 or higher
- Node.js (v18+ recommended)
- npm or yarn
- Git installed
- PostgreSQL installed (for database)

---

## Technical Knowledge

- Strong understanding of Python
- Familiarity with FastAPI
- Basic knowledge of React and TypeScript
- Understanding of REST APIs
- Knowledge of SQL and relational databases
- Basic understanding of JWT authentication
- Basic understanding of Large Language Models (LLMs)

---

## External Services

- Groq API Account  
  https://console.groq.com/

---

## Backend Dependencies

- fastapi==0.104.1
- uvicorn[standard]==0.24.0
- python-dotenv==1.0.0
- groq==0.4.1
- httpx==0.25.2
- python-multipart==0.0.6
- python-jose[cryptography]==3.3.0
- passlib[bcrypt]==1.7.4
- sqlalchemy==2.0.23
- databases[postgresql]==0.8.0
- numpy==1.24.3
- sentence-transformers==2.2.2

Install using:
```bash
pip install -r requirements.txt
```
---

# Project Workflow

The development of ResearchHub AI follows a milestone-based approach to ensure systematic implementation and scalability.

---

## Milestone 1: Requirements Specification and Project Setup

### Activity 1.1: Create `requirements.txt`
- Defined version-locked backend dependencies.
- Ensured reproducibility across systems.

### Activity 1.2: Install Required Libraries
- Created isolated Python virtual environment using `venv`.
- Installed dependencies using pip.
- Configured `.gitignore` to prevent tracking unnecessary files.

---

## Milestone 2: Groq API Integration and Model Initialization

- Generate Groq API Key.
- Configure environment variables.
- Initialize Groq client with `llama-3.3-70b-versatile`.
- Set temperature to 0.3 for precise research analysis.

---

## Milestone 3: Backend Development with FastAPI

- Implement JWT-based authentication.
- Develop paper search API.
- Build AI-powered chatbot endpoint using RAG.

---

## Milestone 4: Frontend Development (React + TypeScript)

- Build authentication UI components.
- Integrate frontend with backend APIs.
- Implement dashboard and workspace interface.

---

## Milestone 5: AI Agent & Context Management

- Generate embeddings for research papers.
- Implement semantic search.
- Maintain workspace-specific AI context.
- Enable multi-document synthesis.

---

## Milestone 6: Testing & Deployment

- Run backend with Uvicorn.
- Start frontend development server.
- Configure CORS for cross-origin requests.
- Secure environment variables.

---

# Milestone 1 Status

Milestone 1 has been successfully completed.

✔ Created structured backend folder  
✔ Added version-locked `requirements.txt`  
✔ Configured `.gitignore`  
✔ Set up Python virtual environment  
✔ Installed all backend dependencies  

The project environment is now stable and ready for Groq API integration.

# Milestone 2 Status

Milestone 2 has been successfully completed.

- Generated Groq API key
- Configured secure .env file
- Initialized Groq client
- Centralized model configuration
- Successfully tested LLM response

---

# Project Structure
```
ResearchHub-AI/
│
├── backend/
│   ├── requirements.txt
│   ├── .env   (should exist locally)
│   └── utils/
│       └── groq_client.py
│
├── frontend/
├── .gitignore
├── README.md
```
---

# Security Practices

- Environment variables stored in `.env`
- JWT-based authentication
- Password hashing using bcrypt
- CORS properly configured

---

# Future Enhancements

- Multi-document summarization
- Citation tracking
- Paper similarity visualization
- Collaborative workspaces
- Streaming AI responses

---
