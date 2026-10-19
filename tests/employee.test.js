
jest.mock("../src/services", () => ({
  employeeService: {
    getEmployees: jest.fn(),
    getEmployeeById: jest.fn(),
    createEmployee: jest.fn(),
    updateEmployee: jest.fn(),
    deleteEmployee: jest.fn(),
  },
  authService: { login: jest.fn() },
  hrService: { getHrById: jest.fn() },
  compensationService: {},
  departmentService: {},
  analyticsService: {},
}));

const request = require("supertest");
const app = require("../src");
const { employeeService } = require("../src/services");

describe("Employee API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/employees should return employees", async () => {
    employeeService.getEmployees.mockResolvedValue({
      data: [{ id: "emp-1", name: "Aarav" }],
      total: 1,
      page: 1,
      limit: 25,
    });

    const response = await request(app).get("/api/employees");

    expect(response.status).toBe(200);
    expect(employeeService.getEmployees).toHaveBeenCalledWith({
      page: 1,
      limit: 25,
      search: undefined,
      country: undefined,
      departmentId: undefined,
    });
    expect(response.body.data).toHaveLength(1);
  });

  test("GET /api/employees should pass pagination and filters", async () => {
    employeeService.getEmployees.mockResolvedValue({ data: [], total: 0 });

    await request(app)
      .get("/api/employees?page=2&limit=10&search=Aarav&country=India&departmentId=dept-1")
      .expect(200);

    expect(employeeService.getEmployees).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      search: "Aarav",
      country: "India",
      departmentId: "dept-1",
    });
  });

  test("GET /api/employees/:id should return an employee", async () => {
    employeeService.getEmployeeById.mockResolvedValue({
      id: "emp-1",
      name: "Aarav",
    });

    const response = await request(app).get("/api/employees/emp-1");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      id: "emp-1",
      name: "Aarav",
    });
    expect(employeeService.getEmployeeById).toHaveBeenCalledWith("emp-1");
  });

  test("POST /api/employees should create an employee", async () => {
    const input = {
      employeeNumber: "EMP001",
      name: "Aarav",
      age: 30,
      country: "India",
      currency: "INR",
      departmentId: "dept-1",
    };

    employeeService.createEmployee.mockResolvedValue({
      id: "emp-1",
      ...input,
    });

    const response = await request(app)
      .post("/api/employees")
      .send(input);

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Aarav");
    expect(employeeService.createEmployee).toHaveBeenCalledWith(input);
  });

  test("PUT /api/employees/:id should update an employee", async () => {
    const input = { name: "Aarav Updated" };

    employeeService.updateEmployee.mockResolvedValue({
      id: "emp-1",
      ...input,
    });

    const response = await request(app)
      .put("/api/employees/emp-1")
      .send(input);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Aarav Updated");
    expect(employeeService.updateEmployee).toHaveBeenCalledWith(
      "emp-1",
      input
    );
  });

  test("PATCH /api/employees/:id should update an employee", async () => {
    employeeService.updateEmployee.mockResolvedValue({
      id: "emp-1",
      name: "Patched Name",
    });

    const response = await request(app)
      .patch("/api/employees/emp-1")
      .send({ name: "Patched Name" });

    expect(response.status).toBe(200);
    expect(employeeService.updateEmployee).toHaveBeenCalledWith(
      "emp-1",
      { name: "Patched Name" }
    );
  });

  test("DELETE /api/employees/:id should return 204", async () => {
    employeeService.deleteEmployee.mockResolvedValue(undefined);

    const response = await request(app)
      .delete("/api/employees/emp-1");

    expect(response.status).toBe(204);
    expect(employeeService.deleteEmployee).toHaveBeenCalledWith("emp-1");
  });

  test("should forward service errors to error middleware", async () => {
    employeeService.getEmployeeById.mockRejectedValue(
      new Error("Employee not found")
    );

    const response = await request(app).get("/api/employees/unknown");

    expect(response.status).toBe(500);
  });
});
