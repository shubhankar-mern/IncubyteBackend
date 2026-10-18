
class AnalyticsController {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  getOverview = async (req, res) => {
    try {
      const result = await this.analyticsService.getOverview();
      res.status(200).json(result);
    } catch (error) {
      console.error("Analytics overview error:", error);
      res.status(500).json({
        message: "Failed to fetch analytics overview",
      });
    }
  };

  getEmployeesByCountry = async (req, res) => {
    try {
      const result =
        await this.analyticsService.getEmployeesByCountry();

      res.status(200).json(result);
    } catch (error) {
      console.error("Country analytics error:", error);
      res.status(500).json({
        message: "Failed to fetch country analytics",
      });
    }
  };

  getEmployeesByDepartment = async (req, res) => {
    try {
      const result =
        await this.analyticsService.getEmployeesByDepartment();

      res.status(200).json(result);
    } catch (error) {
      console.error("Department analytics error:", error);
      res.status(500).json({
        message: "Failed to fetch department analytics",
      });
    }
  };
  getPayroll = async (req, res) => {
  try {
    const { departmentId, country } = req.query;

    const result = await this.analyticsService.getPayroll({
      departmentId,
      country,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Payroll analytics error:", error);

    res.status(500).json({
      message: "Failed to fetch payroll analytics",
    });
  }
};

getSalaryTrends = async (req, res) => {
  try {
    const { from, to, departmentId, country } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        message: "Both from and to dates are required",
      });
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(to) ||
      Number.isNaN(Date.parse(`${from}T00:00:00.000Z`)) ||
      Number.isNaN(Date.parse(`${to}T00:00:00.000Z`)) ||
      from > to
    ) {
      return res.status(400).json({
        message: "Provide valid dates in YYYY-MM-DD format, with from <= to",
      });
    }

    const result = await this.analyticsService.getSalaryTrends({
      from,
      to,
      departmentId,
      country,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Salary trends error:", error);

    return res.status(500).json({
      message: "Failed to fetch salary trends",
    });
  }
};

}

module.exports = AnalyticsController;
