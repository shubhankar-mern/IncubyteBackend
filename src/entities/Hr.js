class Hr {
  constructor({
    id,
    name,
    age,
    departmentId,
    dateOfJoining,
    email,
    passwordHash,
    role
  }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.departmentId = departmentId;
    this.dateOfJoining = new Date(dateOfJoining);
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
  }

  getDetails() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      departmentId: this.departmentId,
      dateOfJoining: this.dateOfJoining,
      email: this.email,
      role: this.role
    };
  }
}

module.exports = Hr;