import { useAppSelector } from "../../redux/hooks";
import { Center, Text } from "@mantine/core";
import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/common/Loader";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAppSelector(
    (state) => state.authReducer
  );
  const navigate = useNavigate();
  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    if (!isLoading && !isAuthenticated) {
      navigate("/signin", { replace: true });
    }
  }, [isLoading, isAuthenticated]);

  // if (isLoading) return <CustomLoader />;

  // if (!isAuthenticated) return <Center>Not Signed In</Center>;
  if (!isLoading && isAuthenticated)
    return (
      <div>
        <Text size="xl" weight="bolder">
          Welcome Back
        </Text>
        <Text size="lg" weight="bold">
          {user?.name}
        </Text>
      </div>
    );
  return <CustomLoader />;
}
