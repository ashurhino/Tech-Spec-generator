import { useFormContext, Controller } from 'react-hook-form';
import { Input, Select, Space, Button, Tag, Collapse } from 'antd';
import { PlusOutlined, CheckCircleFilled } from '@ant-design/icons';
import { TransformationSpec } from '../../types';
import { useState } from 'react';

const { TextArea } = Input;

export default function QualityTestingStep() {
  const { control, watch, setValue } = useFormContext<TransformationSpec>();
  const mustFollow = watch('mustFollow') || [];
  const mustNotDo = watch('mustNotDo') || [];
  const preferredApproaches = watch('preferredApproaches') || [];
  const functionalSuccess = watch('functionalSuccess') || [];
  const technicalSuccess = watch('technicalSuccess') || [];
  const businessSuccess = watch('businessSuccess') || [];
  const unitTestCoverage = watch('unitTestCoverage');
  const mappingApproach = watch('mappingApproach');
  const migrationApproach = watch('migrationApproach');

  const [followInput, setFollowInput] = useState('');
  const [notDoInput, setNotDoInput] = useState('');
  const [approachInput, setApproachInput] = useState('');
  const [funcSuccessInput, setFuncSuccessInput] = useState('');
  const [techSuccessInput, setTechSuccessInput] = useState('');
  const [bizSuccessInput, setBizSuccessInput] = useState('');

  const hasTesting = !!unitTestCoverage;
  const hasMapping = !!mappingApproach;
  const hasConstraints = mustFollow.length > 0 || mustNotDo.length > 0 || preferredApproaches.length > 0;
  const hasSuccess = functionalSuccess.length > 0 || technicalSuccess.length > 0 || businessSuccess.length > 0;
  const hasMigration = !!migrationApproach;

  const testingContent = (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
          Unit Test Coverage (%)
        </label>
        <Controller
          name="unitTestCoverage"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="e.g., 90" size="large" />
          )}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
          Testing Framework
        </label>
        <Controller
          name="testingFramework"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="e.g., xUnit, Jest, Cypress" size="large" />
          )}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
          Integration Tests Required?
        </label>
        <Controller
          name="integrationTestsRequired"
          control={control}
          render={({ field }) => (
            <Space>
              <Button type={field.value ? 'primary' : 'default'} onClick={() => field.onChange(true)}>
                Yes
              </Button>
              <Button type={!field.value ? 'primary' : 'default'} onClick={() => field.onChange(false)}>
                No
              </Button>
            </Space>
          )}
        />
      </div>
    </Space>
  );

  const mappingContent = (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
        Mapping Approach
      </label>
      <Controller
        name="mappingApproach"
        control={control}
        render={({ field }) => (
          <Input {...field} placeholder="e.g., AutoMapper, Manual mapping" size="large" />
        )}
      />
    </div>
  );

  const constraintsContent = (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Must Follow</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <Input
            value={followInput}
            onChange={(e) => setFollowInput(e.target.value)}
            onPressEnter={() => {
              if (followInput.trim()) {
                setValue('mustFollow', [...mustFollow, followInput.trim()]);
                setFollowInput('');
              }
            }}
            placeholder="Add constraint"
            size="large"
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              if (followInput.trim()) {
                setValue('mustFollow', [...mustFollow, followInput.trim()]);
                setFollowInput('');
              }
            }}
            size="large"
          >
            Add
          </Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {mustFollow.map((item, index) => (
            <Tag
              key={index}
              closable
              onClose={() => setValue('mustFollow', mustFollow.filter((_, i) => i !== index))}
              style={{ padding: '4px 8px', fontSize: '14px' }}
            >
              {item}
            </Tag>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Must NOT Do</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <Input
            value={notDoInput}
            onChange={(e) => setNotDoInput(e.target.value)}
            onPressEnter={() => {
              if (notDoInput.trim()) {
                setValue('mustNotDo', [...mustNotDo, notDoInput.trim()]);
                setNotDoInput('');
              }
            }}
            placeholder="Add prohibition"
            size="large"
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              if (notDoInput.trim()) {
                setValue('mustNotDo', [...mustNotDo, notDoInput.trim()]);
                setNotDoInput('');
              }
            }}
            size="large"
          >
            Add
          </Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {mustNotDo.map((item, index) => (
            <Tag
              key={index}
              closable
              color="red"
              onClose={() => setValue('mustNotDo', mustNotDo.filter((_, i) => i !== index))}
              style={{ padding: '4px 8px', fontSize: '14px' }}
            >
              {item}
            </Tag>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Preferred Approaches</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <Input
            value={approachInput}
            onChange={(e) => setApproachInput(e.target.value)}
            onPressEnter={() => {
              if (approachInput.trim()) {
                setValue('preferredApproaches', [...preferredApproaches, approachInput.trim()]);
                setApproachInput('');
              }
            }}
            placeholder="Add preferred approach"
            size="large"
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              if (approachInput.trim()) {
                setValue('preferredApproaches', [...preferredApproaches, approachInput.trim()]);
                setApproachInput('');
              }
            }}
            size="large"
          >
            Add
          </Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {preferredApproaches.map((item, index) => (
            <Tag
              key={index}
              closable
              color="blue"
              onClose={() => setValue('preferredApproaches', preferredApproaches.filter((_, i) => i !== index))}
              style={{ padding: '4px 8px', fontSize: '14px' }}
            >
              {item}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );

  const successContent = (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Functional Success</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <Input
            value={funcSuccessInput}
            onChange={(e) => setFuncSuccessInput(e.target.value)}
            onPressEnter={() => {
              if (funcSuccessInput.trim()) {
                setValue('functionalSuccess', [...functionalSuccess, funcSuccessInput.trim()]);
                setFuncSuccessInput('');
              }
            }}
            placeholder="Add functional success criterion"
            size="large"
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              if (funcSuccessInput.trim()) {
                setValue('functionalSuccess', [...functionalSuccess, funcSuccessInput.trim()]);
                setFuncSuccessInput('');
              }
            }}
            size="large"
          >
            Add
          </Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {functionalSuccess.map((item, index) => (
            <Tag
              key={index}
              closable
              color="green"
              onClose={() => setValue('functionalSuccess', functionalSuccess.filter((_, i) => i !== index))}
              style={{ padding: '4px 8px', fontSize: '14px' }}
            >
              {item}
            </Tag>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Technical Success</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <Input
            value={techSuccessInput}
            onChange={(e) => setTechSuccessInput(e.target.value)}
            onPressEnter={() => {
              if (techSuccessInput.trim()) {
                setValue('technicalSuccess', [...technicalSuccess, techSuccessInput.trim()]);
                setTechSuccessInput('');
              }
            }}
            placeholder="Add technical success criterion"
            size="large"
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              if (techSuccessInput.trim()) {
                setValue('technicalSuccess', [...technicalSuccess, techSuccessInput.trim()]);
                setTechSuccessInput('');
              }
            }}
            size="large"
          >
            Add
          </Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {technicalSuccess.map((item, index) => (
            <Tag
              key={index}
              closable
              color="blue"
              onClose={() => setValue('technicalSuccess', technicalSuccess.filter((_, i) => i !== index))}
              style={{ padding: '4px 8px', fontSize: '14px' }}
            >
              {item}
            </Tag>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Business Success</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <Input
            value={bizSuccessInput}
            onChange={(e) => setBizSuccessInput(e.target.value)}
            onPressEnter={() => {
              if (bizSuccessInput.trim()) {
                setValue('businessSuccess', [...businessSuccess, bizSuccessInput.trim()]);
                setBizSuccessInput('');
              }
            }}
            placeholder="Add business success criterion"
            size="large"
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              if (bizSuccessInput.trim()) {
                setValue('businessSuccess', [...businessSuccess, bizSuccessInput.trim()]);
                setBizSuccessInput('');
              }
            }}
            size="large"
          >
            Add
          </Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {businessSuccess.map((item, index) => (
            <Tag
              key={index}
              closable
              color="purple"
              onClose={() => setValue('businessSuccess', businessSuccess.filter((_, i) => i !== index))}
              style={{ padding: '4px 8px', fontSize: '14px' }}
            >
              {item}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );

  const migrationContent = (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
          Migration Approach
        </label>
        <Controller
          name="migrationApproach"
          control={control}
          render={({ field }) => (
            <Select {...field} size="large" style={{ width: '100%' }}>
              <Select.Option value="Big Bang">Big Bang (all at once)</Select.Option>
              <Select.Option value="Phased">Phased (gradual migration)</Select.Option>
              <Select.Option value="Strangler Fig">Strangler Fig (parallel systems)</Select.Option>
              <Select.Option value="Feature Flag">Feature Flag (toggle between old/new)</Select.Option>
            </Select>
          )}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
          Rollback Plan
        </label>
        <Controller
          name="rollbackPlan"
          control={control}
          render={({ field }) => (
            <TextArea {...field} rows={3} placeholder="Steps to rollback if issues occur" />
          )}
        />
      </div>
    </Space>
  );

  const collapseItems = [
    {
      key: 'testing',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Testing Requirements
          {hasTesting && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: testingContent,
    },
    {
      key: 'mapping',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Data Models & Mapping
          {hasMapping && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: mappingContent,
    },
    {
      key: 'constraints',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Implementation Constraints
          {hasConstraints && (
            <span style={{ marginLeft: '8px', color: '#6b7280', fontWeight: 400 }}>
              ({mustFollow.length + mustNotDo.length + preferredApproaches.length} item{(mustFollow.length + mustNotDo.length + preferredApproaches.length) > 1 ? 's' : ''})
            </span>
          )}
        </span>
      ),
      children: constraintsContent,
    },
    {
      key: 'success',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Success Criteria
          {hasSuccess && (
            <span style={{ marginLeft: '8px', color: '#6b7280', fontWeight: 400 }}>
              ({functionalSuccess.length + technicalSuccess.length + businessSuccess.length} criteria)
            </span>
          )}
        </span>
      ),
      children: successContent,
    },
    {
      key: 'migration',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Migration Strategy
          {hasMigration && <CheckCircleFilled style={{ color: '#52c41a', marginLeft: '8px' }} />}
        </span>
      ),
      children: migrationContent,
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
        6. Quality, Testing & Implementation
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
