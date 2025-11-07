# Knowledge Transfer Web App

A production-ready static web application that captures employee knowledge and enables AI-powered conversations with their expertise.

## Features

- **User/Brain Management**: Create digital "brains" for employees
- **Document Upload**: Support for PDF, TXT, and DOCX files
- **AI Chat**: Chat with LLM that responds as the employee based on their documents
- **Settings**: Configure API endpoint, model, and parameters
- **Data Export/Import**: Backup and restore all data
- **Dark Mode**: Automatic dark mode support
- **508/ADA Compliant**: Full accessibility support

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- IndexedDB (browser storage)
- pdf.js, mammoth.js (document parsing)
- Zustand (state management)
- React Router (hash routing)

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd KnowledgeTransfer
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Deployment to GitHub Pages

### One-Time Setup

1. Go to your GitHub repository settings
2. Navigate to Pages section
3. Set Source to "GitHub Actions"

### Automatic Deployment

The app automatically deploys to GitHub Pages when you push to the main branch:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Your app will be available at: `https://<username>.github.io/KnowledgeTransfer/`

## How to Use

### 1. Configure Settings

- Go to Settings page
- Enter your LLM API endpoint (e.g., OpenAI API)
- Enter your API key
- Configure model, temperature, and max tokens
- Click "Save Settings"

### 2. Create Users

- Go to Home page
- Enter a user name and click "Create"
- The user appears in the list

### 3. Upload Documents

- Select a user from the list
- Click "Upload Documents" or drag files
- Supported formats: PDF, TXT, DOCX
- Documents are processed and stored locally

### 4. Chat with User Brain

- Go to Chat page
- Select a user from dropdown
- Ask questions about their documents
- The AI responds as that person based on their knowledge

### 5. Export/Import Data

- Go to Settings page
- Click "Export Data" to download backup JSON
- Click "Import Data" to restore from backup

## Supported File Formats

- **PDF**: Extracts text from all pages
- **TXT**: Plain text files
- **DOCX**: Microsoft Word documents

## Data Storage

All data is stored locally in your browser using IndexedDB:
- User profiles and metadata
- Document content (extracted text)
- API settings
- No external database required

## Accessibility Features

- WCAG 2.1 AA compliant
- Keyboard navigation (Tab, Enter, Esc)
- Screen reader support with ARIA labels
- Focus indicators on all interactive elements
- 4.5:1 color contrast minimum
- Skip links for navigation
- Reduced motion support

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Security

- API keys stored in browser localStorage
- Input sanitization
- CSP headers
- No eval() or dangerous innerHTML
- File type validation

## Performance

- Code splitting by route
- Lazy loading components
- Optimized production build
- Fast load time (<2s)

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
