import { useFormContext } from 'react-hook-form';
import { Input, Button, Space, Card, Collapse } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { TransformationSpec } from '../../types';

export default function DependenciesStep() {
  const { watch, setValue } = useFormContext<TransformationSpec>();
  const internalDependencies = watch('internalDependencies') || [];
  const externalSystems = watch('externalSystems') || [];

  const addInternalDep = () => {
    setValue('internalDependencies', [
      ...internalDependencies,
      { name: '', purpose: '', location: '', notes: '' },
    ]);
  };

  const removeInternalDep = (index: number) => {
    setValue('internalDependencies', internalDependencies.filter((_, i) => i !== index));
  };

  const updateInternalDep = (index: number, field: keyof typeof internalDependencies[0], value: string) => {
    const updated = [...internalDependencies];
    updated[index][field] = value;
    setValue('internalDependencies', updated);
  };

  const addExternalSystem = () => {
    setValue('externalSystems', [
      ...externalSystems,
      { name: '', connectionType: '', purpose: '', notes: '' },
    ]);
  };

  const removeExternalSystem = (index: number) => {
    setValue('externalSystems', externalSystems.filter((_, i) => i !== index));
  };

  const updateExternalSystem = (index: number, field: keyof typeof externalSystems[0], value: string) => {
    const updated = [...externalSystems];
    updated[index][field] = value;
    setValue('externalSystems', updated);
  };

  const collapseItems = [
    {
      key: 'internal-deps',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          Internal Dependencies
          {internalDependencies.length > 0 && (
            <span style={{ marginLeft: '8px', color: '#6b7280', fontWeight: 400 }}>
              ({internalDependencies.length} item{internalDependencies.length > 1 ? 's' : ''})
            </span>
          )}
        </span>
      ),
      extra: (
        <Button 
          type="dashed" 
          size="small"
          icon={<PlusOutlined />} 
          onClick={(e) => { e.stopPropagation(); addInternalDep(); }}
        >
          Add
        </Button>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {internalDependencies.map((dep, index) => (
            <Card key={index} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  value={dep.name}
                  onChange={(e) => updateInternalDep(index, 'name', e.target.value)}
                  placeholder="e.g., shared-utils, auth-service, common-lib"
                />
                <Input
                  value={dep.purpose}
                  onChange={(e) => updateInternalDep(index, 'purpose', e.target.value)}
                  placeholder="Purpose"
                />
                <Input
                  value={dep.location}
                  onChange={(e) => updateInternalDep(index, 'location', e.target.value)}
                  placeholder="Location/URL"
                />
                <Input
                  value={dep.notes}
                  onChange={(e) => updateInternalDep(index, 'notes', e.target.value)}
                  placeholder="Notes"
                />
                <Button danger icon={<DeleteOutlined />} onClick={() => removeInternalDep(index)} block>
                  Remove
                </Button>
              </Space>
            </Card>
          ))}
          {internalDependencies.length === 0 && (
            <div className="help-text">
              No internal dependencies added. Click "Add" to add dependencies.
            </div>
          )}
        </Space>
      ),
    },
    {
      key: 'external-systems',
      label: (
        <span style={{ fontWeight: 600, fontSize: '14px' }}>
          External Systems
          {externalSystems.length > 0 && (
            <span style={{ marginLeft: '8px', color: '#6b7280', fontWeight: 400 }}>
              ({externalSystems.length} system{externalSystems.length > 1 ? 's' : ''})
            </span>
          )}
        </span>
      ),
      extra: (
        <Button 
          type="dashed" 
          size="small"
          icon={<PlusOutlined />} 
          onClick={(e) => { e.stopPropagation(); addExternalSystem(); }}
        >
          Add
        </Button>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {externalSystems.map((sys, index) => (
            <Card key={index} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  value={sys.name}
                  onChange={(e) => updateExternalSystem(index, 'name', e.target.value)}
                  placeholder="System name (e.g., SQL Server, AWS S3)"
                />
                <Input
                  value={sys.connectionType}
                  onChange={(e) => updateExternalSystem(index, 'connectionType', e.target.value)}
                  placeholder="Connection type (e.g., EF Core, REST API)"
                />
                <Input
                  value={sys.purpose}
                  onChange={(e) => updateExternalSystem(index, 'purpose', e.target.value)}
                  placeholder="Purpose"
                />
                <Input
                  value={sys.notes}
                  onChange={(e) => updateExternalSystem(index, 'notes', e.target.value)}
                  placeholder="Notes"
                />
                <Button danger icon={<DeleteOutlined />} onClick={() => removeExternalSystem(index)} block>
                  Remove
                </Button>
              </Space>
            </Card>
          ))}
          {externalSystems.length === 0 && (
            <div className="help-text">
              No external systems added. Click "Add" to add external systems.
            </div>
          )}
        </Space>
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
        4. Dependencies & Integrations
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
