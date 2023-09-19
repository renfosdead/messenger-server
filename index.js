const FileHelper = require("./helpers/file.js");
if (process.env.NODE_ENV === "prod") {
  FileHelper.copyLogFileToTemp();
}

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const nocache = require("nocache");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(nocache());
app.disable("view cache");
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  res.set("fetchCache", "force-no-store");

  next();
});
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./routes/index.routes"));

app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.listen("1337");
