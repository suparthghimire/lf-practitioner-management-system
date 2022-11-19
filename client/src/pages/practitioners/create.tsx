import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
import { useForm, zodResolver } from "@mantine/form";
import { Practitioner, PractitionerSchema } from "../../models/Practitioner";
import {
  FileButton,
  TextInput,
  Group,
  Text,
  Button,
  MultiSelect,
  Image,
  Tooltip,
  Modal,
} from "@mantine/core";
import FormGroup from "../../components/Layouts/FormGroup";
import { DatePicker, TimeInput } from "@mantine/dates";
import Logo from "../../components/common/Logo";
import ImageCropper from "../../components/Singletons/ImageCropper";
export default function PractitionerCreatePage() {
  const { isAuthenticated, isLoading: userLoading } = useAppSelector(
    (state) => state.authReducer
  );
  const user = useAppSelector((state) => state.authReducer.user);
  const [file, setFile] = useState<File | null>(null);
  const [showImageCropModal, setShowImageCropModal] = useState(false);

  const form = useForm<
    Practitioner & {
      _Days: string[];
      _Specializations: string[];
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
      image: "",
      WorkingDays: [
        {
          id: 1,
          day: "Sunday",
        },
      ],
      Specializations: [],
      _Days: ["1"],
      _Specializations: ["1"],
      icuSpecialist: false,
      createdBy: user?.id ?? -1,
    },
    validate: zodResolver(PractitionerSchema),
  });

  useEffect(() => {
    if (file !== null) setShowImageCropModal(true);
    else setShowImageCropModal(false);
  }, [file]);

  return (
    <UserPageLayout title="Create New Practitioner">
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values);
        })}
      >
        <FileButton
          onChange={(f) => {
            setFile(f);
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
                  height: "100px",
                  width: "100px",

                  border: 0,
                  background: "transparent",
                  color: "black",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                <>
                  <Image
                    width={100}
                    radius={10000}
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
                </>
              </Button>
            </Tooltip>
          )}
        </FileButton>
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
            data={form.values._Days.map((day) => day)}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(value: string) => {
              return value;
            }}
            withAsterisk
            {...form.getInputProps("Days")}
          />
          <MultiSelect
            placeholder="Sunday"
            label="Create or Select Specializations for Practitioner"
            multiple
            data={form.values._Specializations.map((spec) => spec)}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(value: string) => {
              return value;
            }}
            withAsterisk
            {...form.getInputProps("_Specializations")}
          />
        </FormGroup>
        <FormGroup
          style={{
            marginTop: "1rem",
          }}
        >
          <TimeInput
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
        <Button mt="xl">Create Practitioner</Button>
      </form>
      {/* <Modal
        centered
        title="Crop Image"
        opened={showImageCropModal}
        onClose={() => {
          setShowImageCropModal(false);
        }}
      >
        <ImageCropper file={file} />
      </Modal> */}
    </UserPageLayout>
  );
}
