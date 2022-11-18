import CustomLoader from "../../components/common/Loader";
import { useMyDataQuery } from "../../redux/auth/auth.query";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUser } from "../../redux/auth/auth.slice";
import { Text, Button } from "@mantine/core";
export default function DashboardPage() {
  const navigate = useNavigate();
  const accessToken = useAppSelector((state) => state.authReducer.accessToken);

  const user = useAppSelector((state) => state.authReducer.user);

  const dispatch = useAppDispatch();

  const { isSuccess, isLoading, data, isError } = useMyDataQuery(
    accessToken ?? ""
  );

  if (isError) navigate("/signin");
  if (isLoading) return <CustomLoader />;
  if (isSuccess) dispatch(setUser(data?.data));
  return (
    <div>
      <Text size="xl" weight="bolder">
        Welcome Back
      </Text>
      <Text size="lg" weight="bold">
        {user?.name}
      </Text>
      {/* <Link to="/signin">
        <Button variant="light" color="teal">
          Sign In
        </Button>
      </Link>
      <Link to="/signup">
        <Button variant="light" color="blue">
          Sign Up
        </Button>
      </Link> */}
    </div>
  );
}
