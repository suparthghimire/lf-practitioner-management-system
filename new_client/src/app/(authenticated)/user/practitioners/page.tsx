"use client";
import React from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Table,
  Title,
  Popover,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { IconBell, IconEdit, IconTrash } from "@tabler/icons-react";

const elements = [
  { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
  { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
  { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
  { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
  { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
];

const AllPractitioners = () => {
  const rows = elements.map((element) => (
    <tr>
      <td>{element.position}</td>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
      <td>{element.mass}</td>
      <td>
        <Menu>
          <Menu.Target>
            <ActionIcon color="green" variant="light">
              <IconBell />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>
              <ActionIcon color="red" variant="light">
                <IconTrash />
              </ActionIcon>
            </Menu.Item>
            <Menu.Item>
              <ActionIcon color="yellow" variant="light">
                <IconEdit />
              </ActionIcon>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  return (
    <Card>
      <Group position="apart" mt="md" mb="xs">
        <Title weight={500}>All practitioners</Title>
      </Group>
      <Table>
        <thead>
          <tr>
            <th>Element position</th>
            <th>Element name</th>
            <th>Symbol</th>
            <th>Atomic mass</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Card>
  );
};

export default AllPractitioners;
