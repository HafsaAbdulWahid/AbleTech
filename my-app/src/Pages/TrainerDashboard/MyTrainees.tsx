import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Flex,
  Avatar,
  Badge,
  InputGroup,
  InputLeftElement,
  IconButton,
  Tooltip,
  ScaleFade,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Icon,
  Divider,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiBookOpen,
} from 'react-icons/fi';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface Enrollment {
  _id: string;
  userName: string;
  userEmail: string;
  programId: string;
  programTitle: string;
  enrollmentDate: string;
  progress: number;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  lastAccessedDate: string;
  completedModules: Array<{ moduleId: number; completedDate: string }>;
  watchedVideos: Array<{ moduleId: number; videoId: number; watchedDate: string }>;
  quizScores: Array<{ moduleId: number; score: number; attemptDate: string }>;
}

// Dummy data for testing
const DUMMY_ENROLLMENTS: Enrollment[] = [
  {
    _id: '1',
    userName: 'Zara Khan',
    userEmail: 'zara.khan@example.com',
    programId: 'prog1',
    programTitle: 'Advanced React Development',
    enrollmentDate: '2025-01-15T10:00:00Z',
    progress: 85,
    status: 'in-progress',
    lastAccessedDate: '2025-02-02T14:30:00Z',
    completedModules: [
      { moduleId: 1, completedDate: '2025-01-20T10:00:00Z' },
      { moduleId: 2, completedDate: '2025-01-25T10:00:00Z' },
      { moduleId: 3, completedDate: '2025-01-30T10:00:00Z' },
    ],
    watchedVideos: [
      { moduleId: 1, videoId: 1, watchedDate: '2025-01-16T10:00:00Z' },
      { moduleId: 1, videoId: 2, watchedDate: '2025-01-17T10:00:00Z' },
      { moduleId: 2, videoId: 1, watchedDate: '2025-01-22T10:00:00Z' },
      { moduleId: 2, videoId: 2, watchedDate: '2025-01-23T10:00:00Z' },
      { moduleId: 3, videoId: 1, watchedDate: '2025-01-28T10:00:00Z' },
    ],
    quizScores: [
      { moduleId: 1, score: 92, attemptDate: '2025-01-20T10:00:00Z' },
      { moduleId: 2, score: 88, attemptDate: '2025-01-25T10:00:00Z' },
      { moduleId: 3, score: 95, attemptDate: '2025-01-30T10:00:00Z' },
    ],
  },
  {
    _id: '2',
    userName: 'Hafsa Ahmed',
    userEmail: 'hafsa.ahmed@example.com',
    programId: 'prog2',
    programTitle: 'Full Stack Web Development',
    enrollmentDate: '2025-01-10T09:00:00Z',
    progress: 100,
    status: 'completed',
    lastAccessedDate: '2025-02-01T16:45:00Z',
    completedModules: [
      { moduleId: 1, completedDate: '2025-01-12T10:00:00Z' },
      { moduleId: 2, completedDate: '2025-01-18T10:00:00Z' },
      { moduleId: 3, completedDate: '2025-01-24T10:00:00Z' },
      { moduleId: 4, completedDate: '2025-01-28T10:00:00Z' },
      { moduleId: 5, completedDate: '2025-02-01T10:00:00Z' },
    ],
    watchedVideos: [
      { moduleId: 1, videoId: 1, watchedDate: '2025-01-11T10:00:00Z' },
      { moduleId: 1, videoId: 2, watchedDate: '2025-01-11T11:00:00Z' },
      { moduleId: 2, videoId: 1, watchedDate: '2025-01-15T10:00:00Z' },
      { moduleId: 3, videoId: 1, watchedDate: '2025-01-20T10:00:00Z' },
      { moduleId: 4, videoId: 1, watchedDate: '2025-01-26T10:00:00Z' },
      { moduleId: 5, videoId: 1, watchedDate: '2025-01-31T10:00:00Z' },
    ],
    quizScores: [
      { moduleId: 1, score: 98, attemptDate: '2025-01-12T10:00:00Z' },
      { moduleId: 2, score: 94, attemptDate: '2025-01-18T10:00:00Z' },
      { moduleId: 3, score: 90, attemptDate: '2025-01-24T10:00:00Z' },
      { moduleId: 4, score: 96, attemptDate: '2025-01-28T10:00:00Z' },
      { moduleId: 5, score: 100, attemptDate: '2025-02-01T10:00:00Z' },
    ],
  },
  {
    _id: '3',
    userName: 'Laiba Malik',
    userEmail: 'laiba.malik@example.com',
    programId: 'prog3',
    programTitle: 'UI/UX Design Fundamentals',
    enrollmentDate: '2025-01-20T11:00:00Z',
    progress: 45,
    status: 'in-progress',
    lastAccessedDate: '2025-02-03T09:15:00Z',
    completedModules: [
      { moduleId: 1, completedDate: '2025-01-22T10:00:00Z' },
      { moduleId: 2, completedDate: '2025-01-28T10:00:00Z' },
    ],
    watchedVideos: [
      { moduleId: 1, videoId: 1, watchedDate: '2025-01-21T10:00:00Z' },
      { moduleId: 1, videoId: 2, watchedDate: '2025-01-21T11:00:00Z' },
      { moduleId: 2, videoId: 1, watchedDate: '2025-01-26T10:00:00Z' },
      { moduleId: 3, videoId: 1, watchedDate: '2025-02-02T10:00:00Z' },
    ],
    quizScores: [
      { moduleId: 1, score: 85, attemptDate: '2025-01-22T10:00:00Z' },
      { moduleId: 2, score: 78, attemptDate: '2025-01-28T10:00:00Z' },
    ],
  },
];

