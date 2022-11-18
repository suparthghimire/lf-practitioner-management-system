import { Image } from "@mantine/core";
import React, { CSSProperties } from "react";

interface Props {
  size?: number;
  style?: CSSProperties;
}

export default function Logo({ size = 50, style }: Props) {
  return (
    <Image
      src="/logo.svg"
      style={{
        maxWidth: size,
        ...style,
      }}
    />
  );
}
