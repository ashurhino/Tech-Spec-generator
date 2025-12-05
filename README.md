# Tech Spec Generator (Transformation Spec Builder)

This is a repository to generate technical and functional specifications in an interactive manner to be fed into Kiro and generate a fully functional modernized app.

A React-based web application that helps you create comprehensive transformation specification documents for code modernization projects. Generate both Markdown (.md) and PDF files from a user-friendly form interface, with automatic PDF/DOCX/JSON document conversion support.

## Features

- ✅ **Multi-step wizard** - Guided form with 7 steps
- ✅ **Comprehensive coverage** - All aspects of code transformation
- ✅ **Dual output** - Generate both MD (for AI) and PDF (for humans)
- ✅ **Document conversion** - Automatic PDF/DOCX to TXT conversion
- ✅ **JSON support** - Upload JSON files for UAN/UAD documents
- ✅ **Backend integration** - Python Flask backend for document processing
- ✅ **Kiro-CLI integration** - Direct transformation execution
- ✅ **Dynamic forms** - Conditional fields based on transformation type
- ✅ **Modern UI** - Built with Ant Design components
- ✅ **Type-safe** - Full TypeScript support

## Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Modern web browser (Chrome recommended for File System Access API)

## Installation

1. Navigate to the project directory:

```bash
cd transformation-spec-generator
```

2. Install frontend dependencies:

```bash
npm install
```

3. Create Python virtual environment and install backend dependencies:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
```

## Running the Application

### Start the Frontend (React + Vite)

```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

### Start the Backend (Python Flask)

In a separate terminal:

```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
python backend/server.py
```

The backend will start at `http://localhost:5007`

## Features in Detail

### Document Upload & Conversion

- Upload PDF, DOCX, JSON, TXT, or MD files
- Automatic conversion of PDF/DOCX to TXT format for Kiro-CLI compatibility
- Support for User Story, UAN, and UAD documents
- Coding standard documents with multi-file support

### Transformation Execution

- Direct integration with Kiro-CLI
- Real-time streaming output
- Automatic spec file generation
- Working directory selection

### Output Files

The application generates multiple files in the `.kiro` folder:

1. **requirements-specification.md** - Markdown format for requirements
2. **technical-details.md** - Technical specification in Markdown
3. **requirements-specification.pdf** - PDF version for stakeholders
4. **technical-details.pdf** - Technical PDF documentation
5. **transformation-spec.kiro** - Kiro-CLI specification file
6. **Converted documents** - TXT versions of uploaded PDF/DOCX files

## Usage

1. **Select Transformation Type** - Choose from API, UI, Business Logic, Database, etc.
2. **Upload Documents** - Upload requirements, UAN, UAD documents (PDF/DOCX/JSON supported)
3. **Fill in Project Details** - Source/target projects, tech stack, goals
4. **Analyze Source Code** - Document legacy code location and issues
5. **Define Target Architecture** - Specify new architecture and patterns
6. **Configure Dependencies** - List internal/external dependencies
7. **Set Technical Requirements** - Auth, validation, error handling, etc.
8. **Define Quality Standards** - Testing, code quality, success criteria
9. **Review & Generate** - Review all information and generate files
10. **Execute Transformation** - Run Kiro-CLI to generate code

## Project Structure

```
transformation-spec-generator/
├── backend/
│   ├── server.py           # Flask backend server
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── components/
│   │   └── steps/          # Form step components
│   ├── utils/
│   │   ├── markdownGenerator.ts  # MD generation logic
│   │   └── pdfGenerator.ts       # PDF generation logic
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Main application
│   └── main.tsx            # Entry point
├── package.json
└── README.md
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Ant Design** - UI components
- **React Hook Form** - Form management
- **jsPDF** - PDF generation
- **file-saver** - File download
- **Vite** - Build tool

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin support
- **python-docx** - DOCX file processing
- **pypdf** - PDF file processing

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/transform` - Start transformation (SSE stream)
- `POST /api/convert-document` - Convert PDF/DOCX to text
- `POST /api/save-spec` - Save spec to file

## Building for Production

Build the frontend:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Troubleshooting

### Backend Connection Issues

- Ensure backend is running on port 5007
- Check CORS settings if accessing from different origin
- Verify Python dependencies are installed

### Document Conversion Issues

- Ensure `python-docx` and `pypdf` are installed
- Check file permissions in the working directory
- Verify uploaded files are valid PDF/DOCX formats

### Files not downloading

- Use Chrome browser for best File System Access API support
- Check browser's download settings
- Ensure pop-ups are not blocked

## License

MIT License - feel free to use and modify for your projects.

## Support

For issues or questions, please create an issue in the repository.
