const express = require("express");
const router = express.Router();
const user = require("../models/user.model");

router.post("/login", async (req, res) => {
  await user.login(req.body).then((payload) => res.json(payload));
});

router.get("/logout", async (req, res) => {
  await user.logout(req.headers.userid).then((payload) => res.json(payload));
});

module.exports = router;
