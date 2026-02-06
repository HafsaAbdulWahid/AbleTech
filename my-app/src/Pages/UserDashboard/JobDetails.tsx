import {
    Box,
    Text,
    Flex,
    VStack,
    Button,
    Badge,
    HStack,
    Divider,
    Icon,
    Heading,
    Container,
    Card,
    CardBody,
    Spinner,
    Center,
    Avatar,
    Grid,
    List,
    ListItem,
    ListIcon,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    Textarea,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react';
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { 
    FiClock, 
    FiBriefcase, 
    FiMapPin, 
    FiDollarSign,
    FiCalendar,
    FiUsers,
    FiAward,
    FiTrendingUp,
    FiCheckCircle,
    FiChevronRight,
    FiAlertCircle
} from "react-icons/fi";
import { 
    MdCategory, 
    MdLocationOn, 
    MdSchool, 
    MdWork,
} from 'react-icons/md';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

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
    requirements?: string[];
    responsibilities?: string[];
    benefits?: string[];
    skills?: string[];
    education?: string;
    positions?: number;
}

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { 
        isOpen: isProfileSharedOpen, 
        onOpen: onProfileSharedOpen, 
        onClose: onProfileSharedClose 
    } = useDisclosure();
    
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isProfileShared, setIsProfileShared] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    
    const [applicationData, setApplicationData] = useState({
        coverLetter: '',
        phone: '',
        availability: '',
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.email) {
            setUserEmail(userData.email);
        }
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/jobs/${id}`);
            const data = await response.json();
            
            if (response.ok) {
                setJob(data.data);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to load job details",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
            toast({
                title: "Error",
                description: "Failed to load job details",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!userEmail) {
            toast({
                title: "Login Required",
                description: "Please login to apply for this job",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            navigate('/login');
            return;
        }

        // Show loading state
        setIsButtonLoading(true);

        // After 3 seconds, show profile shared popup and hide button
        setTimeout(() => {
            setIsButtonLoading(false);
            setIsProfileShared(true);
            onProfileSharedOpen();
        }, 3000);
    };

    const submitApplication = async () => {
        if (!applicationData.coverLetter || !applicationData.phone) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsApplying(true);
        try {
            const response = await fetch('http://localhost:3001/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId: id,
                    userEmail,
                    coverLetter: applicationData.coverLetter,
                    phone: applicationData.phone,
                    availability: applicationData.availability,
                }),
            });

            if (response.ok) {
                toast({
                    title: "Application Submitted",
                    description: "Your application has been successfully submitted",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                });
                onClose();
                setApplicationData({ coverLetter: '', phone: '', availability: '' });
            } else {
                throw new Error('Application failed');
            }
        } catch (error) {
            toast({
                title: "Application Failed",
                description: "Please try again later",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsApplying(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getDaysRemaining = (deadline: string) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <Box bg="#F7F9FC" minH="100vh">
                <SideNav />
                <Box>
                    <TopNav />
                    <Center h="80vh">
                        <VStack spacing={3}>
                            <Spinner size="lg" color="#2CA58D" thickness="3px" />
                            <Text color="gray.600" fontSize="sm" fontWeight="500">
                                Loading job details...
                            </Text>
                        </VStack>
                    </Center>
                </Box>
            </Box>
        );
    }

    if (!job) {
        return (
            <Box bg="#F7F9FC" minH="100vh">
                <SideNav />
                <Box>
                    <TopNav />
                    <Center h="80vh">
                        <VStack spacing={4}>
                            <Icon as={HiOutlineOfficeBuilding} boxSize={12} color="gray.300" />
                            <Heading size="md" color="gray.700">
                                Job Not Found
                            </Heading>
                            <Text color="gray.500" fontSize="sm">
                                The job you're looking for doesn't exist or has been removed
                            </Text>
                            <Button
                                bg="#2CA58D"
                                color="white"
                                size="md"
                                onClick={() => navigate('/all-jobs')}
                                _hover={{ bg: "#238A75" }}
                                mt={2}
                            >
                                Browse All Jobs
                            </Button>
                        </VStack>
                    </Center>
                </Box>
            </Box>
        );
    }

    const daysRemaining = getDaysRemaining(job.deadline);

    return (
        <Box bg="#F7F9FC" minH="100vh">
            <SideNav />
            <Box>
                <TopNav />
                <Container maxW="1400px" py={6}>
                    {/* Breadcrumb */}
                    <Breadcrumb 
                        spacing={2} 
                        separator={<Icon as={FiChevronRight} color="gray.400" boxSize={3} />}
                        mb={6}
                        ml="100px"
                        fontSize="xs"
                    >
                        <BreadcrumbItem>
                            <BreadcrumbLink 
                                onClick={() => navigate('/user-dashboard')}
                                color="gray.600"
                                _hover={{ color: "#2CA58D" }}
                                fontWeight="500"
                            >
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink 
                                onClick={() => navigate('/all-jobs')}
                                color="gray.600"
                                _hover={{ color: "#2CA58D" }}
                                fontWeight="500"
                            >
                                Jobs
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink color="#2CA58D" fontWeight="600">
                                Details
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>

                    <Flex direction={{ base: "column", lg: "row" }} gap={6} ml="100px">
                        {/* Main Content */}
                        <Box flex="1" maxW="900px">
                            {/* Job Header Card */}
                            <Card 
                                mb={4} 
                                shadow="sm" 
                                borderRadius="lg" 
                                overflow="hidden"
                                border="1px solid"
                                borderColor="#E2E8F0"
                                bg="white"
                            >
                                <Box p={5}>
                                    <Flex align="start" gap={4} mb={4}>
                                        <Avatar
                                            bg="#2CA58D"
                                            color="white"
                                            name={job.company || job.department}
                                            size="md"
                                            fontWeight="600"
                                        />
                                        <Box flex="1">
                                            <HStack spacing={2} mb={2}>
                                                <Badge 
                                                    colorScheme="green" 
                                                    px={2}
                                                    py={0.5}
                                                    borderRadius="md"
                                                    fontSize="10px"
                                                    fontWeight="600"
                                                    textTransform="uppercase"
                                                >
                                                    {job.status || "Active"}
                                                </Badge>
                                                <Text fontSize="xs" color="gray.500">
                                                    Posted {formatDate(job.datePosted)}
                                                </Text>
                                            </HStack>
                                            <Heading size="md" mb={2} color="gray.800" fontWeight="700">
                                                {job.title}
                                            </Heading>
                                            <Text fontSize="sm" mb={3} color="gray.600" fontWeight="600">
                                                {job.company || job.department}
                                            </Text>
                                            <HStack spacing={4} flexWrap="wrap" fontSize="xs" color="gray.600">
                                                <HStack spacing={1.5}>
                                                    <Icon as={FiMapPin} boxSize={3.5} color="gray.500" />
                                                    <Text fontWeight="500">{job.location}</Text>
                                                </HStack>
                                                <HStack spacing={1.5}>
                                                    <Icon as={FiBriefcase} boxSize={3.5} color="gray.500" />
                                                    <Text fontWeight="500">{job.type}</Text>
                                                </HStack>
                                                <HStack spacing={1.5}>
                                                    <Icon as={FiAward} boxSize={3.5} color="gray.500" />
                                                    <Text fontWeight="500">{job.experience}</Text>
                                                </HStack>
                                            </HStack>
                                        </Box>
                                    </Flex>
                                    
                                    {!isProfileShared && (
                                        <Button
                                            size="md"
                                            w="full"
                                            bg="#2CA58D"
                                            color="white"
                                            onClick={handleApply}
                                            isLoading={isButtonLoading}
                                            loadingText="Sharing profile..."
                                            _hover={{ bg: "#238A75" }}
                                            fontSize="sm"
                                            fontWeight="600"
                                            borderRadius="md"
                                        >
                                            Apply for this Position
                                        </Button>
                                    )}

                                    {isProfileShared && (
                                        <Box
                                            w="full"
                                            p={3}
                                            bg="green.50"
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="green.200"
                                            textAlign="center"
                                        >
                                            <HStack spacing={2} justify="center">
                                                <Icon as={FiCheckCircle} color="green.600" boxSize={4} />
                                                <Text fontSize="sm" color="green.800" fontWeight="600">
                                                    Profile Shared Successfully
                                                </Text>
                                            </HStack>
                                        </Box>
                                    )}

                                    {/* Deadline Warning */}
                                    {daysRemaining <= 7 && daysRemaining > 0 && (
                                        <Box
                                            mt={3}
                                            p={2.5}
                                            bg="orange.50"
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="orange.200"
                                        >
                                            <HStack spacing={2}>
                                                <Icon as={FiAlertCircle} color="orange.600" boxSize={3.5} />
                                                <Text fontSize="xs" color="orange.800" fontWeight="600">
                                                    Application closes in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                                                </Text>
                                            </HStack>
                                        </Box>
                                    )}
                                </Box>
                            </Card>

                            {/* Job Description */}
                            <Card 
                                mb={4} 
                                shadow="sm" 
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="#E2E8F0"
                                bg="white"
                            >
                                <CardBody p={5}>
                                    <Heading size="sm" color="gray.800" mb={3} fontWeight="700">
                                        Job Description
                                    </Heading>
                                    <Text 
                                        color="gray.700" 
                                        lineHeight="1.7" 
                                        fontSize="sm"
                                        whiteSpace="pre-line"
                                    >
                                        {job.description}
                                    </Text>
                                </CardBody>
                            </Card>

                            {/* Responsibilities */}
                            {job.responsibilities && job.responsibilities.length > 0 && (
                                <Card 
                                    mb={4} 
                                    shadow="sm" 
                                    borderRadius="lg"
                                    border="1px solid"
                                    borderColor="#E2E8F0"
                                    bg="white"
                                >
                                    <CardBody p={5}>
                                        <Heading size="sm" color="gray.800" mb={3} fontWeight="700">
                                            Key Responsibilities
                                        </Heading>
                                        <VStack spacing={2} align="stretch">
                                            {job.responsibilities.map((resp, index) => (
                                                <HStack 
                                                    key={index} 
                                                    align="start"
                                                    spacing={2}
                                                >
                                                    <Icon 
                                                        as={CheckCircleIcon} 
                                                        color="#2CA58D" 
                                                        mt={0.5}
                                                        boxSize={3.5}
                                                    />
                                                    <Text color="gray.700" fontSize="sm" fontWeight="500">
                                                        {resp}
                                                    </Text>
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </CardBody>
                                </Card>
                            )}

                            {/* Requirements */}
                            {job.requirements && job.requirements.length > 0 && (
                                <Card 
                                    mb={4} 
                                    shadow="sm" 
                                    borderRadius="lg"
                                    border="1px solid"
                                    borderColor="#E2E8F0"
                                    bg="white"
                                >
                                    <CardBody p={5}>
                                        <Heading size="sm" color="gray.800" mb={3} fontWeight="700">
                                            Requirements
                                        </Heading>
                                        <VStack spacing={2} align="stretch">
                                            {job.requirements.map((req, index) => (
                                                <HStack 
                                                    key={index} 
                                                    align="start"
                                                    spacing={2}
                                                >
                                                    <Icon 
                                                        as={CheckCircleIcon} 
                                                        color="#2CA58D" 
                                                        mt={0.5}
                                                        boxSize={3.5}
                                                    />
                                                    <Text color="gray.700" fontSize="sm" fontWeight="500">
                                                        {req}
                                                    </Text>
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </CardBody>
                                </Card>
                            )}

                            {/* Skills Required */}
                            {job.skills && job.skills.length > 0 && (
                                <Card 
                                    mb={4} 
                                    shadow="sm" 
                                    borderRadius="lg"
                                    border="1px solid"
                                    borderColor="#E2E8F0"
                                    bg="white"
                                >
                                    <CardBody p={5}>
                                        <Heading size="sm" color="gray.800" mb={3} fontWeight="700">
                                            Required Skills
                                        </Heading>
                                        <Flex wrap="wrap" gap={2}>
                                            {job.skills.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    colorScheme="teal"
                                                    variant="subtle"
                                                    px={2.5}
                                                    py={1}
                                                    borderRadius="md"
                                                    fontSize="xs"
                                                    fontWeight="600"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </Flex>
                                    </CardBody>
                                </Card>
                            )}

                            {/* Benefits */}
                            {job.benefits && job.benefits.length > 0 && (
                                <Card 
                                    mb={4} 
                                    shadow="sm" 
                                    borderRadius="lg"
                                    border="1px solid"
                                    borderColor="#E2E8F0"
                                    bg="white"
                                >
                                    <CardBody p={5}>
                                        <Heading size="sm" color="gray.800" mb={3} fontWeight="700">
                                            Benefits & Perks
                                        </Heading>
                                        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                                            {job.benefits.map((benefit, index) => (
                                                <HStack 
                                                    key={index} 
                                                    spacing={2}
                                                >
                                                    <Icon as={FiCheckCircle} color="#2CA58D" boxSize={3.5} />
                                                    <Text color="gray.700" fontSize="sm" fontWeight="500">
                                                        {benefit}
                                                    </Text>
                                                </HStack>
                                            ))}
                                        </Grid>
                                    </CardBody>
                                </Card>
                            )}
                        </Box>

                        {/* Sidebar */}
                        <Box w={{ base: "100%", lg: "380px" }}>
                            {/* Job Overview */}
                            <Card 
                                mb={5} 
                                shadow="sm" 
                                borderRadius="lg" 
                                position="sticky" 
                                top="20px"
                                border="1px solid"
                                borderColor="#E2E8F0"
                                bg="white"
                            >
                                <CardBody p={5}>
                                    <Heading size="sm" mb={4} color="gray.800" fontWeight="700">
                                        Job Overview
                                    </Heading>

                                    <VStack spacing={3} align="stretch">
                                        <Box>
                                            <HStack mb={1.5} spacing={2}>
                                                <Icon as={MdWork} boxSize={4} color="gray.500" />
                                                <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                                                    Job Type
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm" ml={6}>
                                                {job.type}
                                            </Text>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <HStack mb={1.5} spacing={2}>
                                                <Icon as={MdCategory} boxSize={4} color="gray.500" />
                                                <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                                                    Category
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm" ml={6}>
                                                {job.category || job.department}
                                            </Text>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <HStack mb={1.5} spacing={2}>
                                                <Icon as={MdLocationOn} boxSize={4} color="gray.500" />
                                                <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                                                    Location
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm" ml={6}>
                                                {job.location}
                                            </Text>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <HStack mb={1.5} spacing={2}>
                                                <Icon as={FiDollarSign} boxSize={4} color="gray.500" />
                                                <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                                                    Salary
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm" ml={6}>
                                                {job.salary || "Competitive"}
                                            </Text>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <HStack mb={1.5} spacing={2}>
                                                <Icon as={MdSchool} boxSize={4} color="gray.500" />
                                                <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                                                    Education
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm" ml={6}>
                                                {job.education || "Bachelor's Degree"}
                                            </Text>
                                        </Box>

                                        <Divider />

                                        <Box>
                                            <HStack mb={1.5} spacing={2}>
                                                <Icon as={FiAward} boxSize={4} color="gray.500" />
                                                <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                                                    Experience
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="gray.800" fontSize="sm" ml={6}>
                                                {job.experience}
                                            </Text>
                                        </Box>

                                        <Divider />

                                        <Box bg="red.50" p={3} borderRadius="md" border="1px solid" borderColor="red.200">
                                            <HStack mb={1.5} spacing={2}>
                                                <Icon as={FiCalendar} boxSize={4} color="red.600" />
                                                <Text fontSize="xs" color="red.600" fontWeight="600" textTransform="uppercase">
                                                    Deadline
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="red.700" fontSize="sm" ml={6}>
                                                {formatDate(job.deadline)}
                                            </Text>
                                        </Box>

                                        {job.positions && (
                                            <>
                                                <Divider />
                                                <Box>
                                                    <HStack mb={1.5} spacing={2}>
                                                        <Icon as={FiUsers} boxSize={4} color="gray.500" />
                                                        <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase">
                                                            Positions
                                                        </Text>
                                                    </HStack>
                                                    <Text fontWeight="600" color="gray.800" fontSize="sm" ml={6}>
                                                        {job.positions} Open
                                                    </Text>
                                                </Box>
                                            </>
                                        )}
                                    </VStack>
                                </CardBody>
                            </Card>

                            {/* Company Info */}
                            <Card 
                                shadow="sm" 
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="#E2E8F0"
                                bg="white"
                            >
                                <CardBody p={5}>
                                    <Flex align="center" mb={3}>
                                        <Icon as={HiOutlineOfficeBuilding} boxSize={4.5} color="gray.600" mr={2} />
                                        <Heading size="sm" color="gray.800" fontWeight="700">
                                            About Company
                                        </Heading>
                                    </Flex>
                                    <Text fontSize="sm" color="gray.600" mb={4} lineHeight="1.6">
                                        {job.company || job.department} is committed to creating inclusive workplaces and providing equal opportunities.
                                    </Text>
                                    <VStack spacing={2} align="stretch">
                                        <HStack justify="space-between" p={2.5} bg="gray.50" borderRadius="md">
                                            <HStack spacing={2}>
                                                <Icon as={FiTrendingUp} color="gray.600" boxSize={3.5} />
                                                <Text fontWeight="500" color="gray.700" fontSize="xs">
                                                    Jobs Posted
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="gray.800" fontSize="xs">127</Text>
                                        </HStack>
                                        <HStack justify="space-between" p={2.5} bg="gray.50" borderRadius="md">
                                            <HStack spacing={2}>
                                                <Icon as={FiUsers} color="gray.600" boxSize={3.5} />
                                                <Text fontWeight="500" color="gray.700" fontSize="xs">
                                                    Hired
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="gray.800" fontSize="xs">17</Text>
                                        </HStack>
                                        <HStack justify="space-between" p={2.5} bg="gray.50" borderRadius="md">
                                            <HStack spacing={2}>
                                                <Text fontWeight="500" color="gray.700" fontSize="xs">
                                                    Rating
                                                </Text>
                                            </HStack>
                                            <Text fontWeight="600" color="#F59E0B" fontSize="xs">
                                                ★ 4.2
                                            </Text>
                                        </HStack>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </Box>
                    </Flex>
                </Container>
            </Box>

            {/* Profile Shared Success Modal */}
            <Modal isOpen={isProfileSharedOpen} onClose={onProfileSharedClose} size="md" isCentered>
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent borderRadius="xl" mx={4}>
                    <ModalBody py={8} px={6}>
                        <VStack spacing={4}>
                            <Box 
                                bg="green.100" 
                                borderRadius="full" 
                                p={4}
                            >
                                <Icon as={FiCheckCircle} color="green.600" boxSize={12} />
                            </Box>
                            <Heading size="md" color="gray.800" fontWeight="700">
                                Profile Shared!
                            </Heading>
                            <Text 
                                fontSize="sm" 
                                color="gray.600" 
                                textAlign="center"
                                lineHeight="1.6"
                            >
                                Your profile has been successfully shared with the employer. 
                                They will review your application and get back to you soon.
                            </Text>
                            <Button
                                bg="#2CA58D"
                                color="white"
                                onClick={onProfileSharedClose}
                                size="md"
                                w="full"
                                mt={2}
                                fontWeight="600"
                                _hover={{ bg: "#238A75" }}
                            >
                                Got it
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Application Modal (Original - now unused but kept for reference) */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent borderRadius="lg" mx={4}>
                    <ModalHeader 
                        bg="#2CA58D"
                        color="white"
                        borderTopRadius="lg"
                        py={4}
                    >
                        <VStack align="start" spacing={0.5}>
                            <Text fontSize="md" fontWeight="700">Apply for {job.title}</Text>
                            <Text fontSize="xs" opacity={0.9} fontWeight="500">
                                {job.company || job.department}
                            </Text>
                        </VStack>
                    </ModalHeader>
                    <ModalCloseButton color="white" top={3} right={3} />
                    
                    <ModalBody py={5} px={6}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel fontWeight="600" color="gray.700" fontSize="sm" mb={2}>
                                    Phone Number
                                </FormLabel>
                                <Input
                                    placeholder="Enter your phone number"
                                    value={applicationData.phone}
                                    onChange={(e) => setApplicationData({
                                        ...applicationData,
                                        phone: e.target.value
                                    })}
                                    size="md"
                                    fontSize="sm"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    _hover={{ borderColor: "gray.400" }}
                                    _focus={{ 
                                        borderColor: "#2CA58D",
                                        boxShadow: "0 0 0 1px #2CA58D"
                                    }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel fontWeight="600" color="gray.700" fontSize="sm" mb={2}>
                                    Cover Letter
                                </FormLabel>
                                <Textarea
                                    placeholder="Tell us why you're a great fit for this role..."
                                    value={applicationData.coverLetter}
                                    onChange={(e) => setApplicationData({
                                        ...applicationData,
                                        coverLetter: e.target.value
                                    })}
                                    rows={5}
                                    fontSize="sm"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    _hover={{ borderColor: "gray.400" }}
                                    _focus={{ 
                                        borderColor: "#2CA58D",
                                        boxShadow: "0 0 0 1px #2CA58D"
                                    }}
                                    resize="vertical"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel fontWeight="600" color="gray.700" fontSize="sm" mb={2}>
                                    Availability
                                </FormLabel>
                                <Input
                                    placeholder="When can you start? (e.g., Immediately)"
                                    value={applicationData.availability}
                                    onChange={(e) => setApplicationData({
                                        ...applicationData,
                                        availability: e.target.value
                                    })}
                                    size="md"
                                    fontSize="sm"
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    _hover={{ borderColor: "gray.400" }}
                                    _focus={{ 
                                        borderColor: "#2CA58D",
                                        boxShadow: "0 0 0 1px #2CA58D"
                                    }}
                                />
                            </FormControl>

                            <Box 
                                w="full" 
                                p={3} 
                                bg="blue.50" 
                                borderRadius="md"
                                border="1px solid"
                                borderColor="blue.200"
                            >
                                <Text fontSize="xs" color="blue.800" lineHeight="1.5">
                                    <strong>Note:</strong> Your resume and profile will be automatically included.
                                </Text>
                            </Box>
                        </VStack>
                    </ModalBody>

                    <ModalFooter 
                        bg="gray.50" 
                        borderTop="1px solid"
                        borderColor="gray.200"
                        px={6} 
                        py={3}
                        borderBottomRadius="lg"
                    >
                        <HStack spacing={2}>
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                size="sm"
                                fontWeight="600"
                            >
                                Cancel
                            </Button>
                            <Button
                                bg="#2CA58D"
                                color="white"
                                onClick={submitApplication}
                                isLoading={isApplying}
                                loadingText="Submitting..."
                                size="sm"
                                fontWeight="600"
                                _hover={{ bg: "#238A75" }}
                            >
                                Submit Application
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}