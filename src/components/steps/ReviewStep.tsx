import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert, Tabs, Button, Modal, Space, Input, message } from 'antd';
import { RocketOutlined, FolderOpenOutlined, LoadingOutlined, FilePdfOutlined } from '@ant-design/icons';
import { TransformationSpec } from '../../types';
import { generateRequirementsMarkdown, generateTechnicalMarkdown } from '../../utils/markdownGenerator';

interface ReviewStepProps {
  onGenerate: () => void;
}

const BACKEND_URL = 'http://localhost:5007';

export default function ReviewStep({ onGenerate }: ReviewStepProps) {
  const { watch } = useFormContext<TransformationSpec>();
  const data = watch();
  
  const [isTransformModalOpen, setIsTransformModalOpen] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isTransformComplete, setIsTransformComplete] = useState(false);
  const [transformOutput, setTransformOutput] = useState<string[]>([]);
  const [workingDir, setWorkingDir] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate markdown previews
  const requirementsPreview = generateRequirementsMarkdown(data);
  const technicalPreview = generateTechnicalMarkdown(data);

  // Generate kiro content from layer structure
  const generateKiroContent = () => {
    let content = `# ${data.targetProject || 'Transformation'} Specification\n\n`;
    
    // Add references to documents in .kiro folder
    content += `## Reference Documents\n\n`;
    content += `Please read and follow the specifications in these documents:\n\n`;
    content += `- Requirements: #[[file:.kiro/requirements-specification.md]]\n`;
    content += `- Technical Details: #[[file:.kiro/technical-details.md]]\n`;
    
    // Add uploaded documents if they exist
    if (data.documentUploadType === 'manual') {
      if (data.requirementsSpecDocument?.fileName) {
        content += `- User Stories: #[[file:.kiro/${data.requirementsSpecDocument.fileName}]]\n`;
      }
      if (data.uanDocument?.fileName) {
        content += `- UAN Document: #[[file:.kiro/${data.uanDocument.fileName}]]\n`;
      }
      if (data.uadDocument?.fileName) {
        content += `- UAD Document: #[[file:.kiro/${data.uadDocument.fileName}]]\n`;
      }
    }
    
    if (data.codingStandardDocuments && data.codingStandardDocuments.length > 0) {
      data.codingStandardDocuments.forEach(doc => {
        if (doc.fileName) {
          content += `- Coding Standards: #[[file:.kiro/${doc.fileName}]]\n`;
        }
      });
    }
    
    content += `\n---\n\n`;
    content += `Architectural Pattern: ${data.architecturalPattern}\n\n`;
    
    if (data.layerStructure && data.layerStructure.length > 0) {
      content += `## Implementation Structure\n\n`;
      data.layerStructure.forEach(layer => {
        content += `### ${layer.name}\n`;
        const lines = layer.description.split('\n').filter(l => l.trim());
        lines.forEach(line => {
          content += `- ${line.trim()}\n`;
        });
        content += '\n';
      });
    }
    
    if (data.transformationGoal) {
      content += `\n## Transformation Goal\n${data.transformationGoal}\n`;
    }
    
    content += `\n## Task: Generate Complete Application Code\n\n`;
    content += `You MUST generate a complete, working application with ${data.architecturalPattern} architecture.\n\n`;
    content += `### Step 1: Analyze Requirements\n`;
    content += `Read ALL the reference documents above and extract:\n`;
    content += `- All domain entities with their properties and relationships\n`;
    content += `- All business validation rules and constraints\n`;
    content += `- All workflows and business processes\n`;
    content += `- All API endpoints and operations\n\n`;
    content += `### Step 2: Generate Complete Code\n`;
    content += `Create ALL files for a production-ready application:\n\n`;
    content += `1. **Domain Layer**: Generate entity classes for EVERY entity found in the documents\n`;
    content += `2. **Application Layer**: Generate commands, handlers, validators, and DTOs for ALL operations\n`;
    content += `3. **Infrastructure Layer**: Generate DbContext, repositories, services, and migrations\n`;
    content += `4. **API Layer**: Generate controllers for ALL endpoints with proper routing\n`;
    content += `5. **Configuration**: Generate appsettings.json, Program.cs, and dependency injection setup\n`;
    content += `6. **Database**: Generate EF Core migrations for all entities\n`;
    content += `7. **Docker**: Generate Dockerfile and docker-compose.yml\n`;
    content += `8. **Tests**: Generate unit tests for key business logic\n\n`;
    content += `### Step 3: Implementation Requirements\n`;
    content += `- Use .NET 8 with C# 12\n`;
    content += `- Implement ALL entities, not just examples\n`;
    content += `- Include ALL validation rules from the documents\n`;
    content += `- Add proper error handling and logging\n`;
    content += `- Follow clean architecture principles strictly\n`;
    content += `- Generate working, compilable code\n\n`;
    content += `### Step 4: Create Project Structure\n`;
    content += `Organize code in the src/ folder following the layer structure below.\n\n`;
    content += `DO NOT just analyze - you must CREATE all the actual code files!\n`;
    
    return content;
  };

  const handleStartTransformation = async () => {
    if (!workingDir) {
      message.error('Please specify a working directory');
      return;
    }

    setIsTransforming(true);
    setIsTransformComplete(false);
    setTransformOutput(['Connecting to backend server...']);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${BACKEND_URL}/api/transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kiro_content: generateKiroContent(),
          working_dir: workingDir,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream');
      }

      let isComplete = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              setTransformOutput(prev => [...prev, data.message]);
              
              // Check if transformation is complete
              if (data.type === 'complete') {
                isComplete = true;
                setIsTransformComplete(true);
              }
              
              // Auto-scroll to bottom
              if (outputRef.current) {
                outputRef.current.scrollTop = outputRef.current.scrollHeight;
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }

      if (isComplete) {
        setTransformOutput(prev => [
          ...prev,
          '\n' + '='.repeat(60),
          '✅ TRANSFORMATION COMPLETED SUCCESSFULLY!',
          '='.repeat(60),
          '',
          `📁 Generated code location: ${workingDir}/src`,
          '📄 Specification files: .kiro folder',
          '',
          '🎯 Next Steps:',
          '1. Review the generated code in the src/ folder',
          '2. Check the .kiro/transformation-spec.kiro file for details',
          '3. Run: dotnet build (to compile the project)',
          '4. Run: dotnet ef migrations add InitialCreate (if needed)',
          '5. Run: docker-compose up (to start the application)',
          '',
          '💡 Tip: If some components are missing, you can run the',
          '   transformation again or manually complete them.',
          '='.repeat(60),
        ]);
        
        message.success({
          content: 'Transformation completed successfully! Check the output for next steps.',
          duration: 5,
        });
      } else {
        message.success('Transformation completed!');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setTransformOutput(prev => [...prev, '\n⚠️ Transformation cancelled by user']);
        message.warning('Transformation cancelled');
      } else {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        setTransformOutput(prev => [...prev, `\nError: ${errorMsg}`, '\nMake sure the backend server is running: python backend/server.py']);
        message.error('Transformation failed. Is the backend server running?');
      }
    } finally {
      setIsTransforming(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelTransformation = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setTransformOutput(prev => [...prev, '\nCancelling transformation...']);
    }
  };

  const handleSelectDirectory = async () => {
    try {
      // @ts-ignore - showDirectoryPicker is not in TypeScript types yet
      if (window.showDirectoryPicker) {
        // @ts-ignore
        const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        // Get the path - this is a workaround since we can't get actual path from File System Access API
        setWorkingDir(dirHandle.name);
        message.info(`Selected: ${dirHandle.name}. Please enter the full path manually for the backend.`);
      } else {
        message.info('Directory picker not available. Please enter the path manually.');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        message.error('Could not open directory picker');
      }
    }
  };

  const tabItems = [
    {
      key: 'requirements',
      label: 'Requirements Specification',
      children: (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '4px',
          maxHeight: '600px',
          overflow: 'auto'
        }}>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            wordWrap: 'break-word',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            {requirementsPreview}
          </pre>
        </div>
      ),
    },
    {
      key: 'technical',
      label: 'Technical Details',
      children: (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '4px',
          maxHeight: '600px',
          overflow: 'auto'
        }}>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            wordWrap: 'break-word',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            {technicalPreview}
          </pre>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ 
        marginBottom: '20px', 
        fontSize: '22px',
        fontWeight: 700,
        color: '#10b981',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        7. Review & Generate
      </h2>

      <Alert
        message="Review Your Specification"
        description="Please review the document previews below. Click 'Generate MD & PDF' to create your transformation specification documents."
        type="info"
        showIcon
        style={{ marginBottom: '16px' }}
      />

      <Tabs 
        defaultActiveKey="requirements" 
        items={tabItems}
        style={{ marginBottom: '16px' }}
        type="line"
        animated
        size="small"
      />

      <div style={{ 
        background: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '15px', 
          fontWeight: 600, 
          color: '#166534',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700
          }}>1</span>
          Ready to Generate
        </h3>
        <p style={{ 
          color: '#166534', 
          margin: '0 0 16px 0', 
          fontSize: '13px',
          lineHeight: '1.5'
        }}>
          Generate your transformation specification files. Both markdown and PDF files will be saved to the .kiro folder in your selected directory.
        </p>
        
        <Button
          type="primary"
          size="large"
          icon={<FilePdfOutlined />}
          onClick={onGenerate}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: 'none',
            fontWeight: 600,
            height: '44px',
            paddingLeft: '24px',
            paddingRight: '24px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
          }}
        >
          Generate MD & PDF
        </Button>
      </div>

      <div style={{ 
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <h3 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '15px', 
          fontWeight: 600, 
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700
          }}>2</span>
          Start Transformation
        </h3>
        <p style={{ 
          color: '#6b7280', 
          margin: '0 0 16px 0', 
          fontSize: '13px',
          lineHeight: '1.5'
        }}>
          After generating the documents, you can start the AI-powered code transformation using AWS KIRO.
        </p>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h4 style={{ color: '#fff', margin: 0, fontSize: '15px', fontWeight: 600 }}>
              Ready for Transformation?
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0', fontSize: '12px' }}>
              Click to begin the AI-powered code transformation
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={() => setIsTransformModalOpen(true)}
            style={{
              background: '#fff',
              color: '#764ba2',
              border: 'none',
              fontWeight: 600,
              height: '40px',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            Start Transformation
          </Button>
        </div>
      </div>

      <Modal
        title={
          <Space>
            <RocketOutlined style={{ color: '#764ba2' }} />
            <span>Start Transformation</span>
          </Space>
        }
        open={isTransformModalOpen}
        onCancel={() => !isTransforming && setIsTransformModalOpen(false)}
        footer={null}
        width={700}
        closable={!isTransforming}
        maskClosable={!isTransforming}
      >
        {isTransformComplete && (
          <Alert
            message="✅ Transformation Completed Successfully!"
            description={
              <div>
                <p style={{ margin: '8px 0' }}>Your code has been generated in: <strong>{workingDir}/src</strong></p>
                <p style={{ margin: '8px 0' }}>Next steps:</p>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  <li>Review the generated code</li>
                  <li>Run: <code>dotnet build</code></li>
                  <li>Run: <code>docker-compose up</code></li>
                </ul>
              </div>
            }
            type="success"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            Working Directory <span style={{ color: 'red' }}>*</span>
          </label>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              value={workingDir}
              onChange={(e) => setWorkingDir(e.target.value)}
              placeholder="/path/to/your/project"
              size="large"
              disabled={isTransforming}
            />
            <Button 
              icon={<FolderOpenOutlined />} 
              size="large"
              onClick={handleSelectDirectory}
              disabled={isTransforming}
            >
              Browse
            </Button>
          </Space.Compact>
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
            Enter the full path to your project directory where the transformation should run
          </p>
        </div>

        {transformOutput.length > 0 && (
          <div 
            ref={outputRef}
            style={{ 
              background: '#1e1e1e', 
              borderRadius: '8px', 
              padding: '16px',
              maxHeight: '400px',
              overflow: 'auto',
              marginBottom: '16px'
            }}
          >
            <pre style={{ 
              color: '#d4d4d4', 
              margin: 0, 
              fontSize: '12px',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}>
              {transformOutput.map((line, i) => (
                <div key={i} style={{ 
                  color: line.includes('Error') ? '#f87171' : 
                         line.includes('complete') ? '#4ade80' : 
                         line.includes('Starting') ? '#60a5fa' : '#d4d4d4'
                }}>
                  {line}
                </div>
              ))}
            </pre>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button 
            onClick={isTransforming ? handleCancelTransformation : () => setIsTransformModalOpen(false)}
            danger={isTransforming}
          >
            {isTransforming ? 'Cancel Transformation' : 'Close'}
          </Button>
          <Button
            type="primary"
            icon={isTransforming ? <LoadingOutlined /> : <RocketOutlined />}
            onClick={handleStartTransformation}
            loading={isTransforming}
            disabled={!workingDir || isTransforming}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
          >
            {isTransforming ? 'Transforming...' : 'Start Transformation'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
