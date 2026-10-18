class CompensationRecord {
  constructor({
    id,
    employeeId,
    salary,
    currency,
    effectiveDate,
    createdAt = new Date(),
  }) {
    this.id = id;
    this.employeeId = employeeId;
    this.salary = Number(salary);
    this.currency = currency;
    this.effectiveDate = new Date(effectiveDate);
    this.createdAt = new Date(createdAt);
  }

  getDetails() {
    return {
      id: this.id,
      employeeId: this.employeeId,
      salary: this.salary,
      currency: this.currency,
      effectiveDate: this.effectiveDate,
      createdAt: this.createdAt,
    };
  }
}

module.exports = CompensationRecord;