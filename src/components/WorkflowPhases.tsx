
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Database, Code, Users, Shield } from 'lucide-react';

const WorkflowPhases = () => {
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  const togglePhase = (phaseId: number) => {
    setCompletedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const phases = [
    {
      id: 1,
      title: "Phase 1: Project Setup & Architecture",
      duration: "Week 1-2",
      priority: "High",
      tasks: [
        "Initialize Spring Boot project with Maven/Gradle",
        "Set up project structure (MVC pattern)",
        "Configure application.properties/yml",
        "Set up MySQL/PostgreSQL database",
        "Configure Spring Security for authentication",
        "Set up logging (Logback/SLF4J)",
        "Initialize Git repository and branching strategy",
        "Set up development environment"
      ],
      deliverables: [
        "Project skeleton with basic configuration",
        "Database connection established",
        "Basic security configuration",
        "Development environment setup"
      ]
    },
    {
      id: 2,
      title: "Phase 2: Database Design & Core Entities",
      duration: "Week 2-3",
      priority: "High",
      tasks: [
        "Design complete database schema",
        "Create JPA entities for all tables",
        "Set up entity relationships and constraints",
        "Create database migration scripts",
        "Implement basic repositories",
        "Set up database seeding for initial data",
        "Create audit trail entities",
        "Implement soft delete functionality"
      ],
      deliverables: [
        "Complete database schema",
        "All JPA entities with relationships",
        "Repository layer implementation",
        "Database migration scripts"
      ]
    },
    {
      id: 3,
      title: "Phase 3: Authentication & Authorization",
      duration: "Week 3-4",
      priority: "High",
      tasks: [
        "Implement JWT-based authentication",
        "Create role-based access control (RBAC)",
        "Develop login/logout functionality",
        "Implement password encryption (BCrypt)",
        "Create user management services",
        "Set up session management",
        "Implement password reset functionality",
        "Add account lockout mechanism"
      ],
      deliverables: [
        "Complete authentication system",
        "Role-based authorization",
        "User management functionality",
        "Security middleware"
      ]
    },
    {
      id: 4,
      title: "Phase 4: KYC & Account Management",
      duration: "Week 4-6",
      priority: "High",
      tasks: [
        "Design KYC workflow and validation",
        "Implement document upload functionality",
        "Create account opening process",
        "Develop customer onboarding flow",
        "Implement account type management",
        "Create customer profile management",
        "Add document verification system",
        "Implement compliance checks"
      ],
      deliverables: [
        "KYC management system",
        "Account opening workflow",
        "Customer onboarding process",
        "Document management system"
      ]
    },
    {
      id: 5,
      title: "Phase 5: Core Banking Operations",
      duration: "Week 6-8",
      priority: "High",
      tasks: [
        "Implement deposit and withdrawal operations",
        "Create fund transfer functionality",
        "Develop balance inquiry services",
        "Implement transaction validation",
        "Create transaction history tracking",
        "Add transaction limits and controls",
        "Implement real-time balance updates",
        "Create transaction reconciliation"
      ],
      deliverables: [
        "Core banking transaction system",
        "Balance management",
        "Transaction processing engine",
        "Transaction validation rules"
      ]
    },
    {
      id: 6,
      title: "Phase 6: Savings & Fixed Deposit Management",
      duration: "Week 8-10",
      priority: "Medium",
      tasks: [
        "Design interest calculation algorithms",
        "Implement savings account management",
        "Create fixed deposit functionality",
        "Develop interest posting schedules",
        "Implement maturity calculations",
        "Create deposit renewal process",
        "Add interest rate management",
        "Implement penalty calculations"
      ],
      deliverables: [
        "Savings account management",
        "Fixed deposit system",
        "Interest calculation engine",
        "Automated interest posting"
      ]
    },
    {
      id: 7,
      title: "Phase 7: Reporting & Analytics",
      duration: "Week 10-11",
      priority: "Medium",
      tasks: [
        "Implement transaction reporting",
        "Create passbook generation",
        "Develop account statements",
        "Create filtering and search functionality",
        "Implement export functionality (PDF/Excel)",
        "Create dashboard analytics",
        "Add regulatory reporting",
        "Implement audit trail reports"
      ],
      deliverables: [
        "Comprehensive reporting system",
        "Passbook generation",
        "Account statements",
        "Analytics dashboard"
      ]
    },
    {
      id: 8,
      title: "Phase 8: API Development & Integration",
      duration: "Week 11-12",
      priority: "Medium",
      tasks: [
        "Create RESTful API endpoints",
        "Implement API documentation (Swagger)",
        "Add API versioning strategy",
        "Implement rate limiting",
        "Create API authentication",
        "Add error handling and validation",
        "Implement API testing",
        "Create integration guidelines"
      ],
      deliverables: [
        "Complete REST API",
        "API documentation",
        "Integration testing suite",
        "API security implementation"
      ]
    },
    {
      id: 9,
      title: "Phase 9: Testing & Quality Assurance",
      duration: "Week 12-14",
      priority: "High",
      tasks: [
        "Unit testing for all components",
        "Integration testing setup",
        "Security testing and penetration testing",
        "Performance testing and optimization",
        "User acceptance testing (UAT)",
        "Load testing for concurrent users",
        "Database performance optimization",
        "Code quality analysis"
      ],
      deliverables: [
        "Complete test suite",
        "Performance benchmarks",
        "Security audit report",
        "Quality assurance documentation"
      ]
    },
    {
      id: 10,
      title: "Phase 10: Deployment & Monitoring",
      duration: "Week 14-16",
      priority: "High",
      tasks: [
        "Set up production environment",
        "Configure CI/CD pipeline",
        "Implement application monitoring",
        "Set up log aggregation",
        "Configure backup strategies",
        "Implement health checks",
        "Create deployment documentation",
        "Set up alerting system"
      ],
      deliverables: [
        "Production deployment",
        "Monitoring and alerting system",
        "Backup and recovery procedures",
        "Deployment documentation"
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Core Banking System Development Workflow
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive step-by-step development guide for building a Core Banking System with Java Spring Boot
        </p>
      </div>

      <Tabs defaultValue="workflow" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Development Workflow
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database Schema
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            System Architecture
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-6">
          <div className="grid gap-6">
            {phases.map((phase) => (
              <Card key={phase.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className="flex-shrink-0"
                      >
                        {completedPhases.includes(phase.id) ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                      <div>
                        <CardTitle className="text-xl">{phase.title}</CardTitle>
                        <CardDescription className="text-sm">
                          Duration: {phase.duration}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={phase.priority === 'High' ? 'destructive' : 'secondary'}>
                      {phase.priority} Priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Key Tasks
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Deliverables
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.deliverables.map((deliverable, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <DatabaseSchema />
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <SystemArchitecture />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DatabaseSchema = () => {
  const tables = [
    {
      name: "users",
      description: "Core user authentication table",
      columns: [
        { name: "user_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "username", type: "VARCHAR(50)", constraints: "UNIQUE, NOT NULL" },
        { name: "email", type: "VARCHAR(100)", constraints: "UNIQUE, NOT NULL" },
        { name: "password_hash", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "role", type: "ENUM('ADMIN', 'CUSTOMER')", constraints: "NOT NULL" },
        { name: "is_active", type: "BOOLEAN", constraints: "DEFAULT TRUE" },
        { name: "last_login", type: "TIMESTAMP", constraints: "NULL" },
        { name: "failed_login_attempts", type: "INT", constraints: "DEFAULT 0" },
        { name: "account_locked_until", type: "TIMESTAMP", constraints: "NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "customers",
      description: "Customer profile and KYC information",
      columns: [
        { name: "customer_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "user_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES users(user_id)" },
        { name: "first_name", type: "VARCHAR(50)", constraints: "NOT NULL" },
        { name: "last_name", type: "VARCHAR(50)", constraints: "NOT NULL" },
        { name: "date_of_birth", type: "DATE", constraints: "NOT NULL" },
        { name: "gender", type: "ENUM('MALE', 'FEMALE', 'OTHER')", constraints: "NOT NULL" },
        { name: "phone_number", type: "VARCHAR(15)", constraints: "UNIQUE, NOT NULL" },
        { name: "address_line1", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "address_line2", type: "VARCHAR(255)", constraints: "NULL" },
        { name: "city", type: "VARCHAR(100)", constraints: "NOT NULL" },
        { name: "state", type: "VARCHAR(100)", constraints: "NOT NULL" },
        { name: "postal_code", type: "VARCHAR(10)", constraints: "NOT NULL" },
        { name: "country", type: "VARCHAR(100)", constraints: "DEFAULT 'India'" },
        { name: "kyc_status", type: "ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED')", constraints: "DEFAULT 'PENDING'" },
        { name: "kyc_documents", type: "JSON", constraints: "NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "accounts",
      description: "Bank account information",
      columns: [
        { name: "account_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "account_number", type: "VARCHAR(20)", constraints: "UNIQUE, NOT NULL" },
        { name: "customer_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES customers(customer_id)" },
        { name: "account_type", type: "ENUM('SAVINGS', 'CURRENT', 'FIXED_DEPOSIT')", constraints: "NOT NULL" },
        { name: "balance", type: "DECIMAL(15,2)", constraints: "DEFAULT 0.00" },
        { name: "minimum_balance", type: "DECIMAL(10,2)", constraints: "DEFAULT 0.00" },
        { name: "interest_rate", type: "DECIMAL(5,4)", constraints: "DEFAULT 0.0000" },
        { name: "status", type: "ENUM('ACTIVE', 'INACTIVE', 'CLOSED', 'FROZEN')", constraints: "DEFAULT 'ACTIVE'" },
        { name: "opening_date", type: "DATE", constraints: "NOT NULL" },
        { name: "closing_date", type: "DATE", constraints: "NULL" },
        { name: "branch_code", type: "VARCHAR(10)", constraints: "NOT NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "transactions",
      description: "All banking transactions",
      columns: [
        { name: "transaction_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "transaction_reference", type: "VARCHAR(50)", constraints: "UNIQUE, NOT NULL" },
        { name: "account_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES accounts(account_id)" },
        { name: "transaction_type", type: "ENUM('DEBIT', 'CREDIT')", constraints: "NOT NULL" },
        { name: "amount", type: "DECIMAL(15,2)", constraints: "NOT NULL" },
        { name: "balance_after", type: "DECIMAL(15,2)", constraints: "NOT NULL" },
        { name: "description", type: "VARCHAR(255)", constraints: "NOT NULL" },
        { name: "transaction_mode", type: "ENUM('CASH', 'CHEQUE', 'ONLINE', 'TRANSFER', 'ATM')", constraints: "NOT NULL" },
        { name: "reference_number", type: "VARCHAR(100)", constraints: "NULL" },
        { name: "beneficiary_account", type: "VARCHAR(20)", constraints: "NULL" },
        { name: "beneficiary_name", type: "VARCHAR(100)", constraints: "NULL" },
        { name: "status", type: "ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')", constraints: "DEFAULT 'COMPLETED'" },
        { name: "created_by", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES users(user_id)" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "fixed_deposits",
      description: "Fixed deposit account details",
      columns: [
        { name: "fd_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "fd_number", type: "VARCHAR(20)", constraints: "UNIQUE, NOT NULL" },
        { name: "customer_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES customers(customer_id)" },
        { name: "principal_amount", type: "DECIMAL(15,2)", constraints: "NOT NULL" },
        { name: "interest_rate", type: "DECIMAL(5,4)", constraints: "NOT NULL" },
        { name: "tenure_months", type: "INT", constraints: "NOT NULL" },
        { name: "maturity_amount", type: "DECIMAL(15,2)", constraints: "NOT NULL" },
        { name: "start_date", type: "DATE", constraints: "NOT NULL" },
        { name: "maturity_date", type: "DATE", constraints: "NOT NULL" },
        { name: "status", type: "ENUM('ACTIVE', 'MATURED', 'PREMATURE_CLOSURE')", constraints: "DEFAULT 'ACTIVE'" },
        { name: "nomination_details", type: "JSON", constraints: "NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" },
        { name: "updated_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "interest_postings",
      description: "Interest calculation and posting records",
      columns: [
        { name: "posting_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "account_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES accounts(account_id)" },
        { name: "posting_date", type: "DATE", constraints: "NOT NULL" },
        { name: "interest_amount", type: "DECIMAL(10,2)", constraints: "NOT NULL" },
        { name: "balance_for_calculation", type: "DECIMAL(15,2)", constraints: "NOT NULL" },
        { name: "interest_rate_applied", type: "DECIMAL(5,4)", constraints: "NOT NULL" },
        { name: "days_calculated", type: "INT", constraints: "NOT NULL" },
        { name: "status", type: "ENUM('CALCULATED', 'POSTED')", constraints: "DEFAULT 'CALCULATED'" },
        { name: "transaction_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES transactions(transaction_id), NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "audit_logs",
      description: "System audit trail",
      columns: [
        { name: "log_id", type: "BIGINT", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "user_id", type: "BIGINT", constraints: "FOREIGN KEY REFERENCES users(user_id)" },
        { name: "action", type: "VARCHAR(100)", constraints: "NOT NULL" },
        { name: "resource_type", type: "VARCHAR(50)", constraints: "NOT NULL" },
        { name: "resource_id", type: "VARCHAR(50)", constraints: "NOT NULL" },
        { name: "old_values", type: "JSON", constraints: "NULL" },
        { name: "new_values", type: "JSON", constraints: "NULL" },
        { name: "ip_address", type: "VARCHAR(45)", constraints: "NULL" },
        { name: "user_agent", type: "TEXT", constraints: "NULL" },
        { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT CURRENT_TIMESTAMP" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Database Schema Design</h2>
        <p className="text-muted-foreground">
          Comprehensive database schema for the Core Banking System
        </p>
      </div>
      
      <div className="grid gap-6">
        {tables.map((table, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                {table.name}
              </CardTitle>
              <CardDescription>{table.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Column Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Data Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Constraints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((column, colIdx) => (
                      <tr key={colIdx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                          {column.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                          {column.type}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          {column.constraints}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SystemArchitecture = () => {
  const architectureComponents = [
    {
      layer: "Presentation Layer",
      components: [
        "REST Controllers",
        "Request/Response DTOs",
        "Exception Handlers",
        "Input Validation",
        "API Documentation (Swagger)"
      ],
      technologies: ["Spring MVC", "Spring Validation", "Swagger/OpenAPI"]
    },
    {
      layer: "Security Layer",
      components: [
        "Authentication Filter",
        "Authorization Manager",
        "JWT Token Provider",
        "Password Encoder",
        "CORS Configuration"
      ],
      technologies: ["Spring Security", "JWT", "BCrypt"]
    },
    {
      layer: "Service Layer",
      components: [
        "Business Logic Services",
        "Transaction Management",
        "Interest Calculation Engine",
        "Notification Services",
        "Audit Service"
      ],
      technologies: ["Spring Service", "@Transactional", "Spring Events"]
    },
    {
      layer: "Data Access Layer",
      components: [
        "JPA Repositories",
        "Custom Query Methods",
        "Database Configurations",
        "Connection Pooling",
        "Migration Scripts"
      ],
      technologies: ["Spring Data JPA", "Hibernate", "Flyway/Liquibase"]
    },
    {
      layer: "Infrastructure Layer",
      components: [
        "Configuration Management",
        "Logging Framework",
        "Caching Layer",
        "Monitoring & Metrics",
        "File Storage Service"
      ],
      technologies: ["Spring Boot", "Logback", "Redis", "Micrometer"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">System Architecture</h2>
        <p className="text-muted-foreground">
          Layered architecture design for the Core Banking System
        </p>
      </div>
      
      <div className="grid gap-6">
        {architectureComponents.map((layer, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                {layer.layer}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {layer.technologies.map((tech, techIdx) => (
                  <Badge key={techIdx} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {layer.components.map((component, compIdx) => (
                  <li key={compIdx} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    {component}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Key Architecture Principles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Design Patterns</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  MVC (Model-View-Controller)
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Repository Pattern
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Service Layer Pattern
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  DTO Pattern
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">SOLID Principles</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Single Responsibility
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Open/Closed Principle
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Dependency Inversion
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Interface Segregation
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowPhases;
