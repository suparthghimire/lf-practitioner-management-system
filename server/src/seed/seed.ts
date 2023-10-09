import bcrypt from "bcrypt";
import { Specialization, Day, DayName } from "prisma/prisma-client";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

import fs from "fs/promises";

async function main() {
  try {
    type ExtendedUser = {
      name: string;
      email: string;
      password: string;
      Practitioner: {
        fullname: string;
        address: string;
        contact: string;
        dob: Date;
        email: string;
        startTime: Date;
        endTime: Date;
        image: string;
        icuSpecialist: boolean;
        Specializations: string[];
        WorkingDays: DayName[];
      };
    };
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("password", salt);
    const users = [];
    for (let i = 0; i < 10; i++) {
      const days = Array(5)
        .fill("")
        .map((v) => faker.date.weekday() as DayName);
      const specializations = Array(5)
        .fill("")
        .map((v) => faker.name.jobTitle());
      const user = await prisma.user.create({
        include: {
          Practitioner: {
            include: {
              Specializations: true,
              WorkingDays: true,
            },
          },
        },
        data: {
          name: faker.name.firstName() + " " + faker.name.lastName(),
          email: faker.internet.email(),
          password: password,

          Practitioner: {
            create: {
              fullname: faker.name.firstName() + " " + faker.name.lastName(),
              address: faker.address.streetName(),
              contact: faker.phone.number().toString(),
              dob: new Date(),
              email: faker.internet.email(),
              endTime: new Date(),
              password: password,
              startTime: new Date(),
              image: faker.image.imageUrl(),
              icuSpecialist: Math.floor(Math.random() * 2) === 1,
              Specializations: {
                connectOrCreate: specializations.map((val) => {
                  return {
                    where: {
                      name: val,
                    },
                    create: {
                      name: val,
                    },
                  };
                }),
              },
              WorkingDays: {
                connectOrCreate: days.map((val) => {
                  return {
                    where: {
                      day: val,
                    },
                    create: {
                      day: val,
                    },
                  };
                }),
              },
            },
          },
        },
      });
      users.push(user);
    }

    const defaultUser = await prisma.user.create({
      data: {
        name: "Default User",
        email: "default_user@gmail.com",
        password: password,
      },
      include: {
        Practitioner: {
          include: {
            Specializations: true,
            WorkingDays: true,
          },
        },
      },
    });

    const testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: "testuser@gmail.com",
        password: password,
      },
      include: {
        Practitioner: {
          include: {
            Specializations: true,
            WorkingDays: true,
          },
        },
      },
    });

    users.push(defaultUser);
    users.push(testUser);
    await fs.writeFile("./src/seed/seed.json", JSON.stringify(users));
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
}

main();
