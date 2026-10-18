const express = require("express");
const { departmentController } = require("../controllers");

const router = express.Router();

router.get("/", departmentController.getAll);
router.get("/:id", departmentController.getById);
router.post("/", departmentController.create);

module.exports = router;