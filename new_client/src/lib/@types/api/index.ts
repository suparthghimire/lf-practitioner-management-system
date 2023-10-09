declare module "@api/types" {
  export type T_Response<T> = {
    data: T;
    message: string;
    success: boolean;
  };

  export type T_ApiUser = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  export type T_LoginResponse<T> = T_Response<{
    accessToken: string;
    refreshToken: string;
    user: T;
  }>;
}
