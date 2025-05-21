import { io } from "socket.io-client";

// 获取当前登录用户 ID（或你可以传入参数）
const userId = localStorage.getItem("userId"); // 或从 context 获取

export const socket = io("http://localhost:5000", {
	query: { userId },
	withCredentials: true,
});
