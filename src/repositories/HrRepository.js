const Hr = require("../entities/Hr");

class HrRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findById(id) {
    const row = await this.prisma.hr.findUnique({
      where: { id },
      include: { department: true },
    });

    return row ? new Hr(row) : null;
  }

  async findByEmail(email) {
    const row = await this.prisma.hr.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    return row ? new Hr(row) : null;
  }

  async findAll() {
    const rows = await this.prisma.hr.findMany({
      include: { department: true },
      orderBy: { name: "asc" },
    });

    return rows.map((row) => new Hr(row));
  }
}

module.exports = HrRepository;