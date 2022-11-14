import { User } from "../models/User";
import { prismaClient } from "../index";
const UserService = {
  createUser: async function (user: User) {
    try {
      const { name, email, password } = user;
      const newUser = await prismaClient.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  },
};
export default UserService;
