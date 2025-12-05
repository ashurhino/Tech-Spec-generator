import { useFormContext, Controller } from 'react-hook-form';
import { Input, Select, Space, Button, Upload, message, Radio, Collapse } from 'antd';
import { FolderOpenOutlined, UploadOutlined, PlusOutlined, DeleteOutlined, CheckCircleFilled } from '@ant-design/icons';
import { TransformationSpec } from '../../types';

const { TextArea } = Input;

const transformationTypes = [
  'API',
  'UI',
  'Business Logic',
  'Database',
  'Infrastructure',
  'Full Stack',
  'Other',
];

// Helper function to normalize file paths
// Replaces colons and backslashes with forward slashes (except Windows drive letters)
const normalizeFilePath = (path: string): string => {
  if (!path) return path;
  
  // First, normalize backslashes to forward slashes
  let normalized = path.replace(/\\/g, '/');
  
  // Handle Windows drive letters - preserve "C:" at the start, replace all other colons
  const driveLetterMatch = normalized.match(/^([A-Za-z]:)/);
  if (driveLetterMatch) {
    // Windows drive letter path - keep drive letter colon, replace all other colons
    const driveLetter = driveLetterMatch[1]; // e.g., "C:"
    const restOfPath = normalized.substring(2);
    // Replace ALL remaining colons with forward slashes
    normalized = driveLetter + restOfPath.replace(/:/g, '/');
  } else {
    // Not a Windows drive letter path - replace ALL colons with forward slashes
    normalized = normalized.replace(/:/g, '/');
  }
  
  return normalized;
};

