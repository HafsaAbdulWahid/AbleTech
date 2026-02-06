import React, { useState, useEffect } from 'react';
import {
  Box, Button, Heading, VStack, HStack, Text, Avatar, Icon, Grid, GridItem, Input, FormControl, FormLabel, Textarea, Badge, Divider, IconButton, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, Flex, Card, CardBody,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FiEdit3, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiCamera, FiLinkedin, FiGlobe, FiArrowLeft, FiBriefcase, FiFileText,
} from 'react-icons/fi';
import { LuBuilding, LuGraduationCap } from "react-icons/lu";
import SideNav from './SideNav';
import TopNav from './TopNav';
import axios from 'axios';

// Interface matching the form data structures
interface UserProfileData {
  // From UserDetailsForm1
  name: string;
  age: string;
  gender: string;
  role: string;
  email: string;
  linkedin: string;
  phone?: string;
  experience?: string;
  summary?: string;

  // From UserDetailsForm2 (Education)
  instituteName: string;
  qualification: string;
  graduationYear?: string;
  cgpa?: string;
  internships: Array<{
    companyName: string;
    position: string;
    description: string;
    duration?: string;
    skills?: string;
  }>;

  // Additional profile info
  profileImage?: string;
  joinDate?: string;
}

interface ProfileProps {
  onBack?: () => void;
}

const UserProfile: React.FC<ProfileProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // User profile data matching the forms
  const [userData, setUserData] = useState<UserProfileData>({
    // Basic Details
    name: '',
    age: '',
    gender: '',
    role: '',
    email: '',
    linkedin: '',
    phone: '',
    experience: '',
    summary: '',

    // Education Details
    instituteName: '',
    qualification: '',
    graduationYear: '',
    cgpa: '',
    internships: [],

    // Additional
    profileImage: '',
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  });

  const [editData, setEditData] = useState<UserProfileData>({ ...userData });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token'); // or your auth token storage
      const response = await axios.get('/api/user-profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Failed to load profile',
        description: 'Please login again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Update user data via API
      await axios.put('/api/user-profile', editData);
      setUserData({ ...editData });
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Text>Loading profile...</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <SideNav />
      <TopNav />

      {/* Main Content */}
      <Box ml="90px" pt={0}>
        <Box p={6}>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={6}>
            {/* Left Column - Profile Summary */}
            <GridItem>
              <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100" mb={4}>
                <VStack spacing={4}>
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      name={userData.name}
                      src={userData.profileImage}
                    />
                    <IconButton
                      icon={<Icon as={FiCamera} />}
                      size="sm"
                      borderRadius="full"
                      position="absolute"
                      bottom={0}
                      right={0}
                      bg="teal.500"
                      color="white"
                      _hover={{ bg: 'teal.600' }}
                      aria-label="Change profile picture"
                    />
                  </Box>

                  <VStack spacing={1}>
                    <Heading size="md" color="gray.800">
                      {userData.name}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">{userData.role}</Text>
                    <HStack>
                      <Badge colorScheme="blue" fontSize="xs">
                        {userData.experience || 'Entry Level'}
                      </Badge>
                      <Badge colorScheme="green" fontSize="xs">
                        Age {userData.age}
                      </Badge>
                    </HStack>
                  </VStack>

                  <Divider />

                  <VStack spacing={3} align="stretch" w="full">
                    <HStack>
                      <Icon as={FiMail} color="gray.500" />
                      <Text fontSize="sm" color="gray.700">{userData.email}</Text>
                    </HStack>
                    {userData.phone && (
                      <HStack>
                        <Icon as={FiPhone} color="gray.500" />
                        <Text fontSize="sm" color="gray.700">{userData.phone}</Text>
                      </HStack>
                    )}
                    <HStack>
                      <Icon as={FiUser} color="gray.500" />
                      <Text fontSize="sm" color="gray.700">{userData.gender}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiCalendar} color="gray.500" />
                      <Text fontSize="sm" color="gray.700">Joined {userData.joinDate}</Text>
                    </HStack>
                    {userData.linkedin && (
                      <HStack>
                        <Icon as={FiLinkedin} color="blue.600" />
                        <Text fontSize="sm" color="gray.700" isTruncated>
                          {userData.linkedin.replace('https://', '')}
                        </Text>
                      </HStack>
                    )}
                  </VStack>

                  <Button
                    leftIcon={<Icon as={FiEdit3} />}
                    colorScheme="teal"
                    size="sm"
                    w="full"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </VStack>
              </Box>

              {/* Quick Stats */}
              <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                <Heading size="sm" color="gray.800" mb={4}>Profile Stats</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="teal.500">
                      {userData.internships.length}
                    </Text>
                    <Text fontSize="xs" color="gray.600">Experience Entries</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      {userData.cgpa || 'N/A'}
                    </Text>
                    <Text fontSize="xs" color="gray.600">CGPA</Text>
                  </Box>
                </Grid>
              </Box>
            </GridItem>

            {/* Right Column - Detailed Information */}
            <GridItem>
              <VStack spacing={4} align="stretch">
                {/* Professional Summary */}
                {userData.summary && (
                  <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                    <Heading size="sm" color="gray.800" mb={3}>Professional Summary</Heading>
                    <Text fontSize="sm" lineHeight="tall" color="gray.700">
                      {userData.summary}
                    </Text>
                  </Box>
                )}

                {/* Education Details */}
                <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                  <HStack mb={3}>
                    <Icon as={LuGraduationCap} color="purple.500" />
                    <Heading size="sm" color="gray.800">Education</Heading>
                  </HStack>
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <Icon as={LuBuilding} color="gray.500" />
                      <Text fontSize="sm" color="gray.700" fontWeight="medium">
                        {userData.instituteName}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        {userData.qualification}
                      </Text>
                      {userData.graduationYear && (
                        <Text fontSize="sm" color="gray.500">
                          {new Date(userData.graduationYear).getFullYear()}
                        </Text>
                      )}
                    </HStack>
                    {userData.cgpa && (
                      <HStack>
                        <Text fontSize="sm" color="gray.600">CGPA:</Text>
                        <Badge colorScheme="blue" fontSize="xs">
                          {userData.cgpa}/4.0
                        </Badge>
                      </HStack>
                    )}
                  </VStack>
                </Box>

                {/* Professional Experience */}
                {userData.internships.length > 0 && (
                  <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                    <HStack mb={4}>
                      <Icon as={FiBriefcase} color="green.500" />
                      <Heading size="sm" color="gray.800">Professional Experience</Heading>
                    </HStack>
                    <VStack align="stretch" spacing={4}>
                      {userData.internships.map((internship, index) => (
                        <Card key={index} variant="outline" size="sm">
                          <CardBody p={4}>
                            <VStack align="stretch" spacing={2}>
                              <HStack justify="space-between">
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                                    {internship.position}
                                  </Text>
                                  <Text fontSize="sm" color="blue.600">
                                    {internship.companyName}
                                  </Text>
                                </VStack>
                                {internship.duration && (
                                  <Badge colorScheme="gray" fontSize="xs">
                                    {internship.duration}
                                  </Badge>
                                )}
                              </HStack>

                              {internship.description && (
                                <Text fontSize="sm" color="gray.700" lineHeight="tall">
                                  {internship.description}
                                </Text>
                              )}

                              {internship.skills && (
                                <Box>
                                  <Text fontSize="xs" color="gray.600" mb={1}>Skills:</Text>
                                  <Flex wrap="wrap" gap={1}>
                                    {internship.skills.split(',').map((skill, skillIndex) => (
                                      <Badge key={skillIndex} colorScheme="teal" fontSize="xs">
                                        {skill.trim()}
                                      </Badge>
                                    ))}
                                  </Flex>
                                </Box>
                              )}
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  </Box>
                )}

                {/* Contact Information */}
                <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                  <Heading size="sm" color="gray.800" mb={3}>Contact Information</Heading>
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Icon as={FiMail} color="blue.500" />
                      <Text fontSize="sm" color="gray.700">{userData.email}</Text>
                    </HStack>
                    {userData.phone && (
                      <HStack>
                        <Icon as={FiPhone} color="green.500" />
                        <Text fontSize="sm" color="gray.700">{userData.phone}</Text>
                      </HStack>
                    )}
                    {userData.linkedin && (
                      <HStack>
                        <Icon as={FiLinkedin} color="blue.600" />
                        <Text fontSize="sm" color="gray.700" isTruncated>
                          {userData.linkedin}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </Box>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditing} onClose={handleCancel} size="xl">
        <ModalOverlay />
        <ModalContent maxW="600px">
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {/* Basic Information */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                <FormControl>
                  <FormLabel fontSize="sm">Full Name</FormLabel>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    size="sm"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Age</FormLabel>
                  <Input
                    type="number"
                    value={editData.age}
                    onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                    size="sm"
                  />
                </FormControl>
              </Grid>

              <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                <FormControl>
                  <FormLabel fontSize="sm">Email</FormLabel>
                  <Input
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    size="sm"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Phone</FormLabel>
                  <Input
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    size="sm"
                  />
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel fontSize="sm">LinkedIn Profile</FormLabel>
                <Input
                  value={editData.linkedin}
                  onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })}
                  size="sm"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Professional Summary</FormLabel>
                <Textarea
                  value={editData.summary}
                  onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                  size="sm"
                  rows={4}
                />
              </FormControl>

              {/* Education */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                <FormControl>
                  <FormLabel fontSize="sm">Institute Name</FormLabel>
                  <Input
                    value={editData.instituteName}
                    onChange={(e) => setEditData({ ...editData, instituteName: e.target.value })}
                    size="sm"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">CGPA</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    value={editData.cgpa}
                    onChange={(e) => setEditData({ ...editData, cgpa: e.target.value })}
                    size="sm"
                  />
                </FormControl>
              </Grid>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCancel}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleSave}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserProfile;