import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatWidget from './chat/ChatWidget'

export default function Layout() {
  return (
    <div className="site">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}