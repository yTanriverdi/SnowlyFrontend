import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";

// let connection = null;

// export const startSignalRConnection = async (registerHandlers) => {
//   if (connection && connection.state === HubConnectionState.Connected) {
//     return connection;
//   }

//   const token = localStorage.getItem("jwtToken");

//   connection = new HubConnectionBuilder()
//     .withUrl("https://snowlybackend.onrender.com/snowlyHub", {
//       accessTokenFactory: () => token,
//       withCredentials: true
//     })
//     .withAutomaticReconnect()
//     .configureLogging(LogLevel.Information)
//     .build();

//     connection.onclose((err) => console.log("SignalR bağlantısı kapandı:", err));


//   await connection.start();

//   registerHandlers(connection);



//   return connection;
// };

// export const getConnection = () => connection;

let connection = null;
let handlersRegistered = false;

export const startSignalRConnection = async (handlers) => {
  if (connection && connection.state === "Connected") {
    return connection;
  }

  connection = new HubConnectionBuilder()
    .withUrl("https://snowlybackend.onrender.com/snowlyHub", {
      accessTokenFactory: () => localStorage.getItem("jwtToken")
    })
    .withAutomaticReconnect()
    .build();

  await connection.start();

  if (!handlersRegistered && handlers) {
    handlers(connection);
    handlersRegistered = true;
  }

  connection.onreconnected(() => {
    handlers(connection);
  });

  return connection;
};

export const getConnection = () => connection;