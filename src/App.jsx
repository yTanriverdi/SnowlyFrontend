import LoginRegister from './Pages/LoginRegister'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './Pages/MainLayout'
import { FriendShipProvider } from './contexts/FriendShipContext'
import { MessageProvider } from './contexts/MessageContext'
import Message from './Pages/Message'
// import Main from './Pages/Main'
import { startSignalRConnection } from './services/signalrservice'
import { useEffect } from 'react'
import OneSignal from 'react-onesignal'

function App() {

//  useEffect(() => {
//     const initSignalR = async () => {
//       await startSignalRConnection();
//     };

//     initSignalR();
//   }, []);
  useEffect(() => {
    const initApp = async () => {
      await OneSignal.init({
        appId: "d2e9bc49-e02f-4169-b0c1-69c3bd574f15",
        notifyButton: { 
    enable: true, 
    position: "bottom-right", 
    theme: "default"
  },
      });

      const userId = await OneSignal.getUserId();
      console.log("Abone kullanıcı ID:", userId);

      await startSignalRConnection();
      console.log("SignalR bağlantısı başlatıldı.");
    };

    initApp();
  }, []);

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
