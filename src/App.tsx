import { useState } from 'react';
import { ConfigProvider, Layout, Steps, Button, message } from 'antd';
import rhinoLogo from './assets/download.png';
import { useForm, FormProvider } from 'react-hook-form';
import { TransformationSpec } from './types';
import { generateRequirementsMarkdown, generateTechnicalMarkdown } from './utils/markdownGenerator';
import { generateRequirementsPDF, generateTechnicalPDF } from './utils/pdfGenerator';
import { saveAs } from 'file-saver';

// Import form steps
import OverviewStep from './components/steps/OverviewStep';
import SourceAnalysisStep from './components/steps/SourceAnalysisStep';
import TargetArchitectureStep from './components/steps/TargetArchitectureStep';
import DependenciesStep from './components/steps/DependenciesStep';
import TechnicalRequirementsStep from './components/steps/TechnicalRequirementsStep';
import QualityTestingStep from './components/steps/QualityTestingStep';
import ReviewStep from './components/steps/ReviewStep';

import './App.css';

const { Header, Content, Footer } = Layout;
const BACKEND_URL = 'http://localhost:5007';

const steps = [
  { title: 'Overview', description: 'Basic information' },
  { title: 'Source', description: 'Legacy code analysis' },
  { title: 'Target', description: 'New architecture' },
  { title: 'Dependencies', description: 'Integrations' },
  { title: 'Technical', description: 'Requirements' },
  { title: 'Quality', description: 'Testing & standards' },
  { title: 'Review', description: 'Generate files' },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const methods = useForm<TransformationSpec>({
    mode: 'onChange',
    defaultValues: {
      // Required fields with defaults
      transformationType: [],
      sourceProject: '',
      targetProject: '',
      transformationGoal: '',
      architecturalPattern: '',
      
      // Other fields
      repository: '',
      businessJustification: '',
      currentPattern: '',
      keyIssues: '',
      coreBusinessLogic: '',
      targetLocation: '',
      authMethod: '',
      authImplementation: '',
      errorStrategy: '',
      loggingFramework: '',
      mappingApproach: '',
      migrationApproach: '',
      rollbackPlan: '',
      apiResourceNaming: '',
      apiNamingConvention: '',
      apiVersioningStrategy: '',
      
      // Document uploads
      documentUploadType: 'manual',
      requirementsSpecDocument: undefined,
      uanDocument: undefined,
      uadDocument: undefined,
      mcpUrl: '',
      mcpProjectId: '',
      mcpProjectName: '',
      codingStandardDocuments: [],
      
      // Default values as per requirements
      loggingLevel: 'Debug',
      unitTestCoverage: '90',
      integrationTestsRequired: true,
      testingFramework: 'XUnit',
      
      // Initialize empty arrays
      legacyCodePaths: [],
      layerStructure: [],
      internalDependencies: [],
      externalSystems: [],
      mustFollow: [],
      mustNotDo: [],
      preferredApproaches: [],
      functionalSuccess: [],
      technicalSuccess: [],
      businessSuccess: [],
    },
  });

  const next = async () => {
    // Validate required fields based on current step
    let fieldsToValidate: (keyof TransformationSpec)[] = [];
    
    if (currentStep === 0) {
      // Overview step - validate required fields
      fieldsToValidate = ['transformationType', 'targetProject', 'transformationGoal'];
    } else if (currentStep === 2) {
      // Target Architecture step - validate architecturalPattern
      fieldsToValidate = ['architecturalPattern'];
    }
    
    if (fieldsToValidate.length > 0) {
      const isValid = await methods.trigger(fieldsToValidate);
      if (!isValid) {
        messageApi.error('Please fill in all required fields before proceeding.');
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleStepChange = async (step: number) => {
    // Only allow going to steps that are already completed or the next step
    // For now, allow clicking on any step (you can add validation if needed)
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const handleGenerateFiles = async () => {
    const data = methods.getValues();
    
    // Validate target project name
    if (!data.targetProject || data.targetProject.trim() === '') {
      messageApi.error('Target Project name is required to save files.');
      return;
    }

    try {
      // Generate Requirements Markdown
      const requirementsMarkdown = generateRequirementsMarkdown(data);
      const requirementsMdBlob = new Blob([requirementsMarkdown], { type: 'text/markdown;charset=utf-8' });

      // Generate Technical Markdown
      const technicalMarkdown = generateTechnicalMarkdown(data);
      const technicalMdBlob = new Blob([technicalMarkdown], { type: 'text/markdown;charset=utf-8' });

      // Generate PDFs
      const requirementsPdf = generateRequirementsPDF(data);
      const technicalPdf = generateTechnicalPDF(data);

      // Convert PDFs to blobs
      const requirementsPdfBlob = requirementsPdf.output('blob');
      const technicalPdfBlob = technicalPdf.output('blob');

      // Try to save files to .kiro folder using File System Access API
      try {
        // @ts-ignore - showDirectoryPicker is not in TypeScript types yet
        if (window.showDirectoryPicker) {
          // @ts-ignore
          const rootDirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });

          // Create .kiro folder (try with dot first, fallback to kiro if needed)
          let kiroDirHandle;
          try {
            kiroDirHandle = await rootDirHandle.getDirectoryHandle('.kiro', { create: true });
          } catch (error) {
            // Some systems don't allow leading dots, try 'kiro' instead
            kiroDirHandle = await rootDirHandle.getDirectoryHandle('kiro', { create: true });
          }

          // Save Requirements Markdown to .kiro folder
          const requirementsMdFileHandle = await kiroDirHandle.getFileHandle('requirements-specification.md', { create: true });
          const requirementsMdWritable = await requirementsMdFileHandle.createWritable();
          await requirementsMdWritable.write(requirementsMdBlob);
          await requirementsMdWritable.close();

          // Save Technical Markdown to .kiro folder
          const technicalMdFileHandle = await kiroDirHandle.getFileHandle('technical-details.md', { create: true });
          const technicalMdWritable = await technicalMdFileHandle.createWritable();
          await technicalMdWritable.write(technicalMdBlob);
          await technicalMdWritable.close();

          // Save Requirements PDF to .kiro folder
          const requirementsPdfFileHandle = await kiroDirHandle.getFileHandle('requirements-specification.pdf', { create: true });
          const requirementsPdfWritable = await requirementsPdfFileHandle.createWritable();
          await requirementsPdfWritable.write(requirementsPdfBlob);
          await requirementsPdfWritable.close();

          // Save Technical PDF to .kiro folder
          const technicalPdfFileHandle = await kiroDirHandle.getFileHandle('technical-details.pdf', { create: true });
          const technicalPdfWritable = await technicalPdfFileHandle.createWritable();
          await technicalPdfWritable.write(technicalPdfBlob);
          await technicalPdfWritable.close();

          // Helper function to convert documents via backend
          const convertDocument = async (fileName: string, fileContent: string | ArrayBuffer) => {
            try {
              // Convert to ArrayBuffer if it's a string
              const buffer = typeof fileContent === 'string' 
                ? new TextEncoder().encode(fileContent).buffer 
                : fileContent;
              
              const response = await fetch(`${BACKEND_URL}/api/convert-document`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  fileName,
                  fileContent: Array.from(new Uint8Array(buffer)),
                }),
              });
              
              if (response.ok) {
                const result = await response.json();
                return result.textContent;
              }
            } catch (error) {
              console.warn('Failed to convert document:', fileName, error);
            }
            return null;
          };

          // Save uploaded documents to .kiro folder (only if Manual upload type)
          if (data.documentUploadType === 'manual') {

            // Save Requirements Specification Document (User Story Document)
            if (data.requirementsSpecDocument && data.requirementsSpecDocument.fileContent) {
              const reqDocBlob = new Blob([data.requirementsSpecDocument.fileContent], { type: data.requirementsSpecDocument.fileType || 'application/octet-stream' });
              const reqDocFileHandle = await kiroDirHandle.getFileHandle(data.requirementsSpecDocument.fileName, { create: true });
              const reqDocWritable = await reqDocFileHandle.createWritable();
              await reqDocWritable.write(reqDocBlob);
              await reqDocWritable.close();

              // Convert PDF/DOCX to TXT
              const fileName = data.requirementsSpecDocument.fileName.toLowerCase();
              if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
                const textContent = await convertDocument(data.requirementsSpecDocument.fileName, data.requirementsSpecDocument.fileContent);
                if (textContent) {
                  const txtFileName = data.requirementsSpecDocument.fileName.replace(/\.(pdf|docx)$/i, '.txt');
                  const txtBlob = new Blob([textContent], { type: 'text/plain' });
                  const txtFileHandle = await kiroDirHandle.getFileHandle(txtFileName, { create: true });
                  const txtWritable = await txtFileHandle.createWritable();
                  await txtWritable.write(txtBlob);
                  await txtWritable.close();
                }
              }
            }

            // Save UAN Document
            if (data.uanDocument && data.uanDocument.fileContent) {
              const uanDocBlob = new Blob([data.uanDocument.fileContent], { type: data.uanDocument.fileType || 'application/octet-stream' });
              const uanDocFileHandle = await kiroDirHandle.getFileHandle(data.uanDocument.fileName, { create: true });
              const uanDocWritable = await uanDocFileHandle.createWritable();
              await uanDocWritable.write(uanDocBlob);
              await uanDocWritable.close();

              // Convert PDF/DOCX to TXT
              const fileName = data.uanDocument.fileName.toLowerCase();
              if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
                const textContent = await convertDocument(data.uanDocument.fileName, data.uanDocument.fileContent);
                if (textContent) {
                  const txtFileName = data.uanDocument.fileName.replace(/\.(pdf|docx)$/i, '.txt');
                  const txtBlob = new Blob([textContent], { type: 'text/plain' });
                  const txtFileHandle = await kiroDirHandle.getFileHandle(txtFileName, { create: true });
                  const txtWritable = await txtFileHandle.createWritable();
                  await txtWritable.write(txtBlob);
                  await txtWritable.close();
                }
              }
            }

            // Save UAD Document
            if (data.uadDocument && data.uadDocument.fileContent) {
              const uadDocBlob = new Blob([data.uadDocument.fileContent], { type: data.uadDocument.fileType || 'application/octet-stream' });
              const uadDocFileHandle = await kiroDirHandle.getFileHandle(data.uadDocument.fileName, { create: true });
              const uadDocWritable = await uadDocFileHandle.createWritable();
              await uadDocWritable.write(uadDocBlob);
              await uadDocWritable.close();

              // Convert PDF/DOCX to TXT
              const fileName = data.uadDocument.fileName.toLowerCase();
              if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
                const textContent = await convertDocument(data.uadDocument.fileName, data.uadDocument.fileContent);
                if (textContent) {
                  const txtFileName = data.uadDocument.fileName.replace(/\.(pdf|docx)$/i, '.txt');
                  const txtBlob = new Blob([textContent], { type: 'text/plain' });
                  const txtFileHandle = await kiroDirHandle.getFileHandle(txtFileName, { create: true });
                  const txtWritable = await txtFileHandle.createWritable();
                  await txtWritable.write(txtBlob);
                  await txtWritable.close();
                }
              }
            }
          }

          // Save Coding Standard Documents to .kiro folder
          if (data.codingStandardDocuments && data.codingStandardDocuments.length > 0) {
            for (const doc of data.codingStandardDocuments) {
              if (doc.fileContent && doc.fileName) {
                const codingDocBlob = new Blob([doc.fileContent], { type: doc.fileType || 'text/plain' });
                const codingDocFileHandle = await kiroDirHandle.getFileHandle(doc.fileName, { create: true });
                const codingDocWritable = await codingDocFileHandle.createWritable();
                await codingDocWritable.write(codingDocBlob);
                await codingDocWritable.close();

                // Convert PDF/DOCX to TXT
                const fileName = doc.fileName.toLowerCase();
                if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
                  const textContent = await convertDocument(doc.fileName, doc.fileContent);
                  if (textContent) {
                    const txtFileName = doc.fileName.replace(/\.(pdf|docx)$/i, '.txt');
                    const txtBlob = new Blob([textContent], { type: 'text/plain' });
                    const txtFileHandle = await kiroDirHandle.getFileHandle(txtFileName, { create: true });
                    const txtWritable = await txtFileHandle.createWritable();
                    await txtWritable.write(txtBlob);
                    await txtWritable.close();
                  }
                }
              }
            }
          }

          messageApi.success('All files saved successfully to .kiro folder!');
        } else {
          // Fallback to regular download if File System Access API is not available (Safari/Firefox)
          saveAs(requirementsMdBlob, 'requirements-specification.md');
          saveAs(technicalMdBlob, 'technical-details.md');
          requirementsPdf.save('requirements-specification.pdf');
          technicalPdf.save('technical-details.pdf');
          messageApi.info('Files downloaded to your Downloads folder. To save to a custom folder, please use Chrome browser.');
        }
      } catch (error) {
        // If user cancels directory picker or error occurs, fallback to regular download
        if ((error as Error).name !== 'AbortError') {
          console.warn('Failed to save to .kiro folder, falling back to download:', error);
        }
        saveAs(requirementsMdBlob, 'requirements-specification.md');
        saveAs(technicalMdBlob, 'technical-details.md');
        requirementsPdf.save('requirements-specification.pdf');
        technicalPdf.save('technical-details.pdf');
        if ((error as Error).name !== 'AbortError') {
          messageApi.warning('Could not save to .kiro folder. Files downloaded to default folder.');
        }
      }
    } catch (error) {
      console.error('Error generating files:', error);
      messageApi.error('Failed to generate files. Please check the console for details.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <OverviewStep />;
      case 1:
        return <SourceAnalysisStep />;
      case 2:
        return <TargetArchitectureStep />;
      case 3:
        return <DependenciesStep />;
      case 4:
        return <TechnicalRequirementsStep />;
      case 5:
        return <QualityTestingStep />;
      case 6:
        return <ReviewStep onGenerate={handleGenerateFiles} />;
      default:
        return null;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#10b981',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      {contextHolder}
      <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <Header 
          style={{ 
            background: '#ffffff',
            padding: '0 50px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', height: '56px', gap: '16px' }}>
            <img 
              src={rhinoLogo} 
              alt="Rhino.ai" 
              style={{ height: '28px', width: 'auto' }} 
            />
            <div style={{ 
              height: '24px', 
              width: '1px', 
              background: '#e5e7eb'
            }} />
            <h1 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: 600,
              color: '#6b7280',
              letterSpacing: '-0.3px',
            }}>
              Transformation Builder
            </h1>
          </div>
        </Header>

        <Content style={{ padding: '20px 40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div style={{ 
            background: '#fff', 
            padding: '16px 20px', 
            borderRadius: '12px', 
            marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <Steps 
              current={currentStep} 
              items={steps.map((step, index) => ({
                ...step,
                onClick: () => handleStepChange(index),
              }))}
              onChange={handleStepChange}
              size="small"
            />
          </div>

          <FormProvider {...methods}>
            <div style={{ 
              background: '#fff', 
              padding: '24px', 
              borderRadius: '12px', 
              minHeight: '400px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              {renderStepContent()}

              <div style={{ 
                marginTop: '24px', 
                paddingTop: '16px',
                borderTop: '1px solid #f0f0f0',
                display: 'flex', 
                justifyContent: 'space-between' 
              }}>
                <Button
                  size="middle"
                  onClick={prev}
                  disabled={currentStep === 0}
                  style={{
                    minWidth: '100px',
                    height: '36px',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                >
                  Previous
                </Button>

                {currentStep < steps.length - 1 && (
                  <Button 
                    type="primary" 
                    size="middle" 
                    onClick={next}
                    style={{
                      minWidth: '100px',
                      height: '36px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    Next
                  </Button>
                )}

                {currentStep === steps.length - 1 && (
                  <div /> 
                )}
              </div>
            </div>
          </FormProvider>
        </Content>

        <Footer style={{ 
          textAlign: 'center', 
          background: '#ffffff',
          color: '#6b7280',
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          fontSize: '13px',
        }}>
          Rhino Transformation Builder ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
