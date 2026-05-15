import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { TRPCProvider } from '@/providers/trpc'
import { ThemeProvider } from '@/providers/theme'
import './index.css'
import App from './App.tsx'
import SettingsPage from './pages/SettingsPage.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <TRPCProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </ThemeProvider>
    </TRPCProvider>
  </BrowserRouter>,
)
