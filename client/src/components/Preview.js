import React, { useEffect, useState } from "react";

import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";

import axios from "axios";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import './preview.css'

function Preview() {
	const defaultInstance = defaultLayoutPlugin();
	const [viewablePDF, setViewablePDF] = useState(null);
	const [fileName, setFileName] = useState("");
	const { id } = useParams();

	const navigate = useNavigate()

	useEffect(() => {
		const getDetails = async () => {
			console.log(id);
			const response = await axios.get(`http://localhost:5000/get/${id}`);
			console.log(response);
			setViewablePDF(`data:application/pdf;base64,${response.data.data}`);
			setFileName(response.data.filename)
		};

		getDetails();
	});

    const markAsSuccess = async () => {
        const response = await axios.post(`http://localhost:5000/${fileName}`);
		console.log(response);
		window.alert('Marked as success');
		navigate('/admin');
    }

	return (
		<div className="preview-div">
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
					<p className="final_verify">
						Write your comments here after reviewing and submit here.
					</p>

                    <textarea rows = {7} cols = {100}>

                    </textarea>
                    <br></br>
					<button
						className="btn btn-success btn-lg submit"
                        onClick = {markAsSuccess}>
						Submit
					</button>
				</>
			)}

			{/* if we dont have pdf or viewablePDF state is null */}
			{!viewablePDF && <>No pdf file found</>}
		</div>
	);
}

export default Preview;
