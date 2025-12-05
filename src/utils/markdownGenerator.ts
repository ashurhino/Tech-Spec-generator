import { TransformationSpec } from '../types';

export const generateRequirementsMarkdown = (data: TransformationSpec): string => {
  const transformationTypes = Array.isArray(data.transformationType) 
    ? data.transformationType.join(', ') 
    : data.transformationType;

  return `# Requirements Specification

## 1. TRANSFORMATION OVERVIEW

### Transformation Type
**Type:** ${transformationTypes}

### Project Context
- **Source Project:** ${data.sourceProject}
- **Target Project:** ${data.targetProject}
- **Repository:** ${data.repository || 'Not specified'}

### Reference Documents
${data.documentUploadType === 'manual' ? `
${data.requirementsSpecDocument ? `- **User Story Document:** ${data.requirementsSpecDocument.filePath || data.requirementsSpecDocument.fileName}` : ''}
${data.uanDocument ? `- **UAN Document:** ${data.uanDocument.filePath || data.uanDocument.fileName}` : ''}
${data.uadDocument ? `- **UAD Document:** ${data.uadDocument.filePath || data.uadDocument.fileName}` : ''}
${data.codingStandardDocuments && data.codingStandardDocuments.length > 0 ? `
- **Coding Standards:**
${data.codingStandardDocuments.map(doc => `  - ${doc.technologyName}: ${doc.filePath || doc.fileName}`).join('\n')}
` : ''}
` : ''}
${data.documentUploadType === 'mcp' ? `
- **MCP URL:** ${data.mcpUrl || 'Not specified'}
- **Project ID:** ${data.mcpProjectId || 'Not specified'}
- **Project Name:** ${data.mcpProjectName || 'Not specified'}
${data.codingStandardDocuments && data.codingStandardDocuments.length > 0 ? `
- **Coding Standards:**
${data.codingStandardDocuments.map(doc => `  - ${doc.technologyName}: ${doc.filePath || doc.fileName}`).join('\n')}
` : ''}
` : ''}

### Transformation Goal
${data.transformationGoal}

---

## 2. BUSINESS JUSTIFICATION

${data.businessJustification}

---

## 3. SOURCE PROJECT INFORMATION

### Current Architecture/Pattern
**Pattern:** ${data.currentPattern || 'Not specified'}

### Key Issues
${data.keyIssues || 'Not specified'}

### Core Business Logic
${data.coreBusinessLogic || 'Not specified'}

---

## 4. TARGET STATE

### Target Architectural Pattern
**Pattern:** ${data.architecturalPattern}

### Target Location
**New files location:** ${data.targetLocation || 'Not specified'}

---

## 5. SUCCESS CRITERIA

### Functional Success
${data.functionalSuccess.length > 0 ? data.functionalSuccess.map(item => `- [ ] ${item}`).join('\n') : 'No functional success criteria specified.'}

### Business Success
${data.businessSuccess.length > 0 ? data.businessSuccess.map(item => `- [ ] ${item}`).join('\n') : 'No business success criteria specified.'}

---

*Generated on ${new Date().toLocaleString()}*
`;
};

export const generateTechnicalMarkdown = (data: TransformationSpec): string => {
  return `# Technical Details

## 1. SOURCE ANALYSIS

### Legacy Code Location
${data.legacyCodePaths.length > 0 ? data.legacyCodePaths.map(path => `- ${path}`).join('\n') : 'No legacy code paths specified.'}

### Current Architecture/Pattern
- **Pattern:** ${data.currentPattern}
- **Key issues:** ${data.keyIssues}

### Core Business Logic
${data.coreBusinessLogic}

---

## 2. TARGET ARCHITECTURE

### Architectural Pattern
**Pattern:** ${data.architecturalPattern}

### Layer Structure
${data.layerStructure.length > 0 ? data.layerStructure.map(layer => `
#### ${layer.name}
${layer.description.split('\n').map(line => line.trim()).filter(line => line).map(line => `- ${line}`).join('\n')}`).join('\n') : 'No layer structure specified.'}

### Target Project Structure
**New files location:** ${data.targetLocation}

---

## 3. DEPENDENCIES & INTEGRATIONS

### Internal Dependencies
${data.internalDependencies.length > 0 ? `
| Dependency | Purpose | Location | Notes |
|------------|---------|----------|-------|
${data.internalDependencies.map(dep => `| ${dep.name} | ${dep.purpose} | ${dep.location} | ${dep.notes} |`).join('\n')}
` : 'No internal dependencies specified.'}

### External Systems
${data.externalSystems.length > 0 ? `
| System | Connection Type | Purpose | Notes |
|--------|----------------|---------|-------|
${data.externalSystems.map(sys => `| ${sys.name} | ${sys.connectionType} | ${sys.purpose} | ${sys.notes} |`).join('\n')}
` : 'No external systems specified.'}

---

## 4. TECHNICAL REQUIREMENTS

### 4.1 Authentication & Authorization
- **Method:** ${data.authMethod}
- **Implementation:** ${data.authImplementation}

### 4.2 Error Handling
- **Strategy:** ${data.errorStrategy}
- **Logging:** ${data.loggingFramework} (Level: ${data.loggingLevel})

${Array.isArray(data.transformationType) && data.transformationType.includes('API') ? `
### 4.3 API Design
**Resource Naming:**
${data.apiResourceNaming || 'Not specified'}

**Naming Convention:** ${data.apiNamingConvention || 'Not specified'}

**Versioning Strategy:** ${data.apiVersioningStrategy || 'Not specified'}
` : ''}

### 4.${Array.isArray(data.transformationType) && data.transformationType.includes('API') ? '4' : '3'} Testing Requirements
- **Unit test coverage:** ${data.unitTestCoverage}% minimum
- **Integration tests:** ${data.integrationTestsRequired ? 'Required' : 'Not required'}
- **Testing framework:** ${data.testingFramework}

---

## 5. DATA MODELS & MAPPING

### Mapping Approach
${data.mappingApproach}

---

## 6. CODE QUALITY STANDARDS

### Must Follow
${data.mustFollow.length > 0 ? data.mustFollow.map(item => `- [ ] ${item}`).join('\n') : 'No constraints specified.'}

### Must NOT Do
${data.mustNotDo.length > 0 ? data.mustNotDo.map(item => `- [ ] ${item}`).join('\n') : 'No constraints specified.'}

### Preferred Approaches
${data.preferredApproaches.length > 0 ? data.preferredApproaches.map(item => `- ${item}`).join('\n') : 'No preferred approaches specified.'}

---

## 7. IMPLEMENTATION CONSTRAINTS

### Technical Success Criteria
${data.technicalSuccess.length > 0 ? data.technicalSuccess.map(item => `- [ ] ${item}`).join('\n') : 'No technical success criteria specified.'}

---

## 8. MIGRATION STRATEGY

### Approach
**Migration Type:** ${data.migrationApproach}

### Rollback Plan
${data.rollbackPlan}

---

*Generated on ${new Date().toLocaleString()}*
`;
};
