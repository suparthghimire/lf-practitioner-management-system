import { useAppSelector } from "../../redux/hooks";
import { Flex, Text } from "@mantine/core";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
import InfoCard from "../../components/Singletons/InfoCard";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.authReducer);

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
}
