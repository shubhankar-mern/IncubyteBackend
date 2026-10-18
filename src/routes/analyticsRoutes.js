
const express = require("express");
const { analyticsController } = require("../controllers");

const router = express.Router();

router.get("/overview", analyticsController.getOverview);
router.get(
  "/employees-by-country",
  analyticsController.getEmployeesByCountry
);
router.get(
  "/employees-by-department",
  analyticsController.getEmployeesByDepartment
);
router.get("/payroll", analyticsController.getPayroll);

router.get("/salary-trends", analyticsController.getSalaryTrends);
module.exports = router;
