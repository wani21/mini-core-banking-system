
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ArchitecturePrinciples = () => {
  return (
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
  );
};

export default ArchitecturePrinciples;
