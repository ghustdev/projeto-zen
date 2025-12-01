
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";


const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  console.error('Erro ao inicializar a aplicação:', error);
  // Fallback UI
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Erro ao carregar a aplicação</h1><p>Por favor, recarregue a página.</p></div>';
}
  