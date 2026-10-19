
require("dotenv").config();

const bcrypt = require("bcrypt");
const prisma = require("../src/lib/prisma");

const hrUsers = [
  {
    name: "Aarav Sharma",
    email: "aarav.hr@acme.com",
    age: 32,
    department: "Human Resources",
  },
  {
    name: "Priya Patel",
    email: "priya.hr@acme.com",
    age: 29,
    department: "Human Resources",
  },
  {
    name: "Rahul Singh",
    email: "rahul.hr@acme.com",
    age: 35,
    department: "Engineering",
  },
  {
    name: "Emma Wilson",
    email: "emma.hr@acme.com",
    age: 31,
    department: "Finance",
  },
  {
    name: "Noah Smith",
    email: "noah.hr@acme.com",
    age: 33,
    department: "Operations",
  },
];

async function main() {
  console.log("Seeding HR accounts...");

  const passwordHash = await bcrypt.hash(
    process.env.HR_SEED_PASSWORD || "ChangeMeSample123!",
    12
  );

  for (const user of hrUsers) {
    const department = await prisma.department.findUnique({
      where: { name: user.department },
    });

    if (!department) {
      throw new Error(
        `Department "${user.department}" does not exist. Run your main seed first.`
      );
    }

    await prisma.hr.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        age: user.age,
        departmentId: department.id,
        passwordHash,
      },
      create: {
        name: user.name,
        email: user.email,
        age: user.age,
        departmentId: department.id,
        dateOfJoining: new Date("2024-01-15T00:00:00.000Z"),
        passwordHash,
        role: "HR",
      },
    });

    console.log(`Created/updated: ${user.email}`);
  }

  console.log("HR seeding completed.");
}

main()
  .catch((error) => {
    console.error("HR seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
