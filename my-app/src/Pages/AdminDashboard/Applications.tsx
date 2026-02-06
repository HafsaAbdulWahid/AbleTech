import React, { useState } from 'react';
import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    HStack,
    VStack,
    Text,
    Avatar,
    Flex,
    Icon,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import {
    FiSearch,
    FiCalendar,
    FiMail,
    FiPhone,
    FiMoreVertical,
    FiEye,
    FiCheck,
    FiX,
    FiDownload
} from 'react-icons/fi';
import SideNav from './SideNav';
import TopNav from './TopNav';

const applications = [
    {
        id: 1,
        name: 'Ahmad Hassan',
        email: 'ahmad.hassan@email.com',
        phone: '+92 300 1234567',
        position: 'Frontend Developer',
        appliedDate: '2024-04-25',
        status: 'Under Review',
        experience: '3 years',
        location: 'Lahore'
    },
    {
        id: 2,
        name: 'Fatima Sheikh',
        email: 'fatima.sheikh@email.com',
        phone: '+92 301 2345678',
        position: 'UI/UX Designer',
        appliedDate: '2024-04-24',
        status: 'Shortlisted',
        experience: '2 years',
        location: 'Karachi'
    },
    {
        id: 3,
        name: 'Muhammad Ali',
        email: 'muhammad.ali@email.com',
        phone: '+92 302 3456789',
        position: 'Data Analyst',
        appliedDate: '2024-04-23',
        status: 'Interview Scheduled',
        experience: '4 years',
        location: 'Islamabad'
    },
    {
        id: 4,
        name: 'Ayesha Khan',
        email: 'ayesha.khan@email.com',
        phone: '+92 303 4567890',
        position: 'Project Manager',
        appliedDate: '2024-04-22',
        status: 'Rejected',
        experience: '5 years',
        location: 'Lahore'
    },
    {
        id: 5,
        name: 'Hassan Ahmed',
        email: 'hassan.ahmed@email.com',
        phone: '+92 304 5678901',
        position: 'Software Engineer',
        appliedDate: '2024-04-21',
        status: 'Under Review',
        experience: '3 years',
        location: 'Karachi'
    },
    {
        id: 6,
        name: 'Sara Malik',
        email: 'sara.malik@email.com',
        phone: '+92 305 6789012',
        position: 'Marketing Coordinator',
        appliedDate: '2024-04-20',
        status: 'Shortlisted',
        experience: '2 years',
        location: 'Multan'
    },
    {
        id: 7,
        name: 'Usman Raja',
        email: 'usman.raja@email.com',
        phone: '+92 306 7890123',
        position: 'DevOps Engineer',
        appliedDate: '2024-04-19',
        status: 'Interview Scheduled',
        experience: '4 years',
        location: 'Lahore'
    },
    {
        id: 8,
        name: 'Zainab Noor',
        email: 'zainab.noor@email.com',
        phone: '+92 307 8901234',
        position: 'Content Writer',
        appliedDate: '2024-04-18',
        status: 'Under Review',
        experience: '1 year',
        location: 'Remote'
    },
    {
        id: 9,
        name: 'Bilal Tariq',
        email: 'bilal.tariq@email.com',
        phone: '+92 308 9012345',
        position: 'Sales Executive',
        appliedDate: '2024-04-17',
        status: 'Shortlisted',
        experience: '2 years',
        location: 'Faisalabad'
    },
    {
        id: 10,
        name: 'Mariam Siddiqui',
        email: 'mariam.siddiqui@email.com',
        phone: '+92 309 0123456',
        position: 'Graphic Designer',
        appliedDate: '2024-04-16',
        status: 'Under Review',
        experience: '3 years',
        location: 'Karachi'
    },
    {
        id: 11,
        name: 'Tariq Mahmood',
        email: 'tariq.mahmood@email.com',
        phone: '+92 310 1234567',
        position: 'HR Specialist',
        appliedDate: '2024-04-15',
        status: 'Interview Scheduled',
        experience: '4 years',
        location: 'Islamabad'
    },
    {
        id: 12,
        name: 'Nadia Farid',
        email: 'nadia.farid@email.com',
        phone: '+92 311 2345678',
        position: 'Mobile App Developer',
        appliedDate: '2024-04-14',
        status: 'Rejected',
        experience: '2 years',
        location: 'Lahore'
    },
    {
        id: 13,
        name: 'Waseem Akram',
        email: 'waseem.akram@email.com',
        phone: '+92 312 3456789',
        position: 'Financial Analyst',
        appliedDate: '2024-04-13',
        status: 'Under Review',
        experience: '3 years',
        location: 'Karachi'
    },
    {
        id: 14,
        name: 'Hira Saleem',
        email: 'hira.saleem@email.com',
        phone: '+92 313 4567890',
        position: 'Quality Assurance Engineer',
        appliedDate: '2024-04-12',
        status: 'Shortlisted',
        experience: '2 years',
        location: 'Multan'
    },
    {
        id: 15,
        name: 'Omar Farooq',
        email: 'omar.farooq@email.com',
        phone: '+92 314 5678901',
        position: 'Digital Marketing Specialist',
        appliedDate: '2024-04-11',
        status: 'Interview Scheduled',
        experience: '3 years',
        location: 'Remote'
    }
];

