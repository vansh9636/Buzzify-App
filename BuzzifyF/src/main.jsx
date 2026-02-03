
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ConstextProvider from './context/Context.jsx'

createRoot(document.getElementById('root')).render(
      <ConstextProvider>
        <App />
      </ConstextProvider>
)
