import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { updateNotification, showNotification } from "@mantine/notifications";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
import {
  useGetSinglePractitionerQuery,
  useUpdatePractitionerMutation,
} from "../../redux/practitioner/practitioner.query";
import { IconCheck, IconX } from "@tabler/icons";
import { Practitioner } from "../../models/Practitioner";
import FormPage from "./hook/FormPage";
import CustomLoader from "../../components/common/Loader";
export default function PractitionerEditPage() {
  const params = useParams();
  const { accessToken } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [practitioner, setPractitioner] = useState<Practitioner>();
  const { data, isSuccess, isError, isLoading, refetch, error } =
    useGetSinglePractitionerQuery({
      token: accessToken as string,
      id: params.id as string,
    });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isError) {
      updateNotification({
        id: "get-single-practitioner",
        message: "Practitioner Not Found",
        color: "red",
        icon: <IconX />,
        title: "Error",
      });
      navigate("/practitioner", { replace: true });
    } else if (isLoading) {
      showNotification({
        id: "get-single-practitioner",
        message: "Loading Practitioner",
        color: "blue",
        loading: true,
        title: "Please Wait",
      });
    } else if (isSuccess) {
      setPractitioner(data.data);
      updateNotification({
        id: "get-single-practitioner",
        message: "Practitioner Found",
        color: "green",
        icon: <IconCheck />,
        title: "Success",
      });
    }
  }, [isError, isLoading, isSuccess]);

  if (isLoading) return <CustomLoader />;
  return (
    <FormPage
      purpose="Update"
      practitioner={practitioner}
      mutation={useUpdatePractitionerMutation}
    />
  );
}