export default function Applications() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('');
    const cardBg = useColorModeValue('white', 'gray.800');

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === '' || app.status === statusFilter;
        const matchesPosition = positionFilter === '' || app.position.includes(positionFilter);

        return matchesSearch && matchesStatus && matchesPosition;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Under Review':
                return 'yellow';
            case 'Shortlisted':
                return 'blue';
            case 'Interview Scheduled':
                return 'purple';
            case 'Rejected':
                return 'red';
            case 'Hired':
                return 'green';
            default:
                return 'gray';
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    };

    return (
        <Box>
            <SideNav />
            <Box>
                <TopNav />
                <Box ml="90px" p={6} maxW="calc(100% - 90px)" bg="gray.50" minH="100vh">

                    {/* Header */}
                    <Box mb={6}>
                        <Heading size="lg" color="#2D3E5E" mb={2}>
                            Job Applications
                        </Heading>
                        <Text color="gray.600">
                            Manage {applications.length} job applications from candidates
                        </Text>
                    </Box>

                    {/* Search and Filters */}
                    <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="sm" mb={6}>
                        <HStack spacing={4} flexWrap="wrap">
                            <InputGroup maxW="400px">
                                <InputLeftElement pointerEvents="none">
                                    <Icon as={FiSearch} color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Search candidates or positions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>

                            <Select
                                placeholder="All Status"
                                maxW="200px"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="Under Review">Under Review</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hired">Hired</option>
                            </Select>

                            <Select
                                placeholder="All Positions"
                                maxW="200px"
                                value={positionFilter}
                                onChange={(e) => setPositionFilter(e.target.value)}
                            >
                                <option value="Developer">Developer</option>
                                <option value="Designer">Designer</option>
                                <option value="Manager">Manager</option>
                                <option value="Analyst">Analyst</option>
                                <option value="Engineer">Engineer</option>
                            </Select>
                        </HStack>
                    </Box>

                    {/* Applications Table */}
                    <Box bg={cardBg} borderRadius="lg" boxShadow="sm" overflow="hidden">
                        <Table variant="simple" size="md">
                            <Thead bg="gray.50">
                                <Tr>
                                    <Th color="gray.600" fontWeight="semibold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" py={4}>
                                        CANDIDATE
                                    </Th>
                                    <Th color="gray.600" fontWeight="semibold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" py={4}>
                                        POSITION
                                    </Th>
                                    <Th color="gray.600" fontWeight="semibold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" py={4}>
                                        APPLIED DATE
                                    </Th>
                                    <Th color="gray.600" fontWeight="semibold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" py={4}>
                                        STATUS
                                    </Th>
                                    <Th color="gray.600" fontWeight="semibold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" py={4}>
                                        EXPERIENCE
                                    </Th>
                                    <Th color="gray.600" fontWeight="semibold" fontSize="sm" textTransform="uppercase" letterSpacing="wide" py={4}>
                                        ACTIONS
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredApplications.map((application) => (
                                    <Tr
                                        key={application.id}
                                        _hover={{ bg: "gray.50" }}
                                        borderBottom="1px"
                                        borderColor="gray.100"
                                    >
                                        <Td py={4}>
                                            <Flex align="center">
                                                <Avatar
                                                    size="sm"
                                                    name={application.name}
                                                    bg="blue.500"
                                                    color="white"
                                                    mr={3}
                                                >
                                                    {getInitials(application.name)}
                                                </Avatar>
                                                <VStack align="start" spacing={0}>
                                                    <Text fontWeight="medium" color="gray.900">
                                                        {application.name}
                                                    </Text>
                                                    <HStack spacing={2}>
                                                        <Icon as={FiMail} size="12px" color="gray.400" />
                                                        <Text fontSize="sm" color="gray.500">
                                                            {application.email}
                                                        </Text>
                                                    </HStack>
                                                </VStack>
                                            </Flex>
                                        </Td>
                                        <Td py={4}>
                                            <Text fontWeight="medium" color="gray.900">
                                                {application.position}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {application.location}
                                            </Text>
                                        </Td>
                                        <Td py={4}>
                                            <HStack>
                                                <Icon as={FiCalendar} color="gray.400" />
                                                <Text fontSize="sm" color="gray.600">
                                                    {new Date(application.appliedDate).toLocaleDateString()}
                                                </Text>
                                            </HStack>
                                        </Td>
                                        <Td py={4}>
                                            <Badge
                                                colorScheme={getStatusColor(application.status)}
                                                fontSize="xs"
                                                px={2}
                                                py={1}
                                                borderRadius="full"
                                                textTransform="capitalize"
                                            >
                                                {application.status}
                                            </Badge>
                                        </Td>
                                        <Td py={4}>
                                            <Text fontSize="sm" color="gray.600">
                                                {application.experience}
                                            </Text>
                                        </Td>
                                        <Td py={4}>
                                            <HStack spacing={1}>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    colorScheme="blue"
                                                    leftIcon={<FiEye />}
                                                >
                                                    View
                                                </Button>
                                                <Menu>
                                                    <MenuButton
                                                        as={Button}
                                                        size="sm"
                                                        variant="ghost"
                                                        colorScheme="gray"
                                                    >
                                                        <FiMoreVertical />
                                                    </MenuButton>
                                                    <MenuList>
                                                        <MenuItem icon={<FiDownload />}>
                                                            Download Resume
                                                        </MenuItem>
                                                        <MenuItem icon={<FiCheck />} color="green.600">
                                                            Shortlist
                                                        </MenuItem>
                                                        <MenuItem icon={<FiX />} color="red.600">
                                                            Reject
                                                        </MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>

                    {filteredApplications.length === 0 && (
                        <Box textAlign="center" py={10}>
                            <Text fontSize="lg" color="gray.500">
                                No applications found matching your criteria
                            </Text>
                            <Text fontSize="sm" color="gray.400" mt={2}>
                                Try adjusting your search or filters
                            </Text>
                        </Box>
                    )}

                    {/* Summary Stats */}
                    <Box mt={6}>
                        <HStack spacing={6} justify="center" flexWrap="wrap">
                            <VStack>
                                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                                    {applications.filter(app => app.status === 'Under Review').length}
                                </Text>
                                <Text fontSize="sm" color="gray.600">Under Review</Text>
                            </VStack>
                            <VStack>
                                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                                    {applications.filter(app => app.status === 'Shortlisted').length}
                                </Text>
                                <Text fontSize="sm" color="gray.600">Shortlisted</Text>
                            </VStack>
                            <VStack>
                                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                    {applications.filter(app => app.status === 'Interview Scheduled').length}
                                </Text>
                                <Text fontSize="sm" color="gray.600">Interviews</Text>
                            </VStack>
                            <VStack>
                                <Text fontSize="2xl" fontWeight="bold" color="red.600">
                                    {applications.filter(app => app.status === 'Rejected').length}
                                </Text>
                                <Text fontSize="sm" color="gray.600">Rejected</Text>
                            </VStack>
                        </HStack>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}