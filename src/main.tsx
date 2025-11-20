import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // <-- Importamos la App
import { HashRouter } from 'react-router-dom' // <-- Importamos el Router
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
