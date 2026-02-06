import React from "react";
import {
  Box,
  HStack,
  Flex
} from "@chakra-ui/react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import DashboardCard from "./DashboardCard";
import AssistiveTech from "./AssistiveTech";
import Sessions from "./Sessions";
import RecommendedJobs from "./RecommendedJobs";

export default function UserDashboard(props: any) {
  return (
    <Box>
      <SideNav />
      <Box>
        <TopNav />
        <Box px={6} ml="100px" mt={8} minH="calc(100vh - 64px)">
          <Flex justify="space-between" gap={5} align="start">

            <Box w="80%">
              <DashboardCard />
              <Box mt={6}>
                <RecommendedJobs />
              </Box>
            </Box>

            <Box ml={4} w="30%">
              <AssistiveTech />
              <Sessions />
            </Box>
          </Flex>

          {props.children}
        </Box>
      </Box>
    </Box>
  );
}
