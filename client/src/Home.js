import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "./components/Admin";
import App from "./components/App";
import Preview from "./components/Preview";

const Home = () => {
	return (
		<Routes>
			<Route path="/" exact element={<App />} />
			<Route path="/admin" exact element={<Admin />} />
			<Route path="/details/:id" exact element={<Preview />} />
		</Routes>
	);
};

export default Home;
