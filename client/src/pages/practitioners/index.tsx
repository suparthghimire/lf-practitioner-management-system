import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
import { useGetPractitionersQuery } from "../../redux/practitioner/practitioner.query";
import CustomLoader from "../../components/common/Loader";
import { Table, Pagination, ScrollArea } from "@mantine/core";
import { Practitioner } from "../../models/Practitioner";
import { usePagination } from "@mantine/hooks";
import PractitionerTableRow from "../../components/Singletons/PractitionerTableRow";
export default function PractitionerIndexPage() {
  const {
    isAuthenticated,
    isLoading: userLoading,
    accessToken,
  } = useAppSelector((state) => state.authReducer);

  const navigate = useNavigate();
  const [totalPages, setTotalPage] = useState(0);

  let pagination = usePagination({
    total: totalPages,
    initialPage: 1,
  });
  const {
    isLoading: practitionerLoading,
    data,
    isError,
    error,
  } = useGetPractitionersQuery({
    token: accessToken ?? "",
    page: pagination.active,
    limit: 5,
  });

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/signin", { replace: true });
    }
  }, [isAuthenticated, userLoading]);

  useEffect(() => {
    setTotalPage(data?.totalPages ?? 0);
  }, [data]);

  if (practitionerLoading) {
    return <CustomLoader />;
  }

  return (
    <UserPageLayout title="All Practitioners">
      <Pagination
        radius="xl"
        page={pagination.active}
        onChange={(page) => pagination.setPage(page)}
        size="sm"
        total={totalPages}
      />
      <ScrollArea>
        <Table mt="xl">
          <thead>
            <tr>
              <th>SN</th>
              <th>ID</th>
              <th>Full Name</th>
              <th>Contact</th>
              <th>Date of Birth</th>
              <th>ICU Specialist</th>
              <th>Working Days</th>
              <th>Working Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((practitioner: Practitioner, sn: number) => {
              return (
                <PractitionerTableRow sn={sn + 1} practitioner={practitioner} />
              );
            })}
          </tbody>
        </Table>
      </ScrollArea>
    </UserPageLayout>
  );
}
