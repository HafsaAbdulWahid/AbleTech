import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  VStack,
  HStack,
  Text,
  Flex,
  Icon,
  Grid,
  GridItem,
  Badge,
  Progress,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Avatar,
  Tooltip,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp,
  FiActivity,
  FiAward,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiDownload,
  FiMail,
  FiCheckCircle,
  FiPause,
  FiUsers,
  FiTarget,
} from 'react-icons/fi';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface UserProgress {
  id: number;
  name: string;
  email: string;
  avatar: string;
  program: string;
  progress: number;
  status: string;
  startDate: string;
  expectedCompletion: string;
  completedModules: number;
  totalModules: number;
  lastActivity: string;
  score: number;
  certificateEarned: boolean;
}

const TrainingProgress = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserProgress | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const userProgress: UserProgress[] = [
  { 
    id: 1, 
    name: 'Fatima Khan', 
    email: 'fatima.khan@example.com', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69b4e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    program: 'Engineering', 
    progress: 85, 
    status: 'In Progress', 
    startDate: '2024-01-15',
    expectedCompletion: '2024-03-15', 
    completedModules: 8, 
    totalModules: 10,
    lastActivity: '2 hours ago', 
    score: 92, 
    certificateEarned: false
  },
  { 
    id: 2, 
    name: 'Ahmed Ali', 
    email: 'ahmed.ali@example.com', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69b4e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    program: 'Design', 
    progress: 92, 
    status: 'Completed', 
    startDate: '2024-02-03',
    expectedCompletion: '2024-02-28', 
    completedModules: 12, 
    totalModules: 12,
    lastActivity: '1 day ago', 
    score: 88, 
    certificateEarned: true
  },
  { 
    id: 3, 
    name: 'Ayesha Malik', 
    email: 'ayesha.malik@example.com', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69b4e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    program: 'Marketing', 
    progress: 45, 
    status: 'In Progress', 
    startDate: '2024-03-10',
    expectedCompletion: '2024-04-01', 
    completedModules: 6, 
    totalModules: 14,
    lastActivity: '5 minutes ago', 
    score: 78, 
    certificateEarned: false
  },
  { 
    id: 4, 
    name: 'Hassan Sheikh', 
    email: 'hassan.sheikh@example.com', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69b4e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    program: 'Sales', 
    progress: 78, 
    status: 'Paused', 
    startDate: '2024-01-28',
    expectedCompletion: '2024-05-20', 
    completedModules: 3, 
    totalModules: 16,
    lastActivity: '3 hours ago', 
    score: 65, 
    certificateEarned: false
  },
  { 
    id: 5, 
    name: 'Zainab Hussain', 
    email: 'zainab.hussain@example.com', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69b4e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    program: 'HR', 
    progress: 23, 
    status: 'Paused', 
    startDate: '2023-12-05',
    expectedCompletion: '2024-05-20', 
    completedModules: 3, 
    totalModules: 16,
    lastActivity: '1 week ago', 
    score: 65, 
    certificateEarned: false
  },
  { 
    id: 6, 
    name: 'Muhammad Usman', 
    email: 'muhammad.usman@example.com', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69b4e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    program: 'IT Support', 
    progress: 67, 
    status: 'In Progress', 
    startDate: '2024-02-20',
    expectedCompletion: '2024-04-01', 
    completedModules: 6, 
    totalModules: 14,
    lastActivity: '30 minutes ago', 
    score: 78, 
    certificateEarned: false
  },
  { 
    id: 7, 
    name: 'Sana Tariq', 
    email: 'sana.tariq@example.com', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69b4e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    program: 'Finance', 
    progress: 38, 
    status: 'In Progress', 
    startDate: '2024-03-25',
    expectedCompletion: '2024-04-01', 
    completedModules: 6, 
    totalModules: 14,
    lastActivity: '4 hours ago', 
    score: 78, 
    certificateEarned: false
  },
  { 
    id: 8, 
    name: 'Bilal Ahmad', 
    email: 'bilal.ahmad@example.com', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b69b4e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
    program: 'Operations', 
    progress: 94, 
    status: 'Completed', 
    startDate: '2024-01-10',
    expectedCompletion: '2024-02-28', 
    completedModules: 12, 
    totalModules: 12,
    lastActivity: '1 hour ago', 
    score: 88, 
    certificateEarned: true
  }
];

  const overallStats = [
    { 
      label: 'Total Trainees', value: userProgress.length, change: '+2 this week', 
      icon: FiUsers, color: 'blue', trend: 'up'
    },
    { 
      label: 'Avg Completion Rate', 
      value: `${Math.round(userProgress.reduce((acc, user) => acc + user.progress, 0) / userProgress.length)}%`, 
      change: '+5% from last month', icon: FiTrendingUp, color: 'green', trend: 'up'
    },
    { 
      label: 'Certificates Earned', value: userProgress.filter(user => user.certificateEarned).length, 
      change: '+1 this week', icon: FiAward, color: 'purple', trend: 'up'
    },
    { 
      label: 'Active Programs', value: Array.from(new Set(userProgress.map(user => user.program))).length, 
      change: 'Stable', icon: FiTarget, color: 'orange', trend: 'stable'
    },
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Completed': return 'green';
      case 'In Progress': return 'blue';
      case 'Paused': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return FiCheckCircle;
      case 'In Progress': return FiActivity;
      case 'Paused': return FiPause;
      default: return FiCheckCircle;
    }
  };

  const filteredUsers = userProgress.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (user: UserProgress): void => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <Box>
      <SideNav />
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
            {/* Green Header Box */}
            <Box bg="teal.500" borderRadius="xl" p={5} mb={6}>
              <Text fontSize="xl" color="white" fontWeight="bold"> Training Progress</Text>
             
            </Box>

            <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
              {overallStats.map((stat, index) => (
                <GridItem key={index}>
                  <Box
                    bg="blue.50"
                    p={4}
                    borderRadius="xl"
                    boxShadow="md"
                    _hover={{ boxShadow: "lg" }}
                  >
                    <Flex align="center" justify="space-between">
                      <Box>
                        <Text fontSize="lg" fontWeight="bold" color="#2D3E5E">
                          {stat.value}
                        </Text>
                        <Text fontSize="13px" color="gray.600" mb={1}>
                          {stat.label}
                        </Text>
                        <Text 
                          fontSize="10px" 
                          color={stat.trend === 'up' ? 'green.500' : stat.trend === 'down' ? 'red.500' : 'gray.500'}
                        >
                          {stat.change}
                        </Text>
                      </Box>
                      <Box
                        w={10} h={10} bg={`${stat.color}.100`} borderRadius="xl"
                        display="flex" alignItems="center" justifyContent="center"
                      >
                        <Icon as={stat.icon} boxSize={5} color={`${stat.color}.600`} />
                      </Box>
                    </Flex>
                  </Box>
                </GridItem>
              ))}
            </Grid>

            <Box
              bg="fff"
              p={4}
              borderRadius="xl"
              mb={6}
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Grid templateColumns="2fr 1fr 1fr" gap={4} alignItems="end">
                <GridItem>
                  <Text fontSize="13px" fontWeight="semibold" mb={2} color="#2D3E5E">
                    Search Trainees
                  </Text>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by name or program..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      borderRadius="md"
                      fontSize="13px"
                    />
                  </InputGroup>
                </GridItem>
                <GridItem>
                  <Text fontSize="13px" fontWeight="semibold" mb={2} color="#2D3E5E">
                    Filter by Status
                  </Text>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    borderRadius="md"
                    fontSize="13px"
                  >
                    <option value="all">All Status</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </Select>
                </GridItem>
                <GridItem>
                  
                </GridItem>
              </Grid>
            </Box>

            <Box
              bg="fff"
              borderRadius="xl"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Box p={4} borderBottom="1px" borderColor="gray.200">
                <Flex justify="space-between" align="center">
                  <Text fontSize="md" fontWeight="bold" color="#2D3E5E">
                    Trainee Progress ({filteredUsers.length})
                  </Text>
                  <HStack spacing={3}>
                    <Button
                      colorScheme="teal"
                      leftIcon={<Icon as={FiDownload} />}
                      size="sm"
                      borderRadius="md"
                      fontSize="10px"
                    >
                      Export Report
                    </Button>
                  </HStack>
                </Flex>
              </Box>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead bg="blue.50">
                    <Tr>
                      <Th borderColor="gray.300" fontSize="10px">Trainee</Th>
                      <Th borderColor="gray.300" fontSize="10px">Program</Th>
                      <Th borderColor="gray.300" fontSize="10px">Progress</Th>
                      <Th borderColor="gray.300" fontSize="10px">Status</Th>
                      <Th borderColor="gray.300" fontSize="10px">Score</Th>
                      <Th borderColor="gray.300" fontSize="10px">Last Activity</Th>
                      <Th borderColor="gray.300" fontSize="10px">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredUsers.map((user) => (
                      <Tr key={user.id} _hover={{ bg: 'gray.50' }}>
                        <Td borderColor="gray.200" py={4}>
                          <Flex align="center">
                            <Avatar size="sm" src={user.avatar} name={user.name} mr={3} />
                            <Box>
                              <Text fontWeight="semibold" fontSize="13px">{user.name}</Text>
                              <Text fontSize="10px" color="gray.500">{user.email}</Text>
                            </Box>
                          </Flex>
                        </Td>
                        <Td borderColor="gray.200">
                          <Text fontSize="13px" fontWeight="semibold">{user.program}</Text>
                          <Text fontSize="10px" color="gray.500">
                            {user.completedModules}/{user.totalModules} modules
                          </Text>
                        </Td>
                        <Td borderColor="gray.200">
                          <Box>
                            <Flex justify="space-between" mb={1}>
                              <Text fontSize="10px" color="gray.600">{user.progress}%</Text>
                            </Flex>
                            <Progress
                              value={user.progress}
                              size="sm"
                              colorScheme={user.progress === 100 ? 'green' : 'blue'}
                              borderRadius="full"
                            />
                          </Box>
                        </Td>
                        <Td borderColor="gray.200">
                          <Badge
                            colorScheme={getStatusColor(user.status)}
                            variant="subtle"
                            borderRadius="md"
                            px={2} py={1} fontSize="10px"
                          >
                            <Icon as={getStatusIcon(user.status)} mr={1} />
                            {user.status}
                          </Badge>
                        </Td>
                        <Td borderColor="gray.200">
                          <Text 
                            fontSize="13px" fontWeight="bold"
                            color={user.score >= 80 ? 'green.600' : user.score >= 60 ? 'orange.600' : 'red.600'}
                          >
                            {user.score}%
                          </Text>
                        </Td>
                        <Td borderColor="gray.200">
                          <Text fontSize="10px" color="gray.600">{user.lastActivity}</Text>
                        </Td>
                        <Td borderColor="gray.200">
                          <HStack spacing={1}>
                            <Tooltip label="View Details">
                              <IconButton
                                aria-label="View user details"
                                icon={<Icon as={FiEye} />}
                                size="sm" variant="ghost" colorScheme="blue"
                                onClick={() => handleViewDetails(user)}
                              />
                            </Tooltip>
                            <Tooltip label="Send Message">
                              <IconButton
                                aria-label="Send message to user"
                                icon={<Icon as={FiMail} />}
                                size="sm" variant="ghost" colorScheme="green"
                              />
                            </Tooltip>
                            <Tooltip label="Edit Program">
                              <IconButton
                                aria-label="Edit user program"
                                icon={<Icon as={FiEdit} />}
                                size="sm" variant="ghost" colorScheme="orange"
                              />
                            </Tooltip>
                          </HStack>
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

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Avatar size="md" src={selectedUser?.avatar} name={selectedUser?.name} mr={3} />
              <Box>
                <Text fontSize="md" fontWeight="bold">{selectedUser?.name}</Text>
                <Text fontSize="13px" color="gray.500">{selectedUser?.email}</Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4} align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Stat>
                    <StatLabel fontSize="13px">Progress</StatLabel>
                    <StatNumber fontSize="lg">{selectedUser.progress}%</StatNumber>
                    <StatHelpText fontSize="10px">
                      {selectedUser.completedModules}/{selectedUser.totalModules} modules completed
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel fontSize="13px">Current Score</StatLabel>
                    <StatNumber fontSize="lg" color={selectedUser.score >= 80 ? 'green.500' : 'orange.500'}>
                      {selectedUser.score}%
                    </StatNumber>
                    <StatHelpText fontSize="10px">Average across all modules</StatHelpText>
                  </Stat>
                </Grid>
                
                <Divider />
                
                <Box>
                  <Text fontSize="13px" fontWeight="semibold" mb={2}>Program Details</Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <Box>
                      <Text fontSize="10px" color="gray.600">Program</Text>
                      <Text fontSize="13px" fontWeight="semibold">{selectedUser.program}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="10px" color="gray.600">Status</Text>
                      <Badge colorScheme={getStatusColor(selectedUser.status)} mt={1} fontSize="10px">
                        {selectedUser.status}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontSize="10px" color="gray.600">Start Date</Text>
                      <Text fontSize="13px" fontWeight="semibold">{selectedUser.startDate}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="10px" color="gray.600">Expected Completion</Text>
                      <Text fontSize="13px" fontWeight="semibold">{selectedUser.expectedCompletion}</Text>
                    </Box>
                  </Grid>
                </Box>

                <Box>
                  <Text fontSize="13px" fontWeight="semibold" mb={2}>Progress Overview</Text>
                  <Progress
                    value={selectedUser.progress}
                    size="lg"
                    colorScheme={selectedUser.progress === 100 ? 'green' : 'blue'}
                    borderRadius="full"
                  />
                  <Text fontSize="10px" color="gray.600" mt={1}>
                    Last activity: {selectedUser.lastActivity}
                  </Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} leftIcon={<Icon as={FiMail} />} fontSize="13px">
              Send Message
            </Button>
            <Button variant="ghost" onClick={onClose} fontSize="13px">Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TrainingProgress;