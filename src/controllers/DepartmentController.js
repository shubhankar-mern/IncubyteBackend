class DepartmentController {
  constructor(departmentService) {
    this.departmentService = departmentService;
  }

  getAll = async (req, res, next) => {
    try {
      const departments =
        await this.departmentService.getDepartments();

      res.status(200).json({ data: departments });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const department =
        await this.departmentService.getDepartmentById(
          req.params.id
        );

      res.status(200).json({ data: department });
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const department =
        await this.departmentService.createDepartment(req.body);

      res.status(201).json({ data: department });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = DepartmentController;