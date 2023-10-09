import { T_User } from "@/schema/user";
import { axiosInstance } from "../interceptor";
import { AxiosResponse } from "axios";
import { T_LoginResponse } from "@api/types";

export const UserSignUp = async (data: T_User) => {
  const response: AxiosResponse<{ id: number } & T_User> =
    await axiosInstance.post("/user/signup", data);
  return response.data;
};
