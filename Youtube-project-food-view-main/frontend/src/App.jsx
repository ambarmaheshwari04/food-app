import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      {/* ⚠️ Global Premium Top-Center Fluid Alert Grid Container - Boosted to 5 Seconds */}
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <AppRoutes />
    </>
  )
}

export default App