import { io } from "socket.io-client";

let socket;

export const initSocket = (userId) => {
	if (!userId) return;
	console.log("🐶 [Socket] Initializing socket with userId:", userId);
	socket = io("http://localhost:5000", {
		query: { userId },
		withCredentials: true,
	});

	// 每次连接时重新注册 userId（防止 socket 重连时丢失身份）
	socket.on("connect", () => {
		// console.log("✅ [Socket] Connected, registering userId:", userId);
		socket.emit("register-user", userId);
	});
};

export const getSocket = () => socket;
