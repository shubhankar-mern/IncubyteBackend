
class AnalyticsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getOverview() {
    const [totalEmployees, totalDepartments, countries] =
      await Promise.all([
        this.prisma.employee.count(),
        this.prisma.department.count(),
        this.prisma.employee.groupBy({
          by: ["country"],
        }),
      ]);

    return {
      totalEmployees,
      totalDepartments,
      totalCountries: countries.length,
    };
  }

  async getEmployeesByCountry() {
    const results = await this.prisma.employee.groupBy({
      by: ["country"],
      _count: {
        _all: true,
      },
      orderBy: {
        country: "asc",
      },
    });

    return results.map((row) => ({
      country: row.country,
      employeeCount: row._count._all,
    }));
  }

  async getEmployeesByDepartment() {
    const [departments, employeeCounts] = await Promise.all([
      this.prisma.department.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      this.prisma.employee.groupBy({
        by: ["departmentId"],
        _count: {
          _all: true,
        },
      }),
    ]);

    const countByDepartment = new Map(
      employeeCounts.map((row) => [
        row.departmentId,
        row._count._all,
      ])
    );

    return departments.map((department) => ({
      departmentId: department.id,
      departmentName: department.name,
      employeeCount: countByDepartment.get(department.id) ?? 0,
    }));
  }

  
async getPayroll({ departmentId, country } = {}) {
  const employees = await this.prisma.employee.findMany({
    where: {
      ...(departmentId ? { departmentId } : {}),
      ...(country ? { country } : {}),
    },
    select: {
      id: true,
      compensation: {
        where: {
          effectiveDate: {
            lte: new Date(),
          },
        },
        orderBy: [
          { effectiveDate: "desc" },
          { createdAt: "desc" },
        ],
        take: 1,
        select: {
          salary: true,
          currency: true,
        },
      },
    },
  });

  const payrollByCurrency = new Map();

  for (const employee of employees) {
    const currentCompensation = employee.compensation[0];

    if (!currentCompensation) continue;

    const { salary, currency } = currentCompensation;
    const current = payrollByCurrency.get(currency) ?? {
      currency,
      employeeCount: 0,
      totalPayroll: 0,
      averageSalary: 0,
    };

    current.employeeCount += 1;
    current.totalPayroll += Number(salary);
    payrollByCurrency.set(currency, current);
  }

  return Array.from(payrollByCurrency.values()).map((item) => ({
    ...item,
    totalPayroll: Number(item.totalPayroll.toFixed(2)),
    averageSalary: Number(
      (item.totalPayroll / item.employeeCount).toFixed(2)
    ),
  }));
};


async getSalaryTrends({ from, to, departmentId, country }) {
  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T23:59:59.999Z`);

  const records = await this.prisma.compensationRecord.findMany({
    where: {
      effectiveDate: {
        gte: fromDate,
        lte: toDate,
      },
      employee: {
        ...(departmentId ? { departmentId } : {}),
        ...(country ? { country } : {}),
      },
    },
    select: {
      salary: true,
      currency: true,
      effectiveDate: true,
    },
    orderBy: {
      effectiveDate: "asc",
    },
  });

  const trends = new Map();

  for (const record of records) {
    const month = record.effectiveDate.toISOString().slice(0, 7);
    const key = `${month}:${record.currency}`;

    const current = trends.get(key) ?? {
      month,
      currency: record.currency,
      salaryRevisionCount: 0,
      totalSalaryChanges: 0,
    };

    current.salaryRevisionCount += 1;
    current.totalSalaryChanges += Number(record.salary);

    trends.set(key, current);
  }

  return Array.from(trends.values()).map((item) => ({
    ...item,
    totalSalaryChanges: Number(item.totalSalaryChanges.toFixed(2)),
  }));
}


}

module.exports = AnalyticsRepository;
