import React, { useState } from 'react';
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Spinner,
  Checkbox,
  Stack,
  FormHelperText,
  Badge,
} from '@chakra-ui/react';
import {
  AiOutlinePlus,
  AiOutlineDelete,
  AiOutlineInfoCircle,
} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';
import { createJobNotification } from '../utils/notificationUtils';

interface JobFormData {
  id?: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salaryMin: string;
  salaryMax: string;
  experience: string;
  deadline: string;
  disability: string[];
  applications?: number;
  status?: string;
  datePosted?: string;
}

interface PostJobListingsProps {
  editingJob?: JobFormData;
  isEditing?: boolean;
}

const PostJob: React.FC<PostJobListingsProps> = ({ editingJob, isEditing = false }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<JobFormData>(editingJob || {
    title: '',
    department: '',
    location: '',
    type: '',
    description: '',
    requirements: [],
    salaryMin: '',
    salaryMax: '',
    experience: '',
    deadline: '',
    disability: [],
  });
  
  const [currentRequirement, setCurrentRequirement] = useState('');

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    if (currentRequirement.trim() && !formData.requirements.includes(currentRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()]
      }));
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== requirement)
    }));
  };

  const handleDisabilityChange = (disability: string) => {
    setFormData(prev => {
      const isSelected = prev.disability.includes(disability);
      return {
        ...prev,
        disability: isSelected
          ? prev.disability.filter(d => d !== disability)
          : [...prev.disability, disability]
      };
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      type: '',
      description: '',
      requirements: [],
      salaryMin: '',
      salaryMax: '',
      experience: '',
      deadline: '',
      disability: [],
    });
    setCurrentRequirement('');
  };

  const handleDelete = async () => {
    if (!formData.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/jobs/${formData.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete job');
      }

      toast({
        title: 'Job Deleted Successfully',
        description: data.message,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });

      onClose();
      
      setTimeout(() => {
        navigate('/job-listings', { replace: true });
        window.location.href = '/job-listings';
      }, 1500);

    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error Deleting Job',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    const requiredFields: (keyof JobFormData)[] = ['title', 'department', 'location', 'type', 'description', 'experience', 'deadline'];
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

    setIsLoading(true);

    try {
      const jobData = {
        title: formData.title.trim(),
        department: formData.department.trim(),
        location: formData.location.trim(),
        type: formData.type,
        description: formData.description.trim(),
        requirements: formData.requirements,
        salaryMin: formData.salaryMin || undefined,
        salaryMax: formData.salaryMax || undefined,
        experience: formData.experience,
        deadline: formData.deadline,
        disability: formData.disability.length > 0 ? formData.disability : undefined,
        status: status === 'published' ? 'Active' : 'Draft',
      };

      console.log('Submitting job data:', jobData);

      const url = isEditing && formData.id 
        ? `http://localhost:3001/api/jobs/${formData.id}`
        : 'http://localhost:3001/api/jobs';
      
      const method = isEditing && formData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',  
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      console.log('API response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'create'} job`);
      }

      toast({
        title: `Job ${isEditing ? 'Updated' : (status === 'published' ? 'Published' : 'Saved as Draft')} Successfully`,
        description: data.message,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });

      if (!isEditing) {
        resetForm();
      }
      
      // Wait longer to ensure database writes complete, then force refresh
      setTimeout(() => {
        navigate('/job-listings', { replace: true });
        // Force a hard reload to get fresh data from the server
        window.location.href = '/job-listings';
      }, 2000);

    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: `Error ${isEditing ? 'Updating' : 'Creating'} Job`,
       description: error instanceof Error ? error.message : 'An unexpected error occurred',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="#f7fafc" minH="100vh">
      <SideNav activeNav="Post Job Listings" />
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
                    {isEditing ? 'Edit Job Listing' : 'Create New Job Listing'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {isEditing ? 'Update job details and requirements' : 'Fill in the details below to post a new position'}
                  </Text>
                </Box>
                {isEditing && formData.id && (
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    leftIcon={<Icon as={AiOutlineDelete} />}
                    onClick={onOpen}
                    isDisabled={isLoading}
                  >
                    Delete Job
                  </Button>
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
                            Job Title
                          </FormLabel>
                          <Input
                            placeholder="e.g., Senior Software Engineer"
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
                            Department
                          </FormLabel>
                          <Input
                            placeholder="e.g., Engineering, Marketing"
                            value={formData.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
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
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                            Location
                          </FormLabel>
                          <Input
                            placeholder="e.g., Karachi"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
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
                            Employment Type
                          </FormLabel>
                          <Select
                            placeholder="Select type"
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
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
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                            Experience Level
                          </FormLabel>
                          <Select
                            placeholder="Select level"
                            value={formData.experience}
                            onChange={(e) => handleInputChange('experience', e.target.value)}
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
                            <option value="Entry Level">Entry Level (0-2 years)</option>
                            <option value="Mid Level">Mid Level (2-5 years)</option>
                            <option value="Senior Level">Senior Level (5+ years)</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                          Application Deadline
                        </FormLabel>
                        <Input
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => handleInputChange('deadline', e.target.value)}
                          borderRadius="lg"
                          fontSize="sm"
                          h="40px"
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300", bg: "white" }}
                          _focus={{ borderColor: "#2CA58D", bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                          isDisabled={isLoading}
                          max="2099-12-31"
                        />
                        <FormHelperText fontSize="xs" color="gray.500">
                          Set the last date for accepting applications
                        </FormHelperText>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                          Job Description
                        </FormLabel>
                        <Textarea
                          placeholder="Provide a detailed description of the role, responsibilities, and what the candidate will be doing..."
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
                          Be clear and concise about the position
                        </FormHelperText>
                      </FormControl>
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Compensation Section */}
                  <Box>
                    <HStack mb={4} spacing={2}>
                      <Box h="7px" w="7px" bg="#2CA58D" borderRadius="full" />
                      <Text fontSize="md" fontWeight="bold" color="#1e2738">
                        Compensation
                      </Text>
                      <Badge colorScheme="gray" fontSize="xs">Optional</Badge>
                    </HStack>
                    
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={1.5}>
                        Annual Salary (PKR)
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder="e.g., PKR 120000"
                        value={formData.salaryMin}
                        onChange={(e) => handleInputChange('salaryMin', e.target.value)}
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
                      <FormHelperText fontSize="xs" color="gray.500">
                        <HStack spacing={1}>
                          <Icon as={AiOutlineInfoCircle} boxSize={3} />
                          <Text>Leaving this blank will show "Competitive salary" to applicants</Text>
                        </HStack>
                      </FormHelperText>
                    </FormControl>
                  </Box>

                  <Divider />

                  {/* Requirements Section */}
                  <Box>
                    <HStack mb={4} spacing={2}>
                      <Box h="7px" w="7px" bg="#2CA58D" borderRadius="full" />
                      <Text fontSize="md" fontWeight="bold" color="#1e2738">
                        Requirements & Skills
                      </Text>
                    </HStack>
                    
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Input
                          value={currentRequirement}
                          onChange={(e) => setCurrentRequirement(e.target.value)}
                          placeholder="e.g., 3+ years of React experience"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addRequirement();
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
                          onClick={addRequirement}
                          bg="#2CA58D"
                          color="white"
                          isDisabled={!currentRequirement.trim() || isLoading}
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
                      
                      {formData.requirements.length > 0 && (
                        <Box
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                          border="1px"
                          borderColor="gray.200"
                        >
                          <Text fontSize="sm" fontWeight="600" color="#1e2738" mb={2}>
                            Added Requirements ({formData.requirements.length})
                          </Text>
                          <Wrap spacing={2}>
                            {formData.requirements.map((requirement, index) => (
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
                                  <TagLabel fontSize="sm">{requirement}</TagLabel>
                                  <TagCloseButton 
                                    onClick={() => removeRequirement(requirement)}
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
                        Accessibility & Inclusion
                      </Text>
                      <Badge colorScheme="gray" fontSize="xs">Optional</Badge>
                    </HStack>
                    
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600" color="#1e2738" mb={2}>
                        Disability Support
                      </FormLabel>
                      <Text fontSize="xs" color="gray.600" mb={3}>
                        Select all types of disabilities this position can accommodate
                      </Text>
                      <Stack 
                        spacing={2.5} 
                        p={3}
                        bg="gray.50"
                        borderRadius="lg"
                        border="1px"
                        borderColor="gray.200"
                      >
                        <Checkbox
                          isChecked={formData.disability.includes("Vision impairment")}
                          onChange={() => handleDisabilityChange("Vision impairment")}
                          isDisabled={isLoading}
                          colorScheme="teal"
                          size="sm"
                        >
                          <Text fontSize="sm" fontWeight="500">Vision impairment</Text>
                        </Checkbox>
                        <Checkbox
                          isChecked={formData.disability.includes("Hearing impairment")}
                          onChange={() => handleDisabilityChange("Hearing impairment")}
                          isDisabled={isLoading}
                          colorScheme="teal"
                          size="sm"
                        >
                          <Text fontSize="sm" fontWeight="500">Hearing impairment</Text>
                        </Checkbox>
                        <Checkbox
                          isChecked={formData.disability.includes("Physical/Mobility impairment")}
                          onChange={() => handleDisabilityChange("Physical/Mobility impairment")}
                          isDisabled={isLoading}
                          colorScheme="teal"
                          size="sm"
                        >
                          <Text fontSize="sm" fontWeight="500">Physical/Mobility impairment</Text>
                        </Checkbox>
                        <Checkbox
                          isChecked={formData.disability.includes("Speech/Communication impairment")}
                          onChange={() => handleDisabilityChange("Speech/Communication impairment")}
                          isDisabled={isLoading}
                          colorScheme="teal"
                          size="sm"
                        >
                          <Text fontSize="sm" fontWeight="500">Speech/Communication impairment</Text>
                        </Checkbox>
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
                      onClick={() => handleSubmit('published')}
                      rightIcon={isLoading ? <Spinner size="sm" /> : <Icon as={AiOutlinePlus} />}
                      _hover={{ bg: "#259a7d", transform: 'translateY(-2px)', boxShadow: 'lg' }}
                      transition="all 0.2s"
                      fontSize="sm"
                      h="40px"
                      borderRadius="lg"
                      isLoading={isLoading}
                      loadingText="Saving..."
                      fontWeight="600"
                    >
                      {isEditing ? 'Update Job Listing' : 'Publish Job Listing'}
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(4px)">
          <AlertDialogContent borderRadius="xl" mx={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" pb={2}>
              Delete Job Listing
            </AlertDialogHeader>

            <AlertDialogBody color="gray.600" fontSize="md">
              Are you sure you want to delete this job listing? This action cannot be undone and all associated data will be permanently removed.
            </AlertDialogBody>

            <AlertDialogFooter pt={6}>
              <Button 
                ref={cancelRef} 
                onClick={onClose} 
                isDisabled={isLoading}
                variant="ghost"
                size="md"
                borderRadius="lg"
              >
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDelete} 
                ml={3}
                isLoading={isLoading}
                loadingText="Deleting..."
                size="md"
                borderRadius="lg"
                fontWeight="600"
              >
                Delete Permanently
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default PostJob;