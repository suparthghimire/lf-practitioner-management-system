import { User } from "../models/User";
import { prismaClient } from "../index";
import bcrypt from "bcrypt";
import { CustomError } from "./Error.Service";

// Select fields to be returned from database
// Password is not returned
const userSelectFields = {
  id: true,
  name: true,
  email: true,
  password: false,
  createdAt: true,
  updatedAt: true,
};

const UserService = {
  // gets user by email
  getUserByID: async function (id: number) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { id },
        select: userSelectFields,
      });
      return user;
    } catch (error) {
      // error handeling is done in the controller
      throw error;
    }
  },
  // gets user by email and password
  getUserByEmailPwd: async function (email: string, password: string) {
    try {
      const user = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });
      // if not found, throw invalid email or passwortd
      if (!user) throw new CustomError("Invalid Email or Password", 401);

      // if found, compare password
      const storedPwd = user.password;
      const isPwdMatch = await bcrypt.compare(password, storedPwd);
      // if passwords donot match, throw invalid email or password

      if (!isPwdMatch) throw new CustomError("Invalid Email or Password", 401);
      // return user id
      return user;
    } catch (error) {
      // error handeling is done in the controller
      throw error;
    }
  },

  createUser: async function (user: User) {
    try {
      const { name, email, password } = user;
      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // create new user
      const newUser = await prismaClient.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: userSelectFields,
      });
      // return created user
      return newUser;
    } catch (error) {
      // error handeling is done in the controller
      throw error;
    }
  },
};
export default UserService;
