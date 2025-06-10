import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// PUT /api/user/updateProfile
export const updateUserProfile = async (req, res) => {
	try {
		const userId = req.user._id;
		const { personality } = req.body;

		const valid = ["introvert", "extrovert"];
		if (!valid.includes(personality)) {
			return res.status(400).json({ error: "Invalid personality type" });
		}

		const updated = await User.findByIdAndUpdate(
			userId,
			{ personality },
			{ new: true }
		);

		res.status(200).json({ message: "Personality updated", personality: updated.personality });
	} catch (error) {
		console.error("Update user profile error:", error.message);
		res.status(500).json({ error: "Server error" });
	}
};

