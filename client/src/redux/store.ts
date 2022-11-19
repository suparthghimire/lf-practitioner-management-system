import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { authApi } from "./auth/auth.query";
import { practitionerApi } from "./practitioner/practitioner.query";

import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer from "./auth/auth.slice";
import practitionerReducer from "./practitioner/practitioner.slice";

const store = configureStore({
  reducer: {
    authReducer: authReducer,
    [authApi.reducerPath]: authApi.reducer,

    practitionerReducer: practitionerReducer,
    [practitionerApi.reducerPath]: practitionerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      practitionerApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);

export default store;
