const Department = require("../entities/Department");

class DepartmentRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    const rows = await this.prisma.department.findMany({
      orderBy: { name: "asc" },
    });

    return rows.map((row) => new Department(row));
  }

  async findById(id) {
    const row = await this.prisma.department.findUnique({
      where: { id },
    });

    return row ? new Department(row) : null;
  }

  async create(data) {
    const row = await this.prisma.department.create({ data });
    return new Department(row);
  }
}

module.exports = DepartmentRepository;