import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AIPage from './pages/AIPage'
import FormatsPage from './pages/FormatsPage'

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
        <Route path="/ai" element={<AIPage />} />
        <Route path="/formats" element={<FormatsPage />} />
        <Route path="/export" element={<div className="min-h-screen p-8"><h1>Export</h1></div>} />
        {/* Modules à venir */}
        <Route path="/justweb" element={<div className="min-h-screen p-8"><h1>JustWeb - En développement</h1></div>} />
        <Route path="/justboost" element={<div className="min-h-screen p-8"><h1>JustBoost - En développement</h1></div>} />
        <Route path="/justpush" element={<div className="min-h-screen p-8"><h1>JustPush - En développement</h1></div>} />
        <Route path="/justfind" element={<div className="min-h-screen p-8"><h1>JustFind - En développement</h1></div>} />
        <Route path="/jobdone" element={<div className="min-h-screen p-8"><h1>JobDone - En développement</h1></div>} />
        <Route path="/justrpa" element={<div className="min-h-screen p-8"><h1>JustRPA - En développement</h1></div>} />
      </Routes>
    </>
  )
}

export default App
