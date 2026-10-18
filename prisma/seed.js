
require("dotenv").config();
const prisma = require("../src/lib/prisma");

const departments = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Sales",
  "Marketing",
  "Operations",
  "Legal",
  "Customer Support",
];

const countries = [
  { name: "India", currency: "INR", min: 500000, max: 3000000 },
  { name: "United States", currency: "USD", min: 60000, max: 200000 },
  { name: "United Kingdom", currency: "GBP", min: 35000, max: 120000 },
  { name: "Germany", currency: "EUR", min: 40000, max: 130000 },
  { name: "Canada", currency: "CAD", min: 55000, max: 160000 },
  { name: "Australia", currency: "AUD", min: 60000, max: 170000 },
];

const firstNames = [
  "Aarav", "Priya", "Rahul", "Emma", "Noah",
  "Olivia", "Liam", "Mia", "Arjun", "Sophia",
  "Ishaan", "Ava", "Rohan", "Amelia", "Daniel",
];

const lastNames = [
  "Sharma", "Patel", "Singh", "Smith", "Brown",
  "Wilson", "Miller", "Davis", "Taylor", "Anderson",
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(items) {
  return items[randomInt(0, items.length - 1)];
}

function randomDate(start, end) {
  return new Date(
    start.getTime() +
      Math.random() * (end.getTime() - start.getTime())
  );
}

async function main() {
  console.log("Creating departments...");

  const departmentRecords = [];

  for (const name of departments) {
    const department = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    departmentRecords.push(department);
  }

  console.log("Preparing 10,000 employees...");

  const now = new Date();
  const startDate = new Date("2018-01-01T00:00:00.000Z");

  const employees = [];

  for (let i = 1; i <= 10000; i++) {
    const country = randomItem(countries);
    const department = randomItem(departmentRecords);
    const dateOfJoining = randomDate(startDate, now);

    employees.push({
      employeeNumber: `EMP${String(i).padStart(5, "0")}`,
      name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      age: randomInt(21, 60),
      dateOfJoining,
      country: country.name,
      currency: country.currency,
      departmentId: department.id,
    });
  }

  console.log("Inserting employees...");

  // Chunk inserts to keep individual queries manageable.
  const batchSize = 1000;

  for (let i = 0; i < employees.length; i += batchSize) {
    await prisma.employee.createMany({
      data: employees.slice(i, i + batchSize),
      skipDuplicates: true,
    });

    console.log(
      `Processed employees ${Math.min(i + batchSize, employees.length)} / ${employees.length}`
    );
  }

  console.log("Creating initial compensation records...");

  // Fetch the actual employees so existing records are not duplicated.
  const allEmployees = await prisma.employee.findMany({
    select: {
      id: true,
      employeeNumber: true,
      dateOfJoining: true,
      country: true,
      currency: true,
    },
  });

  const existingRecords = await prisma.compensationRecord.findMany({
    select: { employeeId: true },
    distinct: ["employeeId"],
  });

  const employeesWithCompensation = new Set(
    existingRecords.map((record) => record.employeeId)
  );

  const compensationRecords = allEmployees
    .filter((employee) => !employeesWithCompensation.has(employee.id))
    .map((employee) => {
      const country = countries.find(
        (item) => item.name === employee.country
      );

      return {
        employeeId: employee.id,
        salary: randomInt(country.min, country.max),
        currency: employee.currency,
        effectiveDate: employee.dateOfJoining,
      };
    });

  for (let i = 0; i < compensationRecords.length; i += batchSize) {
    await prisma.compensationRecord.createMany({
      data: compensationRecords.slice(i, i + batchSize),
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
