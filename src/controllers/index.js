const {
  employeeService,
  compensationService,
  departmentService,
  hrService,
  authService,
} = require("../services");

console.log("Services export:", {
  authService: !!authService,
  hrService: !!hrService,
});

const EmployeeController = require("./EmployeeController");
const CompensationController = require("./CompensationController");
const DepartmentController = require("./DepartmentController");
const HrController = require("./HrController");

const AnalyticsController = require("./AnalyticsController");
const AuthController = require("./AuthController");
const { analyticsService } = require("../services");

module.exports = {
  employeeController: new EmployeeController(employeeService),
  compensationController: new CompensationController(
    compensationService
  ),
  departmentController: new DepartmentController(departmentService),
  hrController: new HrController(hrService),
  analyticsController: new AnalyticsController(analyticsService),
  authController: new AuthController(authService, hrService),
};