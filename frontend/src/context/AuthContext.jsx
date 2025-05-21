import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);

	useEffect(() => {
		const localUser = JSON.parse(localStorage.getItem("chat-user"));
		if (!localUser || !localUser._id) {
			console.warn("🧹 Removing invalid authUser from localStorage:", localUser);
			localStorage.removeItem("chat-user");
			setAuthUser(null);
		} else {
			setAuthUser(localUser);
		}
	}, []);

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};
