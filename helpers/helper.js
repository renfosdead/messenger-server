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

function writeJSONFile(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  getNewId,
  newDate,
  mustBeInArray,
  writeJSONFile,
};
