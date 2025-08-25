// Debug TypeScript build cache issues
console.log('🚀 App starting - TypeScript cache cleared');
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
