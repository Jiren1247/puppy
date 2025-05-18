import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Unauthorized: No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // 👈 包含 { id: user._id }
		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
};

export default verifyToken;
