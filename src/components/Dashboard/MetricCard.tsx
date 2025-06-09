
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  red: 'bg-red-50 text-red-600 border-red-200',
};

export function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {change && (
              <p className={cn(
                'text-sm mt-2 flex items-center',
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              )}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                <span className="text-gray-500 ml-1">vs. último mês</span>
              </p>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-lg border',
            colorClasses[color]
          )}>
            <Icon className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
