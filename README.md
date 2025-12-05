# Rhino Transformation Builder (RTB)

A React-based web application that helps you create comprehensive transformation specification documents for code modernization projects. Generate both Markdown (.md) and PDF files from a user-friendly form interface.

## Features

- ✅ **Multi-step wizard** - Guided form with 7 steps
- ✅ **Comprehensive coverage** - All aspects of code transformation
- ✅ **Dual output** - Generate both MD (for AI) and PDF (for humans)
- ✅ **Dynamic forms** - Conditional fields based on transformation type
- ✅ **Modern UI** - Built with Ant Design components
- ✅ **Type-safe** - Full TypeScript support

## Prerequisites

- Node.js 16+ and npm/yarn
- Modern web browser

## Installation

1. Navigate to the project directory:

```bash
cd transformation-spec-generator
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

## Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Usage

1. **Select Transformation Type** - Choose from API, UI, Business Logic, Database, etc.
2. **Fill in Project Details** - Source/target projects, tech stack, goals
3. **Analyze Source Code** - Document legacy code location and issues
4. **Define Target Architecture** - Specify new architecture and patterns
5. **Configure Dependencies** - List internal/external dependencies
6. **Set Technical Requirements** - Auth, validation, error handling, etc.
7. **Define Quality Standards** - Testing, code quality, success criteria
8. **Review & Generate** - Review all information and generate files

## Output Files

The application generates two files:

### 1. `transformationNotes.md`

- Markdown format for AI consumption
- Easy to version control with Git
- Can be read by Kiro or other AI assistants
- Perfect for `.kiro/specs/` directory

### 2. `transformationNotes.pdf`

- PDF format for human readability
- Professional formatting
- Easy to share with stakeholders
- Suitable for presentations and documentation

## Project Structure

```
transformation-spec-generator/
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

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Ant Design** - UI components
- **React Hook Form** - Form management
- **jsPDF** - PDF generation
- **file-saver** - File download
- **Vite** - Build tool

## Customization

### Adding New Fields

1. Update `src/types.ts` to add new fields to `TransformationSpec` interface
2. Add form controls in the appropriate step component
3. Update `markdownGenerator.ts` to include new fields in output
4. Update `pdfGenerator.ts` to include new fields in PDF

### Modifying Templates

Edit the template strings in:

- `src/utils/markdownGenerator.ts` - For Markdown output
- `src/utils/pdfGenerator.ts` - For PDF output

## Tips

- Use the **Tab** key to navigate between fields quickly
- Press **Enter** in tag input fields to add items
- All required fields are marked with a red asterisk (\*)
- You can go back to previous steps to modify information
- Review step shows a summary before generating files

## Troubleshooting

### Files not downloading

- Check browser's download settings
- Ensure pop-ups are not blocked
- Try a different browser

### Form validation errors

- Required fields must be filled
- Check for red asterisks (\*) on field labels

### Build errors

- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

## Future Enhancements

- [ ] Save/load form data (localStorage or backend)
- [ ] Template library for common transformations
- [ ] Export to Word (.docx) format
- [ ] Import from existing transformation notes
- [ ] Real-time preview of generated documents
- [ ] Form validation with error messages
- [ ] Dark mode support

## License

MIT License - feel free to use and modify for your projects.

## Support

For issues or questions, please create an issue in the repository.
