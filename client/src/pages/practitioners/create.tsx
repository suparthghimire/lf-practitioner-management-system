import { useCreatePractitionerMutation } from "../../redux/practitioner/practitioner.query";
import FormPage from "./hook/FormPage";

export default function Create() {
  return <FormPage purpose="Create" mutation={useCreatePractitionerMutation} />;
}
