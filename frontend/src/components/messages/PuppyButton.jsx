// PuppyButton.jsx
import axios from "axios";
import useConversation from "../../zustand/useConversation";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import { socket } from "../../socket/socket";

const PuppyButton = ({message, onPuppyAction}) => {
    const { conversationId, currentUserId, messages } = useConversation();
    const setCurrentUserId = useConversation((state) => state.setCurrentUserId);
    const { authUser } = useAuthContext();

    useEffect(() => {
	if (authUser?._id) {
		setCurrentUserId(authUser._id);
	}
    }, [authUser]);

	const getLastUserMessage = () => {
		for (let i = messages.length - 1; i >= 0; i--) {
			if (messages[i].senderId === currentUserId) {
				return messages[i].message;
			}
		}
		return "";
	};

	const handleClick = async () => {
		const currentUserMessage = message.trim() !== "" ? message : getLastUserMessage();
		if (!currentUserMessage) {
			alert("No valid message found.");
			return;
		}
        console.log("🐶 Current User Message:", currentUserMessage, "conversationId:", conversationId, "user_id", currentUserId);
		try {
			const res = await axios.get(`http://localhost:5000/api/puppy-recommendation`, {
				params: { conversationId, currentUserMessage },
                withCredentials: true
			});
			console.log("🐶 Puppy Recommendation:", res.data);
			// onPuppyAction({ type: 'kiss-colorful', id: Date.now() });
			const actionType = 'kiss-colorful' || 'sleep';
			// 本地播放
			onPuppyAction({ type: actionType, id: Date.now() });
			// 传给对方
			socket.emit("puppet-action", {
				userId: authUser._id,
				action: actionType,
				receiverId: conversationId,
			})
		} catch (err) {
			console.error("🐶 Error fetching puppy action:", err);
		}
	};

	return (
		<button
			type='button'
			onClick={handleClick}
			className='absolute inset-y-0 end-0 flex items-center pe-3'
			title='Get Puppy Recommendation'
		>
			🐶
		</button>
	);
};

export default PuppyButton;
