import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
import { useGetPractitionersQuery } from "../../redux/practitioner/practitioner.query";
import CustomLoader from "../../components/common/Loader";
import { Table, Pagination, ScrollArea } from "@mantine/core";
import { Practitioner } from "../../models/Practitioner";
import { usePagination } from "@mantine/hooks";
import PractitionerTableRow from "../../components/Singletons/PractitionerTableRow";
export default function PractitionerIndexPage() {
  const { accessToken } = useAppSelector((state) => state.authReducer);

  const [urlParams, setUrlParams] = useSearchParams();

  const strPage = urlParams.get("page");
  const strLimit = urlParams.get("limit");

  const [currPage, setCurrPage] = useState((strPage && parseInt(strPage)) || 1);
  const [limit, setLimit] = useState((strLimit && parseInt(strLimit)) || 5);

  const [totalPages, setTotalPage] = useState(0);
  const navigate = useNavigate();
  let pagination = usePagination({
    total: totalPages,
    initialPage: currPage,
  });
  const { isLoading: practitionerLoading, data } = useGetPractitionersQuery({
    token: accessToken ?? "",
    page: pagination.active,
    limit: limit,
  });

  useEffect(() => {
    setTotalPage(data?.totalPages ?? 0);
  }, [data]);

  return (
    <UserPageLayout title="All Practitioners">
      <Pagination
        radius="xl"
        page={pagination.active}
        onChange={(page) => {
          pagination.setPage(page);
          setCurrPage(page);
          navigate(`/practitioner?page=${page}&limit=5`);
        }}
        size="sm"
        total={totalPages}
      />
      {practitionerLoading ? (
        <p>Loading</p>
      ) : (
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
                  <PractitionerTableRow
                    key={`Single-Practitioner-${practitioner.id}`}
                    sn={sn + 1}
                    practitioner={practitioner}
                  />
                );
              })}
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </UserPageLayout>
  );
}
