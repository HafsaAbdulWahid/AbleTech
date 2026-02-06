import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  IconButton,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  useColorModeValue,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiTrash2,
  FiArrowLeft,
  FiCalendar,
  FiEye,
  FiRefreshCw,
  FiBriefcase,
  FiMoreVertical,
  FiEdit,
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryMin: string;
  salaryMax: string;
  status: string;
  applications: number;
  experience: string;
  description: string;
  requirements: string[];
  deadline: string;
  datePosted: string;
}

const DepartmentwiseJobs = () => {
  const navigate = useNavigate();
  const { department } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const bgColor = useColorModeValue('#F7F9FC', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('#E2E8F0', 'gray.700');
  const textPrimary = useColorModeValue('#2D3748', 'white');
  const textSecondary = useColorModeValue('#718096', 'gray.400');
  const hoverBg = useColorModeValue('#F7FAFC', 'gray.700');

  useEffect(() => {
    if (department) {
      fetchDepartmentJobs();
    }
  }, [department]);

  const fetchDepartmentJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:3001/api/jobs?department=${encodeURIComponent(department || '')}`);

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
        location: job.location,
        type: job.type,
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        status: job.status,
        applications: job.applications || 0,
        experience: job.experience,
        description: job.description,
        requirements: job.requirements || [],
        deadline: job.deadline,
        datePosted: job.datePosted
      }));

      setJobs(jobs);
    } catch (err) {
      console.error('Error fetching department jobs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/recruiter-job-details/${department}/${jobId}`);
  };

  const handleDeleteJob = (jobId: string) => {
    setDeleteJobId(jobId);
    onOpen();
  };

  const confirmDeleteJob = async () => {
    if (!deleteJobId) return;

    setDeleting(true);
    try {
      const response = await fetch(`http://localhost:3001/api/jobs/${deleteJobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete job');
      }

      setJobs(prev => prev.filter(job => job.id !== deleteJobId));

      toast({
        title: 'Job deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error deleting job',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
      setDeleteJobId(null);
      onClose();
    }
  };

  const getJobById = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { bg: '#D1FAE5', color: '#065F46', text: 'ACTIVE' };
      case 'draft':
        return { bg: '#FEF3C7', color: '#92400E', text: 'DRAFT' };
      case 'closed':
        return { bg: '#FEE2E2', color: '#991B1B', text: 'CLOSED' };
      default:
        return { bg: '#E5E7EB', color: '#374151', text: status.toUpperCase() };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'part-time':
        return { bg: '#E0E7FF', color: '#4338CA' };
      case 'contract':
        return { bg: '#FCE7F3', color: '#9F1239' };
      case 'internship':
        return { bg: '#FEF3C7', color: '#92400E' };
      default:
        return { bg: '#E5E7EB', color: '#374151' };
    }
  };

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh">
        <SideNav activeNav="Job Listings" />
        <Box>
          <TopNav />
          <Container maxW="1600px" px={8} ml="100px" mt={8}>
            <Center py={20}>
              <VStack spacing={4}>
                <Spinner size="lg" color="#2CA58D" thickness="3px" />
                <Text fontSize="sm" color={textSecondary} fontWeight="500">
                  Loading jobs...
                </Text>
              </VStack>
            </Center>
          </Container>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg={bgColor} minH="100vh">
        <SideNav activeNav="Job Listings" />
        <Box>
          <TopNav />
          <Container maxW="1600px" px={8} ml="100px" mt={8}>
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="700" color={textPrimary}>
                    {department}
                  </Text>
                  <Text fontSize="sm" color={textSecondary}>
                    Manage and track department job openings
                  </Text>
                </VStack>
                <Button
                  leftIcon={<Icon as={FiArrowLeft} />}
                  onClick={() => navigate('/job-listings')}
                  size="sm"
                  variant="outline"
                >
                  Back
                </Button>
              </HStack>

              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box flex="1">
                  <AlertTitle fontSize="sm">Unable to load jobs</AlertTitle>
                  <AlertDescription fontSize="sm">{error}</AlertDescription>
                </Box>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={fetchDepartmentJobs}
                  leftIcon={<Icon as={FiRefreshCw} />}
                >
                  Retry
                </Button>
              </Alert>
            </VStack>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <SideNav activeNav="Job Listings" />
      <Box>
        <TopNav />

        <Container maxW="1600px" px={8} ml="100px" mt={8} pb={12}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="2xl" fontWeight="700" color={textPrimary}>
                  {department}
                </Text>
                <Text fontSize="sm" color={textSecondary}>
                  Manage and track department job openings
                </Text>
              </VStack>
              <HStack spacing={3}>
                <IconButton
                  aria-label="Refresh"
                  icon={<FiRefreshCw />}
                  size="sm"
                  variant="ghost"
                  onClick={fetchDepartmentJobs}
                />
                <Button
                  leftIcon={<Icon as={FiArrowLeft} />}
                  onClick={() => navigate('/job-listings')}
                  size="sm"
                  variant="outline"
                >
                  Back
                </Button>
              </HStack>
            </HStack>

            {jobs.length === 0 ? (
              <Box
                bg={cardBg}
                borderRadius="lg"
                p={12}
                textAlign="center"
                border="2px dashed"
                borderColor={borderColor}
              >
                <VStack spacing={4}>
                  <Icon as={FiBriefcase} boxSize={12} color={textSecondary} />
                  <Text fontSize="lg" fontWeight="600" color={textPrimary}>
                    No open positions
                  </Text>
                  <Text color={textSecondary} fontSize="sm">
                    There are currently no job listings for the {department} department.
                  </Text>
                  <Button
                    bg="#2CA58D"
                    color="white"
                    size="md"
                    _hover={{ bg: "#238A75" }}
                    onClick={() => navigate('/post-job')}
                    mt={2}
                  >
                    Post a Job
                  </Button>
                </VStack>
              </Box>
            ) : (
              <Box
                bg={cardBg}
                borderRadius="lg"
                border="1px"
                borderColor={borderColor}
                overflow="hidden"
              >
                <Table variant="simple" size="md">
                  <Thead bg="#F8FAFC">
                    <Tr>
                      <Th
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        color={textSecondary}
                        letterSpacing="wider"
                        py={4}
                      >
                        Job Title
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        color={textSecondary}
                        letterSpacing="wider"
                      >
                        Department
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        color={textSecondary}
                        letterSpacing="wider"
                      >
                        Location
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        color={textSecondary}
                        letterSpacing="wider"
                      >
                        Experience
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        color={textSecondary}
                        letterSpacing="wider"
                      >
                        Type
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        color={textSecondary}
                        letterSpacing="wider"
                      >
                        Status
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        color={textSecondary}
                        letterSpacing="wider"
                      >
                        Date Posted
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        color={textSecondary}
                        letterSpacing="wider"
                      >
                        Actions
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {jobs.map((job) => {
                      const statusStyle = getStatusColor(job.status);
                      const typeStyle = getTypeColor(job.type);
                      
                      return (
                        <Tr
                          key={job.id}
                          _hover={{ bg: hoverBg }}
                          cursor="pointer"
                          onClick={() => handleJobClick(job.id)}
                        >
                          <Td py={4}>
                            <Text
                              fontSize="sm"
                              fontWeight="600"
                              color="#2CA58D"
                              _hover={{ textDecoration: 'underline' }}
                            >
                              {job.title}
                            </Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Icon as={FiUsers} boxSize={4} color={textSecondary} />
                              <Text fontSize="sm" color={textPrimary}>
                                {job.department}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Icon as={FiMapPin} boxSize={4} color={textSecondary} />
                              <Text fontSize="sm" color={textPrimary}>
                                {job.location}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color={textPrimary}>
                              {job.experience}
                            </Text>
                          </Td>
                          <Td>
                            <Badge
                              bg={typeStyle.bg}
                              color={typeStyle.color}
                              fontSize="10px"
                              fontWeight="600"
                              px={1}
                              py={1}
                              borderRadius="md"
                              textTransform="capitalize"
                            >
                              {job.type}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              bg={statusStyle.bg}
                              color={statusStyle.color}
                              fontSize="10px"
                              fontWeight="600"
                              px={1}
                              py={1}
                              borderRadius="md"
                              textTransform="uppercase"
                            >
                              {statusStyle.text}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Icon as={FiCalendar} boxSize={4} color={textSecondary} />
                              <Text fontSize="sm" color={textPrimary}>
                                {formatDate(job.datePosted)}
                              </Text>
                            </HStack>
                          </Td>
                          <Td onClick={(e) => e.stopPropagation()}>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FiMoreVertical />}
                                variant="ghost"
                                size="sm"
                                aria-label="Actions"
                              />
                              <MenuList>
                                <MenuItem
                                  icon={<FiEye />}
                                  onClick={() => handleJobClick(job.id)}
                                >
                                  View Details
                                </MenuItem>
                                <MenuItem
                                  icon={<FiTrash2 />}
                                  color="red.500"
                                  onClick={() => handleDeleteJob(job.id)}
                                >
                                  Delete Job
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Delete Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="lg">
            <AlertDialogHeader fontSize="lg" fontWeight="700">
              Delete job listing?
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text fontSize="sm" color={textSecondary}>
                Are you sure you want to delete{' '}
                <Text as="span" fontWeight="600" color={textPrimary}>
                  {getJobById(deleteJobId || '')?.title}
                </Text>
                ? This action cannot be undone.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}
                isDisabled={deleting}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDeleteJob}
                ml={3}
                isLoading={deleting}
                size="sm"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default DepartmentwiseJobs;