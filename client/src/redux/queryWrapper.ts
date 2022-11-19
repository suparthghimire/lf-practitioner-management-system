import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import CONFIG from "../utils/app_config";
import { setLoading, setTokens } from "./auth/auth.slice";

const baseQuery = fetchBaseQuery({ baseUrl: CONFIG.SERVER_URL });

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async function (args, api, extraOptions) {
  api.dispatch(setLoading(true));

  const url = (args as any).url as string;
  let result = await baseQuery(args, api, extraOptions);
  if (url === "/signout") {
    return result;
  }
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
      console.log("Set Here", (refreshResult.data as any).data);
      api.dispatch(
        setTokens({
          accessToken: (refreshResult.data as any).data?.accessToken,
          refreshToken: (refreshResult.data as any).data?.refreshToken,
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
export default baseQueryWithReauth;
