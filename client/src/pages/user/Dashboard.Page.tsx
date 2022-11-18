import { useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { Text, Button, Center } from "@mantine/core";
import { useEffect } from "react";
export default function DashboardPage() {
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.authReducer.user);
  const isAuthenticated = useAppSelector(
    (state) => state.authReducer.isAuthenticated
  );
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated]);
  if (!isAuthenticated) return <Center>Not Signed In</Center>;
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
