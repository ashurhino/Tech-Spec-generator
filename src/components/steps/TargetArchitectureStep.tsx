import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, Button, Space, Collapse, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { TransformationSpec } from '../../types';

const { TextArea } = Input;

// Suggested layer templates for modern modular apps
const LAYER_TEMPLATES = {
  cleanArchitecture: [
    {
      name: 'Domain Layer',
      description: `Core business entities and value objects
Domain events and aggregates
Business rules and invariants
Repository interfaces (contracts only)
Domain services for complex business logic`
    },
    {
      name: 'Application Layer',
      description: `Use cases / Application services
Command and Query handlers (CQRS pattern)
DTOs for input/output
Validation logic (FluentValidation)
Application-level interfaces`
    },
    {
      name: 'Infrastructure Layer',
      description: `Database context and configurations
Repository implementations
External service integrations
Caching implementations
Message queue handlers
File storage services`
    },
    {
      name: 'Presentation Layer',
      description: `API Controllers / Endpoints
Request/Response models
Authentication middleware
API versioning
Swagger/OpenAPI documentation
Error handling middleware`
    },
  ],
  microservices: [
    {
      name: 'API Gateway',
      description: `Request routing and load balancing
Authentication and authorization
Rate limiting and throttling
Request/Response transformation
API composition`
    },
    {
      name: 'Service Layer',
      description: `Individual microservices
Service-specific business logic
Local data stores
Event publishing/subscribing
Health check endpoints`
    },
    {
      name: 'Shared Kernel',
      description: `Common domain models
Shared contracts and interfaces
Cross-cutting concerns
Common utilities and helpers
Message contracts`
    },
    {
      name: 'Infrastructure',
      description: `Service discovery
Configuration management
Distributed logging
Monitoring and tracing
Container orchestration`
    },
  ],
  modular: [
    {
      name: 'Core Module',
      description: `Shared domain entities
Common interfaces and abstractions
Cross-module events
Base classes and utilities`
    },
    {
      name: 'Feature Modules',
      description: `Self-contained feature implementations
Module-specific entities and logic
Internal APIs and services
Module configuration`
    },
    {
      name: 'Integration Layer',
      description: `Inter-module communication
Event bus implementation
Shared database access
External API clients`
    },
    {
      name: 'Host/Composition',
      description: `Application startup and configuration
Dependency injection setup
Module registration
Middleware pipeline`
    },
  ],
  // AWS Templates
  awsServerless: [
    {
      name: 'API Layer (API Gateway)',
      description: `Amazon API Gateway REST/HTTP APIs
Request validation and transformation
API keys and usage plans
Custom authorizers (Lambda/Cognito)
Request/Response mapping templates`
    },
    {
      name: 'Compute Layer (Lambda)',
      description: `AWS Lambda functions for business logic
Lambda layers for shared code
Step Functions for orchestration
EventBridge rules for scheduling
Cold start optimization strategies`
    },
    {
      name: 'Data Layer',
      description: `Amazon DynamoDB tables and indexes
Amazon RDS (Aurora Serverless)
Amazon S3 for object storage
ElastiCache for caching
Amazon OpenSearch for search`
    },
    {
      name: 'Integration Layer',
      description: `Amazon SQS for message queuing
Amazon SNS for pub/sub notifications
Amazon EventBridge for event routing
AWS AppSync for GraphQL APIs
Amazon MQ for message brokering`
    },
    {
      name: 'Security & Auth',
      description: `Amazon Cognito user pools
IAM roles and policies
AWS Secrets Manager
AWS KMS for encryption
VPC and security groups`
    },
  ],
  awsContainers: [
    {
      name: 'Load Balancing Layer',
      description: `Application Load Balancer (ALB)
Target groups and health checks
SSL/TLS termination
Path-based routing
AWS WAF integration`
    },
    {
      name: 'Container Orchestration',
      description: `Amazon ECS/EKS clusters
Task definitions and services
Auto-scaling policies
Service discovery (Cloud Map)
Fargate for serverless containers`
    },
    {
      name: 'Application Services',
      description: `Containerized microservices
Sidecar patterns (Envoy, X-Ray)
Service mesh (App Mesh)
Container health checks
Blue/green deployments`
    },
    {
      name: 'Data & Storage',
      description: `Amazon RDS (PostgreSQL/MySQL)
Amazon ElastiCache (Redis)
Amazon EFS for shared storage
Amazon S3 for static assets
Database migration (DMS)`
    },
    {
      name: 'Observability',
      description: `Amazon CloudWatch logs and metrics
AWS X-Ray for distributed tracing
Container Insights
Custom dashboards and alarms
Log aggregation and analysis`
    },
  ],
  awsEventDriven: [
    {
      name: 'Event Sources',
      description: `Amazon EventBridge event bus
S3 event notifications
DynamoDB Streams
Kinesis Data Streams
IoT Core rules`
    },
    {
      name: 'Event Processing',
      description: `Lambda event handlers
Step Functions workflows
Kinesis Data Analytics
Event filtering and routing
Dead letter queues (DLQ)`
    },
    {
      name: 'Event Storage',
      description: `EventBridge archive and replay
Kinesis Data Firehose
S3 event lake
DynamoDB event store
Timestream for time-series`
    },
    {
      name: 'Messaging',
      description: `Amazon SQS (Standard/FIFO)
Amazon SNS topics
Amazon MQ (RabbitMQ/ActiveMQ)
Fan-out patterns
Message filtering`
    },
    {
      name: 'Saga Orchestration',
      description: `Step Functions state machines
Compensating transactions
Error handling and retries
Parallel execution
Human approval workflows`
    },
  ],
};

