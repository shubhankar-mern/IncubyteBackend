const CompensationRecord = require("../entities/CompensationRecord");

class CompensationRecordRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findByEmployeeId(employeeId) {
    const rows = await this.prisma.compensationRecord.findMany({
      where: { employeeId },
      orderBy: { effectiveDate: "desc" },
    });

    return rows.map(
      (row) =>
        new CompensationRecord({
          ...row,
          salary: row.salary.toString(),
        })
    );
  }

  async create(data, tx = this.prisma) {
    const row = await tx.compensationRecord.create({
      data,
    });

    return new CompensationRecord({
      ...row,
      salary: row.salary.toString(),
    });
  }
}

module.exports = CompensationRecordRepository;