const MyTrainees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchEnrolledUsers();
  }, []);

  const fetchEnrolledUsers = async () => {
    try {
      setIsLoading(true);

      // For testing, use dummy data
      // Comment out this section and uncomment the API calls below when ready to use real data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEnrollments(DUMMY_ENROLLMENTS);
      setIsLoading(false);
      return;

      /* Uncomment this section when ready to use real API
      // Get trainer's email from localStorage
      const trainerEmail = localStorage.getItem('userEmail');

      if (!trainerEmail) {
        toast({
          title: 'Error',
          description: 'Trainer information not found',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // First, get all training programs created by this trainer
      const programsResponse = await fetch(`http://localhost:3001/api/trainers/training-programs`);
      const programsResult = await programsResponse.json();

      if (!programsResponse.ok) {
        throw new Error('Failed to fetch programs');
      }

      // Filter programs by trainer email
      const trainerPrograms = programsResult.data.filter(
        (program: any) => program.trainer === trainerEmail
      );

      // Get all enrollments for these programs
      const allEnrollments: Enrollment[] = [];

      for (const program of trainerPrograms) {
        const enrollmentsResponse = await fetch(
          `http://localhost:3001/api/user-training-programs/program/${program._id}/enrolled-users`
        );
        const enrollmentsResult = await enrollmentsResponse.json();

        if (enrollmentsResponse.ok && enrollmentsResult.data) {
          allEnrollments.push(...enrollmentsResult.data);
        }
      }

      setEnrollments(allEnrollments);
      */
    } catch (error) {
      console.error('Error fetching enrolled users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch enrolled users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch =
      enrollment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.programTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === 'All' ||
      enrollment.status === selectedFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled': return 'blue';
      case 'in-progress': return 'yellow';
      case 'completed': return 'green';
      case 'dropped': return 'red';
      default: return 'gray';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'green';
    if (progress >= 50) return 'yellow';
    return 'red';
  };

  const handleEnrollmentClick = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    onOpen();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const stats = {
    total: enrollments.length,
    enrolled: enrollments.filter(e => e.status === 'enrolled').length,
    inProgress: enrollments.filter(e => e.status === 'in-progress').length,
    completed: enrollments.filter(e => e.status === 'completed').length,
    avgProgress: enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0
  };

  if (isLoading) {
    return (
      <Box>
        <SideNav />
        <Box>
          <TopNav />
          <Center h="calc(100vh - 64px)" ml="100px">
            <VStack spacing={4}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#2CA58D"
                size="xl"
              />
              <Text color="gray.600" fontSize="lg">
                Loading enrolled trainees...
              </Text>
            </VStack>
          </Center>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <SideNav activeNav="My Trainees" />
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
            {/* Header Box with #2CA58D color */}
            <Box bg="#2CA58D" borderRadius="xl" p={5} mb={6}>
              <Text fontSize="xl" color="white" fontWeight="bold">My Trainees</Text>
            </Box>

            {/* Stats Cards with light #2CA58D */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
              <Box
                bg="rgba(44, 165, 141, 0.1)"
                p={4}
                borderRadius="xl"
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
                border="1px solid"
                borderColor="gray.100"
                textAlign="center"
              >
                <Text fontSize="13px" fontWeight="semibold" color="#1e2738" mb={1}>Total Enrollments</Text>
                <Text fontSize="2xl" fontWeight="bold" color="#2CA58D">{stats.total}</Text>
              </Box>
              <Box
                bg="rgba(44, 165, 141, 0.1)"
                p={4}
                borderRadius="xl"
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
                border="1px solid"
                borderColor="gray.100"
                textAlign="center"
              >
                <Text fontSize="13px" fontWeight="semibold" color="#1e2738" mb={1}>In Progress</Text>
                <Text fontSize="2xl" fontWeight="bold" color="yellow.500">{stats.inProgress}</Text>
              </Box>
              <Box
                bg="rgba(44, 165, 141, 0.1)"
                p={4}
                borderRadius="xl"
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
                border="1px solid"
                borderColor="gray.100"
                textAlign="center"
              >
                <Text fontSize="13px" fontWeight="semibold" color="#1e2738" mb={1}>Completed</Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">{stats.completed}</Text>
              </Box>
              <Box
                bg="rgba(44, 165, 141, 0.1)"
                p={4}
                borderRadius="xl"
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
                border="1px solid"
                borderColor="gray.100"
                textAlign="center"
              >
                <Text fontSize="13px" fontWeight="semibold" color="#1e2738" mb={1}>Avg Progress</Text>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">{stats.avgProgress}%</Text>
              </Box>
            </SimpleGrid>

            {/* Search and Filter Bar */}
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
              border="1px solid"
              borderColor="gray.100"
              mb={6}
            >
              <Text fontSize="md" fontWeight="bold" color="#1e2738" mb={4}>
                Search & Filter
              </Text>
              <Flex direction={{ base: 'column', md: 'row' }} gap={4} align={{ base: 'stretch', md: 'center' }} justify="space-between">
                <HStack spacing={4} flex={1}>
                  <FormControl maxW="300px">
                    <FormLabel fontSize="13px" fontWeight="semibold" color="#1e2738">Search Trainees</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiSearch} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search by name, email, or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="white"
                        borderRadius="md"
                        fontSize="13px"
                        _focus={{ borderColor: '#2CA58D', boxShadow: '0 0 0 1px #2CA58D' }}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl maxW="200px">
                    <FormLabel fontSize="13px" fontWeight="semibold" color="#1e2738">Filter by Status</FormLabel>
                    <Select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      fontSize="13px"
                      borderRadius="md"
                    >
                      <option value="All">All Status</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </Select>
                  </FormControl>
                </HStack>
              </Flex>
            </Box>

            {/* User List */}
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Box p={6}>
                <Text fontSize="md" fontWeight="bold" color="#1e2738" mb={4}>
                  Registered Trainees ({filteredEnrollments.length})
                </Text>

                <VStack spacing={4} align="stretch">
                  {filteredEnrollments.map((enrollment) => (
                    <ScaleFade key={enrollment._id} in={true} initialScale={0.9}>
                      <Box
                        bg="rgba(44, 165, 141, 0.1)"
                        p={5}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="gray.200"
                        cursor="pointer"
                        transform={hoveredUser === enrollment._id ? 'translateY(-2px)' : 'translateY(0)'}
                        boxShadow={hoveredUser === enrollment._id ? 'lg' : 'sm'}
                        transition="all 0.2s"
                        onMouseEnter={() => setHoveredUser(enrollment._id)}
                        onMouseLeave={() => setHoveredUser(null)}
                        onClick={() => handleEnrollmentClick(enrollment)}
                        _hover={{ bg: 'gray.100' }}
                      >
                        <Flex align="center" justify="space-between">
                          <HStack spacing={4}>
                            <Avatar name={enrollment.userName} size="md" />
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold" fontSize="md" color="#1e2738">
                                {enrollment.userName}
                              </Text>
                              <Text fontSize="11px" color="gray.600">
                                {enrollment.userEmail}
                              </Text>
                              <HStack spacing={2} mt={1}>
                                <Badge colorScheme={getStatusColor(enrollment.status)} variant="subtle" fontSize="10px">
                                  {enrollment.status.replace('-', ' ').toUpperCase()}
                                </Badge>
                                <HStack spacing={1}>
                                  <Icon as={FiBookOpen} boxSize={3} color="#1e2738" />
                                  <Badge variant="outline" fontSize="10px" color="#1e2738">
                                    {enrollment.programTitle}
                                  </Badge>
                                </HStack>
                              </HStack>
                            </VStack>
                          </HStack>

                          <VStack align="end" spacing={2} minW="200px">
                            <HStack spacing={2}>
                              <Icon as={FiCalendar} color="gray.500" boxSize={3} />
                              <Text fontSize="10px" color="gray.600">
                                Enrolled: {formatDate(enrollment.enrollmentDate)}
                              </Text>
                            </HStack>
                            <HStack spacing={2}>
                              <Icon as={FiClock} color="gray.500" boxSize={3} />
                              <Text fontSize="10px" color="gray.600">
                                Last active: {getTimeAgo(enrollment.lastAccessedDate)}
                              </Text>
                            </HStack>
                            <HStack spacing={2}>
                              <Box w="80px" h="6px" bg="gray.200" borderRadius="full" overflow="hidden">
                                <Box
                                  w={`${enrollment.progress}%`}
                                  h="100%"
                                  bg={`${getProgressColor(enrollment.progress)}.400`}
                                  transition="width 0.3s"
                                />
                              </Box>
                              <Text fontSize="10px" color="gray.600" fontWeight="semibold">
                                {enrollment.progress}%
                              </Text>
                            </HStack>
                          </VStack>

                          <HStack spacing={1}>
                            <Tooltip label="View Details" fontSize="10px">
                              <IconButton
                                icon={<Icon as={FiEye} />}
                                size="sm"
                                variant="ghost"
                                colorScheme="green"
                                aria-label="View Enrollment Details"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEnrollmentClick(enrollment);
                                }}
                              />
                            </Tooltip>
                          </HStack>
                        </Flex>
                      </Box>
                    </ScaleFade>
                  ))}
                </VStack>

                {/* No Results */}
                {filteredEnrollments.length === 0 && (
                  <Box
                    bg="gray.50"
                    p={8}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                    textAlign="center"
                  >
                    <Text fontSize="13px" color="gray.600">
                      No trainees found matching your search criteria
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Enrollment Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader bg="#2CA58D" color="white" borderTopRadius="xl">
            <HStack spacing={3}>
              <Avatar name={selectedEnrollment?.userName} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="lg">{selectedEnrollment?.userName}</Text>
                <Text fontSize="sm" color="rgba(255,255,255,0.8)">
                  {selectedEnrollment?.userEmail}
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6} p={6}>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontSize="md" fontWeight="bold" color="#1e2738" mb={4}>
                  Enrollment Information
                </Text>
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontWeight="semibold" mb={2} fontSize="13px" color="#1e2738">Status</Text>
                    <Badge colorScheme={getStatusColor(selectedEnrollment?.status || '')} fontSize="10px">
                      {selectedEnrollment?.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" mb={2} fontSize="13px" color="#1e2738">Course</Text>
                    <Text fontSize="13px">{selectedEnrollment?.programTitle}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" mb={2} fontSize="13px" color="#1e2738">Enrolled Date</Text>
                    <Text fontSize="13px">
                      {selectedEnrollment && formatDate(selectedEnrollment.enrollmentDate)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" mb={2} fontSize="13px" color="#1e2738">Last Active</Text>
                    <Text fontSize="13px">
                      {selectedEnrollment && getTimeAgo(selectedEnrollment.lastAccessedDate)}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="md" fontWeight="bold" color="#1e2738" mb={4}>
                  Training Progress
                </Text>
                <HStack spacing={3}>
                  <Box flex={1} bg="gray.200" borderRadius="full" h="10px" overflow="hidden">
                    <Box
                      w={`${selectedEnrollment?.progress || 0}%`}
                      h="100%"
                      bg={`${getProgressColor(selectedEnrollment?.progress || 0)}.400`}
                      borderRadius="full"
                      transition="width 0.3s"
                    />
                  </Box>
                  <Text fontWeight="bold" color={`${getProgressColor(selectedEnrollment?.progress || 0)}.500`} fontSize="13px">
                    {selectedEnrollment?.progress}%
                  </Text>
                </HStack>
                <Text color="gray.600" fontSize="10px" mt={2}>
                  Overall completion of {selectedEnrollment?.programTitle}
                </Text>
              </Box>

              <Box>
                <Text fontSize="md" fontWeight="bold" color="#1e2738" mb={3}>
                  Activity Summary
                </Text>
                <SimpleGrid columns={3} spacing={4}>
                  <Box bg="blue.50" p={3} borderRadius="md" textAlign="center">
                    <Text fontSize="xl" fontWeight="bold" color="blue.600">
                      {selectedEnrollment?.completedModules?.length || 0}
                    </Text>
                    <Text fontSize="10px" color="gray.600">Completed Modules</Text>
                  </Box>
                  <Box bg="green.50" p={3} borderRadius="md" textAlign="center">
                    <Text fontSize="xl" fontWeight="bold" color="green.600">
                      {selectedEnrollment?.watchedVideos?.length || 0}
                    </Text>
                    <Text fontSize="10px" color="gray.600">Videos Watched</Text>
                  </Box>
                  <Box bg="purple.50" p={3} borderRadius="md" textAlign="center">
                    <Text fontSize="xl" fontWeight="bold" color="purple.600">
                      {selectedEnrollment?.quizScores?.length || 0}
                    </Text>
                    <Text fontSize="10px" color="gray.600">Quizzes Taken</Text>
                  </Box>
                </SimpleGrid>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MyTrainees;