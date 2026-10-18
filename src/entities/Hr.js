class Hr {
  constructor({
    id,
    name,
    age,
    departmentId,
    dateOfJoining,
  }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.departmentId = departmentId;
    this.dateOfJoining = new Date(dateOfJoining);
  }

  getDetails() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      departmentId: this.departmentId,
      dateOfJoining: this.dateOfJoining,
    };
  }
}

module.exports = Hr;