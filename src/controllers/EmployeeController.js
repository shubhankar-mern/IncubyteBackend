class EmployeeController {
  constructor(employeeService) {
    this.employeeService = employeeService;
  }

  getAll = async (req, res, next) => {
    try {
      const result = await this.employeeService.getEmployees({
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 25,
        search: req.query.search,
        country: req.query.country,
        departmentId: req.query.departmentId,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const employee = await this.employeeService.getEmployeeById(
        req.params.id
      );

      res.status(200).json({ data: employee });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const employee = await this.employeeService.createEmployee(
        req.body
      );

      res.status(201).json({ data: employee });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const employee = await this.employeeService.updateEmployee(
        req.params.id,
        req.body
      );

      res.status(200).json({ data: employee });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.employeeService.deleteEmployee(req.params.id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = EmployeeController;