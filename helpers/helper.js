const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const getNewId = () => {
  return uuidv4();
};

const newDate = () => new Date().toString();

function mustBeInArray(array, id) {
  return new Promise((resolve, reject) => {
    const row = array.find((r) => r.id == id);
    if (!row) {
      reject({
        message: "No such ID",
        status: 404,
      });
    }
    resolve(row);
  });
}

function writeJSONFile(content) {
  fs.writeFileSync(getFileName(), JSON.stringify(content), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function copyLogFileToTemp() {
  console.log("copy datafile...");
  fs.copyFile(
    localFileName,
    serverFileName,
    fs.constants.COPYFILE_FICLONE,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("datafile copied");
      }
    }
  );
}

const localFileName = __dirname + "/../data/chat.json";
const serverFileName = "/tmp/chat.json";

function getFileName() {
  const filename =
    process.env.NODE_ENV === "prod" ? serverFileName : localFileName;
  return filename;
}

module.exports = {
  getNewId,
  newDate,
  mustBeInArray,
  writeJSONFile,
  copyLogFileToTemp,
  getFileName,
};
