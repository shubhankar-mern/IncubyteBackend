const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET|| "default_secret_key",
      {
        issuer: "acme-salary-management",
        audience: "acme-api",
      }
    );

    req.auth = { hrId: payload.sub };
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired session",
    });
  }
}

module.exports = requireAuth;