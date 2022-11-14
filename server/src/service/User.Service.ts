import { User } from "../models/User";
import { prismaClient } from "../index";
import bcrypt from "bcrypt";
const UserService = {
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
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  },
};
export default UserService;
