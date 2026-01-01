# Lumen - AI Document Manager Frontend

Next.js frontend for the AI Document Manager. Upload documents, get AI-powered summaries and classifications, and chat with your documents using RAG (Retrieval Augmented Generation).

## Tech Stack

- **Next.js 16** - App Router with React Server Components
- **React 19** - Latest React with compiler optimizations
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Radix-based component library
- **Axios** - HTTP client for API calls
- **TypeScript** - Type safety

## Features

- **Document Upload** - Drag & drop zone with file validation (PDF, TXT)
- **Document Management** - List, view status, delete documents
- **AI Processing** - Automatic summarization and classification via Logos RAG service
- **Chat with Documents** - Ask questions about your documents with streaming responses
- **Dual Chat Views** - Simple (ChatGPT-style) and Split (document + chat side-by-side)

## Architecture

```
Lumen (Frontend) → Atlas (NestJS Backend) → Logos (Python RAG Engine)
```

- **Lumen**: User interface, document management, chat UI
- **Atlas**: Authentication, document metadata, API gateway to Logos
- **Logos**: Document parsing, chunking, embeddings, vector search, LLM calls

## Project Structure

```
app/
├── documents/
│   └── page.tsx           # Document list + upload page
├── chat/
│   └── [documentId]/
│       └── page.tsx       # Chat with document page
├── layout.tsx             # Root layout with providers
├── page.tsx               # Redirect to /documents
└── globals.css            # Tailwind styles

components/
├── ui/                    # shadcn/ui components
├── documents/
│   ├── upload-zone.tsx    # Drag & drop upload
│   └── document-card.tsx  # Document list item
└── chat/
    ├── message.tsx        # Chat message bubble
    ├── chat-simple.tsx    # Simple chat view
    └── chat-split.tsx     # Split view (doc + chat)

contexts/
└── auth-context.tsx       # Auth state management

lib/
├── api.ts                 # Axios client + API functions
└── utils.ts               # Utility functions

types/
└── index.ts               # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- Atlas backend running on `http://localhost:3000`
- Logos RAG service running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (Note: Next.js defaults to port 3000, you may need to use 3001 if Atlas is running)

### Running the Full Stack

```bash
# Terminal 1: Logos (RAG Engine)
cd ~/Documents/projects/logos
docker compose up -d

# Terminal 2: Atlas (Backend)
cd ~/Documents/projects/atlas
npm run start:dev

# Terminal 3: Lumen (Frontend)
cd ~/Documents/projects/lumen
npm run dev -- -p 3001  # Use port 3001 to avoid conflict with Atlas
```

## API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/documents/upload` | POST | Upload a document |
| `/documents` | GET | List user's documents |
| `/documents/:id` | GET | Get document details |
| `/documents/:id/status` | GET | Get processing status |
| `/documents/:id` | DELETE | Delete a document |
| `/chat` | POST | Chat with document (SSE stream) |

## Authentication

Currently using localStorage for JWT token storage. Set the token manually for testing:

```javascript
localStorage.setItem('access_token', 'your-jwt-token-here');
```

To get a token, register/login via Atlas API:

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Related Projects

- **[Atlas](../atlas)** - NestJS backend API
- **[Logos](../logos)** - Python RAG engine (FastAPI + LangChain + pgvector)
