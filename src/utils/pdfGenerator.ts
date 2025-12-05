import jsPDF from 'jspdf';
import { TransformationSpec } from '../types';

export const generateRequirementsPDF = (data: TransformationSpec): jsPDF => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;
  const maxWidth = 170;

  const checkPageBreak = (additionalHeight: number = lineHeight) => {
    if (yPosition + additionalHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
    }
  };

  const addTitle = (text: string, fontSize: number = 16) => {
    checkPageBreak(fontSize);
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPosition);
    yPosition += fontSize / 2 + 5;
  };

  const addSubtitle = (text: string, fontSize: number = 12) => {
    checkPageBreak(fontSize);
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPosition);
    yPosition += fontSize / 2 + 3;
  };

  const addText = (text: string, fontSize: number = 10, indent: number = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, maxWidth - indent);
    lines.forEach((line: string) => {
      checkPageBreak();
      doc.text(line, margin + indent, yPosition);
      yPosition += lineHeight;
    });
  };

  const addBullet = (text: string, indent: number = 5) => {
    checkPageBreak();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('•', margin + indent, yPosition);
    const lines = doc.splitTextToSize(text, maxWidth - indent - 5);
    lines.forEach((line: string, index: number) => {
      if (index > 0) checkPageBreak();
      doc.text(line, margin + indent + 5, yPosition);
      yPosition += lineHeight;
    });
  };

  const addSeparator = () => {
    checkPageBreak(5);
    yPosition += 3;
  };

  // Title
  addTitle('Requirements Specification', 18);
  addSeparator();

  // 1. Transformation Overview
  addTitle('1. TRANSFORMATION OVERVIEW', 14);
  addSubtitle('Transformation Type');
  const transformationTypes = Array.isArray(data.transformationType) 
    ? data.transformationType.join(', ') 
    : data.transformationType;
  addText(`Type: ${transformationTypes}`);
  addSeparator();

  addSubtitle('Project Context');
  addBullet(`Source Project: ${data.sourceProject}`);
  addBullet(`Target Project: ${data.targetProject}`);
  addBullet(`Repository: ${data.repository || 'Not specified'}`);
  addSeparator();

  // Reference Documents
  const hasManualDocs = data.documentUploadType === 'manual' && (data.requirementsSpecDocument || data.uanDocument || data.uadDocument);
  const hasMcpDocs = data.documentUploadType === 'mcp' && (data.mcpUrl || data.mcpProjectId || data.mcpProjectName);
  const hasCodingStandards = data.codingStandardDocuments && data.codingStandardDocuments.length > 0;
  
  if (hasManualDocs || hasMcpDocs || hasCodingStandards) {
    addSubtitle('Reference Documents');
    
    if (data.documentUploadType === 'manual') {
      if (data.requirementsSpecDocument) {
        addBullet(`User Story Document: ${data.requirementsSpecDocument.filePath || data.requirementsSpecDocument.fileName}`);
      }
      if (data.uanDocument) {
        addBullet(`UAN Document: ${data.uanDocument.filePath || data.uanDocument.fileName}`);
      }
      if (data.uadDocument) {
        addBullet(`UAD Document: ${data.uadDocument.filePath || data.uadDocument.fileName}`);
      }
    }
    
    if (data.documentUploadType === 'mcp') {
      addBullet(`MCP URL: ${data.mcpUrl || 'Not specified'}`);
      addBullet(`Project ID: ${data.mcpProjectId || 'Not specified'}`);
      addBullet(`Project Name: ${data.mcpProjectName || 'Not specified'}`);
    }
    
    if (hasCodingStandards) {
      addText('Coding Standards:', 10);
      data.codingStandardDocuments.forEach(doc => {
        addBullet(`${doc.technologyName}: ${doc.filePath || doc.fileName}`, 10);
      });
    }
    addSeparator();
  }

  addSubtitle('Transformation Goal');
  addText(data.transformationGoal);
  addSeparator();

  // 2. Business Justification
  addTitle('2. BUSINESS JUSTIFICATION', 14);
  addText(data.businessJustification);
  addSeparator();

  // 3. Source Project Information
  addTitle('3. SOURCE PROJECT INFORMATION', 14);
  addSubtitle('Current Architecture/Pattern');
  addText(`Pattern: ${data.currentPattern}`);
  addSeparator();

  addSubtitle('Key Issues');
  addText(data.keyIssues);
  addSeparator();

  addSubtitle('Core Business Logic');
  addText(data.coreBusinessLogic);
  addSeparator();

  // 4. Target State
  addTitle('4. TARGET STATE', 14);
  addSubtitle('Target Architectural Pattern');
  addText(`Pattern: ${data.architecturalPattern}`);
  addSeparator();

  addSubtitle('Target Location');
  addText(`New files location: ${data.targetLocation || 'Not specified'}`);
  addSeparator();

  // 5. Success Criteria
  addTitle('5. SUCCESS CRITERIA', 14);
  
  addSubtitle('Functional Success');
  if (data.functionalSuccess.length > 0) {
    data.functionalSuccess.forEach(item => addBullet(item));
  } else {
    addText('No functional success criteria specified.');
  }
  addSeparator();

  addSubtitle('Business Success');
  if (data.businessSuccess.length > 0) {
    data.businessSuccess.forEach(item => addBullet(item));
  } else {
    addText('No business success criteria specified.');
  }
  addSeparator();

  // Footer
  checkPageBreak(10);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`Generated on ${new Date().toLocaleString()}`, margin, yPosition);

  return doc;
};

