const { v4: uuidv4 } = require("uuid");
const mainStatuses = require("../messenger-types/src/main_statuses.js");
const customStatuses = require("../messenger-types/src/custom_statuses.js");

const getNewId = () => uuidv4();

function isCorrectStatus(status) {
  if (typeof status === "string" && mainStatuses.includes(status)) return true;

  return false;
}

function isCorrectCustomStatus(customStatus) {
  const { status, balloon, title, subtitle } = customStatus;

  if (typeof customStatus !== "object") return false;

  if (
    status &&
    (typeof status !== "string" || !customStatuses.includes(status))
  )
    return false;

  if (balloon !== undefined && typeof balloon !== "boolean") return false;

  if (title !== undefined && typeof title !== "string") return false;

  if (subtitle !== undefined && typeof subtitle !== "string") return false;

  return true;
}

module.exports = {
  getNewId,
  isCorrectStatus,
  isCorrectCustomStatus,
};
