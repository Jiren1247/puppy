import { useEffect, useState } from "react";
import "../../css/puppySprite.css";

const PuppySprite = ({ action }) => {
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		if (!action) return;

		setIsPlaying(true);
		const timer = setTimeout(() => {
			setIsPlaying(false);
		}, 30000); // 播放 30 秒

		return () => clearTimeout(timer);
	}, [action]);
    console.log("🐶 PuppySprite action:", action);

	return (
		<div className="relative inset-0 flex items-center justify-center pointer-events-none z-50">
			<div
				className={`puppy-sprite ${isPlaying ? `puppy-${action}` : "puppy-sleep"}`}
			></div>
		</div>
	);
};

export default PuppySprite;
