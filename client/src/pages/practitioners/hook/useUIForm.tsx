import { zodResolver, useForm } from "@mantine/form";
import { Practitioner, PractitionerSchema } from "../../../models/Practitioner";
import { useAppSelector } from "../../../redux/hooks";
import { useGetSpecializationsQuery } from "../../../redux/specialization/specialization.query";
import { useGetWorkingDaysQuery } from "../../../redux/workingDay/workingDay.query";
import { useEffect, useState } from "react";
export default function useUIForm() {
  const { user, accessToken } = useAppSelector((state) => state.authReducer);

  const {
    data: allSpecializations,
    isLoading: specializationsLoading,
    isError: specializationsError,
  } = useGetSpecializationsQuery(accessToken as string);
  const {
    data: allWorkingDays,
    isLoading: workingDaysLoading,
    isError: workingDaysError,
  } = useGetWorkingDaysQuery(accessToken as string);

  const isLoading = specializationsLoading || workingDaysLoading;
  const isError = specializationsError || workingDaysError;
  const form = useForm<
    Practitioner & {
      allDays: string[];
      allSpecializations: string[];
    }
  >({
    initialValues: {
      fullname: "",
      email: "",
      address: "",
      contact: "",
      dob: new Date(),
      endTime: new Date(),
      startTime: new Date(),
      image: null,
      WorkingDays: [""],
      Specializations: [],
      allDays: [],
      allSpecializations: [],
      icuSpecialist: false,
      createdBy: user?.id ?? -1,
    },
    validate: zodResolver(PractitionerSchema),
  });
  useEffect(() => {
    if (allWorkingDays && allWorkingDays.data) {
      // form.setFieldValue("WorkingDays", allWorkingDays.data);
      form.setFieldValue(
        "allDays",
        allWorkingDays.data.map((d: { id: number; day: string }) => d.day)
      );
    }
    if (allSpecializations && allSpecializations.data) {
      // form.setFieldValue("Specializations", allSpecializations.data);
      form.setFieldValue(
        "allSpecializations",
        allSpecializations.data.map((d: { id: number; name: string }) => d.name)
      );
    }
  }, [allSpecializations, allWorkingDays]);

  return { form, isLoading, isError };
}
