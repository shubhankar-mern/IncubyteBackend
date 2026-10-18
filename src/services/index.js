const prisma = require("../lib/prisma");

const EmployeeRepository = require("../repositories/EmployeeRepository");
const CompensationRepository = require("../repositories/CompensationRepository");
const DepartmentRepository = require("../repositories/DepartmentRepository");
const HrRepository = require("../repositories/HrRepository");

const EmployeeService = require("./EmployeeService");
const CompensationService = require("./CompensationService");
const DepartmentService = require("./DepartmentService");
const HrService = require("./HrService");

const employeeRepository = new EmployeeRepository(prisma);
const compensationRepository = new CompensationRepository(prisma);
const departmentRepository = new DepartmentRepository(prisma);
const hrRepository = new HrRepository(prisma);

module.exports = {
  employeeService: new EmployeeService(employeeRepository),
  compensationService: new CompensationService(
    prisma,
    employeeRepository,
    compensationRepository
  ),
  departmentService: new DepartmentService(departmentRepository),
  hrService: new HrService(hrRepository),
};