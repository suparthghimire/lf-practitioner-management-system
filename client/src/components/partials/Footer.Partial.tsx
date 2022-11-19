import {
  Image,
  createStyles,
  Container,
  Group,
  ActionIcon,
  Text,
  Tooltip,
  Footer,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandGithub,
  IconWorld,
} from "@tabler/icons";
import Logo from "../common/Logo";

const useStyles = createStyles((theme) => ({
  footer: {
    // marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export default function FooterPartial() {
  const { classes } = useStyles();
  return (
    <Footer height={100}>
      <div className={classes.footer}>
        <div className={classes.inner}>
          <Logo size={50} />
          <div>
            <Text color="dimmed">
              Assignment Submission from{" "}
              <a href="https://lfttechnology.com">Leapfrog Technology</a>
            </Text>
            <Text size="xs" color="dimmed">
              © 2022 Leapfrog Technology. All rights reserved.
            </Text>
          </div>
          <Group spacing={0} className={classes.links} position="right" noWrap>
            <Tooltip label="Github Repository">
              <ActionIcon size="lg">
                <IconBrandGithub size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Developer Info">
              <ActionIcon size="lg">
                <IconWorld size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </div>
      </div>
    </Footer>
  );
}
