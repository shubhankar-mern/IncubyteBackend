const express = require("express");
const { compensationController } = require("../controllers");

const router = express.Router();

router.get(
  "/:employeeId/history",
  compensationController.getHistory
);

router.post(
  "/:employeeId",
  compensationController.updateSalary
);

module.exports = router;