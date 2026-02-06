import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Flex,
    Icon,
    Grid,
    Badge,
    Card,
    CardBody,
    Button,
    SimpleGrid,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Stack,
    Center,
    Spinner,
    useToast,
} from '@chakra-ui/react';
import {
    FiBookOpen,
    FiClock,
    FiLayers,
    FiTarget,
    FiSearch,
    FiCalendar,
    FiUser,
    FiArrowRight,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface TrainingProgram {
    _id: string;
    title: string;
    description: string;
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
    tags?: string[];
    isPublished: boolean;
    objectives?: string;
    prerequisites?: string;
    materials?: string;
    accessibilityFeatures?: string[];
    isEnrolled?: boolean;
    progress?: number;
}

const UserTrainingPrograms = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [programs, setPrograms] = useState<TrainingProgram[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');

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

    const handleViewDetails = (programId: string) => {
        console.log('Navigating to details with ID:', programId);
        // Changed from 'selectedProgramId' to 'selectedUserProgramId' to match UserProgramDetails
        localStorage.setItem('selectedUserProgramId', programId);
        navigate('/user-program-details');
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
            program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.trainer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || program.category === selectedCategory;
        const matchesLevel = selectedLevel === '' || program.level === selectedLevel;

        return matchesSearch && matchesCategory && matchesLevel;
    });

    const categories = Array.from(new Set(programs.map(p => p.category)));
    const levels = Array.from(new Set(programs.map(p => p.level)));

    if (isLoading) {
        return (
            <Box minH="100vh" bg="gray.50">
                <SideNav activeNav="Training Programs" />
                <Box>
                    <TopNav />
                    <Center h="calc(100vh - 80px)">
                        <VStack spacing={4}>
                            <Spinner
                                thickness="4px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="#2CA58D"
                                size="xl"
                            />
                            <Text color="gray.600" fontSize="lg">Loading training programs...</Text>
                        </VStack>
                    </Center>
                </Box>
            </Box>
        );
    }

    if (programs.length === 0) {
        return (
            <Box minH="100vh" bg="gray.50">
                <SideNav activeNav="Training Programs" />
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
                            <Box bg="teal.500" borderRadius="xl" p={5} mb={6}>
                                <Text fontSize="xl" color="white" fontWeight="bold">Training Programs</Text>
                            </Box>

                            <Center py={10}>
                                <VStack spacing={4}>
                                    <Icon as={FiBookOpen} boxSize={12} color="gray.400" />
                                    <Text fontSize="xl" color="gray.500" fontWeight="medium">
                                        No Training Programs Available
                                    </Text>
                                    <Text fontSize="md" color="gray.400" textAlign="center">
                                        No trainers have posted any training programs yet. Check back later for new programs.
                                    </Text>
                                    <Button
                                        mt={4}
                                        colorScheme="teal"
                                        onClick={fetchPrograms}
                                        leftIcon={<Icon as={FiTarget} />}
                                    >
                                        Refresh
                                    </Button>
                                </VStack>
                            </Center>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg="gray.50">
            <SideNav activeNav="Training Programs" />
            <Box>
                <TopNav />
                <Box
                    px={6}
                    ml="100px"
                    mt={8}
                    minH="calc(100vh - 64px)"
                    pb={8}
                >
                    <Box
                        p={8}
                        bg="white"
                        borderRadius="3xl"
                        mb={6}
                        boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
                    >
                        {/* Header */}
                        <Box bg="teal.500" borderRadius="xl" p={5} mb={6}>
                            <Flex justify="space-between" align="center">
                                <Box>
                                    <Text fontSize="xl" color="white" fontWeight="bold">Available Training Programs</Text>
                                    <Text fontSize="sm" color="white" opacity={0.9}>
                                        Enhance your skills with programs created by expert trainers
                                    </Text>
                                </Box>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    color="white"
                                    borderColor="white"
                                    onClick={fetchPrograms}
                                    _hover={{ bg: 'whiteAlpha.200' }}
                                >
                                    Refresh
                                </Button>
                            </Flex>
                        </Box>

                        {/* Search and Filter Section */}
                        <Card mb={6} shadow="sm" borderRadius="xl" border="1px solid" borderColor="gray.200">
                            <CardBody p={6}>
                                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                                    <InputGroup flex="2">
                                        <InputLeftElement pointerEvents="none">
                                            <Icon as={FiSearch} color="gray.400" />
                                        </InputLeftElement>
                                        <Input
                                            placeholder="Search programs by title, description, or trainer..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            fontSize="14px"
                                            borderRadius="lg"
                                        />
                                    </InputGroup>

                                    <Select
                                        placeholder="All Categories"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        fontSize="14px"
                                        borderRadius="lg"
                                        flex="1"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </Select>

                                    <Select
                                        placeholder="All Levels"
                                        value={selectedLevel}
                                        onChange={(e) => setSelectedLevel(e.target.value)}
                                        fontSize="14px"
                                        borderRadius="lg"
                                        flex="1"
                                    >
                                        {levels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </Select>
                                </Stack>
                            </CardBody>
                        </Card>

                        {/* Programs Grid */}
                        <Box>
                            <Flex justify="space-between" align="center" mb={6}>
                                <Text fontSize="lg" fontWeight="bold" color="#2D3E5E">
                                    All Programs
                                    <Text as="span" color="gray.500" fontWeight="normal" ml={2}>
                                        ({filteredPrograms.length})
                                    </Text>
                                </Text>
                            </Flex>

                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                {filteredPrograms.map((program) => (
                                    <Card
                                        key={program._id}
                                        bg="white"
                                        shadow="sm"
                                        border="1px solid"
                                        borderColor="gray.200"
                                        borderRadius="xl"
                                        overflow="hidden"
                                        _hover={{
                                            shadow: "md",
                                            borderColor: "teal.300",
                                            transform: "translateY(-4px)",
                                        }}
                                        transition="all 0.3s ease"
                                        position="relative"
                                    >
                                        {/* Colored Top Section with Icon */}
                                        <Box
                                            h="120px"
                                            bg={`${getCategoryColor(program.category)}.50`}
                                            position="relative"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            borderBottom="2px solid"
                                            borderColor={`${getCategoryColor(program.category)}.100`}
                                        >
                                            <Box
                                                w="60px"
                                                h="60px"
                                                bg="white"
                                                borderRadius="xl"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                boxShadow="md"
                                                border="3px solid"
                                                borderColor={`${getCategoryColor(program.category)}.200`}
                                            >
                                                <Icon
                                                    as={FiBookOpen}
                                                    color={`${getCategoryColor(program.category)}.600`}
                                                    boxSize={6}
                                                />
                                            </Box>
                                        </Box>

                                        <CardBody p={5}>
                                            <VStack spacing={3} align="stretch">
                                                {/* Header Section */}
                                                <Box>
                                                    <Text 
                                                        fontSize="17px" 
                                                        fontWeight="700" 
                                                        color="gray.800" 
                                                        mb={1.5}
                                                        lineHeight="1.3"
                                                        noOfLines={2}
                                                    >
                                                        {program.title}
                                                    </Text>
                                                    <Text 
                                                        fontSize="13px" 
                                                        color="gray.600" 
                                                        lineHeight="1.5"
                                                        noOfLines={2}
                                                    >
                                                        {program.description}
                                                    </Text>
                                                </Box>

                                                {/* Badges */}
                                                <HStack spacing={2} flexWrap="wrap">
                                                    <Badge
                                                        colorScheme={getLevelColor(program.level)}
                                                        fontSize="10px"
                                                        fontWeight="600"
                                                        px={2}
                                                        py={1}
                                                        borderRadius="md"
                                                        textTransform="uppercase"
                                                    >
                                                        {program.level}
                                                    </Badge>
                                                    <Badge
                                                        colorScheme={getCategoryColor(program.category)}
                                                        fontSize="10px"
                                                        fontWeight="600"
                                                        px={2}
                                                        py={1}
                                                        borderRadius="md"
                                                    >
                                                        {program.category}
                                                    </Badge>
                                                    <Badge
                                                        bg="gray.100"
                                                        color="gray.700"
                                                        fontSize="10px"
                                                        fontWeight="600"
                                                        px={2}
                                                        py={1}
                                                        borderRadius="md"
                                                    >
                                                        <Icon as={FiClock} boxSize={2.5} mb="-1px" mr={1} />
                                                        {program.duration}
                                                    </Badge>
                                                </HStack>

                                                {/* Stats - Only Modules */}
                                                <Box
                                                    bg="gray.50"
                                                    p={3}
                                                    borderRadius="lg"
                                                    textAlign="center"
                                                >
                                                    <HStack justify="center" spacing={1} mb={1}>
                                                        <Icon as={FiLayers} boxSize={3.5} color="gray.600" />
                                                        <Text fontSize="11px" color="gray.600" fontWeight="500">
                                                            Modules
                                                        </Text>
                                                    </HStack>
                                                    <Text fontSize="18px" fontWeight="700" color="gray.800">
                                                        {program.totalModules}
                                                    </Text>
                                                </Box>

                                                {/* Trainer & Date */}
                                                <Box pt={2} borderTop="1px solid" borderColor="gray.100">
                                                    <VStack spacing={1.5} align="stretch">
                                                        <HStack spacing={2}>
                                                            <Icon as={FiUser} boxSize={3.5} color="gray.500" />
                                                            <Text fontSize="12px" color="gray.600" fontWeight="500">
                                                                {program.trainer}
                                                            </Text>
                                                        </HStack>
                                                        <HStack spacing={2}>
                                                            <Icon as={FiCalendar} boxSize={3.5} color="gray.500" />
                                                            <Text fontSize="12px" color="gray.600">
                                                                {new Date(program.createdDate).toLocaleDateString('en-US', { 
                                                                    month: 'short', 
                                                                    day: 'numeric', 
                                                                    year: 'numeric' 
                                                                })}
                                                            </Text>
                                                        </HStack>
                                                    </VStack>
                                                </Box>

                                                {/* View Button */}
                                                <Button
                                                    size="md"
                                                    colorScheme="teal"
                                                    onClick={() => handleViewDetails(program._id)}
                                                    w="100%"
                                                    fontWeight="600"
                                                    rightIcon={<Icon as={FiArrowRight} />}
                                                >
                                                    View
                                                </Button>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </Box>

                        {filteredPrograms.length === 0 && (
                            <Center py={10}>
                                <VStack spacing={4}>
                                    <Icon as={FiSearch} boxSize={12} color="gray.300" />
                                    <Text fontSize="lg" color="gray.500" mb={2}>No programs found</Text>
                                    <Text fontSize="13px" color="gray.400" textAlign="center">
                                        {searchTerm ? "Try adjusting your search criteria or filters" :
                                            "No programs match your current filters."}
                                    </Text>
                                    {(searchTerm || selectedCategory || selectedLevel) && (
                                        <Button
                                            colorScheme="teal"
                                            variant="outline"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedCategory('');
                                                setSelectedLevel('');
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    )}
                                </VStack>
                            </Center>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default UserTrainingPrograms;