import { Image } from "@mantine/core";
import React from "react";

export default function Logo({ size = 150 }: { size?: number }) {
  return (
    <Image
      src="/logo.svg"
      style={{
        maxWidth: size,
      }}
    />
  );
}
