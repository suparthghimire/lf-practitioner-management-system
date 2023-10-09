import { workingDayApi } from "./workingDay/workingDay.query";

import { specializationApi } from "./specialization/specialization.query";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./auth/auth.query";
import { practitionerAuthApi } from "./auth/practitioner/auth.query";
import { practitionerApi } from "./practitioner/practitioner.query";
import { userApi } from "./user/user.query";
import { attendanceApi } from "./attendance/attendance.query";

import { setupListeners } from "@reduxjs/toolkit/query/react";
import authReducer from "./auth/auth.slice";
import attendanceReducer from "./attendance/attendance.slice";
import practitionerAuthReducer from "./auth/practitioner/auth.slice";
import practitionerReducer from "./practitioner/practitioner.slice";
import workingDayReducer from "./workingDay/workingDay.slice";
import specializationReducer from "./specialization/specialization.slice";
import userReducer from "./user/user.slice";

/**
 * Redux Store
 */

const store = configureStore({
  reducer: {
    authReducer: authReducer,
    [authApi.reducerPath]: authApi.reducer,

    practitionerAuthReducer: practitionerAuthReducer,
    [practitionerAuthApi.reducerPath]: practitionerAuthApi.reducer,

    practitionerReducer: practitionerReducer,
    [practitionerApi.reducerPath]: practitionerApi.reducer,

    specializationReducer: specializationReducer,
    [specializationApi.reducerPath]: specializationApi.reducer,

    workingDayReducer: workingDayReducer,
    [workingDayApi.reducerPath]: workingDayApi.reducer,

    userReducer: userReducer,
    [userApi.reducerPath]: userApi.reducer,

    attendanceReducer: attendanceReducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
  },

  /**
   * Middleware for RTK Query
   */

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      practitionerAuthApi.middleware,
      practitionerApi.middleware,
      specializationApi.middleware,
      workingDayApi.middleware,
      userApi.middleware,
      attendanceApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);

export default store;
