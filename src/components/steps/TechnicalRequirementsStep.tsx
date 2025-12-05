import { useFormContext, Controller } from 'react-hook-form';
import { Input, Select, Space, Collapse } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { TransformationSpec } from '../../types';

const { TextArea } = Input;

export default function TechnicalRequirementsStep() {
  const { control, watch } = useFormContext<TransformationSpec>();
  const transformationType = watch('transformationType');
  const authMethod = watch('authMethod');
  const errorStrategy = watch('errorStrategy');
  const apiResourceNaming = watch('apiResourceNaming');

  const hasAuth = !!authMethod;
  const hasErrorHandling = !!errorStrategy;
  const hasApiDesign = !!apiResourceNaming;
  const isApiTransformation = Array.isArray(transformationType) && transformationType.includes('API');

  const collapseItems = [
    {
      key: 'auth',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Authentication & Authorization
          {hasAuth && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Method</label>
            <Controller
              name="authMethod"
              control={control}
              render={({ field }) => (
                <Select {...field} size="large" style={{ width: '100%' }}>
                  <Select.Option value="JWT">JWT</Select.Option>
                  <Select.Option value="OAuth">OAuth</Select.Option>
                  <Select.Option value="Session">Session</Select.Option>
                  <Select.Option value="API Key">API Key</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              )}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Implementation</label>
            <Controller
              name="authImplementation"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g., Middleware, Attributes" size="large" />
              )}
            />
          </div>
        </Space>
      ),
    },
    {
      key: 'error-logging',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Error Handling & Logging
          {hasErrorHandling && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Error Strategy</label>
            <Controller
              name="errorStrategy"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g., Middleware, Try-Catch, Result Pattern" size="large" />
              )}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Logging Framework</label>
            <Controller
              name="loggingFramework"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g., Serilog, NLog, Winston" size="large" />
              )}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Logging Level</label>
            <Controller
              name="loggingLevel"
              control={control}
              render={({ field }) => (
                <Select {...field} size="large" style={{ width: '100%' }}>
                  <Select.Option value="Debug">Debug</Select.Option>
                  <Select.Option value="Info">Info</Select.Option>
                  <Select.Option value="Warning">Warning</Select.Option>
                  <Select.Option value="Error">Error</Select.Option>
                </Select>
              )}
            />
          </div>
        </Space>
      ),
    },
    ...(isApiTransformation ? [{
      key: 'api-design',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          API Design
          {hasApiDesign && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Resource Naming</label>
            <Controller
              name="apiResourceNaming"
              control={control}
              render={({ field }) => (
                <TextArea {...field} rows={2} placeholder="e.g., Use nouns, lowercase with hyphens" />
              )}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Naming Convention</label>
            <Controller
              name="apiNamingConvention"
              control={control}
              render={({ field }) => (
                <Select {...field} size="large" style={{ width: '100%' }}>
                  <Select.Option value="kebab-case">kebab-case</Select.Option>
                  <Select.Option value="camelCase">camelCase</Select.Option>
                  <Select.Option value="PascalCase">PascalCase</Select.Option>
                </Select>
              )}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Versioning Strategy</label>
            <Controller
              name="apiVersioningStrategy"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g., URL versioning, Header versioning" size="large" />
              )}
            />
          </div>
        </Space>
      ),
    }] : []),
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
        5. Technical Requirements
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
