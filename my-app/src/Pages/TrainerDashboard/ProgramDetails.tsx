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
  Spinner,
  Center,
  useToast,
  Input,
  FormControl,
  FormLabel,
  UnorderedList,
  ListItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Textarea,
  IconButton,
  Select,
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
  FiEdit,
  FiLayers,
  FiPlus,
  FiInfo,
  FiChevronDown,
  FiAward,
  FiEdit3,
  FiPlayCircle,
  FiTrash2,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';
import VideoPlayer from './VideoPlayer';
import axios from 'axios';

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

interface ModuleContent {
  id: number;
  moduleNumber: number;
  title: string;
  description: string;
  videos: VideoContent[];
}

interface VideoContent {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  hasAudio: boolean;
}

const ProgramDetails = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [modules, setModules] = useState<ModuleContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [newVideoName, setNewVideoName] = useState<string>('');
  const [newVideoLink, setNewVideoLink] = useState<string>('');
  const [newVideoDuration, setNewVideoDuration] = useState<string>('');
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<{ [key: number]: boolean }>({});

  // Add Questions Modal States
  const [isAddQuizQuestionsOpen, setIsAddQuizQuestionsOpen] = useState(false);
  const [selectedQuizModuleId, setSelectedQuizModuleId] = useState<number | null>(null);
  const [selectedQuizModuleTitle, setSelectedQuizModuleTitle] = useState<string>('');
  const [isSavingQuestions, setIsSavingQuestions] = useState(false);
  const [modalQuestions, setModalQuestions] = useState<Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>>([
    {
      question: '',
      options: ['', '', ''],
      correctAnswer: 0,
      explanation: ''
    }
  ]);

  // Course Quiz Add Questions Modal
  const [isCourseQuizQuestionsOpen, setIsCourseQuizQuestionsOpen] = useState(false);

  const { isOpen: isVideoOpen, onOpen: onVideoOpen, onClose: onVideoClose } = useDisclosure();
  const { isOpen: isAddVideoOpen, onOpen: onAddVideoOpen, onClose: onAddVideoClose } = useDisclosure();

  useEffect(() => {
    fetchProgramDetails();
  }, []);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const fetchProgramDetails = async () => {
    try {
      setIsLoading(true);
      const programId = localStorage.getItem('selectedProgramId');

      if (!programId) {
        toast({
          title: 'No Program Selected',
          description: 'Please select a program from the list.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        navigate('/training-programs');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/trainers/training-programs/${programId}`);
      const result = await response.json();

      if (response.ok && result.data) {
        setProgram(result.data);

        const programKey = `program_${programId}_modules`;
        const savedModules = JSON.parse(localStorage.getItem(programKey) || '[]');

        let modulesToSet: ModuleContent[];
        if (savedModules.length > 0) {
          modulesToSet = savedModules;
        } else {
          modulesToSet = Array.from(
            { length: result.data.totalModules },
            (_, index) => ({
              id: index + 1,
              moduleNumber: index + 1,
              title: `Module ${index + 1}`,
              description: '',
              videos: [],
            })
          );
        }
        setModules(modulesToSet);

        const initialExpandedState = modulesToSet.reduce((acc, module) => ({
          ...acc,
          [module.id]: false
        }), {});
        setExpandedModules(initialExpandedState);
      } else {
        throw new Error(result.message || 'Failed to fetch program details');
      }
    } catch (error: any) {
      toast({
        title: 'Error Loading Program',
        description: error.message || 'Unable to load program details.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      navigate('/training-programs');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVideo = (videoUrl: string, videoTitle: string) => {
    if (videoUrl && videoUrl.trim()) {
      setSelectedVideoUrl(videoUrl);
      setSelectedVideoTitle(videoTitle);
      onVideoOpen();
    }
  };

  const handleOpenAddVideo = (moduleId: number) => {
    setSelectedModuleId(moduleId);
    setNewVideoName('');
    setNewVideoLink('');
    setNewVideoDuration('');
    onAddVideoOpen();
  };

  const handleSaveVideo = () => {
    if (!newVideoName || !newVideoLink || !newVideoDuration) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (selectedModuleId !== null) {
      const updatedModules = modules.map(module => {
        if (module.id === selectedModuleId) {
          const newVideo: VideoContent = {
            id: module.videos.length + 1,
            title: newVideoName,
            description: '',
            videoUrl: newVideoLink,
            duration: newVideoDuration,
            hasAudio: true,
          };
          return {
            ...module,
            videos: [...module.videos, newVideo],
          };
        }
        return module;
      });

      setModules(updatedModules);

      const programId = localStorage.getItem('selectedProgramId');
      if (programId) {
        const programKey = `program_${programId}_modules`;
        localStorage.setItem(programKey, JSON.stringify(updatedModules));
      }

      toast({
        title: 'Video Added',
        description: 'Video has been successfully added to the module.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onAddVideoClose();
    }
  };

  const handleTakeQuiz = (moduleId: number, moduleTitle: string) => {
    localStorage.setItem('quizModuleId', moduleId.toString());
    localStorage.setItem('quizModuleTitle', moduleTitle);
    localStorage.setItem('quizProgramTitle', program?.title || '');
    localStorage.setItem('quizProgramId', program?._id || '');
    navigate('/quiz');
  };

  const handleStartCourseQuiz = () => {
    localStorage.setItem('courseQuizProgramTitle', program?.title || '');
    localStorage.setItem('courseQuizProgramId', program?._id || '');
    navigate('/course-quiz');
  };

  // Add Quiz Questions Handlers
  const handleOpenAddQuizQuestions = (moduleId: number, moduleTitle: string) => {
    setSelectedQuizModuleId(moduleId);
    setSelectedQuizModuleTitle(moduleTitle);
    setModalQuestions([{
      question: '',
      options: ['', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]);
    setIsAddQuizQuestionsOpen(true);
  };

  const handleAddQuestionField = () => {
    setModalQuestions([
      ...modalQuestions,
      {
        question: '',
        options: ['', '', ''],
        correctAnswer: 0,
        explanation: ''
      }
    ]);
  };

  const handleRemoveQuestionField = (index: number) => {
    if (modalQuestions.length > 1) {
      const updated = modalQuestions.filter((_, i) => i !== index);
      setModalQuestions(updated);
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...modalQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setModalQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...modalQuestions];
    updated[qIndex].options[optIndex] = value;
    setModalQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...modalQuestions];
    if (updated[qIndex].options.length < 6) {
      updated[qIndex].options.push('');
      setModalQuestions(updated);
    }
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    const updated = [...modalQuestions];
    if (updated[qIndex].options.length > 2) {
      updated[qIndex].options.splice(optIndex, 1);
      setModalQuestions(updated);
    }
  };

  const handleSaveQuizQuestions = async () => {
    // Validation
    for (let i = 0; i < modalQuestions.length; i++) {
      const q = modalQuestions[i];
      if (!q.question.trim()) {
        toast({
          title: 'Validation Error',
          description: `Question ${i + 1} is empty`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const validOptions = q.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        toast({
          title: 'Validation Error',
          description: `Question ${i + 1} needs at least 2 options`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    setIsSavingQuestions(true);

    try {
      const trainerId = localStorage.getItem('userName') || localStorage.getItem('userEmail') || '';

      const questionsToSave = modalQuestions.map(q => ({
        question: q.question,
        options: q.options.filter(opt => opt.trim() !== ''),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1
      }));

      console.log('Sending data:', {
        questions: questionsToSave,
        programId: program?._id,
        moduleId: selectedQuizModuleId?.toString(),
        trainerId,
        quizType: 'module'
      });

      const response = await axios.post('http://localhost:3001/api/quiz-questions/bulk', {
        questions: questionsToSave,
        programId: program?._id,
        moduleId: selectedQuizModuleId?.toString(),
        trainerId,
        quizType: 'module'
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: `${response.data.data.length} questions added successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        setIsAddQuizQuestionsOpen(false);
        setModalQuestions([{
          question: '',
          options: ['', '', ''],
          correctAnswer: 0,
          explanation: ''
        }]);
      }
    } catch (error: any) {
      console.error('Error saving questions:', error);
      console.error('Error response:', error.response?.data);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save questions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSavingQuestions(false);
    }
  };

  const handleViewQuiz = (moduleId: number, moduleTitle: string) => {
    handleTakeQuiz(moduleId, moduleTitle);
  };

  const handleDeleteQuiz = async (moduleId: number) => {
    if (!window.confirm('Are you sure you want to delete all questions for this module quiz?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3001/api/quiz-questions/module/${program?._id}/${moduleId}`);

      if (response.data.success) {
        toast({
          title: 'Quiz Deleted',
          description: 'All questions have been deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete quiz questions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Course Quiz Handlers
  const handleOpenCourseQuizQuestions = () => {
    setModalQuestions([{
      question: '',
      options: ['', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]);
    setIsCourseQuizQuestionsOpen(true);
  };

  const handleSaveCourseQuizQuestions = async () => {
    // Validation
    for (let i = 0; i < modalQuestions.length; i++) {
      const q = modalQuestions[i];
      if (!q.question.trim()) {
        toast({
          title: 'Validation Error',
          description: `Question ${i + 1} is empty`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const validOptions = q.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        toast({
          title: 'Validation Error',
          description: `Question ${i + 1} needs at least 2 options`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    setIsSavingQuestions(true);

    try {
      const trainerId = localStorage.getItem('userName') || localStorage.getItem('userEmail') || '';

      const questionsToSave = modalQuestions.map(q => ({
        question: q.question,
        options: q.options.filter(opt => opt.trim() !== ''),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1
      }));

      const response = await axios.post('http://localhost:3001/api/quiz-questions/bulk', {
        questions: questionsToSave,
        programId: program?._id,
        moduleId: null,
        trainerId,
        quizType: 'course'
      });

      if (response.data.success) {
        toast({
          title: 'Success',
          description: `${response.data.data.length} questions added successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        setIsCourseQuizQuestionsOpen(false);
        setModalQuestions([{
          question: '',
          options: ['', '', ''],
          correctAnswer: 0,
          explanation: ''
        }]);
      }
    } catch (error) {
      console.error('Error saving questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to save questions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSavingQuestions(false);
    }
  };

  const handleViewCourseQuiz = () => {
    handleStartCourseQuiz();
  };

  const handleDeleteCourseQuiz = async () => {
    if (!window.confirm('Are you sure you want to delete all questions for the course quiz?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3001/quiz-questions/course/${program?._id}`);

      if (response.data.success) {
        toast({
          title: 'Course Quiz Deleted',
          description: 'All questions have been deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting course quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete course quiz questions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'Beginner':
        return 'green';
      case 'Intermediate':
        return 'blue';
      case 'Advanced':
        return 'purple';
      case 'All Levels':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const parseTextToList = (text: string): string[] => {
    if (!text) return [];
    if (text.includes('|')) {
      return text.split('|').map(item => item.trim()).filter(item => item.length > 0);
    }
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  };

  if (isLoading) {
    return (
      <Box>
        <SideNav activeNav="Training Programs" />
        <Box>
          <TopNav />
          <Center h="calc(100vh - 80px)">
            <VStack spacing={4}>
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="#2CA58D" size="xl" />
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
      <Box>
        <SideNav activeNav="Training Programs" />
        <Box>
          <TopNav />
          <Box px={6} ml="100px" mt={8} minH="calc(100vh - 64px)">
            <Box p={8} bg="white" borderRadius="3xl" mb={6} boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)">
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Program Not Found!</AlertTitle>
                  <AlertDescription>
                    The requested program could not be found. Please go back to the programs list.
                  </AlertDescription>
                </Box>
              </Alert>
              <Button onClick={() => navigate('/training-programs')} mt={4} colorScheme="teal">
                Back to Programs
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const totalVideos = modules.reduce((acc, module) => acc + module.videos.length, 0);
  const totalDuration = modules.reduce((acc, module) => {
    return (
      acc +
      module.videos.reduce((vidAcc, video) => {
        const duration = video.duration.split(':');
        return vidAcc + (parseInt(duration[0]) || 0);
      }, 0)
    );
  }, 0);

  return (
    <Box bg="gray.50">
      <SideNav activeNav="Training Programs" />
      <Box>
        <TopNav />
        <Box px={6} ml="100px" mt={8} minH="calc(100vh - 64px)">
          <Box p={8} bg="white" borderRadius="3xl" mb={6} boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)">

            {/* Header */}
            <Box bgGradient="linear(to-r, #2CA58D, #077660)" borderRadius="xl" p={6} mb={8}>
              <Text fontSize="xl" color="white" fontWeight="bold">
                {program.title}
              </Text>
            </Box>

            {/* Stats Grid */}
            <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
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

              <Card shadow="lg" borderRadius="xl" border="1px" borderColor="orange.100">
                <CardBody p={5}>
                  <Flex align="center" justify="space-between">
                    <Box w={12} h={12} bg="orange.100" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                      <Icon as={FiUsers} boxSize={6} color="orange.600" />
                    </Box>
                    <Box textAlign="right">
                      <Text fontSize="2xl" fontWeight="bold" color="#2D3E5E">{program.enrolledUsers}</Text>
                      <Text fontSize="13px" color="gray.600" fontWeight="semibold">Enrolled Users</Text>
                      <Text fontSize="10px" color="orange.500">Active learners</Text>
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
                      <Text fontSize="2xl" fontWeight="bold" color="#2D3E5E">{totalDuration}</Text>
                      <Text fontSize="13px" color="gray.600" fontWeight="semibold">Total Minutes</Text>
                      <Text fontSize="10px" color="purple.500">Learning time</Text>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            </Grid>

            {/* Program Info Card */}
            <Card shadow="lg" borderRadius="xl" mb={8} border="1px" borderColor="gray.200">
              <CardHeader bg="gray.50" borderTopRadius="xl">
                <Flex align="center" justify="space-between">
                  <Flex align="center">
                    <Box w={10} h={10} bg="teal.100" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" mr={3}>
                      <Icon as={FiBookOpen} color="teal.600" boxSize={5} />
                    </Box>
                    <Box>
                      <Heading size="md" color="#2D3E5E">Program Information</Heading>
                      <Text fontSize="12px" color="gray.500">Complete program details and requirements</Text>
                    </Box>
                  </Flex>
                  <Button size="sm" leftIcon={<Icon as={FiInfo} />} colorScheme="teal" variant="outline" onClick={() => setIsDrawerOpen(true)} fontSize="13px" fontWeight="600">
                    Quick Info
                  </Button>
                </Flex>
              </CardHeader>
              <CardBody p={6}>
                <Text fontSize="13px" color="gray.700" lineHeight="1.6">{program.description}</Text>
              </CardBody>
            </Card>

            {/* Modules */}
            <Box mb={8}>
              <Flex justify="space-between" align="center" mb={6}>
                <HStack spacing={3}>
                  <Icon as={FiLayers} color="#2CA58D" boxSize={6} />
                  <Box>
                    <Heading size="md" color="#2D3E5E">Learning Modules</Heading>
                    <Text fontSize="13px" color="gray.500" mt={1}>{modules.length} modules • {totalVideos} videos</Text>
                  </Box>
                </HStack>
              </Flex>

              <VStack spacing={4} align="stretch">
                {modules.map((module) => {
                  const isExpanded = expandedModules[module.id] !== false;

                  return (
                    <Box key={module.id} bg="white" borderRadius="xl" overflow="hidden" border="1px" borderColor="gray.200" _hover={{ shadow: 'md', borderColor: 'gray.300' }} transition="all 0.2s">
                      <Flex p={5} bg="gray.50" justify="space-between" align="center" borderBottom={isExpanded ? "1px" : "0"} borderColor="gray.200">
                        <Flex align="center" gap={4} flex={1} cursor="pointer" onClick={() => toggleModule(module.id)} _hover={{ bg: 'gray.100' }} transition="background 0.2s" p={2} borderRadius="md" ml={-2}>
                          <Icon as={FiChevronDown} boxSize={5} color="gray.600" transform={isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'} transition="transform 0.2s" />
                          <Flex w={10} h={10} bg="#2CA58D" color="white" borderRadius="lg" align="center" justify="center" fontWeight="bold" fontSize="16px">
                            {module.moduleNumber}
                          </Flex>
                          <Box>
                            <Text fontWeight="600" fontSize="15px" color="#2D3E5E">{module.title || `Module ${module.moduleNumber}`}</Text>
                            <Text fontSize="12px" color="gray.500" mt={0.5}>{module.videos.length} {module.videos.length === 1 ? 'video' : 'videos'}</Text>
                          </Box>
                        </Flex>
                        <Button size="sm" colorScheme="teal" leftIcon={<Icon as={FiPlus} />} onClick={(e) => { e.stopPropagation(); handleOpenAddVideo(module.id); }} fontSize="13px">
                          Add Video
                        </Button>
                      </Flex>

                      {isExpanded && (
                        <Box p={5}>
                          {module.videos.length === 0 ? (
                            <Flex direction="column" align="center" justify="center" py={12} color="gray.400">
                              <Icon as={FiVideo} boxSize={10} mb={3} />
                              <Text fontSize="14px" fontWeight="500" color="gray.500">No videos added yet</Text>
                              <Text fontSize="12px" color="gray.400" mt={1}>Click "Add Video" to get started</Text>
                            </Flex>
                          ) : (
                            <>
                              <VStack spacing={3} align="stretch" mb={4}>
                                {module.videos.map((video) => (
                                  <Flex key={video.id} p={4} bg="gray.50" borderRadius="lg" align="center" justify="space-between" _hover={{ bg: 'gray.100' }} transition="all 0.2s">
                                    <Flex align="center" gap={4} flex={1}>
                                      <Flex w={10} h={10} bg="white" border="2px" borderColor="gray.300" borderRadius="md" align="center" justify="center" flexShrink={0}>
                                        <Icon as={FiVideo} color="gray.600" boxSize={5} />
                                      </Flex>
                                      <Box flex={1}>
                                        <Text fontSize="14px" fontWeight="600" color="#2D3E5E" mb={1}>{video.title}</Text>
                                        <HStack spacing={4} fontSize="12px" color="gray.500">
                                          <HStack spacing={1}>
                                            <Icon as={FiClock} boxSize={3.5} />
                                            <Text>{video.duration}</Text>
                                          </HStack>
                                          <HStack spacing={1}>
                                            <Icon as={video.hasAudio ? FiVolume2 : FiVolumeX} boxSize={3.5} />
                                            <Text>{video.hasAudio ? 'Audio' : 'No Audio'}</Text>
                                          </HStack>
                                        </HStack>
                                      </Box>
                                    </Flex>
                                    {video.videoUrl && video.videoUrl.trim() ? (
                                      <Button size="sm" colorScheme="green" leftIcon={<Icon as={FiPlay} />} fontSize="13px" onClick={() => handlePlayVideo(video.videoUrl, video.title)}>
                                        Play
                                      </Button>
                                    ) : (
                                      <Button size="sm" variant="ghost" fontSize="13px" isDisabled>No Video</Button>
                                    )}
                                  </Flex>
                                ))}
                              </VStack>

                              {/* Quiz Box */}
                              <Flex p={4} bg="gray.50" borderRadius="lg" align="center" justify="space-between" _hover={{ bg: 'gray.100' }} transition="all 0.2s">
                                <Flex align="center" gap={4} flex={1} cursor="pointer" onClick={() => handleTakeQuiz(module.id, module.title || `Module ${module.moduleNumber}`)}>
                                  <Flex w={10} h={10} bg="white" border="2px" borderColor="gray.300" borderRadius="md" align="center" justify="center" flexShrink={0}>
                                    <Icon as={FiEdit3} color="gray.600" boxSize={5} />
                                  </Flex>
                                  <Text fontSize="14px" fontWeight="600" color="#2D3E5E">Test your knowledge</Text>
                                </Flex>
                                <HStack spacing={2}>
                                  <Button 
                                    size="sm" 
                                    bg="#1e2738" 
                                    color="white"
                                    leftIcon={<Icon as={FiPlus} />} 
                                    onClick={(e) => { e.stopPropagation(); handleOpenAddQuizQuestions(module.id, module.title || `Module ${module.moduleNumber}`); }} 
                                    fontSize="13px"
                                    _hover={{ bg: "#2d3e50" }}
                                  >
                                    Add Questions
                                  </Button>
                                  <Button size="sm" colorScheme="teal" variant="outline" leftIcon={<Icon as={FiBookOpen} />} onClick={(e) => { e.stopPropagation(); handleViewQuiz(module.id, module.title || `Module ${module.moduleNumber}`); }} fontSize="13px">
                                    View Quiz
                                  </Button>
                                  <Button size="sm" colorScheme="red" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(module.id); }} fontSize="13px">
                                    <Icon as={FiTrash2} />
                                  </Button>
                                </HStack>
                              </Flex>
                            </>
                          )}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </VStack>
            </Box>

            {/* Course Quiz - Updated UI to match module quiz style */}
            <Box mb={8}>
              <Flex p={4} bg="gray.50" borderRadius="lg" align="center" justify="space-between" _hover={{ bg: 'gray.100' }} transition="all 0.2s" border="1px" borderColor="gray.200">
                <Flex align="center" gap={4} flex={1} cursor="pointer" onClick={handleStartCourseQuiz}>
                  <Flex w={10} h={10} bg="white" border="2px" borderColor="gray.300" borderRadius="md" align="center" justify="center" flexShrink={0}>
                    <Icon as={FiAward} color="gray.600" boxSize={5} />
                  </Flex>
                  <Text fontSize="14px" fontWeight="600" color="#2D3E5E">Course Quiz</Text>
                </Flex>
                <HStack spacing={2}>
                  <Button 
                    size="sm" 
                    bg="#1e2738" 
                    color="white"
                    leftIcon={<Icon as={FiPlus} />} 
                    onClick={(e) => { e.stopPropagation(); handleOpenCourseQuizQuestions(); }} 
                    fontSize="13px"
                    _hover={{ bg: "#2d3e50" }}
                  >
                    Add Questions
                  </Button>
                  <Button size="sm" colorScheme="teal" variant="outline" leftIcon={<Icon as={FiBookOpen} />} onClick={(e) => { e.stopPropagation(); handleViewCourseQuiz(); }} fontSize="13px">
                    View Quiz
                  </Button>
                  <Button size="sm" colorScheme="red" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDeleteCourseQuiz(); }} fontSize="13px">
                    <Icon as={FiTrash2} />
                  </Button>
                </HStack>
              </Flex>
            </Box>
          </Box>
        </Box>

        {/* Modals */}
        <VideoPlayer isOpen={isVideoOpen} onClose={onVideoClose} videoUrl={selectedVideoUrl} videoTitle={selectedVideoTitle} />

        <Modal isOpen={isAddVideoOpen} onClose={onAddVideoClose} size="lg" isCentered>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent borderRadius="xl">
            <ModalHeader>Add New Video</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">Video Name</FormLabel>
                  <Input placeholder="Enter video name" value={newVideoName} onChange={(e) => setNewVideoName(e.target.value)} fontSize="14px" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">Video Link</FormLabel>
                  <Input placeholder="Enter video URL" value={newVideoLink} onChange={(e) => setNewVideoLink(e.target.value)} fontSize="14px" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">Duration (mm:ss)</FormLabel>
                  <Input placeholder="e.g., 10:30" value={newVideoDuration} onChange={(e) => setNewVideoDuration(e.target.value)} fontSize="14px" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAddVideoClose}>Cancel</Button>
              <Button colorScheme="teal" onClick={handleSaveVideo}>Save Video</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add Quiz Questions Modal */}
        <Modal isOpen={isAddQuizQuestionsOpen} onClose={() => setIsAddQuizQuestionsOpen(false)} size="4xl" scrollBehavior="inside">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent maxH="90vh">
            <ModalHeader bg="teal.500" color="white" borderTopRadius="md">
              Add Quiz Questions - {selectedQuizModuleTitle}
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody py={6}>
              <VStack spacing={6} align="stretch">
                {modalQuestions.map((q, qIndex) => (
                  <Card key={qIndex} borderWidth="1px" borderColor="gray.200" bg="gray.50">
                    <CardBody p={4}>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between">
                          <Badge colorScheme="teal">Question {qIndex + 1}</Badge>
                          {modalQuestions.length > 1 && (
                            <IconButton
                              icon={<FiTrash2 />}
                              aria-label="Remove question"
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleRemoveQuestionField(qIndex)}
                            />
                          )}
                        </HStack>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Question</FormLabel>
                          <Textarea
                            value={q.question}
                            onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                            placeholder="Enter your question"
                            size="sm"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Options</FormLabel>
                          <VStack spacing={2} align="stretch">
                            {q.options.map((opt, optIndex) => (
                              <HStack key={optIndex}>
                                <Input
                                  value={opt}
                                  onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                  placeholder={`Option ${optIndex + 1}`}
                                  size="sm"
                                />
                                {q.options.length > 2 && (
                                  <IconButton
                                    icon={<FiTrash2 />}
                                    aria-label="Remove option"
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => handleRemoveOption(qIndex, optIndex)}
                                  />
                                )}
                              </HStack>
                            ))}
                            {q.options.length < 6 && (
                              <Button
                                size="sm"
                                variant="outline"
                                colorScheme="teal"
                                leftIcon={<FiPlus />}
                                onClick={() => handleAddOption(qIndex)}
                              >
                                Add Option
                              </Button>
                            )}
                          </VStack>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Correct Answer</FormLabel>
                          <Select
                            value={q.correctAnswer}
                            onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', parseInt(e.target.value))}
                            size="sm"
                          >
                            {q.options.map((opt, optIndex) => (
                              <option key={optIndex} value={optIndex}>
                                Option {optIndex + 1}: {opt || '(empty)'}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">Explanation (Optional)</FormLabel>
                          <Textarea
                            value={q.explanation}
                            onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                            placeholder="Explain why this is the correct answer"
                            size="sm"
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}

                <Button
                  leftIcon={<FiPlus />}
                  onClick={handleAddQuestionField}
                  variant="outline"
                  colorScheme="teal"
                  size="sm"
                >
                  Add Another Question
                </Button>

                <HStack justify="flex-end" pt={4}>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddQuizQuestionsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="teal.500"
                    color="white"
                    _hover={{ bg: 'teal.600' }}
                    onClick={handleSaveQuizQuestions}
                    isLoading={isSavingQuestions}
                  >
                    Save Questions
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Course Quiz Add Questions Modal */}
        <Modal isOpen={isCourseQuizQuestionsOpen} onClose={() => setIsCourseQuizQuestionsOpen(false)} size="4xl" scrollBehavior="inside">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent maxH="90vh">
            <ModalHeader bg="orange.500" color="white" borderTopRadius="md">
              Add Course Quiz Questions
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody py={6}>
              <VStack spacing={6} align="stretch">
                {modalQuestions.map((q, qIndex) => (
                  <Card key={qIndex} borderWidth="1px" borderColor="gray.200" bg="gray.50">
                    <CardBody p={4}>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between">
                          <Badge colorScheme="orange">Question {qIndex + 1}</Badge>
                          {modalQuestions.length > 1 && (
                            <IconButton
                              icon={<FiTrash2 />}
                              aria-label="Remove question"
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleRemoveQuestionField(qIndex)}
                            />
                          )}
                        </HStack>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Question</FormLabel>
                          <Textarea
                            value={q.question}
                            onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                            placeholder="Enter your question"
                            size="sm"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Options</FormLabel>
                          <VStack spacing={2} align="stretch">
                            {q.options.map((opt, optIndex) => (
                              <HStack key={optIndex}>
                                <Input
                                  value={opt}
                                  onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                  placeholder={`Option ${optIndex + 1}`}
                                  size="sm"
                                />
                                {q.options.length > 2 && (
                                  <IconButton
                                    icon={<FiTrash2 />}
                                    aria-label="Remove option"
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => handleRemoveOption(qIndex, optIndex)}
                                  />
                                )}
                              </HStack>
                            ))}
                            {q.options.length < 6 && (
                              <Button
                                size="sm"
                                variant="outline"
                                colorScheme="orange"
                                leftIcon={<FiPlus />}
                                onClick={() => handleAddOption(qIndex)}
                              >
                                Add Option
                              </Button>
                            )}
                          </VStack>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm">Correct Answer</FormLabel>
                          <Select
                            value={q.correctAnswer}
                            onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', parseInt(e.target.value))}
                            size="sm"
                          >
                            {q.options.map((opt, optIndex) => (
                              <option key={optIndex} value={optIndex}>
                                Option {optIndex + 1}: {opt || '(empty)'}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">Explanation (Optional)</FormLabel>
                          <Textarea
                            value={q.explanation}
                            onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                            placeholder="Explain why this is the correct answer"
                            size="sm"
                          />
                        </FormControl>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}

                <Button
                  leftIcon={<FiPlus />}
                  onClick={handleAddQuestionField}
                  variant="outline"
                  colorScheme="orange"
                  size="sm"
                >
                  Add Another Question
                </Button>

                <HStack justify="flex-end" pt={4}>
                  <Button
                    variant="outline"
                    onClick={() => setIsCourseQuizQuestionsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="orange.500"
                    color="white"
                    _hover={{ bg: 'orange.600' }}
                    onClick={handleSaveCourseQuizQuestions}
                    isLoading={isSavingQuestions}
                  >
                    Save Questions
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

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
                <Flex p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200" justify="space-between" align="center">
                  <HStack>
                    <Icon as={FiUser} boxSize={5} color="teal.500" />
                    <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase">Trainer</Text>
                  </HStack>
                  <Text fontSize="14px" fontWeight="600" color="#2D3E5E">{program.trainer}</Text>
                </Flex>
                <Flex p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200" justify="space-between" align="center">
                  <Text fontSize="12px" color="gray.600" fontWeight="600" textTransform="uppercase">Category</Text>
                  <Badge colorScheme="blue" variant="solid" fontSize="12px" px={3} py={1.5}>{program.category}</Badge>
                </Flex>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </Box>
  );
};

export default ProgramDetails;