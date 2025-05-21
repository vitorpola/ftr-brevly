import { createRoot } from 'react-dom/client'
import './style.css'
import { Home } from './pages/home'

createRoot(document.getElementById('root')!).render(
  <Home />
)
