import { useMutation } from "@tanstack/react-query";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { createContext } from "react";
import { UserSignUp } from "../../api/endpoints/user";
import { T_User } from "@/schema/user";
import { T_ApiUser } from "@api/types";
import AuthReducer from "./authReducer";

type T_AuthPractitioner = {
  fullName: string;
};
type T_AuthUser = {
  name: string;
};

export type T_Auth =
  | {
      status: false;
    }
  | {
      status: true;
      type: "PRACTITIONER";
      user: T_ApiUser;
    }
  | {
      status: true;
      type: "USER";
      user: T_ApiUser;
    };

export type T_AuthContext = {
  auth: T_Auth;
  setAuth: (data: T_Auth) => void;
};
const initialState: T_AuthContext = {
  auth: {
    status: true,
    type: "PRACTITIONER",
    user: {
      id: -1,
      name: "",
      email: "",
      createdAt: "",
      updatedAt: "",
    },
  },
  setAuth: () => {},
};

const AuthContext = createContext<T_AuthContext>(initialState);

const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const [authState, authDispatch] = useReducer(AuthReducer, initialState);

  const setAuth = useCallback(
    (data: T_Auth) => authDispatch({ type: "SET_AUTH", payload: data }),
    []
  );

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        setAuth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
