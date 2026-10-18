class CompensationController {
  constructor(compensationService) {
    this.compensationService = compensationService;
  }

  getHistory = async (req, res, next) => {
    try {
      const history = await this.compensationService.getHistory(
        req.params.employeeId
      );

      res.status(200).json({ data: history });
    } catch (error) {
      next(error);
    }
  };

  updateSalary = async (req, res, next) => {
    try {
      const record = await this.compensationService.updateSalary(
        req.params.employeeId,
        {
          salary: req.body.salary,
          currency: req.body.currency,
          effectiveDate: req.body.effectiveDate,
        }
      );

      res.status(201).json({ data: record });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CompensationController;