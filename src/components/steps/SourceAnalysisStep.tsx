import { useFormContext, Controller } from 'react-hook-form';
import { Input, Button, Space, Tag, Collapse, Tooltip } from 'antd';
import { PlusOutlined, CheckCircleFilled, ThunderboltOutlined } from '@ant-design/icons';
import { TransformationSpec } from '../../types';
import { useState } from 'react';

const { TextArea } = Input;

// Common architectural patterns for quick selection
const PATTERN_OPTIONS = [
  { label: 'Monolithic MVC', color: '#ef4444' },
  { label: 'Layered / N-Tier', color: '#f59e0b' },
  { label: 'Procedural / Scripts', color: '#8b5cf6' },
  { label: 'Legacy SOAP/XML', color: '#6366f1' },
  { label: 'Tightly Coupled', color: '#ec4899' },
  { label: 'Spaghetti Code', color: '#14b8a6' },
];

export default function SourceAnalysisStep() {
  const { control, watch, setValue } = useFormContext<TransformationSpec>();
  const [pathInput, setPathInput] = useState('');
  const legacyCodePaths = watch('legacyCodePaths') || [];
  const currentPattern = watch('currentPattern');
  const coreBusinessLogic = watch('coreBusinessLogic');

  const addPath = () => {
    if (pathInput.trim()) {
      setValue('legacyCodePaths', [...legacyCodePaths, pathInput.trim()]);
      setPathInput('');
    }
  };

  const removePath = (index: number) => {
    setValue('legacyCodePaths', legacyCodePaths.filter((_, i) => i !== index));
  };

  const selectPattern = (pattern: string) => {
    setValue('currentPattern', pattern);
  };

  const hasLegacyPaths = legacyCodePaths.length > 0;
  const hasPattern = !!currentPattern;
  const hasBusinessLogic = !!coreBusinessLogic;

  const collapseItems = [
    {
      key: 'legacy-code',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Legacy Code Location
          {hasLegacyPaths && (
            <span style={{ marginLeft: '8px', color: '#6b7280', fontWeight: 400 }}>
              ({legacyCodePaths.length} path{legacyCodePaths.length > 1 ? 's' : ''})
            </span>
          )}
        </span>
      ),
      children: (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            Primary files/folders
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <Input
              value={pathInput}
              onChange={(e) => setPathInput(e.target.value)}
              onPressEnter={addPath}
              placeholder="e.g., src/controllers/UserController.ts or src/services/"
              size="large"
            />
            <Button icon={<PlusOutlined />} onClick={addPath} size="large">
              Add
            </Button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {legacyCodePaths.map((path, index) => (
              <Tag
                key={index}
                closable
                onClose={() => removePath(index)}
                style={{ padding: '4px 8px', fontSize: '14px' }}
              >
                {path}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'current-architecture',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Current Architecture/Pattern
          {hasPattern && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Current Pattern <span style={{ color: 'red' }}>*</span>
            </label>
            
            {/* Quick selection buttons */}
            {!currentPattern && (
              <div style={{ 
                background: '#f8fafc', 
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#64748b', 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <ThunderboltOutlined />
                  Quick select common patterns:
                </div>
                <Space wrap size="small">
                  {PATTERN_OPTIONS.map((option) => (
                    <Tooltip key={option.label} title={`Select "${option.label}"`}>
                      <Button 
                        size="small" 
                        onClick={() => selectPattern(option.label)}
                        style={{ 
                          borderColor: option.color, 
                          color: option.color,
                          fontSize: '12px'
                        }}
                      >
                        {option.label}
                      </Button>
                    </Tooltip>
                  ))}
                </Space>
              </div>
            )}
            
            <Controller
              name="currentPattern"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Or type your own pattern..."
                  size="large"
                  suffix={
                    currentPattern && (
                      <Button 
                        type="text" 
                        size="small" 
                        onClick={() => setValue('currentPattern', '')}
                        style={{ color: '#9ca3af', fontSize: '11px' }}
                      >
                        Clear
                      </Button>
                    )
                  }
                />
              )}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              Key Issues
            </label>
            <Controller
              name="keyIssues"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={3}
                  placeholder="What problems exist in the current implementation?"
                />
              )}
            />
          </div>
        </Space>
      ),
    },
    {
      key: 'business-logic',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Business Logic Analysis
          {hasBusinessLogic && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: (
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            Core Functionality
          </label>
          <Controller
            name="coreBusinessLogic"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                rows={3}
                placeholder="Describe what the code does"
              />
            )}
          />
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
        2. Source Analysis
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
