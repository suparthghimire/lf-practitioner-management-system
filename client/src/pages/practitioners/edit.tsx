import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
export default function PractitionerEditPage() {
  const { isAuthenticated, isLoading: userLoading } = useAppSelector(
    (state) => state.authReducer
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/signin", { replace: true });
    }
  }, [isAuthenticated, userLoading]);

  return (
    <UserPageLayout title="All Practitioners">
      <div>Edit</div>
    </UserPageLayout>
  );
}