export const generateTechnicalPDF = (data: TransformationSpec): jsPDF => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;
  const maxWidth = 170;

  const checkPageBreak = (additionalHeight: number = lineHeight) => {
    if (yPosition + additionalHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
    }
  };

  const addTitle = (text: string, fontSize: number = 16) => {
    checkPageBreak(fontSize);
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPosition);
    yPosition += fontSize / 2 + 5;
  };

  const addSubtitle = (text: string, fontSize: number = 12) => {
    checkPageBreak(fontSize);
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPosition);
    yPosition += fontSize / 2 + 3;
  };

  const addText = (text: string, fontSize: number = 10, indent: number = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, maxWidth - indent);
    lines.forEach((line: string) => {
      checkPageBreak();
      doc.text(line, margin + indent, yPosition);
      yPosition += lineHeight;
    });
  };

  const addBullet = (text: string, indent: number = 5) => {
    checkPageBreak();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('•', margin + indent, yPosition);
    const lines = doc.splitTextToSize(text, maxWidth - indent - 5);
    lines.forEach((line: string, index: number) => {
      if (index > 0) checkPageBreak();
      doc.text(line, margin + indent + 5, yPosition);
      yPosition += lineHeight;
    });
  };

  const addSeparator = () => {
    checkPageBreak(5);
    yPosition += 3;
  };

  // Title
  addTitle('Technical Details', 18);
  addSeparator();

  // 1. Source Analysis
  addTitle('1. SOURCE ANALYSIS', 14);
  
  addSubtitle('Legacy Code Location');
  if (data.legacyCodePaths.length > 0) {
    data.legacyCodePaths.forEach(path => addBullet(path));
  } else {
    addText('No legacy code paths specified.');
  }
  addSeparator();

  addSubtitle('Current Architecture/Pattern');
  addBullet(`Pattern: ${data.currentPattern}`);
  addBullet(`Key issues: ${data.keyIssues}`);
  addSeparator();

  addSubtitle('Core Business Logic');
  addText(data.coreBusinessLogic);
  addSeparator();

  // 2. Target Architecture
  addTitle('2. TARGET ARCHITECTURE', 14);
  
  addSubtitle('Architectural Pattern');
  addText(`Pattern: ${data.architecturalPattern}`);
  addSeparator();

  addSubtitle('Layer Structure');
  if (data.layerStructure.length > 0) {
    data.layerStructure.forEach((layer) => {
      addText(`${layer.name}:`, 11, 0);
      doc.setFont('helvetica', 'bold');
      yPosition += 2;
      // Split description by newlines and add each as a bullet point
      const descriptionLines = layer.description.split('\n').map(line => line.trim()).filter(line => line);
      descriptionLines.forEach(line => {
        addBullet(line, 10);
      });
      yPosition += 3;
    });
  } else {
    addText('No layer structure specified.');
  }
  addSeparator();

  addSubtitle('Target Project Structure');
  addText(`New files location: ${data.targetLocation}`);
  addSeparator();

  // 3. Dependencies & Integrations
  addTitle('3. DEPENDENCIES & INTEGRATIONS', 14);
  
  addSubtitle('Internal Dependencies');
  if (data.internalDependencies.length > 0) {
    data.internalDependencies.forEach(dep => {
      addBullet(`${dep.name}: ${dep.purpose} (${dep.location})`);
      if (dep.notes) {
        addText(`Notes: ${dep.notes}`, 9, 10);
      }
    });
  } else {
    addText('No internal dependencies specified.');
  }
  addSeparator();

  addSubtitle('External Systems');
  if (data.externalSystems.length > 0) {
    data.externalSystems.forEach(sys => {
      addBullet(`${sys.name} (${sys.connectionType}): ${sys.purpose}`);
      if (sys.notes) {
        addText(`Notes: ${sys.notes}`, 9, 10);
      }
    });
  } else {
    addText('No external systems specified.');
  }
  addSeparator();

  // 4. Technical Requirements
  addTitle('4. TECHNICAL REQUIREMENTS', 14);
  
  addSubtitle('4.1 Authentication & Authorization');
  addBullet(`Method: ${data.authMethod}`);
  addBullet(`Implementation: ${data.authImplementation}`);
  addSeparator();

  addSubtitle('4.2 Error Handling');
  addBullet(`Strategy: ${data.errorStrategy}`);
  addBullet(`Logging: ${data.loggingFramework} (Level: ${data.loggingLevel})`);
  addSeparator();

  const isAPITransformation = Array.isArray(data.transformationType) && data.transformationType.includes('API');
  
  if (isAPITransformation) {
    addSubtitle('4.3 API Design');
    addText(`Resource Naming: ${data.apiResourceNaming || 'Not specified'}`);
    addText(`Naming Convention: ${data.apiNamingConvention || 'Not specified'}`);
    addText(`Versioning Strategy: ${data.apiVersioningStrategy || 'Not specified'}`);
    addSeparator();
  }

  const testSection = isAPITransformation ? '4.4' : '4.3';
  addSubtitle(`${testSection} Testing Requirements`);
  addBullet(`Unit test coverage: ${data.unitTestCoverage}% minimum`);
  addBullet(`Integration tests: ${data.integrationTestsRequired ? 'Required' : 'Not required'}`);
  addBullet(`Testing framework: ${data.testingFramework}`);
  addSeparator();

  // 5. Data Models & Mapping
  addTitle('5. DATA MODELS & MAPPING', 14);
  addSubtitle('Mapping Approach');
  addText(data.mappingApproach);
  addSeparator();

  // 6. Code Quality Standards
  addTitle('6. CODE QUALITY STANDARDS', 14);
  
  addSubtitle('Must Follow');
  if (data.mustFollow.length > 0) {
    data.mustFollow.forEach(item => addBullet(item));
  } else {
    addText('No constraints specified.');
  }
  addSeparator();

  addSubtitle('Must NOT Do');
  if (data.mustNotDo.length > 0) {
    data.mustNotDo.forEach(item => addBullet(item));
  } else {
    addText('No constraints specified.');
  }
  addSeparator();

  addSubtitle('Preferred Approaches');
  if (data.preferredApproaches.length > 0) {
    data.preferredApproaches.forEach(item => addBullet(item));
  } else {
    addText('No preferred approaches specified.');
  }
  addSeparator();

  // 7. Implementation Constraints
  addTitle('7. IMPLEMENTATION CONSTRAINTS', 14);
  addSubtitle('Technical Success Criteria');
  if (data.technicalSuccess.length > 0) {
    data.technicalSuccess.forEach(item => addBullet(item));
  } else {
    addText('No technical success criteria specified.');
  }
  addSeparator();

  // 8. Migration Strategy
  addTitle('8. MIGRATION STRATEGY', 14);
  
  addSubtitle('Approach');
  addText(`Migration Type: ${data.migrationApproach}`);
  addSeparator();

  addSubtitle('Rollback Plan');
  addText(data.rollbackPlan);
  addSeparator();

  // Footer
  checkPageBreak(10);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`Generated on ${new Date().toLocaleString()}`, margin, yPosition);

  return doc;
};
