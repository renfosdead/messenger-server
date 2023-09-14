const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const UserMiddleware = require("../middlewares/user.middleware");

router.post("/login", UserMiddleware.isCorrectLoginFields, async (req, res) => {
  await UserController.login(req)
    .then((payload) => res.json(payload))
    .catch((err) => res.json(err));
});

router.get("/logout", async (req, res) => {
  await UserController.logout(req)
    .then((payload) => res.json(payload))
    .catch((err) => res.json(err));
});

router.post("/name", UserMiddleware.isCorrectNameFields, async (req, res) => {
  await UserController.changeName(req)
    .then((payload) => res.json(payload))
    .catch((err) => res.json(err));
});

router.post(
  "/change_status",
  UserMiddleware.isCorrectStatusFields,
  async (req, res) => {
    await UserController.changeStatus(req)
      .then((payload) => res.json(payload))
      .catch((err) => res.json(err));
  }
);

router.post(
  "/change_custom_status",
  UserMiddleware.isCorrectCustomStatusFields,
  async (req, res) => {
    await UserController.changeCustomStatus(req)
      .then((payload) => res.json(payload))
      .catch((err) => res.json(err));
  }
);

module.exports = router;
