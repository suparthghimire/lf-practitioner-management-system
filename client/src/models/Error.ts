// Type for error thrown by API
export type ServerError = {
  status: boolean;
  message: string;
  data?: { [x: string]: string[] | undefined };
};
