import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useAPIKeyStore } from '@/stores/apiKeyStore';

export function CreateAPIKeyModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    maxInstallations: 10,
    expiresAt: '',
  });

  const addAPIKey = useAPIKeyStore((state) => state.addAPIKey);
  const clients = useAPIKeyStore((state) => state.clients);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find or create client
    const client = clients.find(c => c.email === formData.clientEmail);
    const clientId = client?.id || Math.random().toString(36).substr(2, 9);

    addAPIKey({
      clientId,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      maxInstallations: formData.maxInstallations,
      currentInstallations: 0,
      isActive: true,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
    });

    setOpen(false);
    setFormData({
      clientName: '',
      clientEmail: '',
      maxInstallations: 10,
      expiresAt: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Chave API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Chave API</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Email do Cliente</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="maxInstallations">Limite de Instalações</Label>
            <Input
              id="maxInstallations"
              type="number"
              min="1"
              value={formData.maxInstallations}
              onChange={(e) => setFormData(prev => ({ ...prev, maxInstallations: parseInt(e.target.value) }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="expiresAt">Data de Expiração (opcional)</Label>
            <Input
              id="expiresAt"
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
            />
          </div>
          <Button type="submit" className="w-full">
            Criar Chave API
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
