
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Users, Shield } from 'lucide-react';

interface PhaseCardProps {
  phase: {
    id: number;
    title: string;
    duration: string;
    priority: string;
    tasks: string[];
    deliverables: string[];
  };
  isCompleted: boolean;
  onToggle: (phaseId: number) => void;
}

const PhaseCard = ({ phase, isCompleted, onToggle }: PhaseCardProps) => {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggle(phase.id)}
              className="flex-shrink-0"
            >
              {isCompleted ? (
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
  );
};

export default PhaseCard;
