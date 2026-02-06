import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Flex,
  Icon,
  Grid,
  GridItem,
  CircularProgress,
  CircularProgressLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { FiUsers, FiCheckCircle, FiClock, FiTrendingUp, FiDownload } from 'react-icons/fi';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface ApplicationTrackingData {
  jobId: number;
  jobTitle: string;
  totalApplications: number;
  pending: number;
  shortlisted: number;
  approved: number;
  rejected: number;
  datePosted: string;
  deadline: string;
  status: 'Active' | 'Draft' | 'Closed';
}

const TrackJobApplications = () => {
  const [trackingData, setTrackingData] = useState<ApplicationTrackingData[]>([]);

  useEffect(() => {
    const sampleTrackingData: ApplicationTrackingData[] = [
      {
        jobId: 1,
        jobTitle: 'Senior Software Engineer',
        totalApplications: 45,
        pending: 25,
        shortlisted: 12,
        approved: 3,
        rejected: 5,
        datePosted: '2025-01-15',
        deadline: '2025-02-15',
        status: 'Active'
      },
      {
        jobId: 2,
        jobTitle: 'Product Manager',
        totalApplications: 32,
        pending: 18,
        shortlisted: 8,
        approved: 2,
        rejected: 4,
        datePosted: '2025-01-10',
        deadline: '2025-02-10',
        status: 'Active'
      },
      {
        jobId: 3,
        jobTitle: 'UX Designer',
        totalApplications: 28,
        pending: 15,
        shortlisted: 6,
        approved: 1,
        rejected: 6,
        datePosted: '2025-01-08',
        deadline: '2025-02-08',
        status: 'Active'
      }
    ];

    setTrackingData(sampleTrackingData);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Draft': return 'yellow';
      case 'Closed': return 'red';
      default: return 'gray';
    }
  };

  // Calculate overall statistics
  const totalApplicationsAcrossJobs = trackingData.reduce((sum, job) => sum + job.totalApplications, 0);
  const totalPending = trackingData.reduce((sum, job) => sum + job.pending, 0);
  const totalShortlisted = trackingData.reduce((sum, job) => sum + job.shortlisted, 0);
  const totalApproved = trackingData.reduce((sum, job) => sum + job.approved, 0);

  const overallStats = [
    {
      label: 'Total Applications',
      value: totalApplicationsAcrossJobs,
      icon: FiUsers,
      color: 'blue',
      percentage: 100
    },
    {
      label: 'Pending Review',
      value: totalPending,
      icon: FiClock,
      color: 'yellow',
      percentage: totalApplicationsAcrossJobs > 0 ? Math.round((totalPending / totalApplicationsAcrossJobs) * 100) : 0
    },
    {
      label: 'Shortlisted',
      value: totalShortlisted,
      icon: FiTrendingUp,
      color: 'orange',
      percentage: totalApplicationsAcrossJobs > 0 ? Math.round((totalShortlisted / totalApplicationsAcrossJobs) * 100) : 0
    },
    {
      label: 'Approved',
      value: totalApproved,
      icon: FiCheckCircle,
      color: 'green',
      percentage: totalApplicationsAcrossJobs > 0 ? Math.round((totalApproved / totalApplicationsAcrossJobs) * 100) : 0
    }
  ];

  return (
    <Box>
      <SideNav activeNav="Application Tracking" />
      <Box>
        <TopNav />
        <Box px={6} ml="100px" mt={8} minH="calc(100vh - 64px)">
          <Box
            p={8}
            bg="white"
            borderRadius="3xl"
            mb={6}
            boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            {/* Header Box */}
            <Box bg="#2CA58D" borderRadius="xl" p={5} mb={6}>
              <Text fontSize="xl" color="white" fontWeight="bold">Application Tracking</Text>
            </Box>

            {/* Overall Statistics */}
            <Box
              bg="fff"
              p={4}
              borderRadius="xl"
              mb={6}
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Text fontSize="md" fontWeight="bold" mb={6} color="#2D3E5E">
                Overall Application Statistics
              </Text>
              <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                {overallStats.map((stat, index) => (
                  <GridItem key={index}>
                    <Box bg="gray.100" borderRadius="lg" p={4} border="1px" borderColor="gray.200">
                      <Flex align="center" justify="space-between">
                        <Box>
                          <HStack spacing={3} mb={2}>
                            <Box
                              w={10}
                              h={10}
                              bg={`${stat.color}.100`}
                              borderRadius="lg"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Icon as={stat.icon} boxSize={5} color={`${stat.color}.600`} />
                            </Box>
                            <Box>
                              <Text fontSize="xl" fontWeight="bold">
                                {stat.value}
                              </Text>
                              <Text fontSize="13px" color="gray.600" fontWeight="medium">
                                {stat.label}
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        <CircularProgress 
                          value={stat.percentage} 
                          color={`${stat.color}.400`} 
                          size="60px"
                          thickness="8px"
                        >
                          <CircularProgressLabel fontSize="10px" fontWeight="bold">
                            {stat.percentage}%
                          </CircularProgressLabel>
                        </CircularProgress>
                      </Flex>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            </Box>

            {/* Job-wise Application Breakdown */}
            <Box
              bg="fff"
              borderRadius="xl"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Box p={4} borderBottom="1px" borderColor="gray.200">
                <Flex justify="space-between" align="center">
                  <Text fontSize="md" fontWeight="bold" color="#2D3E5E">
                    Job-wise Application Breakdown
                  </Text>
                  <Button
                    bg="#2CA58D"
                    color="white"
                    _hover={{ bg: "#249a82" }}
                    leftIcon={<Icon as={FiDownload} />}
                    size="sm"
                    borderRadius="md"
                    fontSize="10px"
                  >
                    Export Report
                  </Button>
                </Flex>
              </Box>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead bg="blue.50">
                    <Tr>
                      <Th borderColor="gray.300" fontSize="10px">Job Position</Th>
                      <Th borderColor="gray.300" fontSize="10px">Total Applications</Th>
                      <Th borderColor="gray.300" fontSize="10px">Pending</Th>
                      <Th borderColor="gray.300" fontSize="10px">Shortlisted</Th>
                      <Th borderColor="gray.300" fontSize="10px">Approved</Th>
                      <Th borderColor="gray.300" fontSize="10px">Rejected</Th>
                      <Th borderColor="gray.300" fontSize="10px">Status</Th>
                      <Th borderColor="gray.300" fontSize="10px">Deadline</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {trackingData.map((job) => (
                      <Tr key={job.jobId} _hover={{ bg: 'gray.50' }}>
                        <Td borderColor="gray.200" fontWeight="medium" fontSize="13px">{job.jobTitle}</Td>
                        <Td borderColor="gray.200">
                          <Badge colorScheme="blue" fontSize="10px">
                            {job.totalApplications}
                          </Badge>
                        </Td>
                        <Td borderColor="gray.200">
                          <Badge colorScheme="yellow" fontSize="10px">
                            {job.pending}
                          </Badge>
                        </Td>
                        <Td borderColor="gray.200">
                          <Badge colorScheme="orange" fontSize="10px">
                            {job.shortlisted}
                          </Badge>
                        </Td>
                        <Td borderColor="gray.200">
                          <Badge colorScheme="green" fontSize="10px">
                            {job.approved}
                          </Badge>
                        </Td>
                        <Td borderColor="gray.200">
                          <Badge colorScheme="red" fontSize="10px">
                            {job.rejected}
                          </Badge>
                        </Td>
                        <Td borderColor="gray.200">
                          <Badge colorScheme={getStatusColor(job.status)} fontSize="10px">
                            {job.status}
                          </Badge>
                        </Td>
                        <Td borderColor="gray.200">
                          <Text fontSize="13px">
                            {new Date(job.deadline).toLocaleDateString()}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TrackJobApplications;