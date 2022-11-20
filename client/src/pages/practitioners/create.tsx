import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
import {
  FileButton,
  TextInput,
  Button,
  MultiSelect,
  Tooltip,
  Modal,
  Text,
} from "@mantine/core";
import FormGroup from "../../components/Layouts/FormGroup";
import { DatePicker, TimeInput } from "@mantine/dates";
import useUIForm from "./hook/useUIForm";
import CustomLoader from "../../components/common/Loader";
import ImageCropper from "../../components/Singletons/ImageCropper";
import CONFIG from "../../utils/app_config";
import { Practitioner } from "../../models/Practitioner";
import { useCreatePractitionerMutation } from "../../redux/practitioner/practitioner.query";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";

export default function PractitionerCreatePage() {
  const { accessToken } = useAppSelector((state) => state.authReducer);
  const [file, setFile] = useState<File | null>(null);
  const [showImageCropModal, setShowImageCropModal] = useState(false);

  const [
    createUser,
    {
      isLoading: practitionerCreateLoading,
      isSuccess: practitionerCreateSuccess,
      isError: practitionerCreateError,
      data,
    },
  ] = useCreatePractitionerMutation();

  useEffect(() => {
    if (practitionerCreateSuccess) {
      updateNotification({
        id: "create-practitioner",
        title: "Creation Successful",
        message: "Practitioner created successfully",
        color: "green",
        icon: <IconCheck />,
      });
    } else if (practitionerCreateError) {
      updateNotification({
        id: "create-practitioner",
        title: "Error",
        message: "There was an error creating the practitioner",
        color: "green",
        icon: <IconX />,
      });
    } else if (practitionerCreateLoading) {
      showNotification({
        id: "create-practitioner",
        title: "Please Wait...",
        message: "Please wait while we create the practitioner",
        color: "blue",
        loading: true,
      });
    }
  }, [
    practitionerCreateLoading,
    practitionerCreateSuccess,
    practitionerCreateError,
  ]);

  async function handleSubmit(values: Practitioner) {
    try {
      const submitData: any = {
        ...form.values,
        WorkingDays: form.values.WorkingDays.map((day) => ({
          id: -1,
          day: day,
        })),
        Specializations: form.values.Specializations?.map((spec) => ({
          id: -1,
          name: spec,
        })),
      };

      delete submitData["allDays"];
      delete submitData["allSpecializations"];

      await createUser({
        token: accessToken as string,
        practitioner: submitData,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const { form, isLoading, isError } = useUIForm();

  return (
    <UserPageLayout title="Create New Practitioner">
      {!isLoading && !isError && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <>
            <FileButton
              onChange={(f) => {
                setFile(f);
                form.setFieldValue("image", f);
                setShowImageCropModal(true);
              }}
              accept="image/jpeg, image/png"
            >
              {(props) => (
                <Tooltip position="right" label="Upload Practitioner Image">
                  <Button
                    p={0}
                    // unstyled
                    {...props}
                    style={{
                      height: "250px",
                      width: "250px",
                      border: form.errors.image ? "1px solid red" : 0,
                      background: "transparent",
                      color: "black",
                      borderRadius: "50%",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                  >
                    <div
                      style={{
                        height: "250px",
                        width: "250px",
                        border: 0,
                        background: "#fa52522a",
                        color: "black",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    >
                      <img
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        src={
                          file
                            ? URL.createObjectURL(file)
                            : "/assets/camera_image_upload.svg"
                        }
                      />
                    </div>
                  </Button>
                </Tooltip>
              )}
            </FileButton>
            {form.errors.image && (
              <Text mt="xs" className="error-label">
                {form.errors.image}
              </Text>
            )}
          </>

          <FormGroup cols={1} style={{ marginTop: "1rem" }}>
            <TextInput
              label="Full Name of Practitioner"
              withAsterisk
              placeholder="Jhon Doe"
              {...form.getInputProps("fullname")}
            />
          </FormGroup>
          <FormGroup
            style={{
              marginTop: "1rem",
            }}
          >
            <TextInput
              label="Email of Practitioner"
              withAsterisk
              placeholder="jhon@doe.com"
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Contact of Practitioner"
              withAsterisk
              placeholder="xxx-xxx-xxxx"
              {...form.getInputProps("contact")}
            />
          </FormGroup>
          <FormGroup
            style={{
              marginTop: "1rem",
            }}
          >
            <DatePicker
              placeholder="January 18, 2000"
              label="Date of Birth of Practitioner"
              withAsterisk
              {...form.getInputProps("dob")}
            />
            <TextInput
              label="Address of Practitioner"
              withAsterisk
              placeholder="Kirtipur, Kathmandu"
              {...form.getInputProps("address")}
            />
          </FormGroup>
          <FormGroup
            style={{
              marginTop: "1rem",
            }}
          >
            <MultiSelect
              placeholder="Sunday"
              label="Create or Select Working Days for Practitioner"
              multiple
              data={form.values.allDays.map((day) => day)}
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(value: string) => {
                form.insertListItem("allDays", value);
                return value;
              }}
              withAsterisk
              {...form.getInputProps("WorkingDays")}
            />
            <MultiSelect
              placeholder="OPD"
              label="Create or Select Specializations for Practitioner"
              multiple
              data={form.values.allSpecializations.map((spec) => spec)}
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(value: string) => {
                form.insertListItem("allSpecializations", value);
                return value;
              }}
              withAsterisk
              {...form.getInputProps("Specializations")}
            />
          </FormGroup>
          <FormGroup
            style={{
              marginTop: "1rem",
            }}
          >
            <TimeInput
              format="24"
              label="Start Time of Practitioner"
              withAsterisk
              {...form.getInputProps("startTime")}
            />
            <TimeInput
              label="End Time of Practitioner"
              withAsterisk
              {...form.getInputProps("endTime")}
            />
          </FormGroup>
          <Button loading={practitionerCreateLoading} mt="xl" type="submit">
            Create Practitioner
          </Button>
          {file && CONFIG.IMAGE_ACCEPT_MIMES.includes(file.type) && (
            <Modal
              title="Crop Image"
              centered
              withCloseButton={false}
              opened={showImageCropModal}
              onClose={() => {}}
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <ImageCropper
                  src={URL.createObjectURL(file as File)}
                  type={file.type}
                  setFile={setFile}
                  modalClose={setShowImageCropModal}
                />
              </div>
            </Modal>
          )}
        </form>
      )}
      {isLoading && <CustomLoader />}
    </UserPageLayout>
  );
}
