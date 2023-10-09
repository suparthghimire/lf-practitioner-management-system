import { T_Auth, T_AuthContext } from "./AuthProvider";

type T_Actions = { type: "SET_AUTH"; payload: T_Auth };

const AuthReducer = (state: T_AuthContext, action: T_Actions) => {
  switch (action.type) {
    case "SET_AUTH":
      return state;
    default:
      return state;
  }
};

export default AuthReducer;