export default function TargetArchitectureStep() {
  const { control, watch, setValue } = useFormContext<TransformationSpec>();
  const layerStructure = watch('layerStructure') || [];
  const [activeKeys, setActiveKeys] = useState<string[]>(layerStructure.map((_, i) => `layer-${i}`));

  const addLayer = () => {
    const newIndex = layerStructure.length;
    setValue('layerStructure', [...layerStructure, { name: '', description: '' }]);
    setActiveKeys([...activeKeys, `layer-${newIndex}`]);
  };

  const removeLayer = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setValue('layerStructure', layerStructure.filter((_, i) => i !== index));
    setActiveKeys(activeKeys.filter(key => key !== `layer-${index}`).map(key => {
      const keyIndex = parseInt(key.split('-')[1]);
      return keyIndex > index ? `layer-${keyIndex - 1}` : key;
    }));
  };

  const updateLayer = (index: number, field: 'name' | 'description', value: string) => {
    const updated = [...layerStructure];
    updated[index][field] = value;
    setValue('layerStructure', updated);
  };

  const handleCollapseChange = (keys: string | string[]) => {
    setActiveKeys(Array.isArray(keys) ? keys : [keys]);
  };

  const expandAll = () => {
    setActiveKeys(layerStructure.map((_, i) => `layer-${i}`));
  };

  const collapseAll = () => {
    setActiveKeys([]);
  };

  const loadTemplate = (templateKey: keyof typeof LAYER_TEMPLATES) => {
    const template = LAYER_TEMPLATES[templateKey];
    setValue('layerStructure', template);
    setActiveKeys(template.map((_, i) => `layer-${i}`));
  };

  // Placeholder suggestions for empty layers
  const getPlaceholder = (index: number, field: 'name' | 'description') => {
    const suggestions = [
      { name: 'Domain Layer', description: 'Core entities, business rules, repository interfaces' },
      { name: 'Application Layer', description: 'Use cases, handlers, DTOs, validation' },
      { name: 'Infrastructure Layer', description: 'Database, external services, implementations' },
      { name: 'Presentation Layer', description: 'Controllers, middleware, API documentation' },
    ];
    const suggestion = suggestions[index % suggestions.length];
    return field === 'name' ? suggestion.name : suggestion.description;
  };

  // Handle Tab key to accept placeholder
  const handleKeyDown = (e: React.KeyboardEvent, index: number, field: 'name' | 'description', currentValue: string) => {
    if (e.key === 'Tab' && !currentValue) {
      e.preventDefault();
      updateLayer(index, field, getPlaceholder(index, field));
    }
  };

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
        3. Target Architecture
      </h2>

      <div className="form-section">
        <div className="form-section-title">Architectural Pattern</div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            Pattern <span style={{ color: 'red' }}>*</span>
          </label>
          <Controller
            name="architecturalPattern"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="e.g., Clean Architecture, Microservices, Modular Monolith"
                size="large"
              />
            )}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ fontWeight: 500 }}>
              Layer Structure
            </label>
            <Space size="small">
              {layerStructure.length > 0 && (
                <>
                  <Button size="small" type="link" onClick={expandAll}>
                    Expand All
                  </Button>
                  <Button size="small" type="link" onClick={collapseAll}>
                    Collapse All
                  </Button>
                </>
              )}
            </Space>
          </div>

          {/* Template buttons */}
          {layerStructure.length === 0 && (
            <div style={{ 
              background: '#f8fafc', 
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              {/* Standard Architecture Templates */}
              <div style={{ 
                fontSize: '13px', 
                color: '#64748b', 
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ThunderboltOutlined />
                Quick start with a template:
              </div>
              <Space wrap size="small">
                <Tooltip title="Domain, Application, Infrastructure, Presentation layers">
                  <Button 
                    size="small" 
                    onClick={() => loadTemplate('cleanArchitecture')}
                    style={{ borderColor: '#10b981', color: '#10b981' }}
                  >
                    Clean Architecture
                  </Button>
                </Tooltip>
                <Tooltip title="API Gateway, Services, Shared Kernel, Infrastructure">
                  <Button 
                    size="small" 
                    onClick={() => loadTemplate('microservices')}
                    style={{ borderColor: '#6366f1', color: '#6366f1' }}
                  >
                    Microservices
                  </Button>
                </Tooltip>
                <Tooltip title="Core, Feature Modules, Integration, Host">
                  <Button 
                    size="small" 
                    onClick={() => loadTemplate('modular')}
                    style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                  >
                    Modular Monolith
                  </Button>
                </Tooltip>
              </Space>

              {/* AWS Architecture Templates */}
              <div style={{ 
                fontSize: '13px', 
                color: '#475569', 
                marginTop: '16px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '14px'
              }}>
                <svg width="28" height="17" viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.8 32.4C22.8 33.2 22.9 33.8 23.1 34.2C23.3 34.6 23.6 35 24 35.5C24.1 35.7 24.2 35.8 24.2 36C24.2 36.3 24 36.5 23.6 36.8L21.8 38C21.5 38.2 21.2 38.3 21 38.3C20.7 38.3 20.4 38.1 20.1 37.8C19.7 37.4 19.4 36.9 19.1 36.4C18.8 35.9 18.5 35.3 18.2 34.6C16.1 37.1 13.5 38.4 10.3 38.4C8 38.4 6.2 37.8 4.8 36.5C3.4 35.2 2.7 33.5 2.7 31.4C2.7 29.2 3.5 27.4 5.2 26C6.9 24.6 9.1 23.9 11.9 23.9C12.9 23.9 13.9 24 15 24.2C16.1 24.4 17.2 24.7 18.4 25V23.1C18.4 21.2 18 19.8 17.2 19C16.4 18.2 15 17.8 13.1 17.8C12.1 17.8 11 18 9.9 18.3C8.8 18.6 7.7 19 6.6 19.5C6.2 19.7 5.9 19.8 5.7 19.9C5.5 20 5.4 20 5.3 20C4.9 20 4.7 19.7 4.7 19.2V17.5C4.7 17.1 4.8 16.8 4.9 16.6C5 16.4 5.3 16.2 5.7 16C6.8 15.4 8.1 14.9 9.5 14.5C10.9 14.1 12.4 13.9 14 13.9C17.1 13.9 19.4 14.6 20.9 16.1C22.4 17.5 23.1 19.7 23.1 22.5V32.4H22.8ZM11.7 34.7C12.6 34.7 13.6 34.5 14.7 34.1C15.8 33.7 16.8 33 17.5 32.1C18 31.6 18.3 31 18.5 30.3C18.7 29.6 18.8 28.7 18.8 27.7V26.5C17.9 26.3 16.9 26.1 15.9 26C14.9 25.9 14 25.8 13.1 25.8C11.2 25.8 9.9 26.1 8.9 26.9C7.9 27.7 7.5 28.7 7.5 30.1C7.5 31.4 7.8 32.4 8.5 33.1C9.2 33.8 10.3 34.7 11.7 34.7ZM35.4 38.1C35 38.1 34.7 38 34.5 37.9C34.3 37.8 34.1 37.5 34 37.1L27.4 16.8C27.3 16.5 27.2 16.3 27.2 16.1C27.2 15.7 27.4 15.5 27.8 15.5H30.6C31.1 15.5 31.4 15.6 31.6 15.7C31.8 15.8 31.9 16.1 32 16.5L36.6 33L40.9 16.5C41 16.1 41.1 15.9 41.3 15.7C41.5 15.5 41.9 15.5 42.3 15.5H44.6C45.1 15.5 45.4 15.6 45.6 15.7C45.8 15.8 46 16.1 46.1 16.5L50.4 33.2L55.2 16.5C55.3 16.1 55.5 15.8 55.6 15.7C55.8 15.6 56.1 15.5 56.5 15.5H59.2C59.6 15.5 59.8 15.7 59.8 16.1C59.8 16.2 59.8 16.3 59.7 16.5C59.6 16.7 59.6 16.8 59.6 16.9L52.8 37.2C52.7 37.6 52.5 37.9 52.3 38C52.1 38.1 51.8 38.2 51.4 38.2H48.9C48.4 38.2 48.1 38.1 47.9 38C47.7 37.9 47.5 37.6 47.4 37.2L43.2 21L39 37.1C38.9 37.5 38.7 37.8 38.5 37.9C38.3 38 38 38.1 37.5 38.1H35.4ZM70.6 38.6C69 38.6 67.4 38.4 65.9 38C64.4 37.6 63.2 37.1 62.5 36.5C62.1 36.2 61.8 35.9 61.8 35.6C61.8 35.2 61.9 34.9 62.1 34.6L63.1 32.7C63.3 32.3 63.5 32.1 63.8 32.1C64 32.1 64.3 32.2 64.7 32.5C65.6 33 66.6 33.4 67.7 33.7C68.8 34 70 34.2 71.1 34.2C72.8 34.2 74.1 33.9 75 33.3C75.9 32.7 76.3 31.9 76.3 30.8C76.3 30 76 29.4 75.5 28.9C75 28.4 74 28 72.5 27.5L68.6 26.4C66.4 25.7 64.8 24.7 63.8 23.4C62.8 22.1 62.3 20.7 62.3 19.2C62.3 18 62.6 16.9 63.2 15.9C63.8 14.9 64.5 14.1 65.5 13.4C66.5 12.7 67.5 12.2 68.8 11.9C70.1 11.6 71.4 11.4 72.8 11.4C73.5 11.4 74.3 11.5 75.1 11.6C75.9 11.7 76.6 11.9 77.3 12.1C78 12.3 78.6 12.5 79.1 12.8C79.6 13.1 80 13.3 80.2 13.6C80.4 13.9 80.6 14.1 80.6 14.4C80.6 14.8 80.5 15.1 80.3 15.4L79.4 17.2C79.2 17.5 79 17.8 78.7 17.8C78.5 17.8 78.2 17.7 77.8 17.5C76.5 16.9 75 16.6 73.2 16.6C71.7 16.6 70.5 16.9 69.6 17.4C68.7 17.9 68.3 18.7 68.3 19.7C68.3 20.5 68.7 21.2 69.3 21.7C69.9 22.2 71 22.7 72.5 23.1L76.3 24.2C78.5 24.8 80.1 25.8 81.1 27C82.1 28.2 82.6 29.7 82.6 31.4C82.6 32.6 82.3 33.8 81.8 34.8C81.3 35.8 80.5 36.7 79.6 37.4C78.7 38.1 77.5 38.6 76.2 39C74.6 38.4 72.7 38.6 70.6 38.6Z" fill="#232F3E"/>
                  <path d="M76.4 42.7C67.1 49.5 53.7 53 42.2 53C26.3 53 11.9 47.1 0.9 37C0.1 36.3 0.8 35.3 1.8 35.9C13.7 42.8 28.4 47 43.6 47C53.8 47 65 44.8 75.3 40.2C76.8 39.6 78.1 41.3 76.4 42.7Z" fill="#FF9900"/>
                  <path d="M80.1 38.5C79.1 37.2 73.5 37.9 71 38.2C70.2 38.3 70.1 37.6 70.8 37.1C75.3 34 82.5 34.9 83.4 35.9C84.3 36.9 83.2 44.1 79 48.2C78.4 48.8 77.8 48.5 78.1 47.8C79.1 45.3 81.1 39.8 80.1 38.5Z" fill="#FF9900"/>
                </svg>
                Cloud Architecture:
              </div>
              <Space wrap size="small">
                <Tooltip title="API Gateway, Lambda, DynamoDB, SQS/SNS, Cognito">
                  <Button 
                    size="small" 
                    onClick={() => loadTemplate('awsServerless')}
                    style={{ borderColor: '#0ea5e9', color: '#0ea5e9' }}
                  >
                    AWS Serverless
                  </Button>
                </Tooltip>
                <Tooltip title="ALB, ECS/EKS, RDS, ElastiCache, CloudWatch">
                  <Button 
                    size="small" 
                    onClick={() => loadTemplate('awsContainers')}
                    style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
                  >
                    AWS Containers
                  </Button>
                </Tooltip>
                <Tooltip title="EventBridge, Lambda, Step Functions, SQS/SNS, Kinesis">
                  <Button 
                    size="small" 
                    onClick={() => loadTemplate('awsEventDriven')}
                    style={{ borderColor: '#ec4899', color: '#ec4899' }}
                  >
                    AWS Event-Driven
                  </Button>
                </Tooltip>
              </Space>

              <div style={{ 
                fontSize: '11px', 
                color: '#94a3b8', 
                marginTop: '14px'
              }}>
                Or add layers manually below
              </div>
            </div>
          )}

          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {layerStructure.length > 0 && (
              <Collapse
                activeKey={activeKeys}
                onChange={handleCollapseChange}
                style={{ background: '#fafafa' }}
                items={layerStructure.map((layer, index) => ({
                  key: `layer-${index}`,
                  label: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <EditOutlined style={{ color: '#10b981', fontSize: '14px' }} />
                      <span style={{ 
                        fontWeight: 600, 
                        fontSize: '14px',
                        color: layer.name ? '#1f2937' : '#9ca3af'
                      }}>
                        {layer.name || 'Unnamed Layer'}
                      </span>
                      <span style={{ 
                        marginLeft: 'auto', 
                        fontSize: '12px', 
                        color: '#6b7280',
                        fontWeight: 400
                      }}>
                        {layer.description.split('\n').filter(l => l.trim()).length} items
                      </span>
                    </div>
                  ),
                  extra: (
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={(e) => removeLayer(index, e)}
                      style={{ marginLeft: '8px' }}
                    />
                  ),
                  children: (
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '6px', 
                          fontSize: '12px', 
                          fontWeight: 500,
                          color: '#6b7280'
                        }}>
                          Layer Name
                          {!layer.name && (
                            <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: '8px' }}>
                              (Press Tab to use suggestion)
                            </span>
                          )}
                        </label>
                        <Input
                          value={layer.name}
                          onChange={(e) => updateLayer(index, 'name', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'name', layer.name)}
                          placeholder={getPlaceholder(index, 'name')}
                          style={{ 
                            fontWeight: 600,
                            fontSize: '14px',
                            borderColor: layer.name ? '#10b981' : undefined
                          }}
                          size="middle"
                        />
                      </div>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '6px', 
                          fontSize: '12px', 
                          fontWeight: 500,
                          color: '#6b7280'
                        }}>
                          Layer Details (one item per line)
                          {!layer.description && (
                            <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: '8px' }}>
                              (Press Tab to use suggestion)
                            </span>
                          )}
                        </label>
                        <TextArea
                          value={layer.description}
                          onChange={(e) => updateLayer(index, 'description', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index, 'description', layer.description)}
                          placeholder={getPlaceholder(index, 'description')}
                          rows={5}
                          style={{ 
                            fontSize: '13px',
                            lineHeight: '1.6'
                          }}
                        />
                      </div>
                    </div>
                  ),
                  style: {
                    marginBottom: '8px',
                    borderLeft: '4px solid #10b981',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }
                }))}
              />
            )}
            <Button 
              icon={<PlusOutlined />} 
              onClick={addLayer} 
              block
              style={{
                borderStyle: 'dashed',
                height: '44px',
                fontWeight: 500
              }}
            >
              Add Layer
            </Button>
          </Space>
        </div>
      </div>

    </div>
  );
}
