const express = require("express");

const employeeRoutes = require("./employeeRoutes");
const compensationRoutes = require("./compensationRoutes");
const departmentRoutes = require("./departmentRoutes");
const hrRoutes = require("./hrRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const authRoutes = require("./AuthRoutes");
const router = express.Router();

router.use("/employees", employeeRoutes);
router.use("/compensation", compensationRoutes);
router.use("/departments", departmentRoutes);
router.use("/hr", hrRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/auth",authRoutes);

module.exports = router;