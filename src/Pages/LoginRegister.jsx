import React, { useEffect } from 'react'
import { useState } from 'react';
import "../styles/LoginRegister.css"
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import OneSignal from 'react-onesignal';

const LoginRegister = () => {

  // CONTEXT
  const {userLoginAsync, userRegisterAsync} = useAuth();
  // CONTEXT


  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginRunning, setLoginRunning] = useState(false);
  const [error, setError] = useState("");


  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  const login = async(e) => {
    e.preventDefault();
    setLoginRunning(true);
    setLoginError(false);
    const UserLoginDTO = {
      Email: email.trim(),
      Password: password.trim()
    }
    const loginRes = await userLoginAsync(UserLoginDTO);
    if(loginRes.success){
      setTimeout(() => {
        setLoginRunning(false);
        navigate("/anasayfa")
      }, 1000);
    }
    else{
      setLoginRunning(false);
      setLoginError(true);
      setLoginErrorMessage(loginRes.message);
    }
  }


  const formReset = () => {
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterSecondPassword("");
    setRegisterFirstName("");
    setRegisterLastName("");
    setEmail("");
    setPassword("");
    setLoginError(false);
    setTypeChange(!typeChange);
  }



  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerSecondPassword, setRegisterSecondPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");

  const [registerError, setRegisterError] = useState(false);
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");


  const [registerRunning, setRegisterRunning] = useState(false);
  const register = async (e) => {
    e.preventDefault();
    setRegisterRunning(true);
    const UserRegisterDTO = {
      Email: registerEmail.trim(),
      Password: registerPassword.trim(),
      FirstName: registerFirstName.trim(),
      LastName: registerLastName.trim()
    }
    const registerRes = await userRegisterAsync(UserRegisterDTO);
  }
  const [typeChange, setTypeChange] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // OneSignal SDK başlat, Notify Button aktif
        await OneSignal.init({
          appId: "d2e9bc49-e02f-4169-b0c1-69c3bd574f15",
          notifyButton: {
            enable: true,          // sağ alt köşede otomatik izin butonu
            position: "bottom-right",
            theme: "default",
          },
        });
        console.log(
          "Push izinleri Notify Button üzerinden yönetilir. Abone ID’si dashboard veya webhook ile alınır."
        );
      } catch (err) {
        console.error("Init sırasında hata:", err);
      }
    };

    initApp();
  }, []);

  const handleInfoButton = () => {
    alert(
      "Push bildirimleri için sağ alt köşedeki Notify Button’a tıklayın.\n" +
        "Notify Button kullanıcıya izin penceresini açar ve abonelik oluşturur."
    );
  };



  return (
    <>
    <section className='loginRegister'>
      <button className='notificationButton' onClick={handleInfoButton}>
          Bildirimleri etkinleştir
      </button>

        {typeChange ? (
          <div className='loginDiv'>
            <img className='snowlyLogo' src='/Snowly.png' alt='Snowly Logo'/>
            <p className='snowlyAppName'>Snowly</p>
            <form className='loginForm' onSubmit={login}>
              <div className='loginFormWrapper'>
                <p>E-Posta</p>
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
              </div>
              <div className='loginFormWrapper'>
                <p>Şifre</p>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
              </div>
              <a className='noRemember'>Şifremi unuttum</a>
              {loginError && (<p className='loginErrorInfo'>{loginErrorMessage}</p>)}
              <div className='loginComp'>
                {!loginRunning ? (
                    <button className='loginButton' type='submit'>Giriş Yap</button>
                  ) : (
                    <div className='loginRunning'></div>
                  )}
              </div>
            </form>
            <p className='toRegister'>Henüz hesabın yok mu? <span onClick={ formReset}>Kayıt ol</span></p>
            <div className='element1'></div>
        <div className='element2'></div>
          </div>
        ): (
          <div className='registerDiv'>
            <img className='snowlyLogo' src='/Snowly.png' alt='Snowly Logo'/>
            <p className='snowlyAppName'>Snowly</p>
            <form className='registerForm' onSubmit={register} >
              <div className='registerFormWrapper'>
                <p>İsim</p>
                <input type='text' value={registerFirstName} onChange={(e) => 
                  setRegisterFirstName(e.target.value)
                } required/>
              </div>
              <div className='registerFormWrapper'>
                <p>Soyisim</p>
                <input type='text' value={registerLastName} onChange={(e) => setRegisterLastName(e.target.value)} required/>
              </div>
              <div className='registerFormWrapper'>
                <p>E-Posta</p>
                <input type='email' value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required/>
              </div>
              <div className='registerFormWrapper'>
                <p>Şifre</p>
                <input type='password' value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required/>
              </div>
              <div className='registerFormWrapper'>
                <p>Şifre Tekrar</p>
                <input type='password' value={registerSecondPassword} onChange={(e) => setRegisterSecondPassword(e.target.value)} required/>
              </div>
              {!registerRunning ? (
                    <button className='registerButton' type='submit'>Kayıt Ol</button>
                  ) : (
                    <div className='registerRunning'></div>
                  )}
            </form>
            <p className='toLogin'>Hesabın var mı? <span onClick={formReset}>Giriş Yap</span></p>
            <div className='element1'></div>
        <div className='element2'></div>
          </div>
        )}
        {/* <div className='element1'></div>
        <div className='element2'></div> */}
    </section>
    </>
  )
}

export default LoginRegister