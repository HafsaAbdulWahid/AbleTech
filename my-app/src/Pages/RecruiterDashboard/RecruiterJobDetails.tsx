import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Divider,
  Wrap,
  WrapItem,
  Grid,
  Icon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import { FiMapPin, FiClock, FiCalendar, FiDollarSign, FiUsers, FiBriefcase, FiArrowLeft} from 'react-icons/fi';
import { MdAttachMoney, MdCategory, MdLocationOn, MdSchool, MdWork } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface JobListing {
  id: number;
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
  status: string;
  datePosted: string;
  applications: number;
}

const RecruiterJobDetails = () => {
  const navigate = useNavigate();
  const { department, jobId } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [jobDetails, setJobDetails] = useState<JobListing | null>(null);
  const [editForm, setEditForm] = useState<JobListing | null>(null);
  const [requirementsInput, setRequirementsInput] = useState('');

  useEffect(() => {
    const savedJobs = localStorage.getItem('jobListings');
    if (savedJobs) {
      const jobs: JobListing[] = JSON.parse(savedJobs);
      const job = jobs.find(j => j.id === parseInt(jobId || '0') && j.department === department);
      setJobDetails(job || null);
      if (job) {
        setEditForm({ ...job });
        setRequirementsInput(job.requirements.join(', '));
      }
    }
  }, [jobId, department]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Draft': return 'yellow';
      case 'Closed': return 'red';
      default: return 'gray';
    }
  };

  const handleSaveEdit = () => {
    if (!editForm) return;

    const savedJobs = localStorage.getItem('jobListings');
    if (savedJobs) {
      const jobs: JobListing[] = JSON.parse(savedJobs);
      const updatedJobs = jobs.map(job => {
        if (job.id === editForm.id && job.department === editForm.department) {
          return {
            ...editForm,
            requirements: requirementsInput.split(',').map(req => req.trim()).filter(req => req.length > 0)
          };
        }
        return job;
      });
      
      localStorage.setItem('jobListings', JSON.stringify(updatedJobs));
      
      const updatedJob = updatedJobs.find(j => j.id === editForm.id && j.department === editForm.department);
      setJobDetails(updatedJob || null);
      
      toast({
        title: 'Job Updated',
        description: 'Job details have been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    }
  };

  const handleInputChange = (field: keyof JobListing, value: string | number) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [field]: value
      });
    }
  };

  if (!jobDetails) {
    return (
      <Box>
        <SideNav activeNav="Job Listings" />
        <TopNav />
        <Box px={6} ml="100px" mt={8}>
          <Box p={8} bg="white" borderRadius="3xl" boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)">
            <Text fontSize="lg" color="gray.500" mb={4} textAlign="center">
              Job not found
            </Text>
            <Flex justify="center">
              <Button 
                bg="#2CA58D"
                color="white"
                _hover={{ bg: "#238A75" }}
                onClick={() => navigate('/job-listings')}
              >
                Back to Job Listings
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <SideNav activeNav="Job Listings" />
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
            <Box bg="#2CA58D" borderRadius="xl" p={5} mb={6}>
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontSize="xl" color="white" fontWeight="bold">Job Details</Text>
                  <Text fontSize="sm" color="white" opacity="0.9" mt={1}>
                    {jobDetails.department} Department
                  </Text>
                </Box>
                
                <Button
                   leftIcon={<Icon as={FiArrowLeft} />}
                    onClick={() => navigate(`/department-jobs/${department}`)}
                    variant="outline"
                    size="sm"
                    color="white"
                    borderColor="white"
                    _hover={{ bg: "whiteAlpha.200" }}
                     >
                    Back to {jobDetails.department} Jobs
                  </Button>
              </Flex>
            </Box>

            <Grid templateColumns="2fr 400px" gap={8} alignItems="start">
              <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={2}>
                  {jobDetails.title}
                </Text>

                <VStack spacing={4} align="stretch" mb={6}>
                  <HStack spacing={8} fontSize="sm" color="gray.600">
                    <Text>Date Posted: {new Date(jobDetails.datePosted).toLocaleDateString()}</Text>
                    <HStack><Icon as={FiMapPin} /><Text>{jobDetails.location}</Text></HStack>
                    <HStack><Icon as={FiBriefcase} /><Text>{jobDetails.type}</Text></HStack>
                  </HStack>

                  <HStack spacing={8} fontSize="sm" color="gray.600">
                    <HStack><Icon as={FiUsers} /><Text>{jobDetails.experience}</Text></HStack>
                    <Badge colorScheme={getStatusColor(jobDetails.status)} borderRadius="lg">
                      {jobDetails.status}
                    </Badge>
                    <HStack><Icon as={FiCalendar} /><Text>Deadline: {new Date(jobDetails.deadline).toLocaleDateString()}</Text></HStack>
                  </HStack>
                </VStack>

                <Divider mb={6} />

                <Box mb={6}>
                  <Text fontWeight="semibold" mb={3} fontSize="lg">Job Description</Text>
                  <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                    {jobDetails.description}
                  </Text>
                </Box>

                {jobDetails.requirements.length > 0 && (
                  <Box mb={6}>
                    <Text fontWeight="semibold" mb={3} fontSize="lg">Skills Required</Text>
                    <Wrap spacing={2}>
                      {jobDetails.requirements.map((skill, index) => (
                        <WrapItem key={index}>
                          <Badge colorScheme="teal" p={2} borderRadius="lg" fontSize="xs">
                            {skill}
                          </Badge>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                )}

                <Box mb={8}>
                  <Text fontWeight="semibold" mb={2} fontSize="lg">Salary Range</Text>
                  <Text fontSize="md" color="gray.700">
                    ${jobDetails.salaryMin ? parseInt(jobDetails.salaryMin).toLocaleString() : 'TBD'} - 
                    ${jobDetails.salaryMax ? parseInt(jobDetails.salaryMax).toLocaleString() : 'TBD'}
                  </Text>
                </Box>

                <HStack spacing={4}>
                  <Button 
                    bg="#2CA58D" 
                    color="white" 
                    _hover={{ bg: "#238A75" }}
                    onClick={onOpen}
                  >
                    Edit Job
                  </Button>
                  <Button 
                    variant="outline" 
                    borderColor="#2CA58D" 
                    color="#2CA58D"
                    _hover={{ bg: "#2CA58D", color: "white" }}
                    onClick={() => navigate('/view-applications')}
                  >
                    View Applications ({jobDetails.applications})
                  </Button>
                </HStack>
              </Box>

              <Box
                position="sticky"
                top="20px"
                border="1px solid #e1e1e1"
                borderRadius="xl"
                padding="25px"
                backgroundColor="#ebf5f4"
                height="fit-content"
              >
                <Text fontSize="xl" fontWeight="bold" marginBottom="20px" color="#2CA58D">
                  Job Overview
                </Text>

                <VStack spacing={4} align="stretch">
                  <Flex align="center">
                    <Icon as={MdWork} boxSize={5} color="#2CA58D" marginRight="12px" />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.700">Job Title</Text>
                      <Text fontSize="sm" color="gray.600">{jobDetails.title}</Text>
                    </Box>
                  </Flex>

                  <Flex align="center">
                    <Icon as={MdWork} boxSize={5} color="#2CA58D" marginRight="12px" />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.700">Job Type</Text>
                      <Text fontSize="sm" color="gray.600">{jobDetails.type}</Text>
                    </Box>
                  </Flex>

                  <Flex align="center">
                    <Icon as={MdCategory} boxSize={5} color="#2CA58D" marginRight="12px" />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.700">Category</Text>
                      <Text fontSize="sm" color="gray.600">{jobDetails.department}</Text>
                    </Box>
                  </Flex>

                  <Flex align="center">
                    <Icon as={MdLocationOn} boxSize={5} color="#2CA58D" marginRight="12px" />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.700">Location</Text>
                      <Text fontSize="sm" color="gray.600">{jobDetails.location}</Text>
                    </Box>
                  </Flex>

                  <Flex align="center">
                    <Icon as={MdSchool} boxSize={5} color="#2CA58D" marginRight="12px" />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.700">Experience</Text>
                      <Text fontSize="sm" color="gray.600">{jobDetails.experience}</Text>
                    </Box>
                  </Flex>

                  <Flex align="center">
                    <Icon as={MdAttachMoney} boxSize={5} color="#2CA58D" marginRight="12px" />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.700">Salary Range</Text>
                      <Text fontSize="sm" color="gray.600">
                        ${jobDetails.salaryMin ? parseInt(jobDetails.salaryMin).toLocaleString() : 'TBD'} - 
                        ${jobDetails.salaryMax ? parseInt(jobDetails.salaryMax).toLocaleString() : 'TBD'}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex align="center">
                    <Icon as={FiUsers} boxSize={5} color="#2CA58D" marginRight="12px" />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.700">Applications</Text>
                      <Text fontSize="sm" color="gray.600">{jobDetails.applications}</Text>
                    </Box>
                  </Flex>

                  <Flex align="center">
                    <Icon as={FiCalendar} boxSize={5} color="#2CA58D" marginRight="12px" />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.700">Deadline</Text>
                      <Text fontSize="sm" color="gray.600">{new Date(jobDetails.deadline).toLocaleDateString()}</Text>
                    </Box>
                  </Flex>
                </VStack>
              </Box>
            </Grid>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Edit Job Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {editForm && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Job Title</FormLabel>
                  <Input
                    value={editForm.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Department</FormLabel>
                  <Select
                    value={editForm.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  >
                    <option value="Design">Design</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="People">People</option>
                    <option value="Sales">Sales</option>
                    <option value="University">University</option>
                  </Select>
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={editForm.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Job Type</FormLabel>
                    <Select
                      value={editForm.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </Select>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Requirements (comma-separated)</FormLabel>
                  <Textarea
                    value={requirementsInput}
                    onChange={(e) => setRequirementsInput(e.target.value)}
                    placeholder="React, JavaScript, Node.js, etc."
                    rows={3}
                  />
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Min Salary</FormLabel>
                    <Input
                      type="number"
                      value={editForm.salaryMin}
                      onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Max Salary</FormLabel>
                    <Input
                      type="number"
                      value={editForm.salaryMax}
                      onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                    />
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Experience Level</FormLabel>
                    <Select
                      value={editForm.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                    >
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                      <option value="Executive">Executive</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={editForm.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Closed">Closed</option>
                    </Select>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Application Deadline</FormLabel>
                  <Input
                    type="date"
                    value={editForm.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                  />
                </FormControl>

                <HStack justify="flex-end" w="full" pt={4}>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    bg="#2CA58D" 
                    color="white" 
                    _hover={{ bg: "#238A75" }}
                    onClick={handleSaveEdit}
                  >
                    Save Changes
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RecruiterJobDetails;