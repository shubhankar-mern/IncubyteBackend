class HrService {
  constructor(hrRepository) {
    this.hrRepository = hrRepository;
  }

  async getHrById(id) {
    const hr = await this.hrRepository.findById(id);

    if (!hr) {
      throw new Error("HR user not found");
    }

    return hr;
  }

  async getHrByEmail(email) {
    const hr = await this.hrRepository.findByEmail(email);

    if (!hr) {
      throw new Error("HR user not found");
    }

    return hr;
  }

  async getAllHrUsers() {
    return this.hrRepository.findAll();
  }
}

module.exports = HrService;