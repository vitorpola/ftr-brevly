import { createRoot } from 'react-dom/client'
import './style.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { LinksProvider } from './contexts/LinksContext'
import { Home } from './pages/home'
import { NotFound } from './pages/not_found'
import { Redirect } from './pages/redirect'

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <LinksProvider>
     <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/url/not-found" element={<NotFound />} />
          <Route path="/:shortUrl" element={<Redirect />} />
        </Routes>
      </BrowserRouter>
    </LinksProvider>
  );
}
