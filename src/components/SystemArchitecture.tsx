
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code } from 'lucide-react';
import ArchitecturePrinciples from './ArchitecturePrinciples';

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

      <ArchitecturePrinciples />
    </div>
  );
};

export default SystemArchitecture;
