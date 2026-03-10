# ResearchHub AI
ResearchHub AI is an AI-powered academic research assistant designed to help researchers, students, and developers efficiently discover, organize, and analyze scholarly papers. The platform integrates research paper discovery, workspace management, AI-based literature analysis, and structured research note management in a unified system.

The objective of this project is to streamline the research workflow by combining artificial intelligence with academic paper discovery tools.

--- 

##  DEMO VIDEO
```
https://youtu.be/EyCmc5188ZI
```

# Project Overview

ResearchHub AI provides an organized environment where users can search research papers from online scholarly databases, import them into dedicated research workspaces, analyze them with AI tools, and maintain structured research notes.

The system integrates external research APIs and AI models to enable intelligent research assistance and knowledge synthesis.

---

# System Architecture

The platform follows a modern full-stack architecture.

User  
↓  
Frontend Application (React + TypeScript)  
↓  
Backend API (FastAPI - Python)  
↓  
PostgreSQL Database  
↓  
External APIs (OpenAlex Research API and Groq AI)

---

# Core Features

## User Authentication

The platform supports secure user authentication.

Capabilities include:

- User registration
- Secure login with JWT authentication
- Session management
- Security question based password recovery
- Protected backend routes

---

## Research Paper Discovery

Users can search academic papers through integrated scholarly databases.

Capabilities include:

- Keyword-based research paper search
- Paper metadata retrieval
- Display of title, authors, abstract, year, and source
- Integration with OpenAlex API
- Import papers directly into workspaces
- Reading time estimation for papers

---

## Workspace Management

Workspaces allow users to organize research topics and projects.

Features include:

- Create research workspaces
- Import research papers into workspaces
- Manage multiple research topics
- Delete workspace functionality
- Workspace-based AI analysis

---

## AI Research Assistant

The AI assistant enables interactive research support.

Capabilities include:

- Answer research-related questions
- Provide structured responses with headings and points
- Summarize research papers
- Perform cross-paper analysis
- Provide academic-style explanations

---

## Literature Review Generator

This module generates structured literature reviews from imported papers.

Generated output includes:

- Research background
- Key findings
- Comparative analysis
- Major contributions
- Summary of research trends

---

## Research Gap Detector

This module analyzes imported research papers and detects possible research gaps.

Output includes:

- Underexplored topics
- Contradictory findings
- Future research directions
- Potential problem statements

---

## Research Notes

Users can maintain notes related to their research workspaces.

Capabilities include:

- Create notes
- Edit and delete notes
- Timestamped research entries
- AI-assisted note generation

---

## Activity History

The platform records user activity for tracking research progress.

Examples include:

- Workspace creation
- Paper imports
- AI analysis requests
- Research queries

---

# Unique Features

ResearchHub AI combines multiple academic research tools into a unified platform.

Key differentiators include:

- AI-powered literature review generation
- Automated research gap detection
- Workspace-based research organization
- Academic paper discovery integration
- AI-assisted scholarly analysis
- Structured research workflow management

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

## Backend

- Python
- FastAPI
- SQLAlchemy
- Async database handling
- JWT Authentication

## Database

- PostgreSQL

## External APIs

- OpenAlex API (research paper discovery)
- Groq API (AI assistant)

## Development Tools

- Git
- GitHub
- VS Code
- Postman

## Deployment Platforms

- Render (Backend and PostgreSQL)
- Render Static Site or Vercel (Frontend)

---

# Project Structure

```
ResearchHub-AI
│
├── backend
│   ├── routers
│   │   ├── auth.py
│   │   ├── papers.py
│   │   ├── workspace.py
│   │   └── research.py
│   │
│   ├── services
│   │   ├── paper_search.py
│   │   └── ai_service.py
│   │
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── security.py
│   └── main.py
│
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── services
    │   ├── context
    │   └── types
    │
    ├── package.json
    └── vite.config.ts
```

---

# Installation Guide

## Prerequisites

The following software must be installed:

- Python 3.10 or higher
- Node.js 18 or higher
- PostgreSQL
- Git

---

# Backend Setup

Navigate to the backend directory.

```
cd backend
```

Create a virtual environment.

```
python -m venv 
```

Activate the virtual environment.

Windows

```
venv\Scripts\activate
```

Install dependencies.

```
pip install -r requirements.txt
```

Create environment variables.

Create a `.env` file in the backend directory.

```
DATABASE_URL=postgresql://username:password@localhost:5432/researchhub
SECRET_KEY=your_secret_key
GROQ_API_KEY=your_api_key
```

Start the backend server.

```
uvicorn main:app --reload
```

Backend server will run at:

```
http://localhost:8000
```

API documentation will be available at:

```
http://localhost:8000/docs
```

---

# Frontend Setup

Navigate to the frontend directory.

```
cd frontend
```

Install dependencies.

```
npm install
```

Start the development server.

```
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# Database Setup

Create a PostgreSQL database.

```
CREATE DATABASE researchhub;
```

Update the database connection string in the environment variables.

Run the backend server to automatically create tables.

---

# Future Enhancements

Potential future improvements include:

- Collaborative research workspaces
- Citation export functionality
- PDF annotation tools
- Knowledge graph visualization
- Advanced research analytics

--- 

# UI Screenshots : 
<img width="1914" height="873" alt="image" src="https://github.com/user-attachments/assets/08d98f8a-6e17-445b-bcc7-aed0dc471afa" />



<img width="1920" height="1080" alt="Screenshot (399)" src="https://github.com/user-attachments/assets/dd901149-e17d-4d1e-a181-9adb891e49f7" />




<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2fb3091d-8b6a-4d9a-9e9f-7789de4d26cc" />



<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/51fe216f-cb4d-4994-ae9f-00be0959280f" />


# License

This project is developed for educational and research purposes.
