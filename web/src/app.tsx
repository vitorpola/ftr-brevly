import { createRoot } from 'react-dom/client'
import './style.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LinksProvider } from './contexts/LinksContext'
import { Home } from './pages/home'
import { Redirect } from './pages/redirect'

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <LinksProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:shortUrl" element={<Redirect />} />
        </Routes>
      </BrowserRouter>
    </LinksProvider>
  );
}
