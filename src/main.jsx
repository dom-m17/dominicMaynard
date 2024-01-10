import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <a href="/task/">Task</a>
    <a href="/src/vercelFile/">Vercel</a>
    <a href="/src/vercelFile/alternate.html">Alternate</a>
  </React.StrictMode>,
)
