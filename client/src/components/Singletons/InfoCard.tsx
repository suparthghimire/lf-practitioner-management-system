import {
  createStyles,
  Text,
  Card,
  RingProgress,
  Group,
  Button,
  Flex,
  Loader,
  Center,
} from "@mantine/core";
import { Link } from "react-router-dom";
import CustomLoader from "../common/Loader";
const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    lineHeight: 1,
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1,
  },

  inner: {
    display: "flex",

    [theme.fn.smallerThan(350)]: {
      flexDirection: "column",
    },
  },

  ring: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",

    [theme.fn.smallerThan(350)]: {
      justifyContent: "center",
      marginTop: theme.spacing.md,
    },
  },
}));

interface StatsRingCardProps {
  title: string;
  completed: number;
  total: number;
  percentText: string;
  loading?: boolean;
  stats: {
    value: number;
    label: string;
  }[];
  buttonLinks: {
    label: string;
    href: string;
    color: "red" | "blue" | "green" | "yellow" | "teal" | "pink" | "gray";
  }[];
}

export default function InfoCard({
  title,
  completed,
  total,
  stats,
  percentText,
  buttonLinks,
  loading = false,
}: StatsRingCardProps) {
  const { classes, theme } = useStyles();
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="xs" color="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card
      style={{
        minWidth: 300,
        minHeight: 300,
      }}
      withBorder
      p="xl"
      radius="md"
      className={classes.card}
    >
      {!loading ? (
        <>
          <div className={classes.inner}>
            <div>
              <Text size="xl" className={classes.label}>
                {title}
              </Text>
              <div>
                <Text className={classes.lead} mt={30}>
                  {total}
                </Text>
                <Text size="xs" color="dimmed">
                  Total
                </Text>
              </div>
              <Group mt="lg">{items}</Group>
            </div>

            <div className={classes.ring}>
              <RingProgress
                roundCaps
                thickness={6}
                size={150}
                sections={[
                  {
                    value: isNaN((completed / total) * 100)
                      ? 0
                      : (completed / total) * 100,
                    color: theme.primaryColor,
                  },
                ]}
                label={
                  <div>
                    <Text
                      align="center"
                      size="lg"
                      className={classes.label}
                      sx={{ fontSize: 22 }}
                    >
                      {isNaN((completed / total) * 100)
                        ? 0
                        : (completed / total) * 100}
                      %
                    </Text>
                    <Text align="center" size="xs" color="dimmed">
                      {percentText}
                    </Text>
                  </div>
                }
              />
            </div>
          </div>
          <Flex mt="lg" gap="lg">
            {buttonLinks.map((buttonLink) => (
              <Link
                style={{ textDecoration: "none" }}
                to={buttonLink.href}
                key={buttonLink.label}
              >
                <Button
                  fullWidth
                  color={buttonLink.color}
                  variant="light"
                  mt="lg"
                >
                  {buttonLink.label}
                </Button>
              </Link>
            ))}
          </Flex>
        </>
      ) : (
        <Center
          style={{
            height: "100%",
          }}
        >
          <Loader />
        </Center>
      )}
    </Card>
  );
}
