"use client";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import Image from "next/image";

const Header = () => (
  <HStack>
    <Image
      className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
      src="/logo-personio.png"
      alt="Personio Logo"
      width={180}
      height={37}
      priority
    />
  </HStack>
);

export default Header;
