import LoginRegister from './Pages/LoginRegister'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './Pages/MainLayout'
import { FriendShipProvider } from './contexts/FriendShipContext'
import { MessageProvider } from './contexts/MessageContext'
import Message from './Pages/Message'
// import Main from './Pages/Main'

function App() {

  return (
    <>
    <AuthProvider>
      <FriendShipProvider>
        <MessageProvider>
         <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/anasayfa" replace />} />
            <Route path="/giris-ve-kayit" element={<LoginRegister />} />
            <Route path="/anasayfa" element={<MainLayout/>}/>
            <Route path="/mesaj" element={<Message/>}/>
          </Routes>
         </BrowserRouter>
        </MessageProvider>
      </FriendShipProvider>
    </AuthProvider>
    </>
  )
}

export default App
