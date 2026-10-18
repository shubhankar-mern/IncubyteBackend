class CompensationService {
  constructor(prisma, employeeRepository, compensationRepository) {
    this.prisma = prisma;
    this.employeeRepository = employeeRepository;
    this.compensationRepository = compensationRepository;
  }

  async getHistory(employeeId) {
    const employee =
      await this.employeeRepository.findById(employeeId);

    if (!employee) {
      throw new Error("Employee not found");
    }

    return this.compensationRepository.findByEmployeeId(employeeId);
  }

  async updateSalary(employeeId, data) {
    if (!data.salary || !Number.isFinite(Number(data.salary))) {
      throw new Error("A valid salary is required");
    }

    if (Number(data.salary) < 0) {
      throw new Error("Salary cannot be negative");
    }

    const employee =
      await this.employeeRepository.findById(employeeId);

    if (!employee) {
      throw new Error("Employee not found");
    }

    return this.prisma.$transaction(async (tx) => {
      return this.compensationRepository.create(
        {
          employeeId,
          salary: data.salary,
          currency: data.currency,
          effectiveDate: new Date(data.effectiveDate),
        },
        tx
      );
    });
  }
}

module.exports = CompensationService;