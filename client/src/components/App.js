import React, { useState } from "react";

import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";

import axios from "axios";

function App() {
	const defaultInstance = defaultLayoutPlugin();

	const [finalPDFFile, setFinalPDFFile] = useState(null);
	const [viewablePDF, setViewablePDF] = useState(null);

	const [err, setErr] = useState("");


	const fileType = ["application/pdf"];

	const onChangeHandler = (event) => {
		let file = event.target.files[0];
		if (file) {
			if (file && fileType.includes(file.type)) {
				setFinalPDFFile(file);
				// let reader = new FileReader();
				// reader.readAsDataURL(file);
				// reader.onloadend = (event) => {
				// 	setFinalPDFFile(event.target.result);
				// 	setErr("");
				// };
			} else {
				setFinalPDFFile(null);
				setErr("Please Select Valid PDF");
			}
		} else {
			console.log("Select a PDF file of good clarity");
		}
	};

	const submitHandler = (event) => {
		// console.log(event.target)
		event.preventDefault();
		if (finalPDFFile !== null) {
			// console.log(finalPDFFile);
				let reader = new FileReader();
					reader.readAsDataURL(finalPDFFile);
					reader.onloadend = (event) => {
						// console.log(typeof(event.target.result))
						// console.log((event.target.result))
						setViewablePDF(event.target.result);
						setErr("");
					};
		} else {
			setViewablePDF(null);
		}
	};


	const addToBackend = async () => {
		// Adding to backend happens here
		console.log("sending to backend")
		console.log(finalPDFFile)
		const URL = "http://localhost:5000/add-new-document"
		// generating formdata
		const config = {
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data'
		}
		if(finalPDFFile !== null){
			const formData = new FormData();
			formData.append("insurance_file", finalPDFFile, finalPDFFile.name)
			for (var key of formData.entries()) {
				console.log(key[0] + ', ' + key[1]);
			}
			const response = await axios.post(URL, formData, config);
			console.log(response);
			window.alert("Submitted successfully")
			window.location.reload();
		}
	}

	return (
		<div className="container">
			<h2 className="heading">InsurStaq Demo Application</h2>
			<br></br>
			<h5 className="heading-2">Please upload a form of good clarity and submit using the form below</h5>
			<br></br>
			<form className="form-group" onSubmit={submitHandler}>
				<input
					type="file"
					className="form-control"
					name='insurance_file'
					required
					onChange={onChangeHandler}
				/>
				{err && <div className="error-msg">{err}</div>}
				<br></br>

				<button type="submit" className="btn btn-success btn-lg">
					Upload and View PDF
				</button>
			</form>

			{/* show pdf conditionally (if we have one)  */}
			{viewablePDF && (
				<>
					<h4>View PDF</h4>
					<div className="pdf-container">
						<Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
							<Viewer
								fileUrl={viewablePDF}
								plugins={[defaultInstance]}
							/>
						</Worker>
					</div>
					<p className="final_verify">Make sure you verify the details before submitting the PDF.</p>
					
					<button onClick={addToBackend} className = 'btn btn-success btn-lg submit'>
						Submit
					</button>
				</>
			)}

			{/* if we dont have pdf or viewablePDF state is null */}
			{!viewablePDF && <>No pdf file selected</>}
		</div>
	);
}

export default App;
