import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import UserPageLayout from "../../../components/Layouts/UserPageLayout";
import {
  FileButton,
  TextInput,
  Button,
  MultiSelect,
  Tooltip,
  Modal,
  Text,
  Switch,
  ActionIcon,
} from "@mantine/core";
import useUIForm from "./useUIForm";
import { useNavigate } from "react-router-dom";
import FormGroup from "../../../components/Layouts/FormGroup";
import ImageCropper from "../../../components/Singletons/ImageCropper";
import CONFIG from "../../../utils/app_config";
import { DatePicker, TimeInput } from "@mantine/dates";
import CustomLoader from "../../../components/common/Loader";
import { Practitioner } from "../../../models/Practitioner";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
} from "@reduxjs/toolkit/dist/query";
import { IconCheck, IconX, IconClock } from "@tabler/icons";
import ServerErrorPartial from "../../../components/partials/ServerError.Partial";
import { ServerError } from "../../../models/Error";

type CreateMutationType = UseMutation<
  MutationDefinition<
    {
      token: string;
      practitioner: Practitioner;
    },
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
    never,
    any,
    "practitioner"
  >
>;

type UpdateMutationType = UseMutation<
  MutationDefinition<
    {
      token: string;
      practitionerId: string;
      practitioner: Practitioner;
    },
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
    never,
    any,
    "practitioner"
  >
>;

interface Props {
  practitioner?: Practitioner;
  mutation: CreateMutationType | UpdateMutationType;
  purpose: "Create" | "Update";
}

export default function FormPage(props: Props) {
  const { practitioner, mutation, purpose } = props;
  const { accessToken } = useAppSelector((state) => state.authReducer);
  const [file, setFile] = useState<File | null>(null);
  const [showImageCropModal, setShowImageCropModal] = useState(false);
  const navigate = useNavigate();

  const startTimeRef = useRef<HTMLInputElement>();
  const endTimeRef = useRef<HTMLInputElement>();

  const {
    form,
    isLoading: formLoading,
    isError: formError,
  } = useUIForm({
    practitioner,
  });

  const [
    submitFunction,
    {
      isLoading: mutationLoading,
      isError: mutationError,
      isSuccess: mutationSuccess,
      error: mutationErrorData,
    },
  ] = mutation();

  useEffect(() => {
    if (mutationSuccess) {
      updateNotification({
        id: "create-practitioner",
        title:
          purpose === "Create" ? "Creation Successful" : "Update Successful",
        message: `Practitioner ${
          purpose === "Create" ? "created" : "updated"
        } successfully`,
        color: "green",
        icon: <IconCheck />,
      });
      navigate("/practitioner");
    } else if (mutationError) {
      updateNotification({
        id: "create-practitioner",
        title: "Error",
        message: `There was an error while ${
          purpose === "Create" ? "creating" : "updating"
        } the practitioner`,
        color: "red",
        icon: <IconX />,
      });
    } else if (mutationLoading) {
      showNotification({
        id: "create-practitioner",
        title: "Please Wait...",
        message: `Please wait while we ${
          purpose === "Create" ? "create" : "update"
        } the practitioner`,
        color: "blue",
        loading: true,
      });
    }
  }, [mutationSuccess, mutationError, mutationLoading]);

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

      const submitArgs = {
        token: accessToken as string,
        practitioner: submitData,
        practitionerId: practitioner
          ? (practitioner.id as number).toString()
          : "",
      };
      await submitFunction(submitArgs);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <UserPageLayout title={`${props.purpose} Practitioner`}>
      <ServerErrorPartial
        errors={(mutationErrorData as any)?.data as ServerError}
      />
      {!formLoading && !formError && (
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
                            : practitioner
                            ? practitioner.image
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
              ref={startTimeRef}
              format="24"
              label="Start Time of Practitioner"
              withAsterisk
              {...form.getInputProps("startTime")}
              rightSection={
                <ActionIcon onClick={() => startTimeRef.current?.showPicker()}>
                  <IconClock size="1rem" stroke={1.5} />
                </ActionIcon>
              }
            />
            <TimeInput
              ref={endTimeRef}
              label="End Time of Practitioner"
              withAsterisk
              {...form.getInputProps("endTime")}
              rightSection={
                <ActionIcon onClick={() => endTimeRef.current?.showPicker()}>
                  <IconClock size="1rem" stroke={1.5} />
                </ActionIcon>
              }
            />
          </FormGroup>
          <FormGroup>
            <Switch
              label="ICU Specialist"
              checked={form.values.icuSpecialist}
              {...form.getInputProps("icuSpecialist")}
            />
          </FormGroup>
          <Button loading={mutationLoading} mt="xl" type="submit">
            {purpose} Practitioner
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
      {formLoading && <CustomLoader />}
    </UserPageLayout>
  );
}
