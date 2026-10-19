const express = require("express");
const { hrController } = require("../controllers");

const router = express.Router();

router.get("/", hrController.getAll);
router.get("/:id", hrController.getById);
module.exports = router;