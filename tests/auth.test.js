
const request = require("supertest");
const app = require("../src");
const { authService, hrService } = require("../src/services");

const jwt = require("jsonwebtoken");
describe("Authentication API", () => {
  describe("POST /api/auth/login", () => {
    test("should reject missing credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Email and password are required"
      );
    });
  });

  describe("GET /api/auth/me", () => {
    test("should reject requests without an auth cookie", async () => {
      const response = await request(app)
        .get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Authentication required"
      );
    });
  });
});


jest.mock("../src/services", () => ({
  authService: {
    login: jest.fn(),
  },
  hrService: {
    getHrById: jest.fn(),
  },
  employeeService: {},
  compensationService: {},
  departmentService: {},
  analyticsService: {},
}));



describe("Authentication API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    test("should reject missing credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Email and password are required"
      );
    });

    test("should reject invalid credentials", async () => {
      authService.login.mockRejectedValue(
        new Error("Invalid email or password")
      );

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "emma.hr@acme.com",
          password: "wrong-password",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Invalid email or password"
      );
    });

    test("should log in and set an HttpOnly cookie", async () => {
      authService.login.mockResolvedValue({
        accessToken: "test-token",
        hr: {
          id: "hr-1",
          name: "Emma",
          email: "emma.hr@acme.com",
          role: "HR",
        },
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "emma.hr@acme.com",
          password: "correct-password",
        });

      expect(response.status).toBe(200);
      expect(response.body.hr.email).toBe("emma.hr@acme.com");

      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies.join(";")).toContain("accessToken=");
      expect(cookies.join(";").toLowerCase()).toContain("httponly");
    });
  });

  describe("GET /api/auth/me", () => {
    test("should reject requests without an auth cookie", async () => {
      const response = await request(app)
        .get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        "Authentication required"
      );
    });

    test("should return the authenticated HR profile", async () => {
      process.env.JWT_ACCESS_SECRET = "test-secret";

      const token = jwt.sign(
        { sub: "hr-1" },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "15m",
          issuer: "acme-salary-management",
          audience: "acme-api",
        }
      );

      hrService.getHrById.mockResolvedValue({
        id: "hr-1",
        name: "Emma",
        email: "emma.hr@acme.com",
        role: "HR",
      });

      const response = await request(app)
        .get("/api/auth/me")
        .set("Cookie", `accessToken=${token}`);

      expect(response.status).toBe(200);
      expect(response.body.hr.email).toBe("emma.hr@acme.com");
      expect(hrService.getHrById).toHaveBeenCalledWith("hr-1");
    });
  });

  describe("POST /api/auth/logout", () => {
    test("should clear the authentication cookie", async () => {
      const response = await request(app)
        .post("/api/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Logged out successfully"
      );

      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies.join(";")).toContain("accessToken=");
      expect(cookies.join(";")).toContain("Expires=");
    });
  });
});
