
export const phases = [
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
