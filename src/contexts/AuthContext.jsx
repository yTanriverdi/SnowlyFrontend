import axios from "axios";

import { createContext, useContext, useState } from "react";
import api from "../services/api";


const AuthContext = createContext();


export const AuthProvider = ({children}) => {

    const BACKEND_URL = "https://snowlybackend.onrender.com/api";


const userLoginAsync = async (UserLoginDTO) => {
    const response = await api.post("/User/LoginUser", UserLoginDTO);

    console.log(response);
    if (!response.success) {
        return response;
    }

    const apiData = response.data;

    localStorage.setItem("email", apiData.email);
    localStorage.setItem("jwtToken", apiData.jwtToken);
    localStorage.setItem("userId", apiData.userId);
    localStorage.setItem("refreshToken", apiData.refreshToken);
    localStorage.setItem("role", apiData.role);
    localStorage.setItem("firstName", apiData.firstName);
    localStorage.setItem("lastName", apiData.lastName);

    return response;
};


    const userRegisterAsync = async (UserRegisterDTO) => {
    const response = await api.post("/User/AddUser", UserRegisterDTO);

    if (!response.success) {
        return response;
    }

    return response;
};


    const getUserByEmailAsync = async (email) => {
    const response = await api.get(
        "/User/GetUserByEmail",
        {
            params: {
                Email: email
            }
        }
    );

    return response;
};


    const getUserByIdAsync = async (userId) => {
        const getUserByIdResponse = await api.get(`User/GetUserById`,{
            params:{
                UserId: userId
            }
        });
        return getUserByIdResponse;
    }

    const wakeAsync = async () => {
        const wakeResponse = await api.get(`WakeUp/Wake`);
        return wakeResponse;
    }

    const wakeAuthAsync = async () => {
         const wakeAuthResponse = await api.get(`WakeUp/WakeAuth`);
        return wakeAuthResponse;
    }


    const updateUserAsync = async (UpdateUserDTO) => {
        const updateUserResponse = await api.put(`User/UpdateUser`, UpdateUserDTO);
        return updateUserResponse; 
    }

    const updatePasswordAsync = async (UpdatePasswordDTO) => {
        const updatePasswordAsync = await api.put(`User/ChangePassword`, UpdatePasswordDTO);
        return updatePasswordAsync; 
    }
    return (
    <AuthContext.Provider value={{userLoginAsync, userRegisterAsync, getUserByEmailAsync, wakeAsync, wakeAuthAsync, updateUserAsync, updatePasswordAsync, getUserByIdAsync}}>
            {children}
        </AuthContext.Provider>
    );
}




export const useAuth = () => useContext(AuthContext);