const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const cors = require("cors");

const app = express();

// console.log(process.env.MONGOURL);
//to parse json content
app.use(express.json());
//to parse body from url
app.use(
	express.urlencoded({
		extended: false,
	})
);
app.use(methodOverride("_method"));
app.use(
	cors({
		origin: true,
	})
);

const conn = mongoose.createConnection(process.env.MONGOURL);
let gfs;

conn.once("open", () => {
	// Init stream
	gfs = new mongoose.mongo.GridFSBucket(conn.db, {
		bucketName: "uploads",
	});
});

// Create storage engine
const storage = new GridFsStorage({
	url: process.env.MONGOURL,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			const filename = file.originalname;
			const fileInfo = {
				filename: filename,
				bucketName: "uploads",
			};
			resolve(fileInfo);
		});
	},
});

const upload = multer({ storage });

app.listen(process.env.PORT, function () {
	console.log(`Application live on localhost: ${process.env.PORT}`);
});

// app.post("/add-new-document", (req, res) => {
// 	console.log("request received");
//     res.json({file: req.file})
// });

app.post("/add-new-document", upload.single("insurance_file"), (req, res) => {
	console.log("request received");
	console.log(req.file);
	const metadata = {
		status: false,
	};
	const file = req.file;
	const uploadStream = gfs.openUploadStream(file.originalname, {
		metadata: metadata,
	});

	uploadStream.end(file.buffer);

	uploadStream.on("finish", function () {
		console.log("File saved!");
	});
	res.json({ file: req.file });
});

app.get("/get", (req, res) => {
	gfs.find().toArray((err, files) => {
		if (!files && files.length === 0) {
			return res.status(404).json({
				err: "no files exist",
			});
		}
		return res.json(files);
	});
});

app.get("/get/:id", (req, res) => {
	const fn = req.params.id;
	gfs.find({ filename: fn }).toArray((err, file) => {
		// console.log(file);
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: "no files exist",
			});
		}
		const downloadStream = gfs.openDownloadStream(file[0]._id);
		let chunks = [];
		downloadStream.on("data", function (chunk) {
			chunks.push(chunk);
		});
		downloadStream.on("end", function () {
			const pdfData = Buffer.concat(chunks);
			const base64Data = pdfData.toString("base64");

			// Send the Base64 data in the response
			res.send({filename: fn, data: base64Data});
		});
	});
});

app.get("/pending-approval", async (req, res) => {
	let f = [];
	await gfs.find().toArray((err, files) => {
		if (!files && files.length === 0) {
			return res.status(404).json({
				err: "no files exist",
			});
		}
		files.forEach((file) => {
			// console.log(file);
			if (file.metadata !== undefined) {
				if (file.metadata.status === false) {
					f.push(file);
					// res.send({file})
				}
			}
		});
		res.send({ result: f });
	});
	// console.log(f);
});

app.post("/:id", async (req, res) => {
	const fn = req.params.id;
	console.log(fn);
	
	const document = await gfs.find({ filename: fn }).toArray();
	// console.log(document);
	document.map((doc) => {
		return gfs.delete(doc._id);
	});

	res.send(`Done`);

	// const documents = await gfs.find({ fn }).toArray();
	// if (documents.length === 0) {
	// 	throw new Error("FileNotFound");
	// }
	// );
});
