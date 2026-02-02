import { createContext, useContext } from "react";
import api from "../services/api";

const FriendShipContext = createContext();


export const FriendShipProvider = ({children}) => {


    const addFriendAsync = async (addresseeId) => {
        const userId = localStorage.getItem("userId");

        const addFriendDTO = {
            RequesterId: userId,
            AddresseeId: addresseeId
        };

        const response = await api.post(
        "/FriendShip/AddFriendShip",
        addFriendDTO
    );

    return response;
};

const getFriendsAsync = async() => {
const userId = localStorage.getItem("userId");

    const response = await api.get(
        `/FriendShip/GetAllAcceptedFriendShip`,
        {
            params: {
                RequesterId: userId
            }
        }
    );
    return response;
    }

    const getAllPendingFriendShipForRequesterAsync = async () => {
        const userId = localStorage.getItem("userId")
        const getAllPendingFriendResponse = await api.get("FriendShip/GetAllPendingFriendShipForRequester",{
            params:{
                RequesterId: userId
            }
        });
        return getAllPendingFriendResponse;
    }
    const getAllPendingFriendShipForAddresseeAsync = async () => {
        const userId = localStorage.getItem("userId")
        const getAllPendingFriendResponse = await api.get("FriendShip/GetAllPendingFriendShipForAddressee",{
            params:{
                AddresseeId: userId
            }
        });
        return getAllPendingFriendResponse;
    }

    const acceptFriendShipAsync = async (friendShipId) => {
            const acceptFriendShipResponse = await api.post("/FriendShip/AcceptFriendShip",
            {
                FriendShipId: friendShipId
            }
        );
        return acceptFriendShipResponse.data;
        };

    const deleteFriendShipAsync = async (addresseeId) => {
        const mainUserId = localStorage.getItem("userId");
        const deleteFriendShipResponse = await api.post("/FriendShip/DeleteFriendShip",{
            RequesterId: mainUserId,
            AddresseeId: addresseeId
        });
        return deleteFriendShipResponse.data;
    };
    

     return (
    <FriendShipContext.Provider value={{getAllPendingFriendShipForRequesterAsync, getAllPendingFriendShipForAddresseeAsync, addFriendAsync, getFriendsAsync, acceptFriendShipAsync, deleteFriendShipAsync}}>
            {children}
        </FriendShipContext.Provider>
    );
}

export const useFriendShip = () => useContext(FriendShipContext);