import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  SimpleGrid,
  Icon,
  Spinner,
  Stack,
  FormHelperText,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import {
  AiOutlinePlus,
  AiOutlineInfoCircle,
} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface TrainingFormData {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  totalModules: number;
  trainerName: string;
  objectives: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  targetAudience: string;
  language: string;
  certification: boolean;
  accessibilityFeatures: string[];
}

const CreateTrainingProgram: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProgramId, setEditProgramId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<TrainingFormData>({
    title: '',
    description: '',
    category: '',
    level: '',
    duration: '',
    totalModules: 1,
    trainerName: '',
    objectives: [],
    prerequisites: [],
    learningOutcomes: [],
    targetAudience: '',
    language: 'English',
    certification: false,
    accessibilityFeatures: [],
  });
  
  const [currentObjective, setCurrentObjective] = useState('');
  const [currentPrerequisite, setCurrentPrerequisite] = useState('');
  const [currentOutcome, setCurrentOutcome] = useState('');

  // Load program data if in edit mode
  useEffect(() => {
    const programId = localStorage.getItem('editProgramId');
    const programDataStr = localStorage.getItem('editProgramData');
    
    if (programId && programDataStr) {
      try {
        const programData = JSON.parse(programDataStr);
        console.log('Loading program data for edit:', programData);
        
        setIsEditMode(true);
        setEditProgramId(programId);
        
        // Helper function to safely split strings
        const safeSplit = (value: any): string[] => {
          if (!value) return [];
          if (typeof value === 'string') {
            return value.split('|').map(item => item.trim()).filter(item => item.length > 0);
          }
          if (Array.isArray(value)) {
            return value.filter(item => item && typeof item === 'string' && item.trim().length > 0);
          }
          return [];
        };
        
        setFormData({
          title: programData.title || '',
          description: programData.description || '',
          category: programData.category || '',
          level: programData.level || '',
          duration: programData.duration || '',
          totalModules: programData.totalModules || 1,
          trainerName: programData.trainer || '',
          objectives: safeSplit(programData.objectives),
          prerequisites: safeSplit(programData.prerequisites),
          learningOutcomes: safeSplit(programData.learningOutcomes),
          targetAudience: programData.targetAudience || '',
          language: programData.language || 'English',
          certification: programData.certification || false,
          accessibilityFeatures: safeSplit(programData.accessibilityFeatures),
        });
        
        console.log('Form data loaded successfully');
        
        // Clear localStorage after loading
        localStorage.removeItem('editProgramId');
        localStorage.removeItem('editProgramData');
      } catch (error) {
        console.error('Error loading program data:', error);
        toast({
          title: 'Error Loading Program',
          description: error instanceof Error ? error.message : 'Could not load program data for editing.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [toast]);

  const handleInputChange = (field: keyof TrainingFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addObjective = () => {
    if (currentObjective.trim() && !formData.objectives.includes(currentObjective.trim())) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, currentObjective.trim()]
      }));
      setCurrentObjective('');
    }
  };

  const removeObjective = (objective: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj !== objective)
    }));
  };

  const addPrerequisite = () => {
    if (currentPrerequisite.trim() && !formData.prerequisites.includes(currentPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, currentPrerequisite.trim()]
      }));
      setCurrentPrerequisite('');
    }
  };

  const removePrerequisite = (prerequisite: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(pre => pre !== prerequisite)
    }));
  };

  const addOutcome = () => {
    if (currentOutcome.trim() && !formData.learningOutcomes.includes(currentOutcome.trim())) {
      setFormData(prev => ({
        ...prev,
        learningOutcomes: [...prev.learningOutcomes, currentOutcome.trim()]
      }));
      setCurrentOutcome('');
    }
  };

  const removeOutcome = (outcome: string) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter(out => out !== outcome)
    }));
  };

  const handleAccessibilityChange = (feature: string) => {
    setFormData(prev => {
      const isSelected = prev.accessibilityFeatures.includes(feature);
      return {
        ...prev,
        accessibilityFeatures: isSelected
          ? prev.accessibilityFeatures.filter(f => f !== feature)
          : [...prev.accessibilityFeatures, feature]
      };
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      level: '',
      duration: '',
      totalModules: 1,
      trainerName: '',
      objectives: [],
      prerequisites: [],
      learningOutcomes: [],
      targetAudience: '',
      language: 'English',
      certification: false,
      accessibilityFeatures: [],
    });
    setCurrentObjective('');
    setCurrentPrerequisite('');
    setCurrentOutcome('');
    setIsEditMode(false);
    setEditProgramId(null);
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof TrainingFormData)[] = [
      'title', 
      'description', 
      'category', 
      'level', 
      'duration', 
      'trainerName',
      'targetAudience'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in all required fields marked with *',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    if (formData.objectives.length === 0) {
      toast({
        title: 'Add Training Objectives',
        description: 'Please add at least one training objective',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    setIsLoading(true);

    try {
      const programData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        trainer: formData.trainerName.trim(),
        category: formData.category,
        level: formData.level,
        duration: formData.duration,
        totalModules: formData.totalModules,
        objectives: formData.objectives.join('|'),
        prerequisites: formData.prerequisites.length > 0 ? formData.prerequisites.join('|') : undefined,
        learningOutcomes: formData.learningOutcomes.length > 0 ? formData.learningOutcomes.join('|') : undefined,
        targetAudience: formData.targetAudience,
        language: formData.language,
        certification: formData.certification,
        accessibilityFeatures: formData.accessibilityFeatures.length > 0 ? formData.accessibilityFeatures.join('|') : undefined,
        isPublished: true,
        status: 'Active',
      };

      console.log('Submitting training program data:', programData);

      const url = isEditMode && editProgramId
        ? `http://localhost:3001/api/trainers/training-programs/${editProgramId}`
        : 'http://localhost:3001/api/trainers/training-programs';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
      });

      const data = await response.json();

      console.log('API response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${isEditMode ? 'update' : 'create'} training program`);
      }

      toast({
        title: isEditMode ? 'Training Program Updated Successfully!' : 'Training Program Created Successfully!',
        description: isEditMode 
          ? 'Your training program has been updated.' 
          : 'Your training program is now live and visible to all users.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      resetForm();
      
      setTimeout(() => {
        navigate('/training-programs', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: `Error ${isEditMode ? 'Updating' : 'Creating'} Training Program`,
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="#f7fafc" minH="100vh">
      <SideNav activeNav="Create Program" />
      <Box>
        <TopNav />
        <Box px={8} ml="100px" mt={6} pb={6} minH="calc(100vh - 64px)">
          <Box maxW="1400px" mx="auto">
            {/* Header Section */}
            <Box
              bg="white"
              borderRadius="xl"
              p={5}
              mb={5}
              boxShadow="sm"
              borderLeft="4px solid"
              borderColor="#2CA58D"
            >
              <HStack justifyContent="space-between" alignItems="center">
                <Box>
                  <Text fontSize="2xl" color="#1e2738" fontWeight="bold" mb={1}>
                    {isEditMode ? 'Edit Training Program' : 'Create New Training Program'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {isEditMode 
                      ? 'Update the details of your training program' 
                      : 'Fill in the details below to launch a comprehensive training program'}
                  </Text>
                </Box>
                {isEditMode && (
                  <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
                    Edit Mode
                  </Badge>
                )}
              </HStack>
            </Box>

            {/* Form Section */}
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
              overflow="hidden"
            >
              <Box p={6}>
                <VStack spacing={8} align="stretch">
                  {/* Basic Information Section */}
                  <Box>
                    <HStack mb={4} spacing={2}>
                      <Box h="7px" w="7px" bg="#2CA58D" borderRadius="full" />
                      <Text fontSize="md" fontWeight="bold" color="#1e2738">
                        Basic Information
                      </Text>
                      <Badge colorScheme="red" fontSize="xs">Required</Badge>
                    </HStack>
                    
                    <VStack spacing={5} align="stretch">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                            Program Title
                          </FormLabel>
                          <Input
                            placeholder="e.g., Advanced Web Development Bootcamp"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            borderRadius="lg"
                            fontSize="sm"
                            h="40px"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                            _hover={{ borderColor: "gray.300", bg: "white" }}
                            _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                            isDisabled={isLoading}
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                            Category
                          </FormLabel>
                          <Select
                            placeholder="Select category"
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            fontSize="sm"
                            h="40px"
                            borderRadius="lg"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                            _hover={{ borderColor: "gray.300", bg: "white" }}
                            _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                            isDisabled={isLoading}
                          >
                            <option value="Technology">Technology</option>
                            <option value="Business">Business</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="Health & Wellness">Health & Wellness</option>
                            <option value="Communication">Communication</option>
                            <option value="Leadership">Leadership</option>
                            <option value="Other">Other</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                            Trainer Name
                          </FormLabel>
                          <Input
                            placeholder="e.g., John Doe"
                            value={formData.trainerName}
                            onChange={(e) => handleInputChange('trainerName', e.target.value)}
                            borderRadius="lg"
                            fontSize="sm"
                            h="40px"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                            _hover={{ borderColor: "gray.300", bg: "white" }}
                            _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                            isDisabled={isLoading}
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                            Difficulty Level
                          </FormLabel>
                          <Select
                            placeholder="Select level"
                            value={formData.level}
                            onChange={(e) => handleInputChange('level', e.target.value)}
                            fontSize="sm"
                            h="40px"
                            borderRadius="lg"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                            _hover={{ borderColor: "gray.300", bg: "white" }}
                            _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                            isDisabled={isLoading}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="All Levels">All Levels</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                            Duration
                          </FormLabel>
                          <Select
                            placeholder="Select duration"
                            value={formData.duration}
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                            fontSize="sm"
                            h="40px"
                            borderRadius="lg"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                            _hover={{ borderColor: "gray.300", bg: "white" }}
                            _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                            isDisabled={isLoading}
                          >
                            <option value="1 week">1 week</option>
                            <option value="2 weeks">2 weeks</option>
                            <option value="3 weeks">3 weeks</option>
                            <option value="4 weeks">4 weeks (1 month)</option>
                            <option value="6 weeks">6 weeks</option>
                            <option value="8 weeks">8 weeks (2 months)</option>
                            <option value="12 weeks">12 weeks (3 months)</option>
                            <option value="6 months">6 months</option>
                            <option value="1 year">1 year</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                            Total Modules
                          </FormLabel>
                          <NumberInput
                            min={1}
                            max={100}
                            value={formData.totalModules}
                            onChange={(valueString) =>
                              handleInputChange('totalModules', parseInt(valueString) || 1)
                            }
                            isDisabled={isLoading}
                          >
                            <NumberInputField 
                              fontSize="sm" 
                              borderRadius="lg"
                              h="40px"
                              bg="gray.50"
                              border="1px"
                              borderColor="gray.200"
                              _hover={{ borderColor: "gray.300", bg: "white" }}
                              _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                            />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                            Language
                          </FormLabel>
                          <Select
                            value={formData.language}
                            onChange={(e) => handleInputChange('language', e.target.value)}
                            fontSize="sm"
                            h="40px"
                            borderRadius="lg"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                            _hover={{ borderColor: "gray.300", bg: "white" }}
                            _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                            isDisabled={isLoading}
                          >
                            <option value="English">English</option>
                            <option value="Urdu">Urdu</option>
                            <option value="Both">Both (English & Urdu)</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                          Target Audience
                        </FormLabel>
                        <Input
                          placeholder="e.g., Working Professionals, Students, Beginners"
                          value={formData.targetAudience}
                          onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                          borderRadius="lg"
                          fontSize="sm"
                          h="40px"
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300", bg: "white" }}
                          _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                          isDisabled={isLoading}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                          Program Description
                        </FormLabel>
                        <Textarea
                          placeholder="Provide a detailed overview of what this training program covers, the skills participants will gain, and the benefits..."
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={5}
                          resize="vertical"
                          fontSize="sm"
                          borderRadius="lg"
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300", bg: "white" }}
                          _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                          isDisabled={isLoading}
                        />
                        <FormHelperText fontSize="xs" color="gray.500">
                          Be clear and detailed about what participants will learn
                        </FormHelperText>
                      </FormControl>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Training Objectives Section */}
                  <Box>
                    <HStack mb={4} spacing={2}>
                      <Box h="7px" w="7px" bg="#2CA58D" borderRadius="full" />
                      <Text fontSize="md" fontWeight="bold" color="#1e2738">
                        Training Objectives
                      </Text>
                      <Badge colorScheme="red" fontSize="xs">Required</Badge>
                    </HStack>
                    
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Input
                          value={currentObjective}
                          onChange={(e) => setCurrentObjective(e.target.value)}
                          placeholder="e.g., Master advanced JavaScript concepts"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addObjective();
                            }
                          }}
                          borderRadius="lg"
                          fontSize="sm"
                          h="40px"
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300", bg: "white" }}
                          _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                          isDisabled={isLoading}
                        />
                        <Button
                          onClick={addObjective}
                          bg="#2CA58D"
                          color="white"
                          isDisabled={!currentObjective.trim() || isLoading}
                          _hover={{ bg: "#259a7d" }}
                          fontSize="sm"
                          h="40px"
                          px={6}
                          borderRadius="lg"
                          leftIcon={<Icon as={AiOutlinePlus} />}
                        >
                          Add
                        </Button>
                      </HStack>
                      
                      {formData.objectives.length > 0 && (
                        <Box
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                          border="1px"
                          borderColor="gray.200"
                        >
                          <Text fontSize="sm" fontWeight="600" color="#1e2738" mb={2}>
                            Training Objectives ({formData.objectives.length})
                          </Text>
                          <Wrap spacing={2}>
                            {formData.objectives.map((objective, index) => (
                              <WrapItem key={index}>
                                <Tag
                                  size="md"
                                  bg="white"
                                  color="#1e2738"
                                  border="1px"
                                  borderColor="gray.200"
                                  borderRadius="lg"
                                  py={1.5}
                                  px={2.5}
                                >
                                  <TagLabel fontSize="sm">{objective}</TagLabel>
                                  <TagCloseButton 
                                    onClick={() => removeObjective(objective)}
                                    isDisabled={isLoading}
                                  />
                                </Tag>
                              </WrapItem>
                            ))}
                          </Wrap>
                        </Box>
                      )}
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Prerequisites Section */}
                  <Box>
                    <HStack mb={4} spacing={2}>
                      <Box h="7px" w="7px" bg="#2CA58D" borderRadius="full" />
                      <Text fontSize="md" fontWeight="bold" color="#1e2738">
                        Prerequisites
                      </Text>
                      <Badge colorScheme="gray" fontSize="xs">Optional</Badge>
                    </HStack>
                    
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Input
                          value={currentPrerequisite}
                          onChange={(e) => setCurrentPrerequisite(e.target.value)}
                          placeholder="e.g., Basic knowledge of HTML and CSS"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addPrerequisite();
                            }
                          }}
                          borderRadius="lg"
                          fontSize="sm"
                          h="40px"
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300", bg: "white" }}
                          _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                          isDisabled={isLoading}
                        />
                        <Button
                          onClick={addPrerequisite}
                          bg="#2CA58D"
                          color="white"
                          isDisabled={!currentPrerequisite.trim() || isLoading}
                          _hover={{ bg: "#259a7d" }}
                          fontSize="sm"
                          h="40px"
                          px={6}
                          borderRadius="lg"
                          leftIcon={<Icon as={AiOutlinePlus} />}
                        >
                          Add
                        </Button>
                      </HStack>
                      
                      {formData.prerequisites.length > 0 && (
                        <Box
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                          border="1px"
                          borderColor="gray.200"
                        >
                          <Text fontSize="sm" fontWeight="600" color="#1e2738" mb={2}>
                            Prerequisites ({formData.prerequisites.length})
                          </Text>
                          <Wrap spacing={2}>
                            {formData.prerequisites.map((prerequisite, index) => (
                              <WrapItem key={index}>
                                <Tag
                                  size="md"
                                  bg="white"
                                  color="#1e2738"
                                  border="1px"
                                  borderColor="gray.200"
                                  borderRadius="lg"
                                  py={1.5}
                                  px={2.5}
                                >
                                  <TagLabel fontSize="sm">{prerequisite}</TagLabel>
                                  <TagCloseButton 
                                    onClick={() => removePrerequisite(prerequisite)}
                                    isDisabled={isLoading}
                                  />
                                </Tag>
                              </WrapItem>
                            ))}
                          </Wrap>
                        </Box>
                      )}
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Learning Outcomes Section */}
                  <Box>
                    <HStack mb={4} spacing={2}>
                      <Box h="7px" w="7px" bg="#2CA58D" borderRadius="full" />
                      <Text fontSize="md" fontWeight="bold" color="#1e2738">
                        Learning Outcomes
                      </Text>
                      <Badge colorScheme="gray" fontSize="xs">Optional</Badge>
                    </HStack>
                    
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Input
                          value={currentOutcome}
                          onChange={(e) => setCurrentOutcome(e.target.value)}
                          placeholder="e.g., Build full-stack web applications from scratch"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addOutcome();
                            }
                          }}
                          borderRadius="lg"
                          fontSize="sm"
                          h="40px"
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300", bg: "white" }}
                          _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                          isDisabled={isLoading}
                        />
                        <Button
                          onClick={addOutcome}
                          bg="#2CA58D"
                          color="white"
                          isDisabled={!currentOutcome.trim() || isLoading}
                          _hover={{ bg: "#259a7d" }}
                          fontSize="sm"
                          h="40px"
                          px={6}
                          borderRadius="lg"
                          leftIcon={<Icon as={AiOutlinePlus} />}
                        >
                          Add
                        </Button>
                      </HStack>
                      
                      {formData.learningOutcomes.length > 0 && (
                        <Box
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                          border="1px"
                          borderColor="gray.200"
                        >
                          <Text fontSize="sm" fontWeight="600" color="#1e2738" mb={2}>
                            Learning Outcomes ({formData.learningOutcomes.length})
                          </Text>
                          <Wrap spacing={2}>
                            {formData.learningOutcomes.map((outcome, index) => (
                              <WrapItem key={index}>
                                <Tag
                                  size="md"
                                  bg="white"
                                  color="#1e2738"
                                  border="1px"
                                  borderColor="gray.200"
                                  borderRadius="lg"
                                  py={1.5}
                                  px={2.5}
                                >
                                  <TagLabel fontSize="sm">{outcome}</TagLabel>
                                  <TagCloseButton 
                                    onClick={() => removeOutcome(outcome)}
                                    isDisabled={isLoading}
                                  />
                                </Tag>
                              </WrapItem>
                            ))}
                          </Wrap>
                        </Box>
                      )}
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Accessibility Section */}
                  <Box>
                    <HStack mb={4} spacing={2}>
                      <Box h="7px" w="7px" bg="#2CA58D" borderRadius="full" />
                      <Text fontSize="md" fontWeight="bold" color="#1e2738">
                        Accessibility Features
                      </Text>
                      <Badge colorScheme="gray" fontSize="xs">Optional</Badge>
                    </HStack>
                    
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={2}>
                        Supported Accessibility Options
                      </FormLabel>
                      <Text fontSize="xs" color="gray.600" mb={3}>
                        Select features that make this training accessible to all learners
                      </Text>
                      <Stack 
                        spacing={2.5} 
                        p={3}
                        bg="gray.50"
                        borderRadius="lg"
                        border="1px"
                        borderColor="gray.200"
                      >
                        <HStack spacing={4} flexWrap="wrap">
                          <Button
                            size="sm"
                            variant={formData.accessibilityFeatures.includes("Subtitles/Captions") ? "solid" : "outline"}
                            colorScheme={formData.accessibilityFeatures.includes("Subtitles/Captions") ? "teal" : "gray"}
                            onClick={() => handleAccessibilityChange("Subtitles/Captions")}
                            isDisabled={isLoading}
                            fontSize="xs"
                          >
                            Subtitles/Captions
                          </Button>
                          <Button
                            size="sm"
                            variant={formData.accessibilityFeatures.includes("Sign Language") ? "solid" : "outline"}
                            colorScheme={formData.accessibilityFeatures.includes("Sign Language") ? "teal" : "gray"}
                            onClick={() => handleAccessibilityChange("Sign Language")}
                            isDisabled={isLoading}
                            fontSize="xs"
                          >
                            Sign Language
                          </Button>
                          <Button
                            size="sm"
                            variant={formData.accessibilityFeatures.includes("Screen Reader Compatible") ? "solid" : "outline"}
                            colorScheme={formData.accessibilityFeatures.includes("Screen Reader Compatible") ? "teal" : "gray"}
                            onClick={() => handleAccessibilityChange("Screen Reader Compatible")}
                            isDisabled={isLoading}
                            fontSize="xs"
                          >
                            Screen Reader Compatible
                          </Button>
                          <Button
                            size="sm"
                            variant={formData.accessibilityFeatures.includes("Adjustable Playback Speed") ? "solid" : "outline"}
                            colorScheme={formData.accessibilityFeatures.includes("Adjustable Playback Speed") ? "teal" : "gray"}
                            onClick={() => handleAccessibilityChange("Adjustable Playback Speed")}
                            isDisabled={isLoading}
                            fontSize="xs"
                          >
                            Adjustable Speed
                          </Button>
                          <Button
                            size="sm"
                            variant={formData.accessibilityFeatures.includes("Downloadable Materials") ? "solid" : "outline"}
                            colorScheme={formData.accessibilityFeatures.includes("Downloadable Materials") ? "teal" : "gray"}
                            onClick={() => handleAccessibilityChange("Downloadable Materials")}
                            isDisabled={isLoading}
                            fontSize="xs"
                          >
                            Downloadable Materials
                          </Button>
                        </HStack>
                      </Stack>
                    </FormControl>
                  </Box>

                  <Divider />

                  {/* Action Buttons */}
                  <HStack spacing={3} justifyContent="flex-end" pt={3}>
                    <Button
                      variant="ghost"
                      size="md"
                      px={6}
                      onClick={resetForm}
                      fontSize="sm"
                      h="40px"
                      borderRadius="lg"
                      isDisabled={isLoading}
                      color="gray.600"
                      _hover={{ bg: "gray.100" }}
                    >
                      Clear Form
                    </Button>
                    
                    <Button
                      bg="#2CA58D"
                      color="white"
                      size="md"
                      px={8}
                      onClick={handleSubmit}
                      rightIcon={isLoading ? <Spinner size="sm" /> : <Icon as={AiOutlinePlus} />}
                      _hover={{ bg: "#259a7d", transform: 'translateY(-2px)', boxShadow: 'lg' }}
                      transition="all 0.2s"
                      fontSize="sm"
                      h="40px"
                      borderRadius="lg"
                      isLoading={isLoading}
                      loadingText={isEditMode ? "Updating..." : "Creating..."}
                      fontWeight="600"
                    >
                      {isEditMode ? 'Update Training Program' : 'Launch Training Program'}
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTrainingProgram;