import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <a href="/task/">Task</a><br></br>
    <a href="/project1/index.html">Project 1</a><br></br>
    <a href="/project2/index.html">Project 2</a><br></br>
  </React.StrictMode>,
)
