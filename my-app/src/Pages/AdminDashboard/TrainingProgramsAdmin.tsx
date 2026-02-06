import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    Container,
    Button,
    HStack,
    VStack,
    useToast,
    Badge,
    Flex,
    Icon,
    Grid,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Center,
    Spinner,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Divider,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer
} from '@chakra-ui/react';
import { 
    FiBookOpen,
    FiUsers,
    FiLayers,
    FiSearch,
    FiCalendar,
    FiUser,
    FiTrash2,
    FiEye,
    FiMoreVertical,
    FiRefreshCw
} from 'react-icons/fi';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface TrainingProgram {
    _id: string;
    title: string;
    // description: string;
    trainer: string;
    category: string;
    level: string;
    duration: string;
    totalModules: number;
    enrolledUsers: number;
    completionRate: number;
    status: string;
    createdDate: string;
    lastUpdated: string;
    isPublished: boolean;
}

const TrainingProgramsAdmin: React.FC = () => {
    const toast = useToast();
    
    const [programs, setPrograms] = useState<TrainingProgram[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedTrainer, setSelectedTrainer] = useState<string>('');

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:3001/api/trainers/training-programs');
            const result = await response.json();

            if (response.ok) {
                setPrograms(result.data || []);
            } else {
                console.error('Failed to fetch programs:', result.message);
                toast({
                    title: 'Error Fetching Programs',
                    description: result.message || 'Failed to load training programs',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error fetching training programs:', error);
            toast({
                title: 'Network Error',
                description: 'Unable to connect to the server. Please try again.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProgram = async (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                const response = await fetch(`http://localhost:3001/api/trainers/training-programs/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setPrograms(prev => prev.filter(p => p._id !== id));
                    toast({
                        title: 'Program Deleted',
                        description: 'Training program removed successfully',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    throw new Error('Failed to delete program');
                }
            } catch (error) {
                toast({
                    title: 'Delete Failed',
                    description: 'Unable to delete the program. Please try again.',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
            }
        }
    };

    const handleViewDetails = (programId: string) => {
        localStorage.setItem('selectedProgramId', programId);
        window.location.href = '/program-details';
    };

    const getLevelColor = (level: string): string => {
        switch (level) {
            case 'Beginner': return 'green';
            case 'Intermediate': return 'blue';
            case 'Advanced': return 'purple';
            case 'All Levels': return 'orange';
            default: return 'gray';
        }
    };

    const getCategoryColor = (category: string): string => {
        const colors = ['blue', 'purple', 'green', 'orange', 'pink', 'teal', 'cyan'];
        const categories = Array.from(new Set(programs.map(p => p.category)));
        const index = categories.indexOf(category) % colors.length;
        return colors[index];
    };

    // Filter programs based on search and filters
    const filteredPrograms = programs.filter(program => {
        const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.trainer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || program.category === selectedCategory;
        const matchesLevel = selectedLevel === '' || program.level === selectedLevel;
        const matchesTrainer = selectedTrainer === '' || program.trainer === selectedTrainer;

        return matchesSearch && matchesCategory && matchesLevel && matchesTrainer;
    });

    const categories = Array.from(new Set(programs.map(p => p.category)));
    const levels = Array.from(new Set(programs.map(p => p.level)));
    const trainers = Array.from(new Set(programs.map(p => p.trainer)));

    const totalEnrolled = programs.reduce((acc, p) => acc + p.enrolledUsers, 0);
    const totalModules = programs.reduce((acc, p) => acc + p.totalModules, 0);

    if (isLoading) {
        return (
            <Box>
                <SideNav />
                <Box>
                    <TopNav />
                    <Box bg="#F7FAFC" py={10} ml="90px" p={6} maxW="calc(100% - 90px)" minH="100vh">
                        <Center h="70vh">
                            <VStack spacing={5}>
                                <Spinner
                                    thickness="4px"
                                    speed="0.65s"
                                    emptyColor="gray.200"
                                    color="#2CA58D"
                                    size="xl"
                                />
                                <VStack spacing={2}>
                                    <Text fontSize="lg" fontWeight="600" color="gray.700">
                                        Loading Training Programs
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
                                    Training Programs
                                </Heading>
                                <Text color="gray.600" fontSize="md" fontWeight="500">
                                    Monitor and manage all training programs
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
                                            <Icon as={FiBookOpen} boxSize={5} color="blue.500" />
                                        </Box>
                                        <VStack align="start" spacing={0}>
                                            <Text fontSize="xl" fontWeight="700" color="gray.800">
                                                {programs.length}
                                            </Text>
                                            <Text fontSize="xs" color="gray.600" fontWeight="500">
                                                Total Programs
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
                                            <Icon as={FiLayers} boxSize={5} color="purple.500" />
                                        </Box>
                                        <VStack align="start" spacing={0}>
                                            <Text fontSize="xl" fontWeight="700" color="gray.800">
                                                {totalModules}
                                            </Text>
                                            <Text fontSize="xs" color="gray.600" fontWeight="500">
                                                Total Modules
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
                                        placeholder="Search by title, description, or trainer..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                    placeholder="All Categories"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    size="md"
                                    flex="1"
                                    minW="180px"
                                    borderColor="gray.200"
                                    fontSize="sm"
                                    _hover={{ borderColor: "gray.300" }}
                                    _focus={{
                                        borderColor: "#2CA58D",
                                        boxShadow: "0 0 0 1px #2CA58D"
                                    }}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Select>

                                <Select
                                    placeholder="All Levels"
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    size="md"
                                    flex="1"
                                    minW="160px"
                                    borderColor="gray.200"
                                    fontSize="sm"
                                    _hover={{ borderColor: "gray.300" }}
                                    _focus={{
                                        borderColor: "#2CA58D",
                                        boxShadow: "0 0 0 1px #2CA58D"
                                    }}
                                >
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </Select>

                                <Select
                                    placeholder="All Trainers"
                                    value={selectedTrainer}
                                    onChange={(e) => setSelectedTrainer(e.target.value)}
                                    size="md"
                                    flex="1"
                                    minW="180px"
                                    borderColor="gray.200"
                                    fontSize="sm"
                                    _hover={{ borderColor: "gray.300" }}
                                    _focus={{
                                        borderColor: "#2CA58D",
                                        boxShadow: "0 0 0 1px #2CA58D"
                                    }}
                                >
                                    {trainers.map(trainer => (
                                        <option key={trainer} value={trainer}>{trainer}</option>
                                    ))}
                                </Select>

                                {(searchTerm || selectedCategory || selectedLevel || selectedTrainer) && (
                                    <Button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('');
                                            setSelectedLevel('');
                                            setSelectedTrainer('');
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
                            {filteredPrograms.length === 0 ? (
                                <Center py={20}>
                                    <VStack spacing={4}>
                                        <Box
                                            bg="gray.100"
                                            p={6}
                                            borderRadius="full"
                                        >
                                            <Icon as={FiBookOpen} boxSize={12} color="gray.400" />
                                        </Box>
                                        <Text fontSize="xl" fontWeight="600" color="gray.700">
                                            {searchTerm || selectedCategory || selectedLevel || selectedTrainer
                                                ? "No programs match your filters"
                                                : "No training programs available"}
                                        </Text>
                                        <Text color="gray.500" fontSize="sm" textAlign="center" maxW="md">
                                            {searchTerm || selectedCategory || selectedLevel || selectedTrainer
                                                ? "Try adjusting your search criteria or filters"
                                                : "Training programs will appear here once trainers create them"}
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
                                                    Program Title
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
                                                    Trainer
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
                                                    Category
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
                                                    Level
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
                                                    Modules
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
                                                    Enrolled
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
                                                    Date Created
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
                                            {filteredPrograms.map((program) => (
                                                <Tr
                                                    key={program._id}
                                                    _hover={{ bg: "gray.50" }}
                                                    borderBottom="1px solid"
                                                    borderColor="gray.100"
                                                    transition="all 0.15s"
                                                >
                                                    <Td px={8} py={5}>
                                                        <VStack align="start" spacing={1}>
                                                            <Text
                                                                color="#2CA58D"
                                                                fontWeight="600"
                                                                fontSize="sm"
                                                                cursor="pointer"
                                                                _hover={{
                                                                    textDecoration: "none",
                                                                    color: "#248a73"
                                                                }}
                                                                onClick={() => handleViewDetails(program._id)}
                                                            >
                                                                {program.title}
                                                            </Text>
                                                            {/* <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                                                {program.description}
                                                            </Text> */}
                                                        </VStack>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <HStack spacing={2}>
                                                            <Icon as={FiUser} boxSize={4} color="gray.400" />
                                                            <Text
                                                                color="gray.700"
                                                                fontSize="sm"
                                                                fontWeight="500"
                                                            >
                                                                {program.trainer}
                                                            </Text>
                                                        </HStack>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <Badge
                                                            colorScheme={getCategoryColor(program.category)}
                                                            borderRadius="md"
                                                            px={3}
                                                            py={1.5}
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                            textTransform="capitalize"
                                                        >
                                                            {program.category}
                                                        </Badge>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <Badge
                                                            colorScheme={getLevelColor(program.level)}
                                                            borderRadius="md"
                                                            px={3}
                                                            py={1.5}
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                            textTransform="capitalize"
                                                        >
                                                            {program.level}
                                                        </Badge>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <Text
                                                            color="gray.700"
                                                            fontSize="sm"
                                                            fontWeight="600"
                                                        >
                                                            {program.totalModules}
                                                        </Text>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <HStack spacing={2}>
                                                            <Icon as={FiUsers} boxSize={4} color="gray.400" />
                                                            <Text
                                                                color="gray.700"
                                                                fontSize="sm"
                                                                fontWeight="600"
                                                            >
                                                                {program.enrolledUsers}
                                                            </Text>
                                                        </HStack>
                                                    </Td>
                                                    <Td px={6} py={5}>
                                                        <HStack spacing={2}>
                                                            <Icon as={FiCalendar} boxSize={4} color="gray.400" />
                                                            <Text
                                                                color="gray.600"
                                                                fontSize="sm"
                                                                fontWeight="500"
                                                            >
                                                                {new Date(program.createdDate).toLocaleDateString('en-US', {
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
                                                                <MenuItem
                                                                    icon={<FiEye />}
                                                                    onClick={() => handleViewDetails(program._id)}
                                                                >
                                                                    View Details
                                                                </MenuItem>
                                                                <Divider />
                                                                <MenuItem
                                                                    icon={<FiTrash2 />}
                                                                    color="red.500"
                                                                    onClick={() => handleDeleteProgram(program._id, program.title)}
                                                                >
                                                                    Delete Program
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
                        {filteredPrograms.length > 0 && (
                            <Flex
                                mt={4}
                                justify="space-between"
                                align="center"
                                px={2}
                            >
                                <Text fontSize="sm" color="gray.600" fontWeight="500">
                                    Showing {filteredPrograms.length} of {programs.length} program{programs.length !== 1 ? 's' : ''}
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

export default TrainingProgramsAdmin;