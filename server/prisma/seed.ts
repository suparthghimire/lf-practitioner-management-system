import { DayName, Specialization } from "prisma/prisma-client";
import { PrismaClient, User, Practitioner } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

import fs from "fs/promises";

async function main() {
  try {
    const users = [];
    for (let i = 0; i < 10; i++) {
      const weekDayName = faker.date.weekday() as DayName;
      const specializationName = faker.name.jobTitle();
      const user = {
        data: {
          name: faker.name.firstName() + " " + faker.name.lastName(),
          email: faker.internet.email(),
          password: "password",
          Practitioner: {
            create: {
              fullname: faker.name.firstName() + " " + faker.name.lastName(),
              address: faker.address.streetName(),
              contact: faker.phone.number().toString(),
              dob: new Date(),
              email: faker.internet.email(),
              endTime: new Date(),
              startTime: new Date(),
              image: faker.image.imageUrl(),
              icuSpecialist: Math.floor(Math.random() * 2) === 1,
              WorkingDays: {
                connectOrCreate: {
                  where: {
                    day: weekDayName,
                  },
                  create: {
                    day: weekDayName,
                  },
                },
              },
              Specializations: {
                connectOrCreate: {
                  where: {
                    name: specializationName,
                  },
                  create: {
                    name: specializationName,
                  },
                },
              },
            },
          },
        },
      };
      users.push(user);
    }
    const loginUser = {
      data: {
        name: "Default",
        email: "default_user@gmail.com",
        password: "password",
      },
    };
    users.push(loginUser);
    // // save the users to the json
    await fs.writeFile(
      "./prisma/seed_data.json",
      JSON.stringify(await Promise.all(users))
    );

    for (let i = 0; i < users.length; i++) {
      try {
        console.log("Creating", users[i]);
        const x = await prisma.user.create(users[i]);
      } catch (e) {
        console.log(e);
      }
    }
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
}

main();
