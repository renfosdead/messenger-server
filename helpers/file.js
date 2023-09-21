const fs = require("fs");

const writeJSONFile = (content) => {
  fs.writeFileSync(getFileName(), JSON.stringify(content), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const copyLogFileToTemp = () => {
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
};

const localFileName = __dirname + "/../data/chat.json";
const serverFileName = "/tmp/chat.json";

const getFileName = () => {
  const filename =
    process.env.NODE_ENV === "prod" ? serverFileName : localFileName;
  return filename;
};

const getChatData = () => {
  const data = fs.readFileSync(getFileName(), "utf8");
  return JSON.parse(data);
};

module.exports = {
  writeJSONFile,
  copyLogFileToTemp,
  getChatData,
};
