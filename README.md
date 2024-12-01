# Alpaca Health Session Note Generator

A modern, AI-powered session note generator built in 4 hours and 14 minutes for the Alpaca Health take-home challenge. This application streamlines the process of creating and managing therapy session notes with an intuitive interface and powerful AI assistance.

## 🌟 Key Features
- **Interactive Note Taking**: Dynamic bullet-point interface for structured note entry
- **AI-Powered Summary Generation**: Intelligent session summary generation with multiple format options
- **Smart Text Regeneration**: Context-aware text regeneration for specific sections
- **Modern UI/UX**: Clean, intuitive interface with Alpaca Health's design language
- **Robust Backend**: FastAPI-powered backend with Postgres database
- **Comprehensive Testing**: Extensive test suite for API, services, and database layers


## 🎨 UI/UX Considerations

- Intuitive note-taking interface
- Clear visual hierarchy
- Responsive design
- Accessibility compliance

## 🏗 Architecture & Design Decisions

### Frontend (Next.js + TypeScript)
- **Component Architecture**: Modular design with reusable components
  - `SessionModal`: Core modal component for session management
  - `SummaryDisplay`: Dedicated summary visualization
  - `PatientNameInput`: Reusable input component
  - `SuggestionBox`: Smart text regeneration interface
- **State Management**: React hooks for local state and clean props passing flow and prop elevation when needed
- **TypeScript**: Strong typing for enhanced code reliability
- **Styling**: Tailwind CSS for responsive design

### Backend (FastAPI + SQLAlchemy)
- **MVC Architecture**: Clean separation of concerns for maintainability
  - Models: SQLAlchemy models for data structure
  - Services: Business logic layer
  - Controllers: API endpoint handlers
- **Database**: Postgres for simplicity and portability
- **Async Support**: Fully asynchronous API endpoints
- **LLM Integration**: Modular LLM client for easy provider switching (Can switch to self-hosted LLMs, Claude, etc. (might be important for cost and data protection))

## 🛠 Technical Implementation

### Clean Code Practices
1. **SOLID Principles**
   - Single Responsibility: Each component has one clear purpose
   - Open/Closed: Extensible architecture for future features
   - Interface Segregation: Clean API contracts
   - Dependency Inversion: Modular dependencies

2. **Testing Strategy**
   - Unit Tests: Services and utilities
   - Integration Tests: API endpoints
   - Database Tests: Data layer operations
   - Mock LLM responses for consistent testing

3. **Error Handling**
   - Comprehensive error states
   - User-friendly error messages
   - Proper HTTP status codes
   - Validation at all layers


## 🚀 Setup & Installation

### Configure Environment Variables
Create a `.env` file in the root directory of your project and add the following configuration:

```env
DATABASE_URL=postgresql://localhost/alpaca_health OR <YOUR_DATABASE_URL>
OPENAI_API_KEY= <YOUR_OPENAI_API_KEY>
```

Replace the values with your actual environment settings as needed.

---

### Backend Setup (Python 3.11+)
Set up the Python virtual environment and install dependencies:

```bash
python -m venv alpaca_venv
source alpaca_venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### Frontend Setup (Node.js 18+)
Navigate to the `frontend` directory and start the development server:

```bash
cd frontend
npm install
npm run dev
```


## 🎯 Future Enhancements

1. **Feature Expansions**
   - Template support for routine appointments
   - RAG over all the history / notes of some particular user to get context / prep for upcoming sessions
   - Voice input for note-taking
   - OCR/VLLM for image processing of handwritten notes to be added as well
   - Add user authentication
   - Add support for user specific notes search (could have been implemented if I had some more time)
   - Healthcare CRM integration for syncing across multiple platforms
   - Add more LLM providers (self hosted LLMs finetuned for this specific use case)

2. **Technical Improvements**
   - Microservices architecture for scaling
   - Multi-provider LLM support



