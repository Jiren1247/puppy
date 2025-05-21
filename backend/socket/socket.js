import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
		credentials: true,
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") {
		userSocketMap[userId] = socket.id;
		// console.log("✅ registered socket:", userId, "->", socket.id);
	}

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("register-user", (userId) => {
		if (userId) {
			userSocketMap[userId] = socket.id;
			console.log("✅ [Re-register] userId:", userId, "-> socket:", socket.id);
		}
	});

	socket.on("puppet-action", ({ userId, action, receiverId }) => {
		const receiverSocketId = getReceiverSocketId(receiverId);
		console.log("📡 puppet-action: from", userId, "to", receiverId, "socketId:", receiverSocketId);
		console.log("💾 userSocketMap:", userSocketMap);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("puppet-action-update", {
				userId,        // 谁做的动作
				action,        // 动作类型，如 'run-away'
				actionId: Date.now(), // 唯一标识触发刷新
			});
		}

		// 同步给自己（确保自己也收到一次，可选）
		socket.emit("puppet-action-update", {
			userId,
			action,
			actionId: Date.now(),
		});
	});


	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };
