import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	// setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	conversationId: null,
	currentUserId: null,

	setSelectedConversation: (selectedConversation) =>
		set({
			selectedConversation,
			conversationId: selectedConversation?._id || null,
		}),

	setCurrentUserId: (userId) => set({ currentUserId: userId }),
	messages: [],
	setMessages: (messages) => set({ messages }),

}));

export default useConversation;
