const express = require("express");
const router = express.Router();

const { logon, hello } = require("../controllers/auth");
const authenticate = require("../middleware/authenticate");

router.post("/logon", logon);

router.get("/hello", authenticate, hello);

module.exports = router;
