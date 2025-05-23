import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import PuppyButton from "./PuppyButton";
// import PuppySprite from "./PuppySprite";

const MessageInput = ({ onPuppyAction, puppyAction }) => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();
	// const [puppyAction, setPuppyAction] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};

	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>

			<div className='w-full relative flex space-x-2'>
				{/* <div className='absolute left-0 z-20'>
					<PuppySprite action={puppyAction} />
				</div> */}
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<div className="absolute inset-y-0 end-10 flex items-center pe-3">
					<PuppyButton
						message={message}
						onPuppyAction={onPuppyAction}
					/>
				</div>
				<div>
					<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
						{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
					</button>
				</div>

			</div>
		</form>
	);
};
export default MessageInput;
