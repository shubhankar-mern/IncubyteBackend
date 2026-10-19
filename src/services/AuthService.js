
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  constructor(hrRepository) {
    this.hrRepository = hrRepository;
  }

  async login({ email, password }) {
    const hr = await this.hrRepository.findByEmail(
      email.trim().toLowerCase()
    );

    if (!hr) {
      throw new Error("Invalid email or password");
    }
    

    const isPasswordValid = await bcrypt.compare(
      password,
      hr.passwordHash
    );
   
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const accessToken = jwt.sign(
      { sub: hr.id },
      process.env.JWT_ACCESS_SECRET|| "default_secret_key",
      {
        expiresIn: "15m",
        issuer: "acme-salary-management",
        audience: "acme-api",
      }
    );

    return {
      accessToken,
      hr: {
        id: hr.id,
        name: hr.name,
        email: hr.email,
        role: hr.role,
      },
    };
  }
}

module.exports = AuthService;
