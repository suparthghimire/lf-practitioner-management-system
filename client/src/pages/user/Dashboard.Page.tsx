import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Flex, Text } from "@mantine/core";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
import InfoCard from "../../components/Singletons/InfoCard";
import { useGetDashboardDataQuery } from "../../redux/user/user.query";
import { useEffect } from "react";
import { setDashboard } from "../../redux/user/user.slice";

export default function DashboardPage() {
  const { user, accessToken } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();
  const { data, isError, isLoading, isSuccess, refetch } =
    useGetDashboardDataQuery(accessToken as string);
  const { practitionersWorkingToday } = useAppSelector(
    (state) => state.userReducer
  );

  useEffect(() => {
    console.log("REFETCH");
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setDashboard({
          practitionersWorkingToday: {
            totalPractitioners:
              data?.data?.practitonersWorkingToday?.totalPractitioners || 0,
            totalWorkingToday:
              data?.data?.practitonersWorkingToday?.todayData || 0,
            totalWorkingTodayPercentage:
              data?.data?.practitonersWorkingToday?.totalPercent || 0,
          },
        })
      );
    }
  }, [isSuccess]);

  return (
    <UserPageLayout title={`Welcome Back ${user?.name}`}>
      <Text size="lg" weight="bold">
        Dashboard
      </Text>
      <Flex mt="xl" gap="xl" className="mt-2">
        <InfoCard
          loading={isLoading}
          title="Practitioners"
          total={practitionersWorkingToday.totalPractitioners}
          completed={practitionersWorkingToday.totalWorkingToday}
          percentText="Working Today"
          stats={[
            {
              value: practitionersWorkingToday.totalWorkingToday,
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
}
