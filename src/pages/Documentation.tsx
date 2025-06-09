
import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Book, Key, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Documentation() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado!',
      description: 'Código copiado para o clipboard.',
    });
  };

  const codeExamples = {
    curl: `curl -X POST https://api.dockercontrol.com/validate \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "ak_1234567890abcdef1234567890abcdef",
    "ipAddress": "192.168.1.100"
  }'`,
    python: `import requests

def validate_api_key(api_key, ip_address=None):
    url = "https://api.dockercontrol.com/validate"
    payload = {
        "apiKey": api_key,
        "ipAddress": ip_address
    }
    
    response = requests.post(url, json=payload)
    return response.json()

# Exemplo de uso
result = validate_api_key("ak_1234567890abcdef1234567890abcdef")
if result["success"]:
    print("Chave válida! Instalações restantes:", result.get("installationsLeft"))
else:
    print("Erro:", result["message"])`,
    nodejs: `const axios = require('axios');

async function validateApiKey(apiKey, ipAddress = null) {
  try {
    const response = await axios.post('https://api.dockercontrol.com/validate', {
      apiKey: apiKey,
      ipAddress: ipAddress
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro na validação:', error.response?.data || error.message);
    return { success: false, message: 'Erro de conexão' };
  }
}

// Exemplo de uso
validateApiKey('ak_1234567890abcdef1234567890abcdef')
  .then(result => {
    if (result.success) {
      console.log('Chave válida! Instalações restantes:', result.installationsLeft);
    } else {
      console.log('Erro:', result.message);
    }
  });`
  };

  return (
    <AppLayout title="Documentação" subtitle="Guia completo da API de validação">
      <div className="space-y-6">
        {/* Introdução */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="h-5 w-5 mr-2" />
              Introdução
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              O Docker API Control permite validar chaves de API para controlar a distribuição
              de aplicações Docker. Esta documentação explica como integrar a validação em 
              sua aplicação.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">URL Base da API</h4>
              <code className="text-blue-800">https://api.dockercontrol.com</code>
            </div>
          </CardContent>
        </Card>

        {/* Endpoint de Validação */}
        <Card>
          <CardHeader>
            <CardTitle>Endpoint de Validação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">POST</Badge>
              <code>/validate</code>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Parâmetros de Entrada</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Campo</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Obrigatório</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">apiKey</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">Sim</td>
                      <td className="border border-gray-300 px-4 py-2">Chave API a ser validada</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">ipAddress</td>
                      <td className="border border-gray-300 px-4 py-2">string</td>
                      <td className="border border-gray-300 px-4 py-2">Não</td>
                      <td className="border border-gray-300 px-4 py-2">IP da instalação (para logs)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Resposta de Sucesso</h4>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
{`{
  "success": true,
  "message": "Chave válida",
  "installationsLeft": 27
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Resposta de Erro</h4>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
{`{
  "success": false,
  "message": "Chave API inválida"
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Códigos de Erro */}
        <Card>
          <CardHeader>
            <CardTitle>Códigos de Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium">Chave API inválida</span>
                <Badge variant="destructive">400</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium">Chave API revogada</span>
                <Badge variant="destructive">403</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium">Chave API expirada</span>
                <Badge variant="destructive">403</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium">Limite de instalações atingido</span>
                <Badge variant="destructive">429</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exemplos de Código */}
        <Card>
          <CardHeader>
            <CardTitle>Exemplos de Código</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* cURL */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">cURL</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(codeExamples.curl)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {codeExamples.curl}
              </pre>
            </div>

            {/* Python */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Python</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(codeExamples.python)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {codeExamples.python}
              </pre>
            </div>

            {/* Node.js */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Node.js</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(codeExamples.nodejs)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {codeExamples.nodejs}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Formato das Chaves */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Formato das Chaves API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              As chaves API seguem um formato específico para garantir unicidade e segurança:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <code className="text-lg">ak_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</code>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Prefixo: <code>ak_</code> (API Key)</li>
              <li>28 caracteres alfanuméricos</li>
              <li>Total: 32 caracteres</li>
              <li>Geradas criptograficamente</li>
            </ul>
          </CardContent>
        </Card>

        {/* Boas Práticas */}
        <Card>
          <CardHeader>
            <CardTitle>Boas Práticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-900">Segurança</h4>
                <p className="text-gray-600">
                  Nunca exponha chaves API em código fonte público. Use variáveis de ambiente.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-900">Cache</h4>
                <p className="text-gray-600">
                  Implemente cache local para reduzir chamadas desnecessárias à API.
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-yellow-900">Tratamento de Erros</h4>
                <p className="text-gray-600">
                  Sempre trate erros de rede e respostas de falha adequadamente.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-900">Logs</h4>
                <p className="text-gray-600">
                  Forneça o IP da instalação para melhor rastreamento e auditoria.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
