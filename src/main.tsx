import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SMProvider } from './context/smContext.tsx';

document.body.style.margin = '0';
document.body.style.padding = '0';  
document.body.style.backgroundColor = 'rgb(11, 11, 11)';
document.body.style.color = 'rgb(15, 165, 206)';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SMProvider>
      <App />
    </SMProvider>
  </StrictMode>,
)
