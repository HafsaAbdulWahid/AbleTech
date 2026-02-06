import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Heading,
    Link,
    Badge,
    Text,
    Container,
    TableContainer,
    Spinner,
    Center,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Flex,
    Icon,
    HStack,
    VStack,
    Divider,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { 
    FiBriefcase, 
    FiMapPin, 
    FiClock, 
    FiCalendar, 
    FiUsers,
    FiSearch,
    FiFilter,
    FiMoreVertical,
    FiEye,
    FiEdit,
    FiTrash2
} from 'react-icons/fi';
import axios from 'axios';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface Job {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    experience: string;
    deadline: string;
    status: string;
    datePosted: string;
    company?: string;
    salary?: string;
    category?: string;
}

const getExperienceBadgeColor = (experience: string) => {
    const exp = experience.toLowerCase();
    if (exp.includes('no-experience') || exp.includes('fresher')) {
        return 'orange';
    } else if (exp.includes('intermediate') || exp.includes('2') || exp.includes('3') || exp.includes('4')) {
        return 'blue';
    } else if (exp.includes('expert') || exp.includes('senior') || exp.includes('5+') || exp.includes('6+')) {
        return 'purple';
    }
    return 'gray';
};

const getTypeBadgeColor = (type: string) => {
    const jobType = type.toLowerCase();
    if (jobType.includes('full-time')) return 'green';
    if (jobType.includes('part-time')) return 'blue';
    if (jobType.includes('contract')) return 'purple';
    if (jobType.includes('internship')) return 'orange';
    return 'gray';
};

const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || 'active';
    if (statusLower === 'active') {
        return { color: 'green', text: 'Active' };
    } else if (statusLower === 'closed') {
        return { color: 'red', text: 'Closed' };
    } else if (statusLower === 'pending') {
        return { color: 'yellow', text: 'Pending' };
    }
    return { color: 'gray', text: status };
};

