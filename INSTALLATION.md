# Installation Guide

Complete step-by-step installation instructions for the Rhino Transformation Builder (RTB).

## Prerequisites

### Required Software

1. **Node.js** (version 16 or higher)

   - Download from: https://nodejs.org/
   - Verify installation: `node --version`
   - Should show v16.x.x or higher

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`
   - Should show 8.x.x or higher

### Optional Software

- **Git** (for version control)
- **VS Code** (recommended code editor)

## Installation Methods

### Method 1: Automated Setup (Windows)

1. Open the `transformation-spec-generator` folder
2. Double-click `setup.bat`
3. Wait for installation to complete
4. Double-click `start.bat` to run the app

### Method 2: Manual Setup (All Platforms)

#### Step 1: Navigate to Project Directory

```bash
cd transformation-spec-generator
```

#### Step 2: Install Dependencies

```bash
npm install
```

This will install:

- React 18
- TypeScript
- Ant Design
- React Hook Form
- jsPDF
- file-saver
- Vite
- And all other dependencies

#### Step 3: Verify Installation

```bash
npm list --depth=0
```

You should see all packages listed without errors.

## Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will:

- Start on `http://localhost:3000`
- Open automatically in your default browser
- Reload automatically when you make changes

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Troubleshooting

### Issue: "npm: command not found"

**Solution:** Node.js is not installed or not in PATH

1. Install Node.js from https://nodejs.org/
2. Restart your terminal/command prompt
3. Verify with `node --version`

### Issue: "Cannot find module"

**Solution:** Dependencies not installed properly

```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 3000 already in use

**Solution:** Change the port in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Change to any available port
    open: true,
  },
});
```

### Issue: "EACCES: permission denied"

**Solution:** Run with appropriate permissions

```bash
# On Linux/Mac
sudo npm install

# Or fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Issue: Build fails with TypeScript errors

**Solution:** Ensure TypeScript is installed

```bash
npm install --save-dev typescript
```

### Issue: PDF generation not working

**Solution:** Check browser console for errors

- Ensure jsPDF is installed: `npm install jspdf`
- Check browser's download settings
- Disable pop-up blockers

## Verifying Installation

After installation, verify everything works:

1. **Start the app:** `npm run dev`
2. **Check the browser:** Should open at http://localhost:3000
3. **Fill a simple form:** Enter basic information
4. **Generate files:** Click "Generate MD & PDF"
5. **Check downloads:** Both files should download

## Directory Structure After Installation

```
transformation-spec-generator/
├── node_modules/          # Installed dependencies (created after npm install)
├── src/                   # Source code
│   ├── components/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── package.json           # Project configuration
├── package-lock.json      # Dependency lock file (created after npm install)
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Documentation
```

## Next Steps

After successful installation:

1. Read [QUICKSTART.md](QUICKSTART.md) for usage guide
2. Review [README.md](README.md) for detailed documentation
3. Check [sample-data.json](sample-data.json) for example data
4. Start creating your transformation specifications!

## Updating the Application

To update dependencies:

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update <package-name>
```

## Uninstalling

To remove the application:

1. Delete the `transformation-spec-generator` folder
2. That's it! No system-wide changes were made

To remove Node.js (if needed):

- Windows: Use "Add or Remove Programs"
- Mac: Use the Node.js uninstaller
- Linux: Use your package manager (e.g., `sudo apt remove nodejs`)

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review the error message carefully
3. Search for the error online
4. Check Node.js and npm versions
5. Try reinstalling dependencies

## System Requirements

- **OS:** Windows 10+, macOS 10.15+, or Linux
- **RAM:** 4GB minimum, 8GB recommended
- **Disk Space:** 500MB for application and dependencies
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

## Performance Tips

- Close unnecessary browser tabs
- Use production build for better performance
- Clear browser cache if experiencing issues
- Ensure adequate disk space for downloads

---

**Installation complete!** You're ready to start generating transformation specifications. 🎉
