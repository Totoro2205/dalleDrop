import { useState } from 'react'
import { Navbar, Welcome, Footer } from './components'

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Navbar />
        <Welcome />
      </div>
      <Footer />
    </div>
  )
}

export default App
