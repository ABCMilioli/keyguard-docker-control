
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  console.log('NotFound page renderizando...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Página não encontrada</CardTitle>
          <CardDescription>
            A página que você está procurando não existe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/">
            <Button className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
