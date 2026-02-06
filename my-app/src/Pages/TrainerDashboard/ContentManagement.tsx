import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  Flex,
  Icon,
  Grid,
  Badge,
  Input,
  Tooltip,
  IconButton,
  useDisclosure,
  Divider,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Textarea,
  Switch,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

import {
  FiArrowRight,
  FiVideo,
  FiVolumeX,
  FiVolume2,
  FiSave,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';

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

const ContentManagement = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [modules, setModules] = useState<ModuleContent[]>([]);
  const [videoToDelete, setVideoToDelete] = useState<{moduleId: number, videoId: number} | null>(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const programId = localStorage.getItem('selectedProgramId');
    const storedPrograms = JSON.parse(localStorage.getItem('trainingPrograms') || '[]');
    const selectedProgram = storedPrograms.find((p: TrainingProgram) => p.id.toString() === programId);
   
    if (selectedProgram) {
      setProgram(selectedProgram);
     
      // Load existing modules data or create new ones
      const programKey = `program_${selectedProgram.id}_modules`;
      const savedModules = JSON.parse(localStorage.getItem(programKey) || '[]');
     
      if (savedModules.length > 0) {
        setModules(savedModules);
      } else {
        // Initialize empty modules for trainer to fill
        const emptyModules: ModuleContent[] = Array.from({ length: selectedProgram.totalModules }, (_, index) => ({
          id: index + 1,
          moduleNumber: index + 1,
          title: '',
          description: '',
          videos: [
            {
              id: 1,
              title: '',
              description: '',
              videoUrl: '',
              duration: '',
              hasAudio: true
            }
          ]
        }));
        setModules(emptyModules);
      }
    }
  }, []);

  // Save modules to localStorage whenever modules change
  useEffect(() => {
    if (program && modules.length > 0) {
      const programKey = `program_${program.id}_modules`;
      localStorage.setItem(programKey, JSON.stringify(modules));
    }
  }, [modules, program]);

  const handleBackToList = (): void => {
    localStorage.removeItem('selectedProgramId');
    navigate('/manage-training');
  };

  const handleSaveModuleContent = (moduleId: number) => {
    toast({
      title: 'Module Updated',
      description: 'Module content has been saved successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveVideoContent = (moduleId: number, videoId: number, updates: Partial<VideoContent>) => {
    setModules(prev =>
      prev.map(module =>
        module.id === moduleId
          ? {
              ...module,
              videos: module.videos.map(video =>
                video.id === videoId ? { ...video, ...updates } : video
              )
            }
          : module
      )
    );
  };

  const handleAddVideo = (moduleId: number) => {
    const newVideo: VideoContent = {
      id: Date.now(),
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      hasAudio: true
    };

    setModules(prev =>
      prev.map(module =>
        module.id === moduleId
          ? { ...module, videos: [...module.videos, newVideo] }
          : module
      )
    );

    toast({
      title: 'Video Added',
      description: 'New video slot has been added to the module.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteVideo = (moduleId: number, videoId: number) => {
    setVideoToDelete({ moduleId, videoId });
    onDeleteOpen();
  };

  const confirmDeleteVideo = () => {
    if (videoToDelete) {
      setModules(prev =>
        prev.map(module =>
          module.id === videoToDelete.moduleId
            ? { ...module, videos: module.videos.filter(video => video.id !== videoToDelete.videoId) }
            : module
        )
      );

      toast({
        title: 'Video Deleted',
        description: 'Video has been removed from the module.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    onDeleteClose();
  };

  if (!program) {
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
              <Text fontSize="13px" color="gray.600">Program not found. Please go back to the program list.</Text>
              <Button onClick={() => navigate('/manage-training')} mt={4} fontSize="13px">
                Back to Programs
              </Button>
            </Box>
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
        <Box px={6} ml="100px" mt={8} minH="calc(100vh - 64px)">
          <Box
            p={8}
            bg="white"
            borderRadius="3xl"
            mb={6}
            boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            {/* Header Box */}
            <Box bg="#2CA58D" borderRadius="xl" p={5} mb={6}>
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontSize="xl" color="white" fontWeight="bold">
                    {program.title} - Content Management
                  </Text>
                  
                </Box>
                <Button
                  variant="outline"
                  leftIcon={<Icon as={FiArrowRight} transform="rotate(180deg)" />}
                  onClick={handleBackToList}
                  color="white"
                  borderColor="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  fontSize="13px"
                >
                  Back to Programs
                </Button>
              </Flex>
            </Box>

            {/* Module Management */}
            <Card
              bg="white"
              shadow="md"
              border="1px"
              borderColor="gray.200"
              borderRadius="xl"
              _hover={{ boxShadow: "lg" }}
            >
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="#2D3E5E" fontWeight="bold">
                    Module Content Management ({modules.length} Modules)
                  </Heading>
                  <Text fontSize="13px" color="gray.500">
                    Last updated: {new Date().toLocaleDateString()}
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <Accordion allowToggle allowMultiple>
                  {modules.map((module) => (
                    <AccordionItem
                      key={module.id}
                      border="1px"
                      borderColor="gray.200"
                      borderRadius="md"
                      mb={4}
                      _last={{ mb: 0 }}
                    >
                      <AccordionButton
                        _expanded={{ bg: 'rgba(44, 165, 141, 0.1)', color: '#238B75' }}
                        borderRadius="md"
                        _hover={{ bg: 'gray.50' }}
                      >
                        <Box flex="1" textAlign="left">
                          <Flex align="center" justify="space-between">
                            <Flex align="center">
                              <Badge bg="#2CA58D" color="white" mr={3} fontSize="10px">
                                Module {module.moduleNumber}
                              </Badge>
                              <Text fontWeight="semibold" fontSize="13px" color="#2D3E5E">
                                {module.title || `Module ${module.moduleNumber}`}
                              </Text>
                            </Flex>
                            <Text fontSize="11px" color="gray.500" mr={4}>
                              {module.videos.length} videos
                            </Text>
                          </Flex>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <VStack spacing={6} align="stretch">
                          {/* Module Details */}
                          <Box>
                            <Text fontSize="md" fontWeight="bold" color="#2D3E5E" mb={4}>
                              Module Information
                            </Text>
                            <FormControl mb={4}>
                              <FormLabel fontSize="13px" fontWeight="semibold" color="#2D3E5E">
                                Module Title
                              </FormLabel>
                              <Input
                                value={module.title}
                                onChange={(e) => {
                                  const newTitle = e.target.value;
                                  setModules(prev =>
                                    prev.map(m => m.id === module.id ? { ...m, title: newTitle } : m)
                                  );
                                }}
                                placeholder={`Enter title for Module ${module.moduleNumber}`}
                                fontSize="13px"
                                borderRadius="md"
                              />
                            </FormControl>
                            <FormControl mb={4}>
                              <FormLabel fontSize="13px" fontWeight="semibold" color="#2D3E5E">
                                Module Description
                              </FormLabel>
                              <Textarea
                                value={module.description}
                                onChange={(e) => {
                                  const newDescription = e.target.value;
                                  setModules(prev =>
                                    prev.map(m => m.id === module.id ? { ...m, description: newDescription } : m)
                                  );
                                }}
                                placeholder={`Enter description for Module ${module.moduleNumber}`}
                                fontSize="13px"
                                rows={3}
                                borderRadius="md"
                              />
                            </FormControl>
                            <Button
                              size="sm"
                              bg="#2CA58D"
                              color="white"
                              _hover={{ bg: '#238B75' }}
                              onClick={() => handleSaveModuleContent(module.id)}
                              leftIcon={<Icon as={FiSave} />}
                              fontSize="13px"
                              borderRadius="md"
                            >
                              Save Module
                            </Button>
                          </Box>

                          <Divider />

                          {/* Videos Management */}
                          <Box>
                            <Flex justify="space-between" align="center" mb={4}>
                              <Text fontSize="md" fontWeight="bold" color="#2D3E5E">
                                Videos ({module.videos.length})
                              </Text>
                              <Button
                                size="sm"
                                colorScheme="blue"
                                onClick={() => handleAddVideo(module.id)}
                                leftIcon={<Icon as={FiPlus} />}
                                fontSize="13px"
                                borderRadius="md"
                              >
                                Add Video
                              </Button>
                            </Flex>
                            <SimpleGrid columns={1} spacing={4}>
                              {module.videos.map((video, videoIndex) => (
                                <Card
                                  key={video.id}
                                  variant="outline"
                                  borderRadius="md"
                                  _hover={{ boxShadow: "md" }}
                                >
                                  <CardBody p={4}>
                                    <Grid templateColumns="auto 1fr auto" gap={4} alignItems="start">
                                      <Box
                                        w={12}
                                        h={12}
                                        bg="blue.100"
                                        borderRadius="md"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                      >
                                        <Icon as={FiVideo} color="blue.600" boxSize={6} />
                                      </Box>
                                     
                                      <VStack align="stretch" spacing={3}>
                                        <FormControl>
                                          <FormLabel fontSize="12px" mb={1} color="#2D3E5E" fontWeight="semibold">
                                            Video Title
                                          </FormLabel>
                                          <Input
                                            value={video.title}
                                            onChange={(e) => handleSaveVideoContent(module.id, video.id, { title: e.target.value })}
                                            placeholder="Enter video title"
                                            fontSize="12px"
                                            size="sm"
                                            borderRadius="md"
                                          />
                                        </FormControl>
                                        <FormControl>
                                          <FormLabel fontSize="12px" mb={1} color="#2D3E5E" fontWeight="semibold">
                                            Description
                                          </FormLabel>
                                          <Textarea
                                            value={video.description}
                                            onChange={(e) => handleSaveVideoContent(module.id, video.id, { description: e.target.value })}
                                            placeholder="Enter video description"
                                            fontSize="12px"
                                            size="sm"
                                            rows={2}
                                            borderRadius="md"
                                          />
                                        </FormControl>
                                        <FormControl>
                                          <FormLabel fontSize="12px" mb={1} color="#2D3E5E" fontWeight="semibold">
                                            YouTube Video URL
                                          </FormLabel>
                                          <Input
                                            value={video.videoUrl}
                                            onChange={(e) => handleSaveVideoContent(module.id, video.id, { videoUrl: e.target.value })}
                                            fontSize="12px"
                                            size="sm"
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            borderRadius="md"
                                          />
                                        </FormControl>
                                        <FormControl>
                                          <FormLabel fontSize="12px" mb={1} color="#2D3E5E" fontWeight="semibold">
                                            Duration
                                          </FormLabel>
                                          <Input
                                            value={video.duration}
                                            onChange={(e) => handleSaveVideoContent(module.id, video.id, { duration: e.target.value })}
                                            fontSize="12px"
                                            size="sm"
                                            placeholder="e.g., 10:30"
                                            borderRadius="md"
                                          />
                                        </FormControl>
                                        <Flex justify="space-between" align="center">
                                          <HStack>
                                            <Switch
                                              size="sm"
                                              isChecked={video.hasAudio}
                                              onChange={(e) => handleSaveVideoContent(module.id, video.id, { hasAudio: e.target.checked })}
                                              colorScheme="green"
                                              sx={{
                                                '& .chakra-switch__track[data-checked]': {
                                                  backgroundColor: '#2CA58D',
                                                },
                                              }}
                                            />
                                            <Icon as={video.hasAudio ? FiVolume2 : FiVolumeX} boxSize={4} />
                                            <Text fontSize="11px" color="#2D3E5E" fontWeight="semibold">
                                              Audio Support
                                            </Text>
                                          </HStack>
                                          <Badge colorScheme="gray" fontSize="10px">
                                            Video {videoIndex + 1}
                                          </Badge>
                                        </Flex>
                                      </VStack>
                                     
                                      <VStack spacing={2}>
                                        {module.videos.length > 1 && (
                                          <Tooltip label="Delete Video">
                                            <IconButton
                                              aria-label="Delete video"
                                              icon={<Icon as={FiTrash2} />}
                                              size="xs"
                                              colorScheme="red"
                                              onClick={() => handleDeleteVideo(module.id, video.id)}
                                            />
                                          </Tooltip>
                                        )}
                                      </VStack>
                                    </Grid>
                                  </CardBody>
                                </Card>
                              ))}
                            </SimpleGrid>
                          </Box>

                          <Divider />

                          {/* Quiz Section Placeholder */}
                          <Box>
                            <Flex justify="space-between" align="center" p={4} bg="gray.50" borderRadius="md">
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="semibold" fontSize="13px" color="#2D3E5E">
                                  Module Quiz
                                </Text>
                                <Text fontSize="11px" color="gray.600">
                                  Test knowledge after completing this module
                                </Text>
                              </VStack>
                              <Button size="sm" variant="outline" disabled fontSize="13px">
                                Coming Soon
                              </Button>
                            </Flex>
                          </Box>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Delete Video Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="#2D3E5E">
              Delete Video
            </AlertDialogHeader>

            <AlertDialogBody fontSize="13px" color="gray.600">
              Are you sure you want to delete this video? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onDeleteClose}
                fontSize="13px"
                borderRadius="md"
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDeleteVideo}
                ml={3}
                fontSize="13px"
                borderRadius="md"
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

export default ContentManagement;