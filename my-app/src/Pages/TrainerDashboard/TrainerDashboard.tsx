import React from "react";
import {
  Box,
  HStack,
  Flex
} from '@chakra-ui/react';
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import DashboardCard from "./DashboardCard";
import StatsSection from "./StatsSection";
import StudentEnrollment from "./StudentEnrollment";

export default function UserDashboard(props: any) {
  return (
    <Box bg="gray.50">
      <SideNav />
      <Box>
        <TopNav />
        <Box px={6} ml="100px" mt={8} minH="calc(100vh - 64px)">
          <Flex justify="space-between" gap={5} align="start">

            <Box w="80%">
              <DashboardCard />
              <Box mt={6}>
                <StudentEnrollment/>
              </Box>
            </Box>

            <Box ml={4} w="30%">
              <StatsSection />
            </Box>
          </Flex>

          {props.children}
        </Box>
      </Box>
    </Box>
  );
}