export default function OverviewStep() {
  const { control, setValue, watch } = useFormContext<TransformationSpec>();
  const [messageApi, contextHolder] = message.useMessage();
  
  const codingStandardDocuments = watch('codingStandardDocuments') || [];
  const requirementsDoc = watch('requirementsSpecDocument');
  const uanDoc = watch('uanDocument');
  const uadDoc = watch('uadDocument');
  const documentUploadType = watch('documentUploadType') || 'manual';

  const handleFolderSelect = async (fieldName: 'sourceProject' | 'targetProject') => {
    try {
      // @ts-ignore - showDirectoryPicker is not in TypeScript types yet
      if (window.showDirectoryPicker) {
        // @ts-ignore - showDirectoryPicker is not in TypeScript types yet
        const dirHandle = await window.showDirectoryPicker();
        setValue(fieldName, dirHandle.name);
        messageApi.success(`Selected folder: ${dirHandle.name}`);
      } else {
        messageApi.warning('Folder picker not supported in this browser. Please type the path manually.');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        messageApi.error('Failed to select folder');
      }
    }
  };

  const handleFileUpload = async (file: File, fieldName: 'requirementsSpecDocument' | 'uanDocument' | 'uadDocument') => {
    try {
      // Read file as ArrayBuffer for binary files (PDF, DOCX), or text for text files
      let fileContent: string | ArrayBuffer;
      const isBinaryFile = file.type === 'application/pdf' || 
                          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                          file.name.endsWith('.pdf') || 
                          file.name.endsWith('.docx');
      
      if (isBinaryFile) {
        // Read as ArrayBuffer for binary files
        fileContent = await file.arrayBuffer();
      } else {
        // Read as text for text files
        fileContent = await file.text();
      }
      
      // Try to get the full path from various possible sources
      let filePath: string | undefined = undefined;
      
      // Check webkitRelativePath first (for directory uploads)
      if ((file as any).webkitRelativePath) {
        filePath = (file as any).webkitRelativePath;
      } 
      // Check path property
      else if ((file as any).path) {
        filePath = (file as any).path;
      }
      // Check if file has a fullPath property
      else if ((file as any).fullPath) {
        filePath = (file as any).fullPath;
      }
      // If no path available, use just the filename
      else {
        filePath = file.name;
      }
      
      // Always normalize path separators using helper function
      // This ensures colons are replaced with forward slashes
      if (filePath && filePath !== file.name) {
        filePath = normalizeFilePath(filePath);
      }
      
      setValue(fieldName, {
        fileName: file.name,
        filePath: filePath,
        fileContent: fileContent,
        fileType: file.type || 'application/octet-stream'
      });
      messageApi.success(`Uploaded: ${filePath || file.name}`);
    } catch (error) {
      messageApi.error('Failed to read file');
    }
    return false; // Prevent default upload behavior
  };

  const handleCodingStandardUpload = async (file: File, index: number) => {
    try {
      // Read file as ArrayBuffer for binary files (PDF, DOCX), or text for text files
      let fileContent: string | ArrayBuffer;
      const isBinaryFile = file.type === 'application/pdf' || 
                          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                          file.name.endsWith('.pdf') || 
                          file.name.endsWith('.docx');
      
      if (isBinaryFile) {
        // Read as ArrayBuffer for binary files
        fileContent = await file.arrayBuffer();
      } else {
        // Read as text for text files
        fileContent = await file.text();
      }
      
      // Try to get the full path from various possible sources
      let filePath: string | undefined = undefined;
      
      // Check webkitRelativePath first (for directory uploads)
      if ((file as any).webkitRelativePath) {
        filePath = (file as any).webkitRelativePath;
      } 
      // Check path property
      else if ((file as any).path) {
        filePath = (file as any).path;
      }
      // Check if file has a fullPath property
      else if ((file as any).fullPath) {
        filePath = (file as any).fullPath;
      }
      // If no path available, use just the filename
      else {
        filePath = file.name;
      }
      
      // Always normalize path separators using helper function
      // This ensures colons are replaced with forward slashes
      if (filePath && filePath !== file.name) {
        filePath = normalizeFilePath(filePath);
      }
      
      const updatedDocs = [...codingStandardDocuments];
      updatedDocs[index] = {
        ...updatedDocs[index],
        fileName: file.name,
        filePath: filePath,
        fileContent: fileContent,
        fileType: file.type || 'text/plain'
      };
      setValue('codingStandardDocuments', updatedDocs);
      messageApi.success(`Uploaded: ${filePath || file.name}`);
    } catch (error) {
      messageApi.error('Failed to read file');
    }
    return false;
  };

  const addCodingStandardRow = () => {
    const newDoc = {
      id: Date.now().toString(),
      technologyName: '',
      fileName: '',
      fileContent: '',
      fileType: ''
    };
    setValue('codingStandardDocuments', [...codingStandardDocuments, newDoc]);
  };

  const removeCodingStandardRow = (index: number) => {
    const updatedDocs = codingStandardDocuments.filter((_: any, i: number) => i !== index);
    setValue('codingStandardDocuments', updatedDocs);
  };

  const updateTechnologyName = (index: number, value: string) => {
    const updatedDocs = [...codingStandardDocuments];
    updatedDocs[index] = { ...updatedDocs[index], technologyName: value };
    setValue('codingStandardDocuments', updatedDocs);
  };

  const transformationType = watch('transformationType') || [];
  const targetProject = watch('targetProject');
  const transformationGoal = watch('transformationGoal');
  const sourceProject = watch('sourceProject');

  // Helper to check if section has data
  const hasTransformationType = transformationType.length > 0;
  const hasProjectContext = !!(targetProject || sourceProject);
  const hasDocuments = !!(requirementsDoc || uanDoc || uadDoc || codingStandardDocuments.length > 0);
  const hasGoal = !!(transformationGoal);

  const collapseItems = [
    {
      key: 'transformation-type',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Transformation Type <span style={{ color: 'red' }}>*</span>
          {hasTransformationType && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: (
        <div>
          <Controller
            name="transformationType"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                mode="multiple"
                placeholder="Select transformation type(s)"
                size="large"
                style={{ width: '100%' }}
                options={transformationTypes.map(type => ({ value: type, label: type }))}
              />
            )}
          />
          <div className="help-text" style={{ marginTop: '8px' }}>
            Select one or more transformation types that apply to this project
          </div>
        </div>
      ),
    },
    {
      key: 'project-context',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Project Context
          {hasProjectContext && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Source Project
            </label>
            <Space.Compact style={{ width: '100%' }}>
              <Controller
                name="sourceProject"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="e.g., frontend/web/legacy-app" size="large" />
                )}
              />
              <Button 
                icon={<FolderOpenOutlined />} 
                size="large"
                onClick={() => handleFolderSelect('sourceProject')}
              >
                Browse
              </Button>
            </Space.Compact>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Target Project <span style={{ color: 'red' }}>*</span>
            </label>
            <Space.Compact style={{ width: '100%' }}>
              <Controller
                name="targetProject"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input {...field} placeholder="e.g., backend/api/my-service" size="large" />
                )}
              />
              <Button 
                icon={<FolderOpenOutlined />} 
                size="large"
                onClick={() => handleFolderSelect('targetProject')}
              >
                Browse
              </Button>
            </Space.Compact>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Repository
            </label>
            <Controller
              name="repository"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g., github.com/org/repo-name" size="large" />
              )}
            />
          </div>
        </Space>
      ),
    },
    {
      key: 'document-uploads',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Rhino Document Hub
          {hasDocuments && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Controller
              name="documentUploadType"
              control={control}
              defaultValue="manual"
              render={({ field }) => (
                <Radio.Group {...field} buttonStyle="solid" size="large">
                  <Radio.Button value="manual">Manual</Radio.Button>
                  <Radio.Button value="mcp">MCP</Radio.Button>
                </Radio.Group>
              )}
            />
          </div>

          {documentUploadType === 'manual' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  User Story Document
                </label>
                <Upload
                  beforeUpload={(file) => handleFileUpload(file, 'requirementsSpecDocument')}
                  maxCount={1}
                  accept=".txt,.md,.pdf,.doc,.docx,.json"
                >
                  <Button icon={<UploadOutlined />} size="large">
                    {requirementsDoc?.fileName || 'Upload Requirements Document'}
                  </Button>
                </Upload>
                {requirementsDoc && (
                  <div className="help-text" style={{ color: '#52c41a', marginTop: '8px' }}>
                    ✓ Uploaded: {requirementsDoc.filePath || requirementsDoc.fileName}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  UAN Document
                </label>
                <Upload
                  beforeUpload={(file) => handleFileUpload(file, 'uanDocument')}
                  maxCount={1}
                  accept=".txt,.md,.pdf,.doc,.docx,.json"
                >
                  <Button icon={<UploadOutlined />} size="large">
                    {uanDoc?.fileName || 'Upload UAN Document'}
                  </Button>
                </Upload>
                {uanDoc && (
                  <div className="help-text" style={{ color: '#52c41a', marginTop: '8px' }}>
                    ✓ Uploaded: {uanDoc.filePath || uanDoc.fileName}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  UAD Document
                </label>
                <Upload
                  beforeUpload={(file) => handleFileUpload(file, 'uadDocument')}
                  maxCount={1}
                  accept=".txt,.md,.pdf,.doc,.docx,.json"
                >
                  <Button icon={<UploadOutlined />} size="large">
                    {uadDoc?.fileName || 'Upload UAD Document'}
                  </Button>
                </Upload>
                {uadDoc && (
                  <div className="help-text" style={{ color: '#52c41a', marginTop: '8px' }}>
                    ✓ Uploaded: {uadDoc.filePath || uadDoc.fileName}
                  </div>
                )}
              </div>
            </>
          )}

          {documentUploadType === 'mcp' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  MCP Url
                </label>
                <Controller
                  name="mcpUrl"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter MCP URL" size="large" />
                  )}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Project ID
                </label>
                <Controller
                  name="mcpProjectId"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter Project ID" size="large" />
                  )}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Project Name
                </label>
                <Controller
                  name="mcpProjectName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter Project Name" size="large" />
                  )}
                />
              </div>
            </>
          )}
        </Space>
      ),
    },
    {
      key: 'coding-standards',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Coding Standard Documents
          {codingStandardDocuments.length > 0 && (
            <span style={{ marginLeft: '8px', color: '#6b7280', fontWeight: 400 }}>
              ({codingStandardDocuments.length} document{codingStandardDocuments.length > 1 ? 's' : ''})
            </span>
          )}
        </span>
      ),
      extra: (
        <Button 
          type="dashed" 
          size="small"
          icon={<PlusOutlined />} 
          onClick={(e) => { e.stopPropagation(); addCodingStandardRow(); }}
        >
          Add
        </Button>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {codingStandardDocuments.map((doc: any, index: number) => (
            <div 
              key={doc.id} 
              style={{ 
                padding: '16px', 
                border: '1px solid #d9d9d9', 
                borderRadius: '4px',
                backgroundColor: '#fafafa'
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Technology Name
                  </label>
                  <Input
                    value={doc.technologyName}
                    onChange={(e) => updateTechnologyName(index, e.target.value)}
                    placeholder="e.g., React, .NET, Python"
                    size="large"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Document
                  </label>
                  <Space>
                    <Upload
                      beforeUpload={(file) => handleCodingStandardUpload(file, index)}
                      maxCount={1}
                      accept=".txt,.md,.pdf,.doc,.docx"
                    >
                      <Button icon={<UploadOutlined />} size="large">
                        {doc.fileName || 'Upload Coding Standard'}
                      </Button>
                    </Upload>
                    <Button 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => removeCodingStandardRow(index)}
                      size="large"
                    >
                      Remove
                    </Button>
                  </Space>
                  {doc.fileName && (
                    <div className="help-text" style={{ color: '#52c41a', marginTop: '8px' }}>
                      ✓ Uploaded: {doc.filePath || doc.fileName}
                    </div>
                  )}
                </div>
              </Space>
            </div>
          ))}
          
          {codingStandardDocuments.length === 0 && (
            <div className="help-text">
              No coding standard documents added. Click "Add" to upload coding standards for specific technologies.
            </div>
          )}
        </Space>
      ),
    },
    {
      key: 'transformation-goal',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Transformation Goal <span style={{ color: 'red' }}>*</span>
          {hasGoal && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Describe the transformation goal <span style={{ color: 'red' }}>*</span>
            </label>
            <Controller
              name="transformationGoal"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={4}
                  placeholder="Transform [component/feature] from [current state] to [desired state] following [standards]..."
                />
              )}
            />
            <div className="help-text" style={{ marginTop: '8px' }}>
              Example: Transform legacy monolithic APIs to REST-compliant microservices
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Business Justification <span style={{ color: 'red' }}>*</span>
            </label>
            <Controller
              name="businessJustification"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={3}
                  placeholder="Why is this transformation needed? What business value does it provide?"
                />
              )}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
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
        1. Transformation Overview
      </h2>

      <Collapse 
        defaultActiveKey={[]}
        items={collapseItems}
        style={{ background: '#fafafa' }}
        expandIconPosition="start"
      />
    </div>
  );
}
