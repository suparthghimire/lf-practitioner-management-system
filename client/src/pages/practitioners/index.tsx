import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
import { useGetPractitionersQuery } from "../../redux/practitioner/practitioner.query";
import { Center, Text, Table, Pagination, ScrollArea } from "@mantine/core";
import { Practitioner } from "../../models/Practitioner";
import { usePagination } from "@mantine/hooks";

import PractitionerTableRow from "../../components/Singletons/PractitionerTableRow";
import CustomLoader from "../../components/common/Loader";
export default function PractitionerIndexPage() {
  const { accessToken } = useAppSelector((state) => state.authReducer);

  const [urlParams, setUrlParams] = useSearchParams();

  const strPage = urlParams.get("page");
  const strLimit = urlParams.get("limit");

  const [currPage, setCurrPage] = useState((strPage && parseInt(strPage)) || 1);
  const [limit, setLimit] = useState((strLimit && parseInt(strLimit)) || 10);

  const [totalPages, setTotalPage] = useState(0);
  const navigate = useNavigate();
  let pagination = usePagination({
    total: totalPages,
    initialPage: currPage,
  });
  const {
    isLoading: practitionerLoading,
    data,
    refetch,
  } = useGetPractitionersQuery({
    token: accessToken ?? "",
    page: pagination.active,
    limit: limit,
  });

  useEffect(() => {
    console.log(data);
    refetch();
    console.log("REFETCH");

    setTotalPage(data?.totalPages ?? 0);
  }, [data]);

  if (!practitionerLoading)
    return (
      <UserPageLayout title="All Practitioners">
        <Pagination
          radius="xl"
          page={pagination.active}
          onChange={(page) => {
            pagination.setPage(page);
            2;
            setCurrPage(page);
            navigate(`/practitioner?page=${page}&limit=5`);
          }}
          size="sm"
          total={totalPages}
        />
        {data?.data && (
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
                {data?.data?.length > 0 ? (
                  data?.data?.map((practitioner: Practitioner, sn: number) => {
                    return (
                      <PractitionerTableRow
                        key={`Single-Practitioner-${practitioner.id}`}
                        sn={sn + 1}
                        practitioner={practitioner}
                        refetch={refetch}
                      />
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9}>
                      <Center mt="xl">
                        <Text size="xl" italic weight="bold" color="dimmed">
                          No Practitioners Found
                        </Text>
                      </Center>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollArea>
        )}
      </UserPageLayout>
    );
  return <CustomLoader />;
}
