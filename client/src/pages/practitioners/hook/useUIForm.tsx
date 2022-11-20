import { zodResolver, useForm } from "@mantine/form";
import { Practitioner, PractitionerSchema } from "../../../models/Practitioner";
import { useAppSelector } from "../../../redux/hooks";
import { useGetSpecializationsQuery } from "../../../redux/specialization/specialization.query";
import { useGetWorkingDaysQuery } from "../../../redux/workingDay/workingDay.query";
import { useEffect, useState } from "react";
export default function useUIForm({
  practitioner,
}: {
  practitioner?: Practitioner;
}) {
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

  console.log(practitioner);
  const isLoading = specializationsLoading || workingDaysLoading;
  const isError = specializationsError || workingDaysError;
  const form = useForm<
    Practitioner & {
      allDays: string[];
      allSpecializations: string[];
    }
  >({
    initialValues: {
      fullname: practitioner ? practitioner.fullname : "",
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

  useEffect(() => {
    if (practitioner) {
      form.setFieldValue("fullname", practitioner.fullname);
      form.setFieldValue("email", practitioner.email);
      form.setFieldValue("address", practitioner.address);
      form.setFieldValue("contact", practitioner.contact);
      form.setFieldValue("image", practitioner.image);

      const dob = new Date(practitioner.dob);
      const startDateTime = new Date(practitioner.startTime);
      const endDateTime = new Date(practitioner.endTime);

      form.setFieldValue("dob", dob);
      form.setFieldValue("endTime", endDateTime);
      form.setFieldValue("startTime", startDateTime);
      form.setFieldValue("icuSpecialist", practitioner.icuSpecialist);
      const workingDayNames = practitioner.WorkingDays.map((d) => {
        const dataFromApi = d as unknown as { id: number; day: string };
        return dataFromApi.day;
      });
      form.setFieldValue("WorkingDays", workingDayNames);
      const specializationNames = practitioner.Specializations?.map((spec) => {
        const dataFromApi = spec as unknown as { id: number; name: string };
        return dataFromApi.name;
      });
      form.setFieldValue("Specializations", specializationNames);
    }
  }, [practitioner]);

  return { form, isLoading, isError };
}
