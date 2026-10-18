class Department {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  rename(newName) {
    if (!newName || !newName.trim()) {
      throw new Error("Department name cannot be empty");
    }

    this.name = newName.trim();
  }
}

module.exports = Department;