import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import EditCV from './pages/EditCV'

function App() {
  return (
    <>
      <div className="animated-bg" />
      <div className="grid-bg" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cv/:id/edit" element={<EditCV />} />
      </Routes>
    </>
  )
}

export default App

