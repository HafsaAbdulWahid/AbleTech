import React, { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import SideNav from './SideNav';
import TopNav from './TopNav';
import DashboardCard from './DashboardCard';
import QuickStats from './QuickStats';
import ApplicationTrends from './ApplicationTrends';
import OrganizationProfile from './OrganizationProfile';

interface JobListing {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
    applications: number;
    shortlisted: number;
    approved: number;
    rejected: number;
    status: string;
    datePosted: string;
    requirements: string[];
}

const RecruiterDashboard = () => {
    const [jobListings, setJobListings] = useState<JobListing[]>([]);
    const [showProfile, setShowProfile] = useState(false);

    useEffect(() => {
        const sampleJobListings: JobListing[] = [
            {
                id: 1,
                title: 'Senior Software Engineer',
                department: 'Engineering',
                location: 'Remote',
                type: 'Full-time',
                applications: 45,
                shortlisted: 12,
                approved: 3,
                rejected: 8,
                status: 'Active',
                datePosted: '2025-01-15',
                requirements: ['React', 'Node.js', '5+ years experience']
            },
            {
                id: 2,
                title: 'Product Manager',
                department: 'Product',
                location: 'Karachi',
                type: 'Full-time',
                applications: 32,
                shortlisted: 8,
                approved: 2,
                rejected: 4,
                status: 'Active',
                datePosted: '2025-01-10',
                requirements: ['Product Strategy', 'Analytics', 'Leadership']
            },
            {
                id: 3,
                title: 'UX Designer',
                department: 'Design',
                location: 'Hybrid',
                type: 'Full-time',
                applications: 28,
                shortlisted: 6,
                approved: 1,
                rejected: 3,
                status: 'Active',
                datePosted: '2025-01-08',
                requirements: ['Figma', 'User Research', 'Prototyping']
            }
        ];
        setJobListings(sampleJobListings);
    }, []);

    const handleBackToDashboard = () => setShowProfile(false);

    if (showProfile) {
        return <OrganizationProfile onBack={handleBackToDashboard} />;
    }

    return (
        <Box bg="gray.50">
            <SideNav activeNav="Dashboard" />
            <Box>
                <TopNav />

                <Box px={6} ml="100px" mt={8} minH="calc(100vh - 64px)">

                    {/* Header and Quick Stats Row */}
                    <Flex justify="space-between" gap={5} align="start">
                        <Box w="80%">
                            <DashboardCard />
                            <Box my={6}>
                                <ApplicationTrends />
                            </Box>
                        </Box>


                        <Box ml={4} w="30%">
                            <QuickStats jobListings={jobListings} />
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Box>





    );
};

export default RecruiterDashboard;