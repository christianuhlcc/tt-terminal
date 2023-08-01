"use client";
import { Flex, VStack } from "@chakra-ui/react";

const Content = ({ children }) => (
  <Flex
    direction="column"
    height={"100%"}
    justifyContent={"center"}
    alignItems={"center"}
  >
    {children}
  </Flex>
);

export default Content;
