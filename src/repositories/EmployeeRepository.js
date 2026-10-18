const Employee = require("../entities/Employee");

class EmployeeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findById(id) {
    const row = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        compensation: {
          where: { effectiveDate: { lte: new Date() } },
          orderBy: { effectiveDate: "desc" },
          take: 1,
        },
      },
    });

    if (!row) return null;

    return new Employee({
      ...row,
      currentSalary: row.compensation[0]?.salary.toString() ?? null,
    });
  }

  async findAll({ page = 1, limit = 25, search, country, departmentId } = {}) {
    const where = {
      ...(country && { country }),
      ...(departmentId && { departmentId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { employeeNumber: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
        include: {
          compensation: {
            where: { effectiveDate: { lte: new Date() } },
            orderBy: { effectiveDate: "desc" },
            take: 1,
          },
        },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return {
      data: rows.map(
        (row) =>
          new Employee({
            ...row,
            currentSalary: row.compensation[0]?.salary.toString() ?? null,
          })
      ),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data, tx = this.prisma) {
    const row = await tx.employee.create({ data });
    return new Employee(row);
  }

  async update(id, data, tx = this.prisma) {
    const row = await tx.employee.update({
      where: { id },
      data,
    });

    return new Employee(row);
  }

  async delete(id) {
    return this.prisma.employee.delete({
      where: { id },
    });
  }
}

module.exports = EmployeeRepository;