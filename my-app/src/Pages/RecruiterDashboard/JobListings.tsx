import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Button,
  Grid,
  Badge,
  Icon,
  Flex,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
  Divider,
} from '@chakra-ui/react';
import { FiUsers, FiFileText, FiBriefcase, FiTrendingUp, FiFolder } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface JobListing {
  id: number;
  title: string;
  department: string;
  status: string;
  applications: number;
  location?: string;
  type?: string;
  experience?: string;
  datePosted?: string;
}

const JobListings = () => {
  const navigate = useNavigate();
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [groupedJobs, setGroupedJobs] = useState<{ [key: string]: JobListing[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all jobs without pagination limit (set high limit to get all jobs)
      const response = await fetch('http://localhost:3001/api/jobs?limit=1000');

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from API');
      }

      const jobs: JobListing[] = data.data.map((job: any) => ({
        id: job._id,
        title: job.title,
        department: job.department,
        status: job.status,
        applications: job.applications || 0,
        location: job.location,
        type: job.type,
        experience: job.experience,
        datePosted: job.datePosted
      }));

      setJobListings(jobs);

      const grouped = jobs.reduce((acc, job) => {
        if (!acc[job.department]) {
          acc[job.department] = [];
        }
        acc[job.department].push(job);
        return acc;
      }, {} as { [key: string]: JobListing[] });

      setGroupedJobs(grouped);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentClick = (department: string) => {
    navigate(`/department-jobs/${department}`);
  };

  const getDepartmentColor = (department: string) => {
    const colors = ['blue', 'purple', 'green', 'orange', 'pink', 'teal', 'cyan', 'red', 'yellow'];
    const departments = Array.from(new Set(jobListings.map(j => j.department)));
    const index = departments.indexOf(department) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <Box bg="gray.50" minH="100vh" overflow="hidden">
        <SideNav activeNav="Job Listings" />
        <Box>
          <TopNav />
          <Box px={4} ml="100px" mr={4} mt={6} minH="calc(100vh - 64px)">
            <Box
              p={6}
              bg="white"
              borderRadius="2xl"
              mb={5}
              boxShadow="sm"
            >
              <Box
                bgGradient="linear(135deg, #2CA58D 0%, #238A75 100%)"
                borderRadius="xl"
                p={6}
                mb={6}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-20%"
                  right="-5%"
                  w="180px"
                  h="180px"
                  bg="whiteAlpha.100"
                  borderRadius="full"
                  filter="blur(50px)"
                />
                <Text fontSize="xl" color="white" fontWeight="700" letterSpacing="tight">
                  Job Listings
                </Text>
              </Box>

              <Center py={16}>
                <VStack spacing={4}>
                  <Spinner
                    size="lg"
                    color="#2CA58D"
                    thickness="3px"
                    speed="0.8s"
                  />
                  <Text color="gray.500" fontSize="sm" fontWeight="500">
                    Loading job listings...
                  </Text>
                </VStack>
              </Center>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg="gray.50" minH="100vh" overflow="hidden">
        <SideNav activeNav="Job Listings" />
        <Box>
          <TopNav />
          <Box px={4} ml="100px" mr={4} mt={6} minH="calc(100vh - 64px)">
            <Box
              p={6}
              bg="white"
              borderRadius="2xl"
              mb={5}
              boxShadow="sm"
            >
              <Box
                bgGradient="linear(135deg, #2CA58D 0%, #238A75 100%)"
                borderRadius="xl"
                p={6}
                mb={6}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-20%"
                  right="-5%"
                  w="180px"
                  h="180px"
                  bg="whiteAlpha.100"
                  borderRadius="full"
                  filter="blur(50px)"
                />
                <Text fontSize="xl" color="white" fontWeight="700" letterSpacing="tight">
                  Job Listings
                </Text>
              </Box>

              <Alert
                status="error"
                borderRadius="lg"
                mb={5}
                bg="red.50"
                border="1px"
                borderColor="red.200"
              >
                <AlertIcon color="red.500" />
                <Box flex="1">
                  <AlertTitle fontSize="sm" fontWeight="600" color="red.900">
                    Error Loading Jobs
                  </AlertTitle>
                  <AlertDescription fontSize="sm" color="red.700" mt={1}>
                    {error}
                  </AlertDescription>
                </Box>
              </Alert>

              <Flex justify="center">
                <Button
                  bg="#2CA58D"
                  color="white"
                  onClick={fetchJobs}
                  fontSize="sm"
                  fontWeight="600"
                  borderRadius="lg"
                  px={6}
                  h="40px"
                  _hover={{
                    bg: "#238A75",
                    transform: "translateY(-2px)",
                    boxShadow: "md"
                  }}
                  transition="all 0.3s ease"
                >
                  Try Again
                </Button>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (jobListings.length === 0) {
    return (
      <Box bg="gray.50" minH="100vh" overflow="hidden">
        <SideNav activeNav="Job Listings" />
        <Box>
          <TopNav />
          <Box px={4} ml="100px" mr={4} mt={6} minH="calc(100vh - 64px)">
            <Box
              p={6}
              bg="white"
              borderRadius="2xl"
              mb={5}
              boxShadow="sm"
            >
              <Box
                bgGradient="linear(135deg, #2CA58D 0%, #238A75 100%)"
                borderRadius="xl"
                p={6}
                mb={6}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-20%"
                  right="-5%"
                  w="180px"
                  h="180px"
                  bg="whiteAlpha.100"
                  borderRadius="full"
                  filter="blur(50px)"
                />
                <Text fontSize="xl" color="white" fontWeight="700" letterSpacing="tight">
                  Job Listings
                </Text>
              </Box>

              <Alert
                status="info"
                borderRadius="lg"
                bg="blue.50"
                border="1px"
                borderColor="blue.200"
                mb={5}
              >
                <AlertIcon color="blue.500" />
                <Box flex="1">
                  <AlertTitle fontSize="sm" fontWeight="600" color="blue.900">
                    No Job Listings Found
                  </AlertTitle>
                  <AlertDescription fontSize="sm" color="blue.700" mt={1}>
                    You haven't created any job listings yet. Create your first job posting to get started.
                  </AlertDescription>
                </Box>
              </Alert>

              <Flex justify="center" mt={6}>
                <Button
                  bg="#2CA58D"
                  color="white"
                  size="md"
                  leftIcon={<Icon as={FiBriefcase} boxSize={4} />}
                  onClick={() => navigate('/post-job')}
                  fontSize="sm"
                  fontWeight="600"
                  borderRadius="lg"
                  px={6}
                  h="42px"
                  _hover={{
                    bg: "#238A75",
                    transform: "translateY(-2px)",
                    boxShadow: "md"
                  }}
                  transition="all 0.3s ease"
                >
                  Post Your First Job
                </Button>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh" overflow="hidden">
      <SideNav activeNav="Job Listings" />
      <Box>
        <TopNav />
        <Box px={4} ml="100px" mr={4} mt={5} pb={5}>
          <Box
            p={5}
            bg="white"
            borderRadius="2xl"
            boxShadow="sm"
          >
            {/* Header Section */}
            <Box
              bgGradient="linear(to-r, #2CA58D, #077660)"
              borderRadius="xl"
              p={5}
              mb={6}
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="-20%"
                right="-5%"
                w="180px"
                h="180px"
                bg="whiteAlpha.100"
                borderRadius="full"
                filter="blur(50px)"
              />
              <HStack justifyContent="space-between" alignItems="center" position="relative">
                <VStack align="start" spacing={1}>
                  <Text fontSize="xl" color="white" fontWeight="bold">
                    Job Listings
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.900" fontWeight="400">
                    Manage and track all your open positions
                  </Text>
                </VStack>
                <Button
                  size="sm"
                  bg="whiteAlpha.300"
                  color="white"
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor="whiteAlpha.400"
                  _hover={{ bg: "whiteAlpha.400" }}
                  onClick={fetchJobs}
                  fontSize="sm"
                  fontWeight="600"
                  borderRadius="md"
                  px={5}
                  h="36px"
                  leftIcon={<Icon as={FiTrendingUp} boxSize={4} />}
                >
                  Refresh
                </Button>
              </HStack>
            </Box>

            {/* Stats Cards */}
            <Flex gap={5} mb={8} flexWrap="wrap">
              <Card
                bg="white"
                shadow="sm"
                border="1px"
                borderColor="gray.100"
                borderRadius="xl"
                flex="1"
                minW="240px"
                _hover={{
                  boxShadow: "md",
                  transform: "translateY(-2px)",
                  borderColor: "blue.200"
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                <CardBody p={5}>
                  <VStack align="stretch" spacing={3}>
                    <Flex align="center" justify="space-between">
                      <Box
                        w={12}
                        h={12}
                        bgGradient="linear(135deg, #E3F2FD, #BBDEFB)"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="0 4px 12px rgba(144, 202, 249, 0.2)"
                      >
                        <Icon as={FiFileText} boxSize={5} color="#1976D2" />
                      </Box>
                      <Badge
                        colorScheme="blue"
                        fontSize="xs"
                        px={2.5}
                        py={0.5}
                        borderRadius="full"
                        fontWeight="600"
                      >
                        Active
                      </Badge>
                    </Flex>
                    <Box>
                      <Text fontSize="2xl" fontWeight="700" color="gray.800" lineHeight="1">
                        {Object.keys(groupedJobs).length}
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontWeight="500" mt={1}>
                        Total Departments
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                bg="white"
                shadow="sm"
                border="1px"
                borderColor="gray.100"
                borderRadius="xl"
                flex="1"
                minW="240px"
                _hover={{
                  boxShadow: "md",
                  transform: "translateY(-2px)",
                  borderColor: "purple.200"
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                <CardBody p={5}>
                  <VStack align="stretch" spacing={3}>
                    <Flex align="center" justify="space-between">
                      <Box
                        w={12}
                        h={12}
                        bgGradient="linear(135deg, #F3E5F5, #E1BEE7)"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="0 4px 12px rgba(206, 147, 216, 0.2)"
                      >
                        <Icon as={FiBriefcase} boxSize={5} color="#7B1FA2" />
                      </Box>
                      <Badge
                        colorScheme="purple"
                        fontSize="xs"
                        px={2.5}
                        py={0.5}
                        borderRadius="full"
                        fontWeight="600"
                      >
                        Open
                      </Badge>
                    </Flex>
                    <Box>
                      <Text fontSize="2xl" fontWeight="700" color="gray.800" lineHeight="1">
                        {jobListings.length}
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontWeight="500" mt={1}>
                        Total Positions
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              <Card
                bg="white"
                shadow="sm"
                border="1px"
                borderColor="gray.100"
                borderRadius="xl"
                flex="1"
                minW="240px"
                _hover={{
                  boxShadow: "md",
                  transform: "translateY(-2px)",
                  borderColor: "orange.200"
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                <CardBody p={5}>
                  <VStack align="stretch" spacing={3}>
                    <Flex align="center" justify="space-between">
                      <Box
                        w={12}
                        h={12}
                        bgGradient="linear(135deg, #FFF3E0, #FFE0B2)"
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="0 4px 12px rgba(255, 183, 77, 0.2)"
                      >
                        <Icon as={FiUsers} boxSize={5} color="#F57C00" />
                      </Box>
                      <Badge
                        colorScheme="orange"
                        fontSize="xs"
                        px={2.5}
                        py={0.5}
                        borderRadius="full"
                        fontWeight="600"
                      >
                        Total
                      </Badge>
                    </Flex>
                    <Box>
                      <Text fontSize="2xl" fontWeight="700" color="gray.800" lineHeight="1">
                        {jobListings.reduce((sum, job) => sum + job.applications, 0)}
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontWeight="500" mt={1}>
                        Total Applications
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </Flex>

            <Divider mb={6} borderColor="gray.200" />

            {/* Departments Section */}
            <Box>
              <Flex align="center" justify="space-between" mb={5}>
                <VStack align="start" spacing={0.5}>
                  <Text fontSize="lg" fontWeight="700" color="gray.800">
                    Departments
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontWeight="500">
                    {Object.keys(groupedJobs).length} department{Object.keys(groupedJobs).length !== 1 ? 's' : ''} with active positions
                  </Text>
                </VStack>
              </Flex>

              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
                {Object.entries(groupedJobs).map(([department, jobs]) => (
                  <Card
                    key={department}
                    bg="white"
                    shadow="md"
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    overflow="hidden"
                    _hover={{
                      boxShadow: "md",
                      transform: "translateY(-2px)",
                      borderColor: `${getDepartmentColor(department)}.300`,
                      cursor: "pointer"
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    onClick={() => handleDepartmentClick(department)}
                  >
                    <Box
                      h="110px"
                      bgGradient={`linear(135deg, ${getDepartmentColor(department)}.50, ${getDepartmentColor(department)}.100)`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                      overflow="hidden"
                    >
                      <Box
                        position="absolute"
                        top="-30%"
                        right="-10%"
                        w="100px"
                        h="100px"
                        bg={`${getDepartmentColor(department)}.200`}
                        borderRadius="full"
                        opacity={0.3}
                        filter="blur(35px)"
                      />
                      <Box
                        w="70px"
                        h="70px"
                        bg="white"
                        borderRadius="xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="0 6px 20px rgba(0, 0, 0, 0.1)"
                        border="2px solid"
                        borderColor={`${getDepartmentColor(department)}.200`}
                        position="relative"
                        _hover={{
                          transform: "scale(1.05)"
                        }}
                        transition="transform 0.3s ease"
                      >
                        <Icon 
                          as={FiFolder} 
                          boxSize={8} 
                          color={`${getDepartmentColor(department)}.500`} 
                        />
                      </Box>
                    </Box>

                    <CardBody p={5}>
                      <VStack spacing={3} align="stretch">
                        <Box>
                          <Text fontSize="md" fontWeight="700" color="gray.800" mb={1.5}>
                            {department}
                          </Text>
                          <Badge
                            colorScheme={getDepartmentColor(department)}
                            variant="subtle"
                            fontSize="xs"
                            px={2.5}
                            py={0.5}
                            borderRadius="full"
                            fontWeight="600"
                          >
                            {jobs.length} position{jobs.length !== 1 ? 's' : ''}
                          </Badge>
                        </Box>

                        <Grid templateColumns="repeat(2, 1fr)" gap={3} py={2}>
                          <VStack spacing={0.5} align="start">
                            <Text fontSize="lg" fontWeight="700" color="gray.800">
                              {jobs.filter(j => j.status === 'Active').length}
                            </Text>
                            <Text fontSize="10px" color="gray.500" fontWeight="500" textTransform="uppercase" letterSpacing="wide">
                              Active
                            </Text>
                          </VStack>
                          <VStack spacing={0.5} align="start">
                            <Text fontSize="lg" fontWeight="700" color="gray.800">
                              {jobs.reduce((sum, job) => sum + job.applications, 0)}
                            </Text>
                            <Text fontSize="10px" color="gray.500" fontWeight="500" textTransform="uppercase" letterSpacing="wide">
                              Applications
                            </Text>
                          </VStack>
                        </Grid>

                        <Button
                          size="sm"
                          bg={`${getDepartmentColor(department)}.100`}
                          color={`${getDepartmentColor(department)}.700`}
                          fontSize="sm"
                          fontWeight="600"
                          borderRadius="lg"
                          _hover={{
                            bg: `${getDepartmentColor(department)}.200`,
                            transform: "translateY(-1px)",
                            boxShadow: "sm"
                          }}
                          transition="all 0.3s ease"
                          w="full"
                          h="38px"
                        >
                          View Positions
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default JobListings;