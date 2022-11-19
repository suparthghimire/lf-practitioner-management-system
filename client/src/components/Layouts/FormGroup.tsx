import { SimpleGrid } from "@mantine/core";
export default function FormGroup({
  children,
  cols = 2,
  style,
}: {
  cols?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <SimpleGrid
      style={{ ...style }}
      cols={cols}
      breakpoints={[{ maxWidth: "sm", cols: 1 }]}
    >
      {children}
    </SimpleGrid>
  );
}
