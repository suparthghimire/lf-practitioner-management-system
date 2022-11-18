import { UserLogin, User } from "./../../models/User";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import CONFIG from "../../utils/app_config";
import { resetUser, setLoading, setTokens } from "./auth.slice";

const baseQuery = fetchBaseQuery({ baseUrl: CONFIG.SERVER_URL });

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async function (args, api, extraOptions) {
  api.dispatch(setLoading(true));

  const url = (args as any).url as string;
  let result = await baseQuery(args, api, extraOptions);
  console.log(url);
  if (url === "/signout") {
    return result;
  }
  console.log("OUT");
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/refresh",
        method: "POST",
        credentials: "include",
      },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      api.dispatch(
        setTokens({
          accessToken: (refreshResult.data as any).accessToken,
          refreshToken: (refreshResult.data as any).refreshToken,
        })
      );
      const token = (refreshResult.data as any).data!.accessToken;
      result = await baseQuery(
        {
          url: (args as any).url,
          method: (args as any).method,
          body: (args as any).body,
          headers: {
            ...((args as any).headers || {}),
            authorization: token,
          },
          credentials: "include",
        },
        api,
        extraOptions
      );
    }
  } else {
    // api.dispatch(resetUser());
  }
  api.dispatch(setLoading(false));
  return result;
};

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (body: UserLogin) => ({
        url: "/signin",
        method: "POST",
        credentials: "include",
        body,
      }),
    }),
    signup: builder.mutation({
      query: (body: User) => ({
        url: "/signup",
        method: "POST",
        credentials: "include",
        body,
      }),
    }),
    signout: builder.mutation({
      query: () => {
        console.log("signout");
        return {
          url: "/signout",
          credentials: "include",
          method: "DELETE",
        };
      },
    }),
    myData: builder.query({
      query: (token: string) => {
        return {
          url: "/",
          credentials: "include",
          headers: {
            authorization: token,
          },
        };
      },
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useSignoutMutation,
  useMyDataQuery,
} = authApi;
