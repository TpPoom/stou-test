import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { convertDate } from "./public/js/utils.js";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	const newsFile = path.join(__dirname, "public/data/news.json");
	let news = JSON.parse(fs.readFileSync(newsFile, "utf-8"));
	news = news.reverse();
	news.forEach((n) => {
		n.formattedDate = convertDate(n.date);
	});

	const imagesFolder = path.join(
		__dirname,
		"public/assets/uploads/infographic"
	);

	fs.readdir(imagesFolder, (err, files) => {
		if (err) {
			console.error("Error reading the directory:", err);
			return res.status(500).send("Internal Server Error");
		}

		const images = files.filter((file) => file.match(/\.(jpg|jpeg|png|gif)$/));

		res.render("layouts/main", {
			title: "หน้าหลัก",
			body: "../pages/home",
			images,
			news,
		});
	});
});

app.get("/committees", (req, res) => {
	const committeesFile = path.join(__dirname, "public/data/committees.json");
	const committees = JSON.parse(fs.readFileSync(committeesFile, "utf-8"));

	res.render("layouts/main", {
		title: "คณะกรรมการ",
		body: "../pages/committees",
		committees,
	});
});

app.get("/about", (req, res) => {
	const aboutFile = path.join(__dirname, "public/data/about.json");
	const about = JSON.parse(fs.readFileSync(aboutFile, "utf-8"));

	res.render("layouts/main", {
		title: "ประวัติสมาคม",
		body: "../pages/about",
		about: about.about,
		img: about.img,
	});
});

app.get("/contact", (req, res) => {
	const contactFile = path.join(__dirname, "public/data/contact.json");
	const contact = JSON.parse(fs.readFileSync(contactFile, "utf-8"));

	res.render("layouts/main", {
		title: "ติดต่อเรา",
		body: "../pages/contact",
		contact,
	});
});

app.get("/events", (req, res) => {
	res.render("layouts/main", {
		title: "ปฏิทินกิจกรรม",
		body: "../pages/events",
	});
});

app.get("/news/:id", (req, res) => {
	const newsFile = path.join(__dirname, "public/data/news.json");
	let news = JSON.parse(fs.readFileSync(newsFile, "utf-8"));
	news = news.reverse();
	news.forEach((n) => {
		n.formattedDate = convertDate(n.date);
	});

	const newsItem = news.find((n) => n.id === req.params.id);
	const newsIndex = news.findIndex((n) => n.id === req.params.id);
	if (newsIndex !== -1) {
		news.splice(newsIndex, 1);
	}

	news = news.slice(0, 4);

	if (!newsItem) {
		return res.status(404).send("News item not found");
	}

	res.render("layouts/main", {
		title: newsItem.title,
		body: "../pages/news",
		news,
		newsItem,
	});
});

app.use((req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		message: error.message,
		error: process.env.NODE_ENV === "development" ? error : {},
	});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
