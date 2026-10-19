const request = require("supertest");
const app = require("../src");
jest.mock("../src/services", () => ({
  employeeService: {
    getEmployees: jest.fn(),
    getEmployeeById: jest.fn(),
    createEmployee: jest.fn(),
    updateEmployee: jest.fn(),
    deleteEmployee: jest.fn(),
  },

  authService: {
    login: jest.fn(),
  },

  hrService: {
    getHrById: jest.fn(),
  },

  compensationService: {
    getHistory: jest.fn(),
    updateSalary: jest.fn(),
  },

  departmentService: {
    getDepartments: jest.fn(),
    getDepartmentById: jest.fn(),
    createDepartment: jest.fn(),
  },

  analyticsService: {
    getOverview: jest.fn(),
    getEmployeesByCountry: jest.fn(),
    getEmployeesByDepartment: jest.fn(),
    getPayroll: jest.fn(),
    getSalaryTrends: jest.fn(),
  },
}));

describe("Compensation API", () => {
  test("should return compensation history", async () => {
    const { compensationService } = require("../src/services");

    compensationService.getHistory.mockResolvedValue([
      { id: "comp-1", salary: "80000", currency: "INR" },
    ]);

    const response = await request(app)
      .get("/api/compensation/emp-1/history");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(compensationService.getHistory).toHaveBeenCalledWith("emp-1");
  });

  test("should update employee salary", async () => {
    const { compensationService } = require("../src/services");

    compensationService.updateSalary.mockResolvedValue({
      id: "comp-2",
      salary: "90000",
      currency: "INR",
    });

    const response = await request(app)
      .post("/api/compensation/emp-1")
      .send({
        salary: 90000,
        currency: "INR",
        effectiveDate: "2026-10-19",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.salary).toBe("90000");
    expect(compensationService.updateSalary).toHaveBeenCalledWith(
      "emp-1",
      {
        salary: 90000,
        currency: "INR",
        effectiveDate: "2026-10-19",
      }
    );
  });
});

describe("Department API", () => {
  test("should return departments", async () => {
    const { departmentService } = require("../src/services");

    departmentService.getDepartments.mockResolvedValue([
      { id: "dept-1", name: "Engineering" },
      { id: "dept-2", name: "Finance" },
    ]);

    const response = await request(app).get("/api/departments");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

  test("should create a department", async () => {
    const { departmentService } = require("../src/services");

    departmentService.createDepartment.mockResolvedValue({
      id: "dept-3",
      name: "Operations",
    });

    const response = await request(app)
      .post("/api/departments")
      .send({ name: "Operations" });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Operations");
    expect(departmentService.createDepartment).toHaveBeenCalledWith({
      name: "Operations",
    });
  });
});

describe("Analytics API", () => {
  test("should return dashboard overview", async () => {
    const { analyticsService } = require("../src/services");

    analyticsService.getOverview.mockResolvedValue({
      totalEmployees: 50,
      totalDepartments: 5,
    });

    const response = await request(app).get("/api/analytics/overview");

    expect(response.status).toBe(200);
    expect(response.body.totalEmployees).toBe(50);
  });

  test("should reject salary trends when dates are missing", async () => {
    const { analyticsService } = require("../src/services");

    const response = await request(app)
      .get("/api/analytics/salary-trends");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Both from and to dates are required"
    );
    expect(analyticsService.getSalaryTrends).not.toHaveBeenCalled();
  });
});
