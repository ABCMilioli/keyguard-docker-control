
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

console.log('Iniciando aplicação...');

const rootElement = document.getElementById("root");
console.log('Root element:', rootElement);

if (rootElement) {
  createRoot(rootElement).render(<App />);
  console.log('App renderizada com sucesso');
} else {
  console.error('Elemento root não encontrado!');
}
