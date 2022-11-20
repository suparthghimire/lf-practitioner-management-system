import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import CONFIG from "../utils/app_config";
import { setTokens } from "./auth/auth.slice";

/**
 * This is a wrapper around the default fetchBaseQuery that will automatically
 * refresh the access token if the API returns a 401 response.
 */

const baseQuery = fetchBaseQuery({ baseUrl: CONFIG.SERVER_URL });

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async function (args, api, extraOptions) {
  const url = (args as any).url as string;

  // Don't try to refresh the token if we're already trying to refresh it
  let result = await baseQuery(args, api, extraOptions);

  // if user is signing out, don't try to refresh token
  if (url === "/signout") {
    return result;
  }

  // if original request was successful, return the result
  if (!result.error) return result;
  // if original request failed, try to refresh the token
  else if (result.error && result.error.status === 401) {
    // refresh the token. Refresh token is saved by server in cookie
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
      // if refresh token was successful, save tokens to store
      api.dispatch(
        setTokens({
          accessToken: (refreshResult.data as any).data?.accessToken,
          refreshToken: (refreshResult.data as any).data?.refreshToken,
        })
      );
      // Retry original request with new token
      const token = (refreshResult.data as any).data!.accessToken;
      // replace result with new result
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
  }
  // return the result
  return result;
};
export default baseQueryWithReauth;