const JobListings: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3001/api/jobs", {
                    params: {
                        page: 1,
                        limit: 100,
                    },
                });
                console.log("API Response:", response.data);
                const jobsData = response.data.data || [];
                setJobs(jobsData);
                setFilteredJobs(jobsData);
                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching jobs:", err.response || err.message);
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to fetch jobs. Please try again later."
                );
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Filter jobs based on search and filters
    useEffect(() => {
        let filtered = jobs;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Department filter
        if (departmentFilter) {
            filtered = filtered.filter(job => job.department === departmentFilter);
        }

        // Type filter
        if (typeFilter) {
            filtered = filtered.filter(job => job.type === typeFilter);
        }

        setFilteredJobs(filtered);
    }, [searchQuery, departmentFilter, typeFilter, jobs]);

    const uniqueDepartments = Array.from(new Set(jobs.map(job => job.department)));
    const uniqueTypes = Array.from(new Set(jobs.map(job => job.type)));

    if (loading) {
        return (
            <Box>
                <SideNav />
                <Box>
                    <TopNav />
                    <Box bg="#F7FAFC" py={10} ml="90px" p={6} maxW="calc(100% - 90px)" minH="100vh">
                        <Center h="70vh">
                            <VStack spacing={5}>
                                <Box position="relative">
                                    <Spinner
                                        thickness="4px"
                                        speed="0.65s"
                                        emptyColor="gray.200"
                                        color="#2CA58D"
                                        size="xl"
                                    />
                                </Box>
                                <VStack spacing={2}>
                                    <Text fontSize="lg" fontWeight="600" color="gray.700">
                                        Loading Job Listings
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Please wait while we fetch the latest data...
                                    </Text>
                                </VStack>
                            </VStack>
                        </Center>
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <SideNav />
                <Box>
                    <TopNav />
                    <Box bg="#F7FAFC" py={10} ml="90px" p={6} maxW="calc(100% - 90px)" minH="100vh">
                        <Container maxW="container.xl" mt={8}>
                            <Alert
                                status="error"
                                variant="left-accent"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                minHeight="300px"
                                borderRadius="xl"
                                bg="white"
                                boxShadow="lg"
                            >
                                <AlertIcon boxSize="50px" mr={0} />
                                <AlertTitle mt={6} mb={2} fontSize="xl" fontWeight="700">
                                    Failed to Load Job Listings
                                </AlertTitle>
                                <AlertDescription maxWidth="md" fontSize="md" color="gray.600">
                                    {error}
                                </AlertDescription>
                                <Button
                                    mt={6}
                                    colorScheme="red"
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </Button>
                            </Alert>
                        </Container>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <SideNav />
            <Box>
                <TopNav />

                <Box bg="#F7FAFC" py={8} ml="90px" px={6} maxW="calc(100% - 90px)" minH="100vh">
                    <Container maxW="container.xl">
                        {/* Header Section */}
                        <Box mb={6}>
                            <VStack align="start" spacing={1} mb={6}>
                                <Heading
                                    as="h1"
                                    fontSize="3xl"
                                    color="#1A202C"
                                    fontWeight="700"
                                    letterSpacing="tight"
                                >
                                    Job Listings
                                </Heading>
                                <Text color="gray.600" fontSize="md" fontWeight="500">
                                    Manage and track all job openings
                                </Text>
                            </VStack>

                            {/* Stats Cards */}
                            <Flex gap={4} mb={6}>
                                <Box
                                    flex="1"
                                    bg="white"
                                    p={5}
                                    borderRadius="lg"
                                    boxShadow="sm"
                                    border="1px solid"
                                    borderColor="gray.100"
                                    _hover={{ boxShadow: "md" }}
                                    transition="all 0.2s"
                                >
                                    <HStack spacing={3}>
                                        <Box
                                            bg="blue.50"
                                            p={2.5}
                                            borderRadius="md"
                                        >
                                            <Icon as={FiBriefcase} boxSize={5} color="blue.500" />
                                        </Box>
                                        <VStack align="start" spacing={0}>
                                            <Text fontSize="xl" fontWeight="700" color="gray.800">
                                                {jobs.length}
                                            </Text>
                                            <Text fontSize="xs" color="gray.600" fontWeight="500">
                                                Total Positions
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>

                                <Box
                                    flex="1"
                                    bg="white"
                                    p={5}
                                    borderRadius="lg"
                                    boxShadow="sm"
                                    border="1px solid"
                                    borderColor="gray.100"
                                    _hover={{ boxShadow: "md" }}
                                    transition="all 0.2s"
                                >
                                    <HStack spacing={3}>
                                        <Box
                                            bg="purple.50"
                                            p={2.5}
                                            borderRadius="md"
                                        >
                                            <Icon as={FiUsers} boxSize={5} color="purple.500" />
                                        </Box>
                                        <VStack align="start" spacing={0}>
                                            <Text fontSize="xl" fontWeight="700" color="gray.800">
                                                {uniqueDepartments.length}
                                            </Text>
                                            <Text fontSize="xs" color="gray.600" fontWeight="500">
                                                Departments
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            </Flex>
                        </Box>

                        {/* Filters and Search Section */}
                        <Box
                            bg="white"
                            p={5}
                            borderRadius="xl"
                            boxShadow="sm"
                            mb={6}
                            border="1px solid"
                            borderColor="gray.100"
                        >
                            <Flex gap={3} flexWrap="wrap" align="center">
                                <InputGroup flex="2" minW="250px">
                                    <InputLeftElement pointerEvents="none" height="full">
                                        <Icon as={FiSearch} color="gray.400" boxSize={4} />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Search by title, department, or location..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        size="md"
                                        borderColor="gray.200"
                                        fontSize="sm"
                                        _hover={{ borderColor: "gray.300" }}
                                        _focus={{
                                            borderColor: "#2CA58D",
                                            boxShadow: "0 0 0 1px #2CA58D"
                                        }}
                                    />
                                </InputGroup>

                                <Select
                                    placeholder="All Departments"
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                    size="md"
                                    flex="1"
                                    minW="180px"
                                    borderColor="gray.200"
                                    fontSize="sm"
                                    icon={<FiFilter />}
                                    _hover={{ borderColor: "gray.300" }}
                                    _focus={{
                                        borderColor: "#2CA58D",
                                        boxShadow: "0 0 0 1px #2CA58D"
                                    }}
                                >
                                    {uniqueDepartments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </Select>

                                <Select
                                    placeholder="All Types"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    size="md"
                                    flex="1"
                                    minW="160px"
                                    borderColor="gray.200"
                                    fontSize="sm"
                                    icon={<FiFilter />}
                                    _hover={{ borderColor: "gray.300" }}
                                    _focus={{
                                        borderColor: "#2CA58D",
                                        boxShadow: "0 0 0 1px #2CA58D"
                                    }}
                                >
                                    {uniqueTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </Select>

                                {(searchQuery || departmentFilter || typeFilter) && (
                                    <Button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setDepartmentFilter('');
                                            setTypeFilter('');
                                        }}
                                        variant="ghost"
                                        colorScheme="gray"
                                        size="md"
                                        fontSize="sm"
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </Flex>
                        </Box>

                        {/* Table Section */}
                        <Box
                            bg="white"
                            borderRadius="xl"
                            boxShadow="sm"
                            overflow="hidden"
                            border="1px solid"
                            borderColor="gray.100"
                        >
                            {filteredJobs.length === 0 ? (
                                <Center py={20}>
                                    <VStack spacing={4}>
                                        <Box
                                            bg="gray.100"
                                            p={6}
                                            borderRadius="full"
                                        >
                                            <Icon as={FiBriefcase} boxSize={12} color="gray.400" />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="600" color="gray.700">
                                            {searchQuery || departmentFilter || typeFilter
                                                ? "No jobs match your filters"
                                                : "No jobs available"}
                                        </Text>
                                        <Text color="gray.500" fontSize="sm" textAlign="center" maxW="md">
                                            {searchQuery || departmentFilter || typeFilter
                                                ? "Try adjusting your search criteria or filters"
                                                : "Job openings will appear here once they are posted"}
                                        </Text>
                                    </VStack>
                                </Center>
                            ) : (
                                <TableContainer>
                                    <Table variant="simple">
                                        <Thead bg="gray.50">
                                            <Tr>
                                                <Th
                                                    color="#1A202C"
                                                    textTransform="uppercase"
                                                    fontSize="xs"
                                                    fontWeight="700"
                                                    letterSpacing="wide"
                                                    px={8}
                                                    py={5}
                                                    borderBottom="2px solid"
                                                    borderColor="gray.200"
                                                >
                                                    Job Title
                                                </Th>
                                                <Th
                                                    color="#1A202C"
                                                    textTransform="uppercase"
                                                    fontSize="xs"
                                                    fontWeight="700"
                                                    letterSpacing="wide"
                                                    px={6}
                                                    py={5}
                                                    borderBottom="2px solid"
                                                    borderColor="gray.200"
                                                >
                                                    Department
                                                </Th>
                                                <Th
                                                    color="#1A202C"
                                                    textTransform="uppercase"
                                                    fontSize="xs"
                                                    fontWeight="700"
                                                    letterSpacing="wide"
                                                    px={6}
                                                    py={5}
                                                    borderBottom="2px solid"
                                                    borderColor="gray.200"
                                                >
                                                    Location
                                                </Th>
                                                <Th
                                                    color="#1A202C"
                                                    textTransform="uppercase"
                                                    fontSize="xs"
                                                    fontWeight="700"
                                                    letterSpacing="wide"
                                                    px={6}
                                                    py={5}
                                                    borderBottom="2px solid"
                                                    borderColor="gray.200"
                                                >
                                                    Experience
                                                </Th>
                                                <Th
                                                    color="#1A202C"
                                                    textTransform="uppercase"
                                                    fontSize="xs"
                                                    fontWeight="700"
                                                    letterSpacing="wide"
                                                    px={6}
                                                    py={5}
                                                    borderBottom="2px solid"
                                                    borderColor="gray.200"
                                                >
                                                    Type
                                                </Th>
                                                <Th
                                                    color="#1A202C"
                                                    textTransform="uppercase"
                                                    fontSize="xs"
                                                    fontWeight="700"
                                                    letterSpacing="wide"
                                                    px={6}
                                                    py={5}
                                                    borderBottom="2px solid"
                                                    borderColor="gray.200"
                                                >
                                                    Status
                                                </Th>
                                                <Th
                                                    color="#1A202C"
                                                    textTransform="uppercase"
                                                    fontSize="xs"
                                                    fontWeight="700"
                                                    letterSpacing="wide"
                                                    px={6}
                                                    py={5}
                                                    borderBottom="2px solid"
                                                    borderColor="gray.200"
                                                >
                                                    Date Posted
                                                </Th>
                                                <Th
                                                    color="#1A202C"
                                                    textTransform="uppercase"
                                                    fontSize="xs"
                                                    fontWeight="700"
                                                    letterSpacing="wide"
                                                    px={6}
                                                    py={5}
                                                    borderBottom="2px solid"
                                                    borderColor="gray.200"
                                                    textAlign="center"
                                                >
                                                    Actions
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {filteredJobs.map((job, index) => (
                                                <Tr
                                                    key={job._id}
                                                    _hover={{
                                                        bg: "gray.50"
                                                    }}
                                                    borderBottom="1px solid"
                                                    borderColor="gray.100"
                                                    transition="all 0.15s"
                                                >
                                                    <Td px={8} py={5}>
                                                        <VStack align="start" spacing={1}>
                                                            <Link
                                                                color="#2CA58D"
                                                                fontWeight="600"
                                                                fontSize="sm"
                                                                _hover={{
                                                                    textDecoration: "none",
                                                                    color: "#248a73"
                                                                }}
                                                            >
                                                                {job.title}
                                                            </Link>
                                                            {job.company && (
                                                                <Text fontSize="xs" color="gray.500">
                                                                    {job.company}
                                                                </Text>
                                                            )}
                                                        </VStack>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <HStack spacing={2}>
                                                            <Icon as={FiUsers} boxSize={4} color="gray.400" />
                                                            <Text
                                                                color="gray.700"
                                                                fontSize="sm"
                                                                fontWeight="500"
                                                            >
                                                                {job.department}
                                                            </Text>
                                                        </HStack>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <HStack spacing={2}>
                                                            <Icon as={FiMapPin} boxSize={4} color="gray.400" />
                                                            <Text color="gray.600" fontSize="sm">
                                                                {job.location}
                                                            </Text>
                                                        </HStack>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <Badge
                                                            colorScheme={getExperienceBadgeColor(job.experience)}
                                                            borderRadius="md"
                                                            px={3}
                                                            py={1.5}
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                            textTransform="capitalize"
                                                        >
                                                            {job.experience}
                                                        </Badge>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <Badge
                                                            colorScheme={getTypeBadgeColor(job.type)}
                                                            borderRadius="md"
                                                            px={3}
                                                            py={1.5}
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                            textTransform="capitalize"
                                                        >
                                                            {job.type}
                                                        </Badge>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <Badge
                                                            colorScheme={getStatusBadge(job.status).color}
                                                            borderRadius="md"
                                                            px={3}
                                                            py={1.5}
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                        >
                                                            {getStatusBadge(job.status).text}
                                                        </Badge>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <HStack spacing={2}>
                                                            <Icon as={FiCalendar} boxSize={4} color="gray.400" />
                                                            <Text
                                                                color="gray.600"
                                                                fontSize="sm"
                                                                fontWeight="500"
                                                            >
                                                                {new Date(job.datePosted).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </Text>
                                                        </HStack>
                                                    </Td>
                                                    <Td px={6} py={5} textAlign="center">
                                                        <Menu>
                                                            <MenuButton
                                                                as={IconButton}
                                                                icon={<FiMoreVertical />}
                                                                variant="ghost"
                                                                size="sm"
                                                                _hover={{ bg: "gray.100" }}
                                                            />
                                                            <MenuList>
                                                                <MenuItem icon={<FiEye />}>
                                                                    View Details
                                                                </MenuItem>
                                                                <Divider />
                                                                <MenuItem icon={<FiTrash2 />} color="red.500">
                                                                    Delete Job
                                                                </MenuItem>
                                                            </MenuList>
                                                        </Menu>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>

                        {/* Footer Info */}
                        {filteredJobs.length > 0 && (
                            <Flex
                                mt={4}
                                justify="space-between"
                                align="center"
                                px={2}
                            >
                                <Text fontSize="sm" color="gray.600" fontWeight="500">
                                    Showing {filteredJobs.length} of {jobs.length} job{jobs.length !== 1 ? 's' : ''}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    Last updated: {new Date().toLocaleString()}
                                </Text>
                            </Flex>
                        )}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default JobListings;