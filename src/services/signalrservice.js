import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from "@microsoft/signalr";

let connection = null;
let handlersRegistered = false;

export const startSignalRConnection = async (handlers) => {
  if (connection && connection.state === HubConnectionState.Connected) {
    return connection;
  }

  connection = new HubConnectionBuilder()
    .withUrl(import.meta.env.VITE_SIGNALR_URL, {
      accessTokenFactory: () => localStorage.getItem("jwtToken")
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

    await connection.start();

  if (!handlersRegistered && handlers) {
    handlers(connection);
    handlersRegistered = true;
  }

  connection.onreconnected(() => {
    console.log("SignalR reconnected");
  });


  return connection;
};

export const getConnection = () => connection;