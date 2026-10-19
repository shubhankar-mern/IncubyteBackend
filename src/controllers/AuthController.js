
class AuthController {
  constructor(authService, hrService) {
    console.log("AuthService:", !!authService);
  console.log("HrService:", !!hrService);
  
    this.authService = authService;
    this.hrService = hrService;
    this.me = this.me.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
      ) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const { accessToken, hr } = await this.authService.login({
        email,
        password,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
        path: "/",
      });

      return res.status(200).json({
        message: "Login successful",
        hr,
      });
    } catch (error) {
      if (error.message === "Invalid email or password") {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  
async me(req, res, next) {
  try {
    const hr = await this.hrService.getHrById(req.auth.hrId);

    return res.json({
      hr: {
        id: hr.id,
        name: hr.name,
        email: hr.email,
        role: hr.role,
      },
    });
  } catch (error) {
    next(error);
  }
}
}

module.exports = AuthController;
