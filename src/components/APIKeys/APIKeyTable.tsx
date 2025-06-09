
import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { APIKey } from '../../types';
import { useAPIKeyStore } from '../../stores/apiKeyStore';

interface APIKeyTableProps {
  apiKeys: APIKey[];
}

export function APIKeyTable({ apiKeys }: APIKeyTableProps) {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { revokeAPIKey } = useAPIKeyStore();

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Sucesso",
        description: "Chave API copiada para a área de transferência",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Falha ao copiar chave API",
        variant: "destructive",
      });
    }
  };

  const handleRevokeKey = (keyId: string) => {
    revokeAPIKey(keyId);
    toast({
      title: "Chave Revogada",
      description: "A chave API foi revogada com sucesso",
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '••••••••••••••••••••••••';
  };

  const getStatusBadge = (apiKey: APIKey) => {
    if (!apiKey.isActive) {
      return <Badge variant="destructive">Inativa</Badge>;
    }
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return <Badge variant="destructive">Expirada</Badge>;
    }
    if (apiKey.currentInstallations >= apiKey.maxInstallations) {
      return <Badge variant="secondary">Limite Atingido</Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800">Ativa</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chave API</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Instalações</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead>Último Uso</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell className="font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <span className="select-all">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{apiKey.clientName}</div>
                  <div className="text-sm text-gray-500">{apiKey.clientEmail}</div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(apiKey)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{apiKey.currentInstallations}/{apiKey.maxInstallations}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(apiKey.currentInstallations / apiKey.maxInstallations) * 100}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {apiKey.createdAt.toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                {apiKey.lastUsed ? apiKey.lastUsed.toLocaleDateString('pt-BR') : 'Nunca'}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleRevokeKey(apiKey.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Revogar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
