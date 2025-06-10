import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
				relationshipTypes: {
					[senderId]: "friend",  // 默认初始值
					[receiverId]: "friend"
				},
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateRelationshipType = async (req, res) => {
	try {
		const userId = req.user._id.toString();
		const convoId = req.params.id;
		const { relationshipType } = req.body;
		console.log("能运行", userId, convoId, relationshipType);
		// let conversation = await Conversation.findOne({
		// 	participants: { $all: [senderId, receiverId] },
		// });
		// if (!conversation) {
		// 	conversation = await Conversation.create({
		// 		participants: [senderId, receiverId],
		// 		relationshipTypes: {
		// 			[senderId]: "friend",  // 默认初始值
		// 			[receiverId]: "friend"
		// 		},
		// 	});
		// }

		const valid = ["friend", "romantic partner", "colleague", "elder", "boss", "family", "acquaintance"];
		if (!valid.includes(relationshipType)) {
			return res.status(400).json({ error: "Invalid relationship type" });
		}

		const convo = await Conversation.findOne({
			participants: { $all: [userId, convoId] },
		});
		console.log("convo", convo);
		if (!convo) {
			return res.status(404).json({ error: "Conversation not found" });
		}

		if (!convo.relationshipTypes) {
			convo.relationshipTypes = new Map();
		}
		convo.relationshipTypes.set(userId.toString(), relationshipType);
		await convo.save();

		res.status(200).json({ message: "Relationship updated", relationshipType });
	} catch (error) {
		console.error("Error updating relationship:", error.message);
		res.status(500).json({ error: "Server error" });
	}
};
