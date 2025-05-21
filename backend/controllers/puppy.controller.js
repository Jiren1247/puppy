import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import axios from "axios";

export const getPuppyRecommendation = async (req, res) => {
	try {
		const { receiverId, currentUserMessage } = req.query;
		
		const currentUserId  = req.user.userId;
		console.log("🐶 Conversation ID:", receiverId, "Current User Message:", currentUserMessage, "currentUserId", currentUserId);
		// const convo = await Conversation.findById(conversationId);
		// const userIds = convo.participants;
		const userIds = receiverId.split(",").map(id => id.trim());
		// const users = await User.find({ _id: { $in: userIds } });
		// const userMap = {};
		// users.forEach(u => (userMap[u._id.toString()] = u));
		if (!receiverId || !currentUserMessage) {
			return res.status(400).json({ error: "Missing receiverId or currentUserMessage" });
		}

		// 1️⃣ 查找当前用户和对方用户之间的 conversation
		const convo = await Conversation.findOne({
			participants: { $all: [currentUserId, receiverId] }
		});
		if (!convo) {
			return res.status(404).json({ error: "Conversation not found" });
		}

		const messages = await Message.find({ _id: { $in: convo.messages } }).sort({ createdAt: 1 });
		const formattedHistory = messages.map(msg => ({
			role: msg.senderId.toString() === userIds[0].toString() ? "user" : "partner",
			content: msg.message,
		}));

		if (!currentUserMessage) {
			return res.status(400).json({ error: "currentUserMessage is required" });
		}


	const systemPrompt = `
	You are a Puppy Interaction Recommendation Assistant in a chat app. You do not talk or reply in natural language.

	Your task is to act as a real-time emotional observer. Based on the user's personality type (MBTI), the type of relationship between the user and the partner, the full recent chat history, and the user's latest message input, you should analyze:

	1. The user's current **emotion** (e.g., happy, sad, touched, angry, frustrated)
	2. The **emotion intensity** (e.g., low, medium, high)
	3. The **relationship closeness** based on chat history and type (e.g., acquaintance, friend, close friend, romantic partner)
	4. The **MBTI personality** of the user and partner
	5. The **partner's recent interaction** and reaction to the user
	6. The context of the current message

	Based on this analysis, you must return a **puppy action recommendation** that reflects the user's emotional and relational state.

	💡 The action can be:
	- A **single action** (e.g., "tail-wag")
	- Or a **combined action** (e.g., "hug + kiss + wipe tears")
	
	🎯 Important Instructions:
	1. Personality Effect:
	You MUST treat personality type (Introvert vs Extrovert) as a **primary factor** in choosing puppy action.
	- Extroverts MUST receive energetic, expressive, noticeable, and even exaggerated actions. Examples: 'jump + spin + lick', 'happy dance', 'circle + hug', 'excited bark'.
	- Introverts MUST receive subtle, warm, emotionally controlled actions. Examples: 'slow blink', 'nuzzle', 'lean against', 'lay beside'.
	Your output must always reflect this personality difference in the **style and intensity** of the action.

	2. Partner's Action Influence:
	- If the partner did **not** send any message or take any emotional action recently, your puppy action should express initiative, comfort, or curiosity.
	- If the partner **did** respond emotionally (e.g., showed gratitude, sadness, excitement), your puppy action should respond **in kind** — for example: matching energy, comforting, celebrating, or mirroring the emotion.


	- All 4 fields below are required in your JSON output. Do not omit any. Do not explain. Return only the JSON object.**
	Use the available puppy expressions to simulate how a loyal, emotionally responsive puppy would react in this situation.

	---

	**Input Information:**
	- Personality Type: Extrovert
	- Relationship Type: Friend
	- Full recent chat history (max 10 messages):  
	${JSON.stringify(formattedHistory, null, 2)}
	- Current user message: ${currentUserMessage}
	- Partner Last Action: "excitement"

	---

	Please return ONLY the following JSON structure:
	** All of the fields are required, including emotion, intensity, relationshipCloseness and action. Do not omit any. Do not explain. 

	{
		"emotion": "<emotion>",
		"intensity": "<low | medium | high>",
		"relationshipType": "<acquaintance | friend | close friend | romantic partner>",
		"relationshipCloseness": "0-10",
		"action": "<puppy action>"
	}

	Available puppy actions include:  
	tail-wag, jump, hide, sleepy, nuzzle, turn-away, hug, kiss, wipe tears, lay beside, spin, paw-touch,  
	gentle head tilt, slow blink, snuggle, lean against, nose nudge,  
	happy dance, circle around user, ear flop, excited bark, tail-spin,  
	lick hand, soft whine, curl up quietly, press head on lap, bring small toy,  
	jump + hug + lick face, spin + paw-touch + bark, hide + peek + whimper, tail-wag + spin + cuddle


	Be concise. Do not explain. Return only the JSON.
	`;


		// console.log("🔍 GPT Request payload:", {
		// 	endpoint: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}/chat/completions`,
		// 	deployment: process.env.AZURE_DEPLOYMENT_NAME,
		// 	messages: [{ role: "system", content: systemPrompt }],
		// });

		const gptRes = await axios.post(
		`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=2024-12-01-preview`,
		{
			messages: [
			{ role: "system", content: systemPrompt }
			],
			temperature: 0.6,
			max_tokens: 500,
			model: process.env.AZURE_MODEL_NAME
		},
		{
			headers: {
			"api-key": process.env.AZURE_OPENAI_KEY,
			"Content-Type": "application/json"
			}
		}
		);

		const content = gptRes.data.choices[0].message.content;
		const parsed = JSON.parse(content);

		res.status(200).json(parsed);
	} catch (err) {
		console.error("🐶 Puppy AI error:", err?.response?.data || err.message);
		

		res.status(500).json({ error: "Failed to generate puppy action" });
	}
};
