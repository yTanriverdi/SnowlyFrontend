import React, { Activity, useEffect, useRef } from 'react'
import { useState } from 'react';
import '../styles/MainLayout.css'
import { useAuth } from '../contexts/AuthContext';
import { startSignalRConnection , getConnection} from '../services/signalrservice';
import { FaArrowLeft, FaArrowRight, FaMessage, FaRegCircle } from "react-icons/fa6";
import Info from '../Info/Info';
import { useFriendShip } from '../contexts/FriendShipContext';
import { useNavigate } from 'react-router-dom';
import { FaRegMessage } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoMdCheckmark } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaUserFriends } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { useMessage } from '../contexts/MessageContext';
import { FaCircle } from "react-icons/fa6";
const MainLayout = () => {

    // CONTEXT
    const {getUserByEmailAsync, wakeAsync, wakeAuthAsync, updateUserAsync, updatePasswordAsync} = useAuth();
    const {getAllPendingFriendShipForRequesterAsync, getAllPendingFriendShipForAddresseeAsync, addFriendAsync, getFriendsAsync, acceptFriendShipAsync, deleteFriendShipAsync} = useFriendShip();
    const {getChatsAsync} = useMessage();
    // CONTEXT

    // INFO GÖSTERİMİ
    // INFO GÖSTERİMİ
    // INFO GÖSTERİMİ
     const [showInfo, setShowInfo] = useState(false);
    const [infoSets, setInfoSets] = useState({
      message: '',
      type: ''
    });

    const infoMethod = (methodMessage, methodType) => {
      setShowInfo(true);
      setInfoSets({message: methodMessage, type: methodType})
    }
    // INFO GÖSTERİMİ
    // INFO GÖSTERİMİ
    // INFO GÖSTERİMİ


    const navigate = useNavigate();


    const [user, setUser] = useState(null);

    // const connectionRef = useRef(null);
  const [isReady, setIsReady] = useState(false);


//#region Tüm Sohbetleri getirme
    const [chats, setAllChats] = useState([]);

    const getChats = async () => {
      const allChats = await getChatsAsync();
      if(allChats.success)
        setAllChats(allChats.data);
      else return;
    }
    ///#endregion




// SIGNALR HANDLERLERİ
// SIGNALR HANDLERLERİ
// SIGNALR HANDLERLERİ
const onFriendRequestCreated = (data) => {
  if (data.addresseeId === localStorage.getItem("userId")) {
    infoMethod("Arkadaşlık isteği geldi", "infoOk");
  }
};

const onFriendRequestAccepted = (data) => {
  if (data.requesterId === localStorage.getItem("userId")) {
    infoMethod("Yeni arkadaşın var", "infoOk");
  }
};

const onFriendOnline = () => {
  infoMethod("Bir arkadaşın çevrimiçi oldu", "infoOk");
};

const onFriendOffline = () => {
  infoMethod("Bir arkadaşın çevrimdışı oldu", "infoError");
};
// SIGNALR HANDLERLERİ
// SIGNALR HANDLERLERİ
// SIGNALR HANDLERLERİ

useEffect(() => {
  const registerHandlers = (connection) => {
    // connection.off("FriendRequestCreated", onFriendRequestCreated);
    // connection.off("FriendRequestAccepted", onFriendRequestAccepted);
    // connection.off("FriendOnline", onFriendOnline);
    // connection.off("FriendOffline", onFriendOffline);

    connection.on("friendrequestcreated", onFriendRequestCreated);
    connection.on("friendrequestaccepted", onFriendRequestAccepted);
    connection.on("friendonline", onFriendOnline);
    connection.on("friendoffline", onFriendOffline);
  };

  const init = async () => {
    const wake = await wakeAuthAsync();

    if (!wake.success) {
      navigate("/giris-ve-kayit");
      return;
    }

    setIsReady(true);
    await getChats();
    await startSignalRConnection(registerHandlers);
  };

  init();

//   return () => {
//   const conn = getConnection();
//   if (conn) {
//     conn.off("friendrequestcreated", onFriendRequestCreated);
//     conn.off("friendrequestaccepted", onFriendRequestAccepted);
//     conn.off("friendonline", onFriendOnline);
//     conn.off("friendoffline", onFriendOffline);
//   }
// };
}, []);

    const [activeSection, setActiveSection] = useState("chats");
    const [activeDiv, setActiveDiv] = useState("");


    const [myFriendsMessage, setMyFriendsMessage] = useState("");
    const [myFriends, setMyFriends] = useState([]);

    const getFriends = async () => {
        const friendsRes = await getFriendsAsync();
        setMyFriends(friendsRes.data);
        setMyFriendsMessage(`${friendsRes.data.length} Arkadaş`);
    }


    const [findFriendEmail, setFindFriendEmail] = useState("");
    const [findFriendEmailConfirm, setFindFriendEmailConfirm] = useState("");
    const [foundFriend, setFoundFriend] = useState(null);

    const[notFoundMessage, setNotFoundMessage] = useState("");


    // Arkadaşlık araması için kullan
    const findFriendMethod = async (findEmail) => {
      const result = await getUserByEmailAsync(findEmail);
      setFoundFriend(null);
      setFoundFriend(result.data);
      await getFriends();
      await getFriendShipsForAddressee();
      await getFriendShipsForRequester();
      return result;
    }
    

    // Arkadaşlık araması ilk inputa girildiğinde çalışıcak
    const findFriend = async (e) => {
        e.preventDefault();
        setFindFriendEmailConfirm(findFriendEmail);
        const findFriendRes = await findFriendMethod(findFriendEmail);
        if(findFriendRes.success === false){
            setNotFoundMessage(findFriendRes.message);
            setFoundFriend(null);
            return;
        }
    }


    const addFriend = async (userId) => {
        const addFriendRes = await addFriendAsync(userId);
        if(addFriendRes.success === false){
          infoMethod(addFriendRes.data.apiMessage, "infoError");
          return;
        }
        infoMethod("Arkadaşlık isteği gönderildi", "infoOk");
        await getFriends();
        await getFriendShipsForRequester();
    }


    const getUser = async () => {
        const userMail = localStorage.getItem("email");
        const userRes = await getUserByEmailAsync(userMail);
        setUser(userRes.data);
        setUpdateFirstNameFirst(userRes.data.firstName);
        setUpdateFirstName(userRes.data.firstName);
        setUpdateLastNameFirst(userRes.data.lastName);
        setUpdateLastName(userRes.data.lastName);
    }

    const [friendShipsForRequester, setFriendShipsForRequester] = useState([]);
    const [friendShipsForAddressee, setFriendShipsForAddressee] = useState([]);

    const getFriendShipsForRequester = async () => {
      const friendShipsForRequesterResponse = await getAllPendingFriendShipForRequesterAsync();
      setFriendShipsForRequester(friendShipsForRequesterResponse.data);
    }

    const getFriendShipsForAddressee = async () => {
      const friendShipsForAddresseeResponse = await getAllPendingFriendShipForAddresseeAsync();
      setFriendShipsForAddressee(friendShipsForAddresseeResponse.data);
    }


    const activeDivAddFriend = async() => {
      setActiveDiv("addFriend")
      setFoundFriend(null);
      await getFriendShipsForAddressee();
      await getFriendShipsForRequester();
    }

    //#region Aktif div veya Section her değiştiğinde 
      useEffect(() => {
        setNotFoundMessage("");
      }, [activeDiv, activeSection])
    /// #endregion

    
   
    //#region Arkadaşlık ekleme
    const acceptFriendShip = async (email) => {
      const friendship = friendShipsForAddressee.find(
        f => f.email === email
      );
      const acceptFriendShipRes = await acceptFriendShipAsync(friendship.friendShipId);
      if(acceptFriendShipRes.success === false){
        infoMethod("Hata meydana geldi", "infoError");
        return;
      }
      infoMethod("Arkadaşlık isteği kabul edildi", "infoOk");
      await getFriends();
      await getFriendShipsForAddressee();
      await getFriendShipsForRequester();
    }
    ///#endregion

    //#region Arkadaşlık silme
    const [deleteFriendShow, setDeleteFriendShow] = useState(false);
    const [selectedDeleteFriendId, setSelectedDeleteFriendId] = useState("")

    const deleteFriendRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (deleteFriendRef.current && !deleteFriendRef.current.contains(e.target)) {
          setDeleteFriendShow(false);
          setSelectedDeleteFriendId("");
        }
      };
    
      if (deleteFriendShow) {
        document.addEventListener("mousedown", handleClickOutside);
      }
    
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [deleteFriendShow]);


    const friendRequestDelete = async (friendId) => {
      const deleteFriendResponse = await deleteFriendShipAsync(friendId);
      if(deleteFriendResponse.success){
        infoMethod("Arkadaşlık isteği iptal edildi", "infoOk")
      await getFriendShipsForRequester();
      }
      else infoMethod("Başarısız", "infoError");
    }


    const deleteFriendMethod = async () => {
      const deleteFriendResponse = await deleteFriendShipAsync(selectedDeleteFriendId);
      if(deleteFriendResponse.success){
        infoMethod("Arkadaş silindi", "infoOk")
        setDeleteFriendShow(false);
        setSelectedDeleteFriendId("");
        await getFriends();
      }
      else infoMethod("Başarısız", "infoError");
    }

    const deleteFriendForRequest = async (friendId) => {
      const deleteFriendResponse = await deleteFriendShipAsync(friendId);
      if(deleteFriendResponse.success){
        infoMethod("Arkadaşlık isteği reddedildi", "infoOk")
        setFoundFriend(null);
        setNotFoundMessage("");
      }
      else infoMethod("Başarısız", "infoError");
    }

    const deleteFriendForStillFriend = async (friendId) => {
      const deleteFriendResponse = await deleteFriendShipAsync(friendId);
      if(deleteFriendResponse.success){
        infoMethod("Arkadaş silindi", "infoOk")
        setFoundFriend(null);
        setNotFoundMessage("");
      }
      else infoMethod("Başarısız", "infoError");
    }
    ///#endregion

    //#region Bekleyen istekler
    const [friendRequestActiveSection, setFriendRequestActiveSection] = useState("");

    const [friendRequestsForRequest, setFriendRequestsForRequest] = useState([]);

    const [friendRequestsForAddressee, setFriendRequestsForAddressee] = useState([]);

    const friendRequestMyRequest = async () => {
      setFriendRequestActiveSection("myRequest");

      const friendRequestMyRequestResponse = await getAllPendingFriendShipForRequesterAsync();

      if(friendRequestMyRequestResponse.success){
        setFriendRequestsForRequest(friendRequestMyRequestResponse.data);
      }
      else return;
    }

    const friendRequestMyAddressee = async () => {
      setFriendRequestActiveSection("myAddressee")

      const friendRequestMyAddresseeResponse = await getAllPendingFriendShipForAddresseeAsync();
      
      if(friendRequestMyAddresseeResponse.success){
        setFriendRequestsForAddressee(friendRequestMyAddresseeResponse.data);
      }
      else return;
    }

     const deleteFriendForRequestForWaitingRequest = async (friendId) => {
      const deleteFriendResponse = await deleteFriendShipAsync(friendId);
      if(deleteFriendResponse.success){
        infoMethod("Arkadaşlık isteği iptal edildi", "infoOk")
        friendRequestMyRequest();
      }
      else infoMethod("Başarısız", "infoError");
    }

    const acceptFriendForAddresseForWaitingRequest = async (friendShipId) => {
      const acceptFriendShipRes = await acceptFriendShipAsync(friendShipId);
      if(acceptFriendShipRes.success === false){
        infoMethod("Başarısız", "infoError");
        return;
      }
      infoMethod("Arkadaşlık isteği kabul edildi", "infoOk");
      friendRequestMyAddressee();
    }
    ///#endregion Bekleyen istekler


    //#region Çıkış işlemi
    const [logoutShow, setLogoutShow] = useState(false);
    const logout = async() => {
      localStorage.clear();
      navigate("/giris-ve-kayit")
    }

    const logoutRef = useRef(null);
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (logoutRef.current && !logoutRef.current.contains(e.target)) {
          setLogoutShow(false);
        }
      };
    
      if (logoutShow) {
        document.addEventListener("mousedown", handleClickOutside);
      }
    
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [logoutShow]);
    ///#endregion
    const [showUpdateFirstName, setShowUpdateFirstName] = useState(false);
    const [updateFirstName, setUpdateFirstName] = useState("");
    const [updateFirstNameFirst, setUpdateFirstNameFirst] = useState("");

    const [showUpdateLastName, setShowUpdateLastName] = useState(false);
    const [updateLastName, setUpdateLastName] = useState("");
    const [updateLastNameFirst, setUpdateLastNameFirst] = useState("");

    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [updatePassword, setUpdatePassword] = useState("");
    const [updatePasswordFirst, setUpdatePasswordFirst] = useState("");

    const [updatePasswordTwo, setUpdatePasswordTwo] = useState("");
    

    //#region Kullanıcı güncelleme işlemleri


    ///#endregion

    //#region İsim güncelleme dışı tıklama
    const updateFirstNameRef = useRef(null);
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (updateFirstNameRef.current && !updateFirstNameRef.current.contains(e.target)) {
          setShowUpdateFirstName(false);
          setUpdateFirstName(updateFirstNameFirst);
        }
      };
    
      if (showUpdateFirstName) {
        document.addEventListener("mousedown", handleClickOutside);
      }
    
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showUpdateFirstName]);

    ///#endregion

    //#region Soyad güncelleme dışı tıklama
    const updateLastNameRef = useRef(null);
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (updateLastNameRef.current && !updateLastNameRef.current.contains(e.target)) {
          setShowUpdateLastName(false);
          setUpdateLastName(updateLastNameFirst);
        }
      };
    
      if (showUpdateLastName) {
        document.addEventListener("mousedown", handleClickOutside);
      }
    
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showUpdateLastName]);

    ///#endregion

    //#region Şifre güncelleme dışı tıklama
    const updatePasswordRef = useRef(null);
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (updatePasswordRef.current && !updatePasswordRef.current.contains(e.target)) {
          setShowUpdatePassword(false);
        }
      };
    
      if (showUpdatePassword) {
        document.addEventListener("mousedown", handleClickOutside);
      }
    
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showUpdatePassword]);

    ///#endregion




    //#region KULLANICI GÜNCELLEME
     
    const updateUser = async () => {
      
      const UpdateUserDTO = {
        Email: user.email,
        FirstName: updateFirstName,
        LastName: updateLastName
      }
      
      if(updateFirstName == updateFirstNameFirst &&
         updateLastName == updateLastNameFirst){
        infoMethod("Değişiklik yok", "infoError")
      }
      else{
      const updateUserResponse = await updateUserAsync(UpdateUserDTO);
      if(updateUserResponse.success){
        user.firstName = updateUserResponse.data.firstName;
        user.lastName = updateUserResponse.data.lastName
        setUpdateFirstName(updateUserResponse.data.firstName);
        setUpdateFirstNameFirst(updateUserResponse.data.firstName);
        setUpdateLastName(updateUserResponse.data.lastName);
        setUpdateLastNameFirst(updateUserResponse.data.lastName);
        setShowUpdateFirstName(false);
        setShowUpdateLastName(false);
        infoMethod("Güncelleme başarılı", "infoOk");
      }
      else if (updateUserResponse.data.errors) {
          const firstError = Object.values(updateUserResponse.data.errors)[0][0];
      infoMethod(firstError, "infoError");
      }
      else infoMethod("Güncelleme başarısız", "infoError");
      }

      
    }
    ///#endregion


    //#region Kullanıcı Şifre Güncelleme
    const updateUserPassword = async () => {
      if(updatePassword.trim().length == 0){
        infoMethod("Mevcut şifreniz zorunludur", "infoError")
      }
      else if(updatePassword.trim().length < 5){
        infoMethod("Mevcut şifreniz en az 5 karakter uzunluğundadır", "infoError")
      }
      else if(updatePasswordFirst.trim().length == 0 || updatePasswordTwo.trim().length == 0){
        infoMethod("Yeni şifre ve tekrarı zorunludur", "infoError")
      }
      else if(updatePasswordFirst != updatePasswordTwo){
        infoMethod("Şifreler eşleşmiyor", "infoError");
      }
      else if(updatePasswordFirst.trim().length < 5 || updatePasswordTwo.trim().length < 5){
        infoMethod("Şifre en az 5 karakter uzunluğunda olabilir", "infoError")
      }
      else if(updatePasswordFirst.trim().length > 30 || updatePasswordTwo.trim().length > 30 ){
        infoMethod("Şifre en fazla 30 karakter uzunluğunda olabilir", "infoError")
      }
      else if(updatePasswordFirst.trim().includes(" ") || updatePasswordTwo.trim().includes(" ") || updatePassword.trim().includes(" ")){
        infoMethod("Şifre boşluk içeremez", "infoError");
      }
      else{
        const UpdatePasswordDTO = {
          UserId: localStorage.getItem("userId"),
          NewPassword: updatePasswordTwo,
          OldPassword: updatePassword
        }
        const updateUserPasswordRes = await updatePasswordAsync(UpdatePasswordDTO);
        if(updateUserPasswordRes.success){
          infoMethod("Şifre güncellendi", "infoOk")
          setUpdatePassword("");
          setUpdatePasswordFirst("");
          setUpdatePasswordTwo("");
          setShowUpdatePassword(false);
        }
        else{
          infoMethod(updateUserPasswordRes.message == "Şifre yanlış" ? "Mevcut şifreniz yanlış" : "Hata", "infoError")
        }
      }
    }

    ///#endregion


    

    //#region Mesaj göndermeye git
    const goChat = (friendId, fullName) => {
      localStorage.setItem("messageFriendId", friendId);
      localStorage.setItem("messageFullName", fullName);
      navigate("/mesaj");
    }
    ///#endRegion

  return (
    <>
    <div className='mainLayout'>
        <header className='mainLayoutHeader'>
            <img src='/Snowly.png' className='mainLayoutIcon'/>
            <p>Snowly<FaRegCircle className={isReady === true ? "readyCircle readyCircleGreen" : "readyCircle readyCircleRed"}/></p>
        </header>
        {showInfo && (
          <Info message={infoSets.message} type={infoSets.type} onClose={() => setShowInfo(false)}/>
        )}
        <div className='mainLayoutContent'>
            {activeSection == "chats" && 
            <>
            <p className='mainLayoutControlInfo'>Sohbetler</p>
            </>
            }
            {activeSection == "chats" && (
                <div className='chatsDiv'>
                    {!isReady && (<p className='connectingInfo'>Bağlantı sağlanıyor</p>)}
                    {isReady && chats.length > 0 && (
                      <div className='userChats'>
                          {chats.map((item) => {
                            return(
                              <div key={item.userId} className='userChatCard' onClick={() => goChat(item.userId, item.fullName)}>
                                <div className='userChatCardMain'>
                                  <p className='userChatCardName'>{item.fullName}</p>
                                  <p className='userChatCardLastMessage'>{item.lastMessageContent}</p>
                                  </div> 
                                  <div className='userChatCardInfo'>
                                  {item.isLastMessageFromMe ? (
                                  <FaArrowRight className="sentIcon" />
                                    ) : !item.isLastMessageFromMe && item.unreadMessageCount == 0 ? (<FaArrowLeft className='sentIcon'/>):  (
                                    item.unreadMessageCount > 0 && (
                                    <p className="unreadMessageP">{item.unreadMessageCount}</p>
                                      )
                                    )}
                                  {new Date(item.lastMessageTime).toLocaleTimeString("tr-TR", {
                                   hour: "2-digit",
                                   minute: "2-digit",
                                  })}
                                  </div>
                              </div>
                                
                            )
                          })}
                        </div>
                    )}
                </div>
            )}
            {activeSection == "settings" && <p className='mainLayoutControlInfo'>Ayarlar</p>}
            {activeSection == "settings" && 
            <div className='settingsDiv'>
                {!showUpdatePassword && (
                  <div className='settingsDivInfo'>
                    <IoMdInformationCircleOutline />
                    <p>Bilgilerinizi güncelleyebilirsiniz</p>
                </div>
                )}
                {user && (
                  <>
                  <div className='settingsDivEmail'>
                    <p className='settingsDivEmailInfo'>E-Postanız</p>
                    <p className='userEmail'>{user.email}</p>
                </div>
                <div className='settingsDivFirstName'>
                      <p className='settingsDivFirstNameInfo'>İsim</p>
                      {!showUpdateFirstName ? (<>
                      <p className='userFirstName'>{user.firstName}</p>
                      <button className='settingsDivButton' onClick={() => {
                        setUpdateFirstName(updateFirstNameFirst),
                        setShowUpdateFirstName(true)
                      }}><MdEdit /></button></>) : (
                        <>
                        <div className='updateUserMainDiv'  ref={updateFirstNameRef}>
                          <p className='updateUserValidationInfo'><IoMdInformationCircleOutline/> İsim yalnızca harf içerebilir</p>
                          <p className='updateUserValidationInfo'><IoMdInformationCircleOutline/> İsim en az 3 karakter uzunluğunda olabilir</p>
                          <div className='updateUserDiv'>
                          <input className='updateUserInput' type='text' value={updateFirstName} onChange={(e) => setUpdateFirstName(e.target.value.trim())}/>
                            <div className='updateUserButtons'>
                              <button className='updateUserButtonGreen'
                              onClick={() => updateUser()}><IoMdCheckmark /></button>
                              <button className='updateUserButtonRed' onClick={() => {
                                setShowUpdateFirstName(false),
                                setUpdateFirstName(updateFirstNameFirst)
                              }}><IoMdClose/></button>
                            </div>
                          </div>
                          </div>
                        
                        </>)}
                  </div>
                  <div className='settingsDivLastName'>
                      <p className='settingsDivLastNameInfo'>Soyad</p>
                      {!showUpdateLastName ? (<>
                      <p className='userLastName'>{user.lastName}</p>
                      <button className='settingsDivButton' onClick={() => {
                        setUpdateLastName(updateLastNameFirst),
                        setShowUpdateLastName(true)
                      }}><MdEdit /></button></>) : (
                        <>
                        <div className='updateUserMainDiv'  ref={updateLastNameRef}>
                          <p className='updateUserValidationInfo'><IoMdInformationCircleOutline/> Soyad yalnızca harf içerebilir</p>
                          <p className='updateUserValidationInfo'><IoMdInformationCircleOutline/> Soyad en az 2 karakter uzunluğunda olabilir</p>
                          <p className='updateUserValidationInfo'><IoMdInformationCircleOutline/> Soyad boşluk içeremez</p>
                          <div className='updateUserDiv'>
                          <input className='updateUserInput' type='text' value={updateLastName} onChange={(e) => setUpdateLastName(e.target.value.trim())}/>
                            <div className='updateUserButtons'>
                              <button className='updateUserButtonGreen'
                              onClick={() => updateUser()}><IoMdCheckmark /></button>
                              <button className='updateUserButtonRed' onClick={() => {
                                setShowUpdateLastName(false),
                                setUpdateLastName(updateLastNameFirst)
                              }}><IoMdClose/></button>
                            </div>
                          </div>
                          </div>
                        
                        </>)}
                  </div>
                  <div className='settingsDivPassword'>
                      {!showUpdatePassword ? (<>
                      <p className='settingsDivPasswordInfo'>Şifre</p>
                      <p className='userPassword'>***********</p>
                      <button className='settingsDivButton' onClick={() => {
                        setShowUpdatePassword(true)
                      }}><MdEdit /></button></>) : (
                        <>
                        <p className='settingsDivPasswordInfo'>Şifre</p>
                        <div className='updateUserMainDiv'  ref={updatePasswordRef}>
                          <p className='updateUserValidationInfo'><IoMdInformationCircleOutline/> Mevcut şifreniz zorunludur</p>
                          <p className='updateUserValidationInfo'><IoMdInformationCircleOutline/> Şifre en az 5 karakter uzunluğunda olabilir</p>
                          <p className='updateUserValidationInfo'><IoMdInformationCircleOutline/> Şifre en fazla 30 karakter uzunluğunda olabilir</p>
                          <div className='updatePasswordDiv'>
                          <div className='updateUserPasswordInputs'>
                            <div className='updateUserPasswordInputDiv'>
                              <p className='updateUserValidationInfo'>Mevcut Şifreniz</p>
                              <input className='updateUserInput inputPassword' type='password' onChange={(e) => setUpdatePassword(e.target.value.trim())}/>
                              </div>
                            <div className='updateUserPasswordInputDiv'>
                              <p className='updateUserValidationInfo'>Yeni Şifreniz</p>
                              <input className='updateUserInput inputPassword' type='password' onChange={(e) => setUpdatePasswordFirst(e.target.value.trim())}/>
                              </div>
                            <div className='updateUserPasswordInputDiv'>
                              <p className='updateUserValidationInfo'>Yeni Şifreniz Tekrar </p>
                              <input className='updateUserInput inputPassword' type='password' onChange={(e) => setUpdatePasswordTwo(e.target.value.trim())}/>
                              </div>
                          </div>
                            <div className='passwordUpdateButtons'>
                              <button className='updateUserButtonGreen'
                              onClick={() => updateUserPassword()}><IoMdCheckmark /></button>
                              <button className='updateUserButtonRed' onClick={() => {
                                setShowUpdatePassword(false),
                                setUpdatePassword(""),
                                setUpdatePasswordFirst(""),
                                setUpdatePasswordTwo("")
                              }}><IoMdClose/></button>
                            </div>
                          </div>
                          </div>
                        
                        </>)}
                  </div>

                  <div className='logoutdiv'>
                      {logoutShow && (
                        <div className='logoutShowDiv' ref={logoutRef}>
                        <p>Oturumu kapatıyorsunuz ?</p>
                        <button className='logoutLastButton' onClick={() => logout()}>Kapat</button>
                      </div>
                      )}
                      <button className='logoutButton'
                      onClick={() => setLogoutShow(true)}>Oturumu kapat</button>
                  </div>
                  </>
                )}
            </div>}


            {activeSection == "friends" && <p className='mainLayoutControlInfo'>Arkadaşlık</p>}
            {activeSection == "friends" && (
                <div className='friendsDiv'>
                    <div className='friendsHeader'>
                        <button className={`friendsButtons ${
    activeDiv === "myFriends" ? "friendsButtonsActive" : ""
  }`} onClick={() => {
                            setActiveDiv("myFriends"),
                            getFriends()
                        }}>Arkadaşlarım</button>
                        <button className={`friendsButtons ${
    activeDiv === "addFriend" ? "friendsButtonsActive" : ""
  }`}  onClick={activeDivAddFriend}
                        >Arkadaş ekle</button>
                        <button className={`friendsButtons ${
    activeDiv === "friendRequest" ? "friendsButtonsActive" : ""
  }`} onClick={() => {
                            setActiveDiv("friendRequest"),
                            friendRequestMyRequest();
                        }}>Bekleyen istekler</button>
                    </div>
                    {
                          activeDiv === "addFriend" ? (
                            <div className='addFriend'>
                                <form className='addFriendForm' onSubmit={findFriend}>
                                    <p>E-Posta giriniz</p>
                                    <input type='email' onChange={(e) => setFindFriendEmail(e.target.value.trim())} required/>
                                    <button
                                    type='submit' className='addFriendButton'>Ara</button>
                                </form>
                                {foundFriend ? (
                                    <div className='foundFriend'>
                                        <p>{foundFriend.firstName} {foundFriend.lastName}</p>
                                            {foundFriend.userId == localStorage.getItem("userId") ? (<p>Siz</p>) 
                                            : myFriends.some(x => x.friendId == foundFriend.userId) ? (<button className='foundFriendButtonRed'
                                            onClick={() => deleteFriendForStillFriend(foundFriend.userId)}>Arkadaşlıktan Çıkar</button>) 
                                            : friendShipsForRequester.some(x => x.friendId == foundFriend.userId) ? (<><p>İstek gönderildi</p> <button className='friendShipForRequesterDelete' onClick={() => friendRequestDelete(foundFriend.userId)}><IoMdClose/></button> </> ) 
                                            : friendShipsForAddressee.some(x => x.friendId == foundFriend.userId) ? (<> <button className='foundFriendButton' onClick={() => acceptFriendShip(foundFriend.email)}>Arkadaşlık isteğini kabul et</button> <button className='friendShipForRequesterDelete'
                                            onClick={() => deleteFriendForRequest(foundFriend.userId)}><IoMdClose/></button></>) 
                                            : (<button onClick={() => addFriend(foundFriend.userId)} 
                                            className='foundFriendButton'>Arkadaş ekle</button>)}
                                    </div>
                                ) : (<p className='notFoundMessage'>{notFoundMessage}</p>)}
                            </div>
                          ) : activeDiv === "myFriends" ? (
                            <div className='myFriendsDiv'>
                                {myFriendsMessage && (
                                    <p className='myFriendsMessageP'>{myFriendsMessage}</p>
                                    
                                )}
                                {myFriends && myFriends.map((friend) => {
                                   return(
                                     <div className='friendCard' key={friend.friendId}>
                                      {deleteFriendShow && friend.friendId === selectedDeleteFriendId && (
                                        <div 
                                        ref={deleteFriendRef}className='friendCardDeleteDiv'>
                                            <p>{friend.fullName} silinecek ?</p>
                                            <div className='friendCardDeleteButtons'>
                                              <button className='friendCardDeleteButton friendCardDeleteButtonRed'
                                              onClick={() => deleteFriendMethod()}><IoMdCheckmark /></button>
                                              <button className='friendCardDeleteButton friendCardDeleteButtonGreen'
                                              onClick={() => {
                                                setSelectedDeleteFriendId(""),
                                                setDeleteFriendShow("false")
                                              }}
                                              ><IoMdClose /></button>
                                            </div>
                                          </div>
                                      )}
                                        <p>{friend.fullName}</p>
                                        <div className='friendCardButtons'>
                                            <button className='friendCardButton friendCardButtonGreen'
                                            onClick={() => goChat(friend.friendId, friend.fullName)}
                                            ><FaRegMessage /></button>
                                            <button
                                            onClick={() =>{
                                              setDeleteFriendShow(true),
                                              setSelectedDeleteFriendId(friend.friendId)
                                            }} 
                                            className='friendCardButton friendCardButtonRed '><IoMdClose /></button>
                                        </div>
                                    </div>
                                   )
                                })}
                            </div>
                          ) : activeDiv === "friendRequest" ? (
                            <div className='friendRequestDiv'>
                                <div className='friendRequestActiveSection'>
                                    <button className={`appBarButton ${
                                      friendRequestActiveSection === "myRequest" ? "appBarActive" : ""
                                    }`}
                                    onClick={() => {
                                      friendRequestMyRequest()
                                    }}>İsteklerim</button>
                                    <button className={`appBarButton ${
                                      friendRequestActiveSection === "myAddressee" ? "appBarActive" : ""
                                    }`}
                                    onClick={() => {
                                      friendRequestMyAddressee()
                                    }}>Bana Gelen</button>
                                </div>
                                {friendRequestActiveSection === "myRequest" && (
                                  <div className='myRequestDiv'>
                                    {friendRequestsForRequest.length > 0 && (<p className='myFriendRequestCount'>{friendRequestsForRequest.length} Bekleyen istek</p>)}
                                    {friendRequestsForRequest.length > 0 ? (friendRequestsForRequest.map((friend) => {
                                      return(
                                        <div className='myFriendRequestsDiv' key={friend.friendId}>
                                            <p>{friend.fullName}</p>
                                            <button className='friendShipForRequesterDelete'
                                            onClick={() =>  deleteFriendForRequestForWaitingRequest(friend.friendId)}><IoMdClose/></button>
                                        </div>
                                      )
                                    })) : (<p className='waitingFriendRequestP'>Bekleyen istek yok</p>)}
                                  </div>
                                )}
                                {friendRequestActiveSection === "myAddressee" && (
                                  <div className='myAddresseeDiv'>
                                    {friendRequestsForAddressee.length > 0 && (<p className='myFriendRequestCount'>{friendRequestsForAddressee.length} Bekleyen istek</p>)}
                                    {friendRequestsForAddressee.length > 0 ? (friendRequestsForAddressee.map((friend) => {
                                      return(
                                        <div className='myFriendRequestsDiv' key={friend.friendId}>
                                          <p>{friend.fullName}</p>
                                            <div className='myFriendRequestDivButtons'>
                                              <button className='friendCardDeleteButton friendCardDeleteButtonGreen'
                                              onClick={() => {
                                                acceptFriendForAddresseForWaitingRequest(friend.friendShipId)
                                              }}><IoMdCheckmark/></button>
                                              <button className='friendShipForRequesterDelete'
                                            onClick={() =>  deleteFriendForRequestForWaitingRequest(friend.friendId)}><IoMdClose/></button>
                                            </div>
                                        </div>
                                      )
                                    })) : (<p className='waitingFriendRequestP'>Bekleyen istek yok</p>)}
                                  </div>
                                )}
                            </div> 
                          ) : null
                        }
                </div>
            )}

        </div>
        <section className='appBar'>
            <button className={`appBarButton appBarButtonIconMessage ${
    activeSection === "chats" ? "appBarActive" : ""
  }`} onClick={() => {
    setActiveSection("chats"),
    getChats()}}><FaMessage/></button>
            <button className={`appBarButton appBarButtonIcon ${
    activeSection === "friends" ? "appBarActive" : ""
  }`} onClick={() => {
                setActiveSection("friends"),
                setActiveDiv("myFriends"),
                getFriends()
            }}><FaUserFriends/></button>
            <button className={`appBarButton appBarButtonIcon ${
    activeSection === "settings" ? "appBarActive" : ""
  }`} onClick={() => {
                setActiveSection("settings"),
                getUser()
            }}><IoSettingsSharp/></button>
        </section>
    </div>
    </>
  )
}

export default MainLayout