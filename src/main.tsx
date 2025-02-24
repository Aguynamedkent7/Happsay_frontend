import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
<<<<<<< HEAD
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SignupPage />
=======
import MainPage from './pages/MainPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainPage />
>>>>>>> fe669abc701aa8a987c2a0d46dc4e90297c38028
  </StrictMode>,
)
