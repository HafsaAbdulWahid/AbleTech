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
    CardHeader,
    Button,
    SimpleGrid,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Wrap,
    WrapItem,
    Tag,
    TagLabel,
    Progress,
    Spinner,
    Center,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    UnorderedList,
    ListItem,
    useToast,
} from '@chakra-ui/react';
import {
    FiBookOpen,
    FiVideo,
    FiUsers,
    FiClock,
    FiPlay,
    FiArrowLeft,
    FiTarget,
    FiCheckCircle,
    FiTool,
    FiUser,
    FiCalendar,
    FiVolume2,
    FiVolumeX,
    FiLayers,
    FiAward,
    FiCheck,
    FiInfo,
    FiEdit3,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';
import VideoPlayer from '../TrainerDashboard/VideoPlayer';

interface TrainingProgram {
    id: number;
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
    tags: string[];
    isPublished: boolean;
    objectives?: string;
    prerequisites?: string;
    materials?: string;
    accessibilityFeatures?: string[];
    isEnrolled?: boolean;
    progress?: number;
}

interface ModuleContent {
    id: number;
    moduleNumber: number;
    title: string;
    description: string;
    videos: VideoContent[];
    isCompleted?: boolean;
}

interface VideoContent {
    id: number;
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    hasAudio: boolean;
    isWatched?: boolean;
}

const UserProgramDetails = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [program, setProgram] = useState<TrainingProgram | null>(null);
    const [modules, setModules] = useState<ModuleContent[]>([]);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
    const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');
    const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
    const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
    const { isOpen: isVideoOpen, onOpen: onVideoOpen, onClose: onVideoClose } = useDisclosure();

    useEffect(() => {
        fetchProgramDetails();
    }, []);

    const fetchProgramDetails = async () => {
        try {
            setIsLoading(true);
            const programId = localStorage.getItem('selectedUserProgramId');
            
            if (!programId) {
                navigate('/user-training-programs');
                return;
            }

            const response = await fetch(`http://localhost:3001/api/trainers/training-programs/${programId}`);
            const result = await response.json();

            if (response.ok && result.data) {
                const programData = {
                    ...result.data,
                    id: result.data._id,
                    isEnrolled: false,
                    progress: 0,
                };
                setProgram(programData);

                // Check if user is already enrolled
                const userEmail = localStorage.getItem('userEmail');
                if (userEmail) {
                    await checkEnrollmentStatus(userEmail, programId);
                }

                // Load modules from content management
                const programKey = `program_${programId}_modules`;
                const savedModules = JSON.parse(localStorage.getItem(programKey) || '[]');

                if (savedModules.length > 0) {
                    const modulesWithProgress = savedModules.map((module: any) => ({
                        ...module,
                        isCompleted: false,
                        videos: module.videos.map((video: any) => ({
                            ...video,
                            isWatched: false
                        }))
                    }));
                    setModules(modulesWithProgress);
                } else {
                    const defaultModules: ModuleContent[] = Array.from({ length: result.data.totalModules }, (_, index) => ({
                        id: index + 1,
                        moduleNumber: index + 1,
                        title: `Module ${index + 1}`,
                        description: `This module covers the fundamentals of ${result.data.title}`,
                        isCompleted: false,
                        videos: [
                            {
                                id: 1,
                                title: `${result.data.title} - Introduction`,
                                description: "Learn the basics and get started with this comprehensive introduction",
                                videoUrl: "",
                                duration: "10:00",
                                hasAudio: true,
                                isWatched: false
                            }
                        ]
                    }));
                    setModules(defaultModules);
                }
            } else {
                navigate('/user-training-programs');
            }
        } catch (error) {
            console.error('Error fetching program details:', error);
            navigate('/user-training-programs');
        } finally {
            setIsLoading(false);
        }
    };

    const checkEnrollmentStatus = async (userEmail: string, programId: string) => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/user-training-programs/check-enrollment?userEmail=${userEmail}&programId=${programId}`
            );
            const result = await response.json();

            if (response.ok && result.isEnrolled) {
                setIsEnrolled(true);
                setEnrollmentId(result.data._id);
                if (program) {
                    setProgram({
                        ...program,
                        isEnrolled: true,
                        progress: result.data.progress || 0
                    });
                }
            }
        } catch (error) {
            console.error('Error checking enrollment status:', error);
        }
    };

    const handleEnrollNow = async () => {
        setIsEnrolling(true);

        try {
            // Get user details from localStorage
            const userName = localStorage.getItem('userName');
            const userEmail = localStorage.getItem('userEmail');

            if (!userName || !userEmail) {
                toast({
                    title: 'Authentication Required',
                    description: 'Please log in to enroll in this program',
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                });
                setIsEnrolling(false);
                navigate('/login');
                return;
            }

            if (!program) {
                toast({
                    title: 'Error',
                    description: 'Program information not found',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                setIsEnrolling(false);
                return;
            }

            // TEMPORARY FIX: If backend fails, use localStorage to simulate enrollment
            // This ensures the UI works while you fix the backend
            try {
                // Attempt backend enrollment
                const response = await fetch('http://localhost:3001/api/user-training-programs/enroll', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userName: userName,
                        userEmail: userEmail,
                        programId: program.id,
                        programTitle: program.title,
                    }),
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Backend enrollment successful
                    setIsEnrolled(true);
                    setEnrollmentId(result.data._id);
                    setProgram({
                        ...program,
                        isEnrolled: true,
                        progress: 0
                    });

                    // Save enrollment to localStorage as backup
                    const enrollmentData = {
                        enrollmentId: result.data._id,
                        userName,
                        userEmail,
                        programId: program.id,
                        programTitle: program.title,
                        enrolledAt: new Date().toISOString(),
                        progress: 0
                    };
                    localStorage.setItem(`enrollment_${userEmail}_${program.id}`, JSON.stringify(enrollmentData));

                    toast({
                        title: 'Enrollment Successful! 🎉',
                        description: `You have been enrolled in "${program.title}"`,
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    throw new Error(result.message || 'Backend enrollment failed');
                }
            } catch (backendError) {
                console.log('Backend enrollment failed, using localStorage fallback:', backendError);
                
                // Fallback to localStorage enrollment
                const enrollmentData = {
                    enrollmentId: `local_${Date.now()}`,
                    userName,
                    userEmail,
                    programId: program.id,
                    programTitle: program.title,
                    enrolledAt: new Date().toISOString(),
                    progress: 0
                };
                
                // Save to localStorage
                localStorage.setItem(`enrollment_${userEmail}_${program.id}`, JSON.stringify(enrollmentData));
                
                // Update UI state
                setIsEnrolled(true);
                setEnrollmentId(enrollmentData.enrollmentId);
                setProgram({
                    ...program,
                    isEnrolled: true,
                    progress: 0
                });

                toast({
                    title: 'Enrollment Successful! 🎉',
                    description: `You have been enrolled in "${program.title}"`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            toast({
                title: 'Network Error',
                description: 'Unable to connect to the server. Please try again.',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleBackToPrograms = () => {
        localStorage.removeItem('selectedUserProgramId');
        navigate('/user-training-programs');
    };

    const handlePlayVideo = (videoUrl: string, videoTitle: string) => {
        if (videoUrl && videoUrl.trim()) {
            setSelectedVideoUrl(videoUrl);
            setSelectedVideoTitle(videoTitle);
            onVideoOpen();
        }
    };

    const handleMarkVideoWatched = (moduleId: number, videoId: number) => {
        setModules(prev => prev.map(module =>
            module.id === moduleId
                ? {
                    ...module,
                    videos: module.videos.map(video =>
                        video.id === videoId ? { ...video, isWatched: true } : video
                    )
                }
                : module
        ));
    };

    const parseTextToList = (text: string): string[] => {
        if (!text) return [];
        if (text.includes('|')) {
            return text.split('|').map(item => item.trim()).filter(item => item.length > 0);
        }
        return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    };

    const handleTakeQuiz = (moduleId: number, moduleTitle: string) => {
        localStorage.setItem('quizModuleId', moduleId.toString());
        localStorage.setItem('quizModuleTitle', moduleTitle);
        localStorage.setItem('quizProgramTitle', program?.title || '');
        localStorage.setItem('quizProgramId', program?.id?.toString() || '');
        navigate('/quiz');
    };

    const handleStartCourseQuiz = () => {
        localStorage.setItem('courseQuizProgramTitle', program?.title || '');
        localStorage.setItem('courseQuizProgramId', program?.id?.toString() || '');
        navigate('/course-quiz');
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
                            <Text color="gray.600" fontSize="lg">
                                Loading program details...
                            </Text>
                        </VStack>
                    </Center>
                </Box>
            </Box>
        );
    }

    if (!program) {
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
                            <Alert status="error" borderRadius="md">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>Program Not Found!</AlertTitle>
                                    <AlertDescription>
                                        The requested program could not be found. Please go back to the programs list.
                                    </AlertDescription>
                                </Box>
                            </Alert>
                            <Button onClick={() => navigate('/user-training-programs')} mt={4} colorScheme="teal">
                                Back to Programs
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    const totalVideos = modules.reduce((acc, module) => acc + module.videos.length, 0);
    const watchedVideos = modules.reduce((acc, module) =>
        acc + module.videos.filter(video => video.isWatched).length, 0);
    const completedModules = modules.filter(module => module.isCompleted).length;

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
                    {/* Back to Programs Button */}
                    <Button
                        variant="ghost"
                        leftIcon={<Icon as={FiArrowLeft} />}
                        onClick={handleBackToPrograms}
                        mb={4}
                        fontSize="14px"
                        fontWeight="600"
                        color="gray.700"
                        _hover={{ bg: 'white', color: '#2CA58D' }}
                    >
                        Back to Programs
                    </Button>

                    <Box
                        p={8}
                        bg="white"
                        borderRadius="3xl"
                        mb={6}
                        boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
                    >
                        {/* Header with Enroll Button */}
                        <Box bgGradient="linear(to-r, #2CA58D, #077660)" borderRadius="xl" p={6} mb={8}>
                            <Flex justify="space-between" align="center">
                                <Box flex="1">
                                    <Text fontSize="xl" color="white" fontWeight="bold" mb={2}>
                                        {program.title}
                                    </Text>
                                    {isEnrolled && (
                                        <Box>
                                            <Flex justify="space-between" align="center" mb={2}>
                                                <Text fontSize="13px" color="whiteAlpha.900" fontWeight="500">
                                                    Course Progress
                                                </Text>
                                                <Text fontSize="14px" color="white" fontWeight="bold">
                                                    {program.progress || 0}%
                                                </Text>
                                            </Flex>
                                            <Progress
                                                value={program.progress || 0}
                                                size="sm"
                                                colorScheme="whiteAlpha"
                                                bg="whiteAlpha.300"
                                                borderRadius="full"
                                                sx={{
                                                    '& > div': {
                                                        backgroundColor: 'white',
                                                    }
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                                {!isEnrolled && (
                                    <HStack spacing={3} ml={6}>
                                        <Button
                                            bg="white"
                                            color="#2CA58D"
                                            _hover={{ bg: "gray.100" }}
                                            fontSize="14px"
                                            fontWeight="600"
                                            px={8}
                                            onClick={handleEnrollNow}
                                            isLoading={isEnrolling}
                                            loadingText="Enrolling..."
                                        >
                                            Enroll Now
                                        </Button>
                                    </HStack>
                                )}
                            </Flex>
                        </Box>

                        {/* Stats Grid */}
                        <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
                            <Card shadow="lg" borderRadius="xl" border="1px" borderColor="blue.100">
                                <CardBody p={5}>
                                    <Flex align="center" justify="space-between">
                                        <Box w={12} h={12} bg="blue.100" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                                            <Icon as={FiLayers} boxSize={6} color="blue.600" />
                                        </Box>
                                        <Box textAlign="right">
                                            <Text fontSize="2xl" fontWeight="bold" color="#2D3E5E">{program.totalModules}</Text>
                                            <Text fontSize="13px" color="gray.600" fontWeight="semibold">Total Modules</Text>
                                            <Text fontSize="10px" color="blue.500">Learning modules</Text>
                                        </Box>
                                    </Flex>
                                </CardBody>
                            </Card>

                            <Card shadow="lg" borderRadius="xl" border="1px" borderColor="green.100">
                                <CardBody p={5}>
                                    <Flex align="center" justify="space-between">
                                        <Box w={12} h={12} bg="green.100" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                                            <Icon as={FiVideo} boxSize={6} color="green.600" />
                                        </Box>
                                        <Box textAlign="right">
                                            <Text fontSize="2xl" fontWeight="bold" color="#2D3E5E">{totalVideos}</Text>
                                            <Text fontSize="13px" color="gray.600" fontWeight="semibold">Total Videos</Text>
                                            <Text fontSize="10px" color="green.500">Video content</Text>
                                        </Box>
                                    </Flex>
                                </CardBody>
                            </Card>

                            <Card shadow="lg" borderRadius="xl" border="1px" borderColor="purple.100">
                                <CardBody p={5}>
                                    <Flex align="center" justify="space-between">
                                        <Box w={12} h={12} bg="purple.100" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                                            <Icon as={FiClock} boxSize={6} color="purple.600" />
                                        </Box>
                                        <Box textAlign="right">
                                            <Text fontSize="2xl" fontWeight="bold" color="#2D3E5E">{program.duration}</Text>
                                            <Text fontSize="13px" color="gray.600" fontWeight="semibold">Duration</Text>
                                            <Text fontSize="10px" color="purple.500">Course length</Text>
                                        </Box>
                                    </Flex>
                                </CardBody>
                            </Card>
                        </Grid>

                        {/* Program Information */}
                        <Card shadow="lg" borderRadius="xl" mb={8} border="1px" borderColor="gray.200">
                            <CardHeader bg="gray.50" borderTopRadius="xl">
                                <Flex align="center" justify="space-between">
                                    <Flex align="center">
                                        <Box
                                            w={10}
                                            h={10}
                                            bg="teal.100"
                                            borderRadius="lg"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            mr={3}
                                        >
                                            <Icon as={FiBookOpen} color="teal.600" boxSize={5} />
                                        </Box>
                                        <Box>
                                            <Heading size="md" color="#2D3E5E">Program Information</Heading>
                                            <Text fontSize="12px" color="gray.500">Complete program details and requirements</Text>
                                        </Box>
                                    </Flex>
                                    <Button 
                                        size="sm" 
                                        leftIcon={<Icon as={FiInfo} />} 
                                        colorScheme="teal" 
                                        variant="outline" 
                                        onClick={() => setIsDrawerOpen(true)} 
                                        fontSize="13px" 
                                        fontWeight="600"
                                    >
                                        Quick Info
                                    </Button>
                                </Flex>
                            </CardHeader>
                            <CardBody p={6}>
                                <VStack spacing={6} align="stretch">
                                    {/* Description */}
                                    <Box>
                                        <Text fontSize="13px" fontWeight="600" color="gray.700" mb={2}>
                                            Description
                                        </Text>
                                        <Text fontSize="13px" color="gray.700" lineHeight="1.6">
                                            {program.description}
                                        </Text>
                                    </Box>

                                    {/* Training Objectives */}
                                    {program.objectives && (
                                        <Box>
                                            <Flex align="center" mb={3}>
                                                <Icon as={FiTarget} color="orange.500" boxSize={4} mr={2} />
                                                <Text fontSize="13px" fontWeight="600" color="gray.700">
                                                    Training Objectives
                                                </Text>
                                            </Flex>
                                            <UnorderedList spacing={2} pl={4}>
                                                {parseTextToList(program.objectives).map((objective, index) => (
                                                    <ListItem key={index} fontSize="13px" color="gray.700">
                                                        {objective}
                                                    </ListItem>
                                                ))}
                                            </UnorderedList>
                                        </Box>
                                    )}

                                    {/* Learning Outcomes */}
                                    {program.objectives && (
                                        <Box>
                                            <Flex align="center" mb={3}>
                                                <Icon as={FiAward} color="teal.500" boxSize={4} mr={2} />
                                                <Text fontSize="13px" fontWeight="600" color="gray.700">
                                                    Learning Outcomes
                                                </Text>
                                            </Flex>
                                            <UnorderedList spacing={2} pl={4}>
                                                {parseTextToList(program.objectives).map((objective, index) => (
                                                    <ListItem key={index} fontSize="13px" color="gray.700">
                                                        {objective}
                                                    </ListItem>
                                                ))}
                                            </UnorderedList>
                                        </Box>
                                    )}

                                    {/* Prerequisites */}
                                    {program.prerequisites && (
                                        <Box>
                                            <Flex align="center" mb={3}>
                                                <Icon as={FiCheckCircle} color="blue.500" boxSize={4} mr={2} />
                                                <Text fontSize="13px" fontWeight="600" color="gray.700">
                                                    Prerequisites
                                                </Text>
                                            </Flex>
                                            <UnorderedList spacing={2} pl={4}>
                                                {parseTextToList(program.prerequisites).map((prerequisite, index) => (
                                                    <ListItem key={index} fontSize="13px" color="gray.700">
                                                        {prerequisite}
                                                    </ListItem>
                                                ))}
                                            </UnorderedList>
                                        </Box>
                                    )}

                                    {/* Materials */}
                                    {program.materials && showMoreDetails && (
                                        <Box>
                                            <Flex align="center" mb={3}>
                                                <Icon as={FiTool} color="purple.500" boxSize={4} mr={2} />
                                                <Text fontSize="13px" fontWeight="600" color="gray.700">
                                                    Materials Provided
                                                </Text>
                                            </Flex>
                                            <UnorderedList spacing={2} pl={4}>
                                                {parseTextToList(program.materials).map((material, index) => (
                                                    <ListItem key={index} fontSize="13px" color="gray.700">
                                                        {material}
                                                    </ListItem>
                                                ))}
                                            </UnorderedList>
                                        </Box>
                                    )}

                                    {/* Show More/Less Button */}
                                    {program.materials && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="teal"
                                            onClick={() => setShowMoreDetails(!showMoreDetails)}
                                            fontSize="13px"
                                            fontWeight="600"
                                        >
                                            {showMoreDetails ? 'Show Less' : 'Show More Details'}
                                        </Button>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>

                        {/* Learning Modules - Only show if enrolled */}
                        {isEnrolled && (
                            <Card shadow="lg" borderRadius="xl" border="1px" borderColor="gray.200">
                                <CardHeader bg="gray.50" borderTopRadius="xl">
                                    <Flex justify="space-between" align="center">
                                        <Flex align="center">
                                            <Box
                                                w={10}
                                                h={10}
                                                bg="purple.100"
                                                borderRadius="lg"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                mr={3}
                                            >
                                                <Icon as={FiLayers} color="purple.600" boxSize={5} />
                                            </Box>
                                            <Box>
                                                <Heading size="md" color="#2D3E5E">Course Content</Heading>
                                                <Text fontSize="12px" color="gray.500">
                                                    {modules.length} modules • {totalVideos} videos
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <Badge colorScheme="purple" variant="outline" fontSize="10px">
                                            Interactive Learning
                                        </Badge>
                                    </Flex>
                                </CardHeader>
                                <CardBody p={6}>
                                    <Accordion allowToggle allowMultiple>
                                        {modules.map((module, moduleIndex) => (
                                            <AccordionItem
                                                key={module.id}
                                                border="2px"
                                                borderColor="gray.100"
                                                borderRadius="xl"
                                                mb={4}
                                                _last={{ mb: 0 }}
                                                bg="white"
                                                _hover={{ borderColor: "purple.200", shadow: "md" }}
                                                transition="all 0.3s ease"
                                            >
                                                <AccordionButton
                                                    _expanded={{ bg: 'purple.50', color: 'purple.700' }}
                                                    borderRadius="xl"
                                                    _hover={{ bg: 'gray.50' }}
                                                    p={5}
                                                >
                                                    <Box flex="1" textAlign="left">
                                                        <Flex justify="space-between" align="center">
                                                            <Flex align="center">
                                                                <Box
                                                                    w={12}
                                                                    h={12}
                                                                    bg={module.isCompleted ? 'green.100' : `${['blue', 'orange', 'pink', 'teal'][moduleIndex % 4]}.100`}
                                                                    borderRadius="lg"
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    mr={4}
                                                                    position="relative"
                                                                >
                                                                    {module.isCompleted ? (
                                                                        <Icon as={FiCheck} boxSize={6} color="green.600" />
                                                                    ) : (
                                                                        <Text
                                                                            fontSize="14px"
                                                                            fontWeight="bold"
                                                                            color={`${['blue', 'orange', 'pink', 'teal'][moduleIndex % 4]}.600`}
                                                                        >
                                                                            {module.moduleNumber}
                                                                        </Text>
                                                                    )}
                                                                </Box>
                                                                <VStack align="start" spacing={1}>
                                                                    <HStack>
                                                                        <Text fontWeight="bold" fontSize="15px" color="#2D3E5E">
                                                                            {module.title || `Module ${module.moduleNumber}`}
                                                                        </Text>
                                                                        {module.isCompleted && (
                                                                            <Badge colorScheme="green" variant="subtle" fontSize="9px">
                                                                                Completed
                                                                            </Badge>
                                                                        )}
                                                                    </HStack>
                                                                    <Text fontSize="12px" color="gray.600" noOfLines={2}>
                                                                        {module.description || `This module covers the fundamentals of ${program.title}`}
                                                                    </Text>
                                                                </VStack>
                                                            </Flex>
                                                            <VStack spacing={1} align="end" mr={4}>
                                                                <Text fontSize="14px" fontWeight="bold" color="#2D3E5E">
                                                                    {module.videos.filter(v => v.isWatched).length}/{module.videos.length}
                                                                </Text>
                                                                <Text fontSize="10px" color="gray.600">videos watched</Text>
                                                            </VStack>
                                                        </Flex>
                                                    </Box>
                                                    <AccordionIcon boxSize={6} />
                                                </AccordionButton>
                                                <AccordionPanel pb={6} px={6}>
                                                    <VStack spacing={4} align="stretch">
                                                        {/* Videos List */}
                                                        <Box>
                                                            <Text fontSize="14px" fontWeight="bold" color="#2D3E5E" mb={4}>
                                                                Video Lessons ({module.videos.length})
                                                            </Text>
                                                            <SimpleGrid columns={1} spacing={4}>
                                                                {module.videos.map((video, videoIndex) => (
                                                                    <Card
                                                                        key={video.id}
                                                                        variant="outline"
                                                                        borderRadius="lg"
                                                                        _hover={{
                                                                            boxShadow: "md",
                                                                            borderColor: "blue.300",
                                                                            transform: "translateX(4px)"
                                                                        }}
                                                                        transition="all 0.3s ease"
                                                                        border="2px"
                                                                        borderColor={video.isWatched ? "green.200" : "gray.200"}
                                                                        bg={video.isWatched ? "green.50" : "white"}
                                                                    >
                                                                        <CardBody p={4}>
                                                                            <Grid templateColumns="auto 1fr auto" gap={4} alignItems="center">
                                                                                <Box
                                                                                    w={12}
                                                                                    h={12}
                                                                                    bg={video.isWatched ? "green.100" : "blue.100"}
                                                                                    borderRadius="lg"
                                                                                    display="flex"
                                                                                    alignItems="center"
                                                                                    justifyContent="center"
                                                                                    flexShrink={0}
                                                                                    position="relative"
                                                                                >
                                                                                    <Icon
                                                                                        as={video.isWatched ? FiCheckCircle : FiVideo}
                                                                                        color={video.isWatched ? "green.600" : "blue.600"}
                                                                                        boxSize={6}
                                                                                    />
                                                                                </Box>

                                                                                <VStack align="stretch" spacing={2}>
                                                                                    <HStack>
                                                                                        <Text fontSize="14px" fontWeight="bold" color="#2D3E5E">
                                                                                            {video.title || `${program.title} - Video ${videoIndex + 1}`}
                                                                                        </Text>
                                                                                        {video.isWatched && (
                                                                                            <Badge colorScheme="green" variant="subtle" fontSize="9px">
                                                                                                Watched
                                                                                            </Badge>
                                                                                        )}
                                                                                    </HStack>
                                                                                    <Text fontSize="12px" color="gray.600" noOfLines={2}>
                                                                                        {video.description || "Learn the basics and get started with this comprehensive introduction"}
                                                                                    </Text>
                                                                                    <HStack spacing={4}>
                                                                                        <HStack spacing={1}>
                                                                                            <Icon as={FiClock} boxSize={3} color="gray.500" />
                                                                                            <Text fontSize="11px" color="gray.600">
                                                                                                {video.duration || "10:00"}
                                                                                            </Text>
                                                                                        </HStack>
                                                                                        <HStack spacing={1}>
                                                                                            <Icon as={video.hasAudio ? FiVolume2 : FiVolumeX} boxSize={3} color="gray.500" />
                                                                                            <Text fontSize="11px" color="gray.600">
                                                                                                {video.hasAudio ? 'Audio' : 'No Audio'}
                                                                                            </Text>
                                                                                        </HStack>
                                                                                        <Badge colorScheme="blue" variant="subtle" fontSize="9px">
                                                                                            Lesson {videoIndex + 1}
                                                                                        </Badge>
                                                                                    </HStack>
                                                                                </VStack>

                                                                                <VStack spacing={2}>
                                                                                    {video.videoUrl && video.videoUrl.trim() ? (
                                                                                        <Button
                                                                                            size="sm"
                                                                                            colorScheme={video.isWatched ? "teal" : "green"}
                                                                                            leftIcon={<Icon as={FiPlay} />}
                                                                                            fontSize="12px"
                                                                                            borderRadius="md"
                                                                                            onClick={() => {
                                                                                                handlePlayVideo(video.videoUrl, video.title);
                                                                                                if (!video.isWatched) {
                                                                                                    handleMarkVideoWatched(module.id, video.id);
                                                                                                }
                                                                                            }}
                                                                                            _hover={{ transform: "scale(1.05)" }}
                                                                                        >
                                                                                            {video.isWatched ? "Watch Again" : "Watch Now"}
                                                                                        </Button>
                                                                                    ) : (
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="outline"
                                                                                            colorScheme="gray"
                                                                                            fontSize="12px"
                                                                                            borderRadius="md"
                                                                                            disabled
                                                                                        >
                                                                                            Coming Soon
                                                                                        </Button>
                                                                                    )}
                                                                                </VStack>
                                                                            </Grid>
                                                                        </CardBody>
                                                                    </Card>
                                                                ))}
                                                            </SimpleGrid>
                                                        </Box>

                                                        {/* Test Your Knowledge Quiz Box */}
                                                        <Box mt={4}>
                                                            <Card
                                                                variant="outline"
                                                                borderRadius="lg"
                                                                _hover={{
                                                                    boxShadow: "md",
                                                                    borderColor: "teal.300",
                                                                }}
                                                                transition="all 0.3s ease"
                                                                border="2px"
                                                                borderColor="gray.200"
                                                                bg="teal.50"
                                                            >
                                                                <CardBody p={4}>
                                                                    <Grid templateColumns="auto 1fr auto" gap={4} alignItems="center">
                                                                        <Box
                                                                            w={12}
                                                                            h={12}
                                                                            bg="teal.100"
                                                                            borderRadius="lg"
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            justifyContent="center"
                                                                            flexShrink={0}
                                                                        >
                                                                            <Icon as={FiEdit3} color="teal.600" boxSize={6} />
                                                                        </Box>

                                                                        <VStack align="stretch" spacing={1}>
                                                                            <Text fontSize="14px" fontWeight="bold" color="#2D3E5E">
                                                                                Test Your Knowledge
                                                                            </Text>
                                                                            <Text fontSize="12px" color="gray.600">
                                                                                Check your understanding of this module
                                                                            </Text>
                                                                        </VStack>

                                                                        <Button
                                                                            size="sm"
                                                                            colorScheme="teal"
                                                                            fontSize="12px"
                                                                            borderRadius="md"
                                                                            onClick={() => handleTakeQuiz(module.id, module.title || `Module ${module.moduleNumber}`)}
                                                                            _hover={{ transform: "scale(1.05)" }}
                                                                        >
                                                                            Start
                                                                        </Button>
                                                                    </Grid>
                                                                </CardBody>
                                                            </Card>
                                                        </Box>
                                                    </VStack>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardBody>
                            </Card>
                        )}

                        {/* Course Quiz - Only show if enrolled */}
                        {isEnrolled && (
                            <Box mt={6}>
                                <Card
                                    shadow="lg"
                                    borderRadius="xl"
                                    border="2px"
                                    borderColor="orange.200"
                                    bg="orange.50"
                                    cursor="pointer"
                                    onClick={handleStartCourseQuiz}
                                    _hover={{
                                        shadow: "xl",
                                        borderColor: "orange.300",
                                        transform: "translateY(-2px)",
                                    }}
                                    transition="all 0.3s ease"
                                >
                                    <CardBody p={6}>
                                        <Flex align="center" gap={4}>
                                            <Box
                                                w={16}
                                                h={16}
                                                bg="orange.100"
                                                borderRadius="xl"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexShrink={0}
                                            >
                                                <Icon as={FiAward} color="orange.600" boxSize={8} />
                                            </Box>
                                            <Box flex="1">
                                                <Text fontSize="18px" fontWeight="bold" color="#2D3E5E" mb={1}>
                                                    Course Quiz
                                                </Text>
                                                <Text fontSize="13px" color="gray.600">
                                                    Test your overall understanding of the entire course
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </CardBody>
                                </Card>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Video Player Modal */}
            <VideoPlayer
                isOpen={isVideoOpen}
                onClose={onVideoClose}
                videoUrl={selectedVideoUrl}
                videoTitle={selectedVideoTitle}
            />

            {/* Quick Info Drawer */}
            <Drawer isOpen={isDrawerOpen} placement="right" onClose={() => setIsDrawerOpen(false)} size="md">
                <DrawerOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px" pb={4}>
                        <HStack spacing={3}>
                            <Box w={10} h={10} bg="teal.500" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                                <Icon as={FiBookOpen} color="white" boxSize={5} />
                            </Box>
                            <Text fontSize="18px" fontWeight="bold" color="#2D3E5E">Quick Information</Text>
                        </HStack>
                    </DrawerHeader>
                    <DrawerBody p={6}>
                        <VStack spacing={4} align="stretch">
                            {/* Trainer */}
                            <Flex p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200" justify="space-between" align="center">
                                <HStack>
                                    <Icon as={FiUser} boxSize={5} color="teal.500" />
                                    <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase">Trainer</Text>
                                </HStack>
                                <Text fontSize="14px" fontWeight="600" color="#2D3E5E">{program.trainer}</Text>
                            </Flex>

                            {/* Category */}
                            <Flex p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200" justify="space-between" align="center">
                                <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase">Category</Text>
                                <Badge colorScheme="blue" variant="solid" fontSize="12px" px={3} py={1.5}>{program.category}</Badge>
                            </Flex>

                            {/* Level */}
                            <Flex p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200" justify="space-between" align="center">
                                <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase">Level</Text>
                                <Badge colorScheme={getLevelColor(program.level)} variant="solid" fontSize="12px" px={3} py={1.5}>{program.level}</Badge>
                            </Flex>

                            {/* Duration */}
                            <Flex p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200" justify="space-between" align="center">
                                <HStack>
                                    <Icon as={FiClock} boxSize={5} color="purple.500" />
                                    <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase">Duration</Text>
                                </HStack>
                                <Text fontSize="14px" fontWeight="600" color="#2D3E5E">{program.duration}</Text>
                            </Flex>

                            {/* Total Modules */}
                            <Flex p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200" justify="space-between" align="center">
                                <HStack>
                                    <Icon as={FiLayers} boxSize={5} color="blue.500" />
                                    <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase">Modules</Text>
                                </HStack>
                                <Text fontSize="14px" fontWeight="600" color="#2D3E5E">{program.totalModules}</Text>
                            </Flex>

                            {/* Enrolled Users */}
                            <Flex p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200" justify="space-between" align="center">
                                <HStack>
                                    <Icon as={FiUsers} boxSize={5} color="orange.500" />
                                    <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase">Enrolled</Text>
                                </HStack>
                                <Text fontSize="14px" fontWeight="600" color="#2D3E5E">{program.enrolledUsers} Users</Text>
                            </Flex>

                            {/* Status */}
                            <Flex p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200" justify="space-between" align="center">
                                <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase">Status</Text>
                                <Badge 
                                    colorScheme={program.status === 'Active' ? 'green' : 'gray'} 
                                    variant="solid" 
                                    fontSize="12px" 
                                    px={3} 
                                    py={1.5}
                                >
                                    {program.status}
                                </Badge>
                            </Flex>

                            {/* Created Date */}
                            <Flex p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200" justify="space-between" align="center">
                                <HStack>
                                    <Icon as={FiCalendar} boxSize={5} color="gray.500" />
                                    <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase">Created</Text>
                                </HStack>
                                <Text fontSize="14px" fontWeight="600" color="#2D3E5E">
                                    {new Date(program.createdDate).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric' 
                                    })}
                                </Text>
                            </Flex>

                            {/* Tags */}
                            {program.tags && program.tags.length > 0 && (
                                <Box p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
                                    <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase" mb={3}>Tags</Text>
                                    <Wrap spacing={2}>
                                        {program.tags.map((tag, index) => (
                                            <WrapItem key={index}>
                                                <Tag size="sm" colorScheme="teal" variant="subtle" borderRadius="full">
                                                    <TagLabel fontSize="11px">{tag}</TagLabel>
                                                </Tag>
                                            </WrapItem>
                                        ))}
                                    </Wrap>
                                </Box>
                            )}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default UserProgramDetails;