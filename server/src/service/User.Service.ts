import { User } from "../models/User";
import { prismaClient } from "../index";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import bcrypt from "bcrypt";
import { CustomError } from "./Error.Service";

const userSelectFields = {
  id: true,
  name: true,
  email: true,
  password: false,
  createdAt: true,
  updatedAt: true,
};

const UserService = {
  getUserByID: async function (id: number) {
    const user = await prismaClient.user.findUnique({
      where: { id },
      select: userSelectFields,
    });
    return user;
  },
  getUserIDByEmailPwd: async function (email: string, password: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new CustomError("Invalid Email or Password", 401);
    const storedPwd = user.password;
    const isPwdMatch = await bcrypt.compare(password, storedPwd);
    if (!isPwdMatch) throw new CustomError("Invalid Email or Password", 401);

    return user.id;
  },

  createUser: async function (user: User) {
    try {
      const { name, email, password } = user;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await prismaClient.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: userSelectFields,
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  },
};
export default UserService;
