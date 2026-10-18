class Employee {
  constructor({
    id,
    name,
    age,
    dateOfJoining,
    country,
    currency,
    currentSalary,
    departmentId,
  }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.dateOfJoining = new Date(dateOfJoining);
    this.country = country;
    this.currency = currency;
    this.currentSalary = Number(currentSalary);
    this.departmentId = departmentId;
  }

  updateSalary(newSalary) {
    if (!Number.isFinite(newSalary) || newSalary < 0) {
      throw new Error("Salary must be a non-negative number");
    }

    this.currentSalary = newSalary;
  }

  getDetails() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      dateOfJoining: this.dateOfJoining,
      country: this.country,
      currency: this.currency,
      currentSalary: this.currentSalary,
      departmentId: this.departmentId,
    };
  }
}

module.exports = Employee;