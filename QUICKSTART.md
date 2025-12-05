# Quick Start Guide

Get up and running in 3 minutes!

## Step 1: Install Dependencies (1 minute)

```bash
cd transformation-spec-generator
npm install
```

## Step 2: Start the App (30 seconds)

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`

## Step 3: Fill the Form (5-10 minutes)

### Overview Step
- Select transformation type (API, UI, Business Logic, etc.)
- Enter source and target projects
- Add tech stack items
- Describe transformation goal

### Source Analysis Step
- Add legacy code file paths
- Describe current architecture pattern
- Document key issues and technical debt

### Target Architecture Step
- Define architectural pattern
- Add layer structure
- List key design principles

### Dependencies Step
- Add internal dependencies
- Add external systems
- List client files that call legacy code
- Set backward compatibility requirements

### Technical Requirements Step
- Configure authentication & authorization
- Set data validation rules
- Define error handling strategy
- Add API/UI specific requirements (conditional)

### Quality & Testing Step
- Set test coverage requirements
- Define code quality standards
- Add implementation constraints
- Define success criteria
- Configure migration strategy

### Review & Generate Step
- Review all entered information
- Click "Generate MD & PDF"
- Files download automatically!

## Output

You'll get two files:
- `transformationNotes.md` - For AI/Kiro
- `transformationNotes.pdf` - For humans/stakeholders

## Example Use Case

**Scenario:** Migrating legacy MVC controllers to REST API

1. **Type:** API
2. **Source:** `web/Areas/Affiliate/Controllers`
3. **Target:** `FMG.Communication.WebApi`
4. **Tech Stack:** .NET 8, SQL Server, React 18
5. **Goal:** Transform non-REST APIs to REST-compliant endpoints
6. **Standards:** FMG REST API Design Fundamentals

Fill in the details, click generate, and you're done!

## Tips for Best Results

✅ **Be specific** - More detail = better AI understanding
✅ **Use examples** - Reference actual file paths and code
✅ **Document constraints** - List what must/must not be done
✅ **Define success** - Clear criteria help measure completion
✅ **Plan migration** - Think through the rollout strategy

## Next Steps

After generating your specification:

1. **Save the MD file** to `.kiro/specs/{feature-name}/transformationNotes.md`
2. **Share the PDF** with your team and stakeholders
3. **Use with Kiro** - Kiro can read the MD file to guide transformation
4. **Iterate** - Update the spec as you learn more during implementation

## Need Help?

- Check the full README.md for detailed documentation
- Review the example transformationNotes.txt in the parent directory
- Experiment with different transformation types to see conditional fields

Happy transforming! 🚀
