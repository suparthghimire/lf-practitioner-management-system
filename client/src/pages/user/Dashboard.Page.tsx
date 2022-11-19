import { useAppSelector } from "../../redux/hooks";
import { Center, Divider, Flex, Text } from "@mantine/core";
import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/common/Loader";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
import InfoCard from "../../components/Singletons/InfoCard";

const data = {
  Practitioners: {
    count: 5,
  },
  Specializations: {
    count: 5,
  },
};

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

  if (!isLoading && isAuthenticated)
    return (
      <UserPageLayout title={`Welcome Back ${user?.name}`}>
        <Text size="lg" weight="bold">
          Dashboard
        </Text>
        <Flex mt="xl" gap="xl" className="mt-2">
          <InfoCard
            title="Practitioners"
            total={2000}
            completed={420}
            percentText="Working Today"
            stats={[
              {
                value: 420,
                label: "Working Today",
              },
            ]}
            buttonLinks={[
              {
                label: "View All",
                color: "blue",
                href: "/practitioner",
              },
              {
                label: "Create new",
                color: "green",
                href: "/practitioner/create",
              },
            ]}
          />
        </Flex>
      </UserPageLayout>
    );
  return <CustomLoader />;
}
