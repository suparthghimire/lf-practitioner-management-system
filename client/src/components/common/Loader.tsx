import { Center, Loader } from "@mantine/core";

export default function CustomLoader() {
  return (
    <Center mt={"xl"} style={{ height: "50vh" }}>
      <Loader />;
    </Center>
  );
}
