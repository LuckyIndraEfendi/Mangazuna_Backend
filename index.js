import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import manga from "./routes/manga.js";
import manhua from "./routes/manhua.js";
import manhwa from "./routes/manhwa.js";
import search from "./routes/search.js";
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Lucky KomikAPI",
  });
});

app.use("/api/v1/komik", manga);
app.use("/api/v1/komik", manhua);
app.use("/api/v1/komik", manhwa);
app.use("/api/v1/komik", search);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
