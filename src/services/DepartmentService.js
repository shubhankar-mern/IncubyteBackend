class DepartmentService {
  constructor(departmentRepository) {
    this.departmentRepository = departmentRepository;
  }

  async getDepartments() {
    return this.departmentRepository.findAll();
  }

  async getDepartmentById(id) {
    const department =
      await this.departmentRepository.findById(id);

    if (!department) {
      throw new Error("Department not found");
    }

    return department;
  }

  async createDepartment(data) {
    if (!data.name?.trim()) {
      throw new Error("Department name is required");
    }

    return this.departmentRepository.create({
      name: data.name.trim(),
    });
  }
}

module.exports = DepartmentService;