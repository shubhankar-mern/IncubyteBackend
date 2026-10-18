class HrController {
  constructor(hrService) {
    this.hrService = hrService;
  }

  getAll = async (req, res, next) => {
    try {
      const users = await this.hrService.getAllHrUsers();

      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const user = await this.hrService.getHrById(req.params.id);

      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = HrController;