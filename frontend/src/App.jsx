import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import { initSocket } from "./socket/socket";
import { useEffect } from "react";

function App() {
	const { authUser } = useAuthContext();
	useEffect(() => {
		// console.log("authUser", authUser?._id);
		if (authUser?._id) {
			initSocket(authUser._id);
		} else {
			console.warn("⚠️ Cannot initialize socket: authUser is invalid", authUser);
		}
	}, [authUser]);
	
	return (
		<div className='p-4 h-screen flex items-center justify-center'>
			<Routes>
				<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
				<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
				<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
