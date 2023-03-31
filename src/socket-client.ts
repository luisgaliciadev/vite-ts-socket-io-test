/** @format */

import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new Manager("http://localhost:3000/socket.io/socket.io.js", {
    extraHeaders: {
      hola: "token",
      authentication: token,
    },
  });
  socket?.removeAllListeners();
  socket = manager.socket("/");
  addListeners();
};

const addListeners = () => {
  const serverStatusLabel = document.querySelector("#server-status")!;
  const clientsUl = document.querySelector("#clients-ul")!;

  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;

  const messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;

  //   to do  clients-ul

  socket.on("connect", () => {
    console.log("connected");
    serverStatusLabel.innerHTML = "Server Online";
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
    serverStatusLabel.innerHTML = "Server Offline";
  });

  socket.on("clients-updated", (clients: string[]) => {
    console.log({ clients });
    let clientsHtml = "";
    clients.forEach((clientID) => {
      clientsHtml += `
            <li>${clientID}</li>
        `;
    });
    clientsUl.innerHTML = clientsHtml;
  });

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;
    socket.emit("message-from-client", {
      id: "YO",
      message: messageInput.value,
    });
    messageInput.value = "";
  });

  //   emite unicamente al cliente
  socket.on(
    "message-from-server",
    (payload: { fullName: string; message: string }) => {
      console.log(payload);
      const newMessage = `
        <li>
            <strong>${payload.fullName}</strong>
            <span>${payload.message}</span>
        </li>
      `;
      const li = document.createElement("li");
      li.innerHTML = newMessage;
      messagesUl.append(li);
    }
  );
};
