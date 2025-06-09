
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useAPIKeyStore } from '../../stores/apiKeyStore';
import { useToast } from '@/hooks/use-toast';

export function CreateAPIKeyModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientEmail: '',
    maxInstallations: '',
    expiresAt: ''
  });

  const { clients, addAPIKey } = useAPIKeyStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.clientEmail || !formData.maxInstallations) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    addAPIKey({
      clientId: formData.clientId || Math.random().toString(36).substr(2, 9),
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      maxInstallations: parseInt(formData.maxInstallations),
      currentInstallations: 0,
      isActive: true,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null
    });

    toast({
      title: "Sucesso",
      description: "Nova chave API criada com sucesso",
    });

    setOpen(false);
    setFormData({
      clientId: '',
      clientName: '',
      clientEmail: '',
      maxInstallations: '',
      expiresAt: ''
    });
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData({
        ...formData,
        clientId,
        clientName: client.name,
        clientEmail: client.email
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Chave API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Chave API</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Cliente Existente (Opcional)</Label>
            <Select onValueChange={handleClientSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar cliente existente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente *</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="Ex: TechCorp Ltd"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email do Cliente *</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              placeholder="admin@techcorp.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxInstallations">Limite de Instalações *</Label>
            <Input
              id="maxInstallations"
              type="number"
              value={formData.maxInstallations}
              onChange={(e) => setFormData({ ...formData, maxInstallations: e.target.value })}
              placeholder="50"
              min="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Data de Expiração (Opcional)</Label>
            <Input
              id="expiresAt"
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Chave API
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
