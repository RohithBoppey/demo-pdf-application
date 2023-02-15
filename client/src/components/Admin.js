import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./admin.css";

function Admin() {
	const [pendingPDFDetails, setPendingPDFDetails] = useState([]);

	useEffect(() => {
		const getDetails = async () => {
			const URL = "http://localhost:5000/pending-approval";
			const response = await axios.get(URL);
			console.log(response);
			const t = [];
			for (let i of response.data.result) {
				t.push({ id: i._id, filename: i.filename });
			}
			setPendingPDFDetails(t);
		};
		getDetails();
	}, []);

	const navigate = useNavigate();

	return (
		<div className="container">
			<h2 className="heading">InsurStaq Demo Admin Side Application</h2>
			<br></br>
			<br></br>
			{pendingPDFDetails.length !== 0 ? <table>
				<thead>
					<tr>
						<th>Name of the PDF File</th>
						<th>ID of the PDF File</th>
						<th>Preview</th>
					</tr>
				</thead>
				<tbody>
					{pendingPDFDetails.length !== 0 &&
						pendingPDFDetails.map((det) => (
							<tr>
								<td>{det.filename}</td>
								<td>{det.id}</td>
								<td>
									<button
										className="btn btn-success btn-lg"
										onClick={() => {
											navigate(`/details/${det.filename}`);
										}}>
										Preview
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>: <h5>Hoorah! No pending Applications</h5>}
		</div>
	);
}

export default Admin;
