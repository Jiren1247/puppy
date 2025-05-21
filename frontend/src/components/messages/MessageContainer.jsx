import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import PuppySprite from "./PuppySprite";
import { socket } from "../../socket/socket";

const MessageContainer = () => {
	const { selectedConversation,
		setSelectedConversation,
		puppets,
		updatePuppetAction } = useConversation();
	// const [puppyAction, setPuppyAction] = useState({ type: 'sleep', id: 0 });
	const { authUser } = useAuthContext();
	// const [puppets, updatePuppetAction] = useState({
	// 	[authUser?._id]: { type: authUser?.puppetType || "purple", currentAction: "sleep", actionId: 0 },
	// 	[selectedConversation?._id]: { type: selectedConversation?.puppetType || "purple", currentAction: "sleep", actionId: 0 },
	// });

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	useEffect(() => {
		socket.on("puppet-action-update", ({ userId, action, actionId }) => {
			updatePuppetAction(userId, action, actionId);
		});
		return () => socket.off("puppet-action-update");
	}, []);

	useEffect(() => {
		if (authUser && selectedConversation) {
			updatePuppetAction(authUser._id, "sleep");
			updatePuppetAction(selectedConversation._id, "sleep");
		}
	}, [authUser, selectedConversation]);


	return (
		<div className='md:min-w-[450px] flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-slate-500 px-4 py-2 mb-2'>
						<span className='label-text'>To:</span>{" "}
						<span className='text-gray-900 font-bold'>{selectedConversation.fullName}</span>
					</div>
					<Messages />
					{/* <PuppySprite 
						action={puppyAction} 
					/> */}
					<PuppySprite
						userId={authUser._id}
						type={authUser.puppetType || "purple"}
						action={puppets[authUser._id]?.currentAction || "sleep"}
						actionId={puppets[authUser._id]?.actionId || 0}
						position="left"
					/>
					<PuppySprite
						userId={selectedConversation._id}
						type={selectedConversation.puppetType || "purple"}
						action={puppets[selectedConversation._id]?.currentAction || "sleep"}
						actionId={puppets[selectedConversation._id]?.actionId || 0}
						position="right"
					/>
					<MessageInput onPuppyAction={updatePuppetAction} puppyAction={puppets} />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};

