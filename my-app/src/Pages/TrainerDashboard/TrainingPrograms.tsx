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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Spinner,
  Center,
  Divider
} from '@chakra-ui/react';
import {
  FiBookOpen,
  FiVideo,
  FiUsers,
  FiClock,
  FiLayers,
  FiTarget,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiUser,
  FiArrowRight,
  FiTrendingUp,
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
}

const TrainingPrograms = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/trainers/training-programs');
      const result = await response.json();

      if (response.ok) {
        setPrograms(result.data || []);
      } else {
        console.error('Failed to fetch programs:', result.message);
      }
    } catch (error) {
      console.error('Error fetching training programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgramClick = (programId: string) => {
    localStorage.setItem('selectedProgramId', programId);
    navigate('/program-details');
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

  const totalEnrolledUsers = programs.reduce((acc, program) => acc + program.enrolledUsers, 0);

  if (loading) {
    return (
      <Box>
        <SideNav activeNav="Training Programs" />
        <Box>
          <TopNav />
          <Box px={6} ml="100px" mt={6} minH="calc(100vh - 64px)">
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
                  Training Programs
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
                    Loading training programs...
                  </Text>
                </VStack>
              </Center>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (programs.length === 0) {
    return (
      <Box>
        <SideNav activeNav="Training Programs" />
        <Box>
          <TopNav />
          <Box px={6} ml="100px" mt={6} minH="calc(100vh - 64px)">
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
                  Training Programs
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
                    No Training Programs Found
                  </AlertTitle>
                  <AlertDescription fontSize="sm" color="blue.700" mt={1}>
                    You haven't created any training programs yet. Create your first program to get started.
                  </AlertDescription>
                </Box>
              </Alert>

              <Flex justify="center" mt={6}>
                <Button
                  bg="#2CA58D"
                  color="white"
                  size="md"
                  leftIcon={<Icon as={FiBookOpen} boxSize={4} />}
                  onClick={() => navigate('/create-training')}
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
                  Create Your First Program
                </Button>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <SideNav activeNav="Training Programs" />
      <Box>
        <TopNav />
        <Box px={6} ml="100px" mt={5} pb={5}>
          <Box
            p={6}
            bg="white"
            borderRadius="2xl"
            boxShadow="sm"
          >
            {/* Header Section */}
            <Box
             bgGradient="linear(to-r, #35bfa3, #077660)"
              borderRadius="xl"
              p={6}
              mb={8}
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
                  <Text fontSize="xl" color="white" fontWeight="700" letterSpacing="tight">
                    Training Programs
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.900" fontWeight="400">
                    Manage and track all your training programs
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
                  onClick={fetchPrograms}
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
            <Grid templateColumns="repeat(2, 1fr)" gap={5} mb={8}>
              <Card
                bg="white"
                shadow="sm"
                border="1px"
                borderColor="gray.100"
                borderRadius="xl"
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
                        <Icon as={FiBookOpen} boxSize={5} color="#1976D2" />
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
                        {programs.length}
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontWeight="500" mt={1}>
                        Total Programs
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
                        {totalEnrolledUsers}
                      </Text>
                      <Text fontSize="xs" color="gray.500" fontWeight="500" mt={1}>
                        Enrolled Users
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </Grid>

            <Divider mb={6} borderColor="gray.200" />

            {/* Programs Section */}
            <Box>
              <Flex align="center" justify="space-between" mb={5}>
                <VStack align="start" spacing={0.5}>
                  <Text fontSize="lg" fontWeight="700" color="gray.800">
                    Training Programs
                  </Text>
                </VStack>
              </Flex>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                {programs.map((program) => (
                  <Card
                    key={program._id}
                    bg="white"
                    shadow="sm"
                    border="1px"
                    borderColor="gray.100"
                    borderRadius="xl"
                    overflow="hidden"
                    _hover={{
                      boxShadow: "md",
                      transform: "translateY(-2px)",
                      borderColor: `${getCategoryColor(program.category)}.300`,
                      cursor: "pointer"
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    onClick={() => handleProgramClick(program._id)}
                  >
                    <Box
                      h="110px"
                      bgGradient={`linear(135deg, ${getCategoryColor(program.category)}.50, ${getCategoryColor(program.category)}.100)`}
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
                        bg={`${getCategoryColor(program.category)}.200`}
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
                        borderColor={`${getCategoryColor(program.category)}.200`}
                        position="relative"
                        _hover={{
                          transform: "scale(1.05)"
                        }}
                        transition="transform 0.3s ease"
                      >
                        <Icon
                          as={FiBookOpen}
                          boxSize={8}
                          color={`${getCategoryColor(program.category)}.500`}
                        />
                      </Box>
                    </Box>

                    <CardBody p={5}>
                      <VStack spacing={3} align="stretch">
                        <Box>
                          <Text fontSize="md" fontWeight="700" color="gray.800" mb={1.5}>
                            {program.title}
                          </Text>
                          <Text fontSize="12px" color="gray.600" noOfLines={2} mb={2}>
                            {program.description}
                          </Text>
                          <HStack spacing={2} flexWrap="wrap" mb={2}>
                            <Badge
                              colorScheme={getLevelColor(program.level)}
                              variant="subtle"
                              fontSize="xs"
                              px={2.5}
                              mt={2}
                              py={0.5}
                              borderRadius="full"
                              fontWeight="600"
                            >
                              {program.level}
                            </Badge>
                            <Badge
                              colorScheme={getCategoryColor(program.category)}
                              variant="subtle"
                              fontSize="xs"
                              mt={2}
                              px={2.5}
                              py={0.5}
                              borderRadius="full"
                              fontWeight="600"
                            >
                              {program.category}
                            </Badge>
                          </HStack>
                        </Box>

                        <Flex justify="center" py={2}>
                          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <VStack spacing={0.5} mr={2}>
                              <Text fontSize="lg" fontWeight="700" color="gray.800">
                                {program.totalModules}
                              </Text>
                              <Text fontSize="10px" color="gray.500" fontWeight="500" textTransform="uppercase" letterSpacing="wide">
                                Modules
                              </Text>
                            </VStack>

                            <VStack spacing={0.5}>
                              <Text fontSize="lg" fontWeight="700" color="gray.800">
                                {program.enrolledUsers}
                              </Text>
                              <Text fontSize="10px" color="gray.500" fontWeight="500" textTransform="uppercase" letterSpacing="wide">
                                Students
                              </Text>
                            </VStack>
                          </Grid>
                        </Flex>

                        <Box pt={2} borderTop="1px" borderColor="gray.100">
                          <Flex justify="space-between" align="center">
                            <HStack spacing={1}>
                              <Icon as={FiUser} boxSize={3} color="gray.500" />
                              <Text fontSize="11px" color="gray.500">
                                {program.trainer}
                              </Text>
                            </HStack>
                            <HStack spacing={1}>
                              <Icon as={FiCalendar} boxSize={3} color="gray.500" />
                              <Text fontSize="11px" color="gray.500">
                                {new Date(program.createdDate).toLocaleDateString()}
                              </Text>
                            </HStack>
                          </Flex>
                        </Box>

                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            bg={`${getCategoryColor(program.category)}.100`}
                            color={`${getCategoryColor(program.category)}.700`}
                            fontSize="sm"
                            fontWeight="600"
                            borderRadius="lg"
                            _hover={{
                              bg: `${getCategoryColor(program.category)}.200`,
                              transform: "translateY(-1px)",
                              boxShadow: "sm"
                            }}
                            transition="all 0.3s ease"
                            flex="1"
                            h="38px"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            bg="gray.100"
                            color="gray.700"
                            fontSize="sm"
                            fontWeight="600"
                            borderRadius="lg"
                            _hover={{
                              bg: "gray.200",
                              transform: "translateY(-1px)",
                              boxShadow: "sm"
                            }}
                            transition="all 0.3s ease"
                            flex="1"
                            h="38px"
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem('editProgramId', program._id);
                              localStorage.setItem('editProgramData', JSON.stringify(program));
                              navigate('/create-training');
                            }}
                          >
                            Edit
                          </Button>
                        </HStack>
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

export default TrainingPrograms;