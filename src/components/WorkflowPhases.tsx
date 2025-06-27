
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Database, Code } from 'lucide-react';
import PhaseCard from './PhaseCard';
import DatabaseSchema from './DatabaseSchema';
import SystemArchitecture from './SystemArchitecture';
import { phases } from '@/data/phases';

const WorkflowPhases = () => {
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);

  const togglePhase = (phaseId: number) => {
    setCompletedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

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
              <PhaseCard
                key={phase.id}
                phase={phase}
                isCompleted={completedPhases.includes(phase.id)}
                onToggle={togglePhase}
              />
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

export default WorkflowPhases;
