import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from "@microsoft/signalr";

let connection = null;

export const startSignalRConnection = async () => {
  // if (connection && connection.state === HubConnectionState.Connected) {
  //   return connection;
  // }

  if (connection) {
    if (connection.state === HubConnectionState.Disconnected) {
      await connection.start();
    }
    return connection;
  }

  connection = new HubConnectionBuilder()
    // .withUrl(import.meta.env.VITE_SIGNALR_URL,{
    .withUrl("https://snowlybackend.onrender.com/snowlyHub",{
      accessTokenFactory: () => localStorage.getItem("jwtToken")
    })
    .withAutomaticReconnect()
    // .configureLogging(LogLevel.Information)
    .configureLogging(LogLevel.None)
    .build();

    await connection.start();

  return connection;
};

export const getConnection = () => connection;

export const addSignalRHandler = (eventName, handler) => {
  if (!connection) return;
  connection.on(eventName, handler);
};

export const removeSignalRHandler = (eventName, handler) => {
  if (!connection) return;
  connection.off(eventName, handler);
};