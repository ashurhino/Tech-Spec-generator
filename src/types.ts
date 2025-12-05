export interface CodingStandardDocument {
  id: string;
  technologyName: string;
  fileName: string;
  filePath?: string; // Full path from root folder to file
  fileContent: string | ArrayBuffer;
  fileType: string;
}

export interface TransformationSpec {
  // 1. Transformation Overview
  transformationType: string[]; // Changed to array for multi-select
  sourceProject: string;
  targetProject: string;
  repository: string;
  transformationGoal: string;
  businessJustification: string;
  
  // Document uploads
  documentUploadType?: 'manual' | 'mcp'; // Radio selection: Manual or MCP
  requirementsSpecDocument?: {
    fileName: string;
    filePath?: string; // Full path from root folder to file
    fileContent: string | ArrayBuffer;
    fileType: string;
  };
  uanDocument?: {
    fileName: string;
    filePath?: string; // Full path from root folder to file
    fileContent: string | ArrayBuffer;
    fileType: string;
  };
  uadDocument?: {
    fileName: string;
    filePath?: string; // Full path from root folder to file
    fileContent: string | ArrayBuffer;
    fileType: string;
  };
  // MCP fields
  mcpUrl?: string;
  mcpProjectId?: string;
  mcpProjectName?: string;
  codingStandardDocuments: CodingStandardDocument[];

  // 2. Source Analysis
  legacyCodePaths: string[];
  currentPattern: string;
  keyIssues: string;
  coreBusinessLogic: string;

  // 3. Target Architecture
  architecturalPattern: string;
  layerStructure: Array<{ name: string; description: string }>;
  targetLocation: string;

  // 4. Dependencies & Integrations
  internalDependencies: Array<{
    name: string;
    purpose: string;
    location: string;
    notes: string;
  }>;
  externalSystems: Array<{
    name: string;
    connectionType: string;
    purpose: string;
    notes: string;
  }>;

  // 5. Technical Requirements
  authMethod: string;
  authImplementation: string;
  errorStrategy: string;
  loggingFramework: string;
  loggingLevel: string;

  // API Design (conditional)
  apiResourceNaming?: string;
  apiNamingConvention?: string;
  apiVersioningStrategy?: string;

  // Testing
  unitTestCoverage: string;
  integrationTestsRequired: boolean;
  testingFramework: string;

  // 6. Data Models & Mapping
  mappingApproach: string;

  // 7. Implementation Constraints
  mustFollow: string[];
  mustNotDo: string[];
  preferredApproaches: string[];

  // 8. Success Criteria
  functionalSuccess: string[];
  technicalSuccess: string[];
  businessSuccess: string[];

  // 9. Migration Strategy
  migrationApproach: string;
  rollbackPlan: string;
}
