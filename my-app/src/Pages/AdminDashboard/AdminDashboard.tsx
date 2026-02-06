import { Box, SimpleGrid } from "@chakra-ui/react";
import TopNav from "./TopNav";
import SideNav from "./SideNav";
import StatsCards from './StatsCards';
import OverviewChart from './OverviewChart';
import PerformanceSection from './PerformanceSection';


export default function AdminDashboard() {
    return (
        <Box bg="gray.50" minH="100vh">
            <TopNav />
            <SideNav />
            <Box ml="90px" p={8} maxW="calc(100% - 90px)">
                <StatsCards />

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <OverviewChart />
                    <PerformanceSection />
                </SimpleGrid>
            </Box>
        </Box>
    )
}