import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

import {BrowserRouter} from "react-router-dom";
import Home from "./Home";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Home />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);
