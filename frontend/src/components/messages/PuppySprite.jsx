import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PuppySprite = ({ userId, type = "purple", action = "sleep", actionId = 0, position = "left" }) => {
	const [isPlayingAction, setIsPlayingAction] = useState(false);

	useEffect(() => {
		if (!action || action === "sleep") return;

		setIsPlayingAction(true);

		const timer = setTimeout(() => {
			setIsPlayingAction(false);
		}, 30000);

		return () => clearTimeout(timer);
	}, [actionId]);

	const getGifPath = (type, action) => `/assets/${type}/${action}.gif`;

	const sleepPositionClass = position === "left" ? "left-4" : "right-4";
	const actionPositionClass =
		position === "left"
			? "left-1/4 -translate-x-1/2"
			: "right-1/4 translate-x-1/2";

	return (
		<>
			{/* 💤 默认状态：静态 sleep 表情 */}
			{!isPlayingAction && (
				<div className={`fixed bottom-10 ${sleepPositionClass}`}>
					<img
						src={getGifPath(type, "sleep")}
						alt={`${type}-sleep`}
						className="w-20 h-20"
					/>
				</div>
			)}

			{/* 🎬 动作播放区域 */}
			<AnimatePresence>
				{isPlayingAction && (
					<motion.div
						key={`${userId}-${actionId}`}
						className={`fixed top-1/4 ${actionPositionClass} transform -translate-y-1/2 z-50`}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.5 }}
					>
						<img
							src={getGifPath(type, action)}
							onError={(e) => (e.target.src = getGifPath(type, "sleep"))}
							alt={`${type}-${action}`}
							className="w-32 h-32"
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default PuppySprite;
