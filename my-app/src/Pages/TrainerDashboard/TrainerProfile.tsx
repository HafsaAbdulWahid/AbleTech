import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  Avatar,
  Icon,
  Grid,
  GridItem,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Badge,
  Divider,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FiEdit3,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiAward,
  FiCamera,
  FiLinkedin,
  FiGlobe,
  FiArrowLeft,
} from 'react-icons/fi';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface ProfileProps {
  onBack?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample trainer data - replace with actual data from your backend
  const [trainerData, setTrainerData] = useState({
    firstName: 'Layba',
    lastName: 'Khan',
    email: 'john.smith@abletech.com',
    phone: '+92-300-1234567',
    location: 'Karachi, Pakistan',
    joinDate: 'January 2023',
    profileImage: '',
    bio: 'Experienced trainer specializing in web development and digital skills training. Passionate about helping individuals build their careers in technology.',
    specializations: ['Web Development', 'Digital Marketing', 'UI/UX Design', 'Data Entry'],
    experience: '5+ years',
    totalTrainees: 124,
    completedPrograms: 18,
    rating: 4.8,
    linkedin: 'linkedin.com/in/johnsmith',
    website: 'johnsmith.dev',
    certifications: [
      'Certified Professional Trainer',
      'Google Digital Marketing Certificate',
      'Microsoft Office Specialist'
    ],
    achievements: [
      { title: 'Top Trainer 2024', description: 'Highest rated trainer of the year' },
      { title: '1000+ Hours Training', description: 'Delivered over 1000 hours of training' },
      { title: 'Excellence Award', description: 'Outstanding contribution to trainee success' }
    ]
  });

  const [editData, setEditData] = useState({ ...trainerData });

  const handleSave = () => {
    setTrainerData({ ...editData });
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCancel = () => {
    setEditData({ ...trainerData });
    setIsEditing(false);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <SideNav />
      <TopNav />
      
      {/* Main Content */}
      <Box ml="90px" pt={0}>
        <Box p={6}>
          {/* Header with same styling as dashboard */}
          <Box bg="teal.500" borderRadius="xl" p={5} mb={6}>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="xl" color="white" fontWeight="bold">Trainer Profile</Text>
                
              </VStack>
              <Button
                leftIcon={<Icon as={FiArrowLeft} />}
                onClick={handleBack}
                variant="outline"
                size="sm"
                color="white"
                borderColor="white"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                Back to Dashboard
              </Button>
            </HStack>
          </Box>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={6}>
            {/* Left Column - Profile Summary */}
            <GridItem>
              <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100" mb={4}>
                <VStack spacing={4}>
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      name={`${trainerData.firstName} ${trainerData.lastName}`}
                      src={trainerData.profileImage}
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
                      {trainerData.firstName} {trainerData.lastName}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">Professional Trainer</Text>
                    <HStack>
                      <Badge colorScheme="teal" fontSize="xs">
                        {trainerData.rating} ⭐ Rating
                      </Badge>
                    </HStack>
                  </VStack>

                  <Divider />

                  <VStack spacing={3} align="stretch" w="full">
                    <HStack>
                      <Icon as={FiMail} color="gray.500" />
                      <Text fontSize="sm" color="gray.700">{trainerData.email}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiPhone} color="gray.500" />
                      <Text fontSize="sm" color="gray.700">{trainerData.phone}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiMapPin} color="gray.500" />
                      <Text fontSize="sm" color="gray.700">{trainerData.location}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiCalendar} color="gray.500" />
                      <Text fontSize="sm" color="gray.700">Joined {trainerData.joinDate}</Text>
                    </HStack>
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
                <Heading size="sm" color="gray.800" mb={4}>Quick Stats</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="teal.500">
                      {trainerData.totalTrainees}
                    </Text>
                    <Text fontSize="xs" color="gray.600">Total Trainees</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      {trainerData.completedPrograms}
                    </Text>
                    <Text fontSize="xs" color="gray.600">Programs Created</Text>
                  </Box>
                </Grid>
              </Box>
            </GridItem>

            {/* Right Column - Detailed Information */}
            <GridItem>
              <VStack spacing={4} align="stretch">
                {/* Bio */}
                <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                  <Heading size="sm" color="gray.800" mb={3}>About</Heading>
                  <Text fontSize="sm" lineHeight="tall" color="gray.700">
                    {trainerData.bio}
                  </Text>
                </Box>

                {/* Specializations */}
                <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                  <Heading size="sm" color="gray.800" mb={3}>Specializations</Heading>
                  <Flex wrap="wrap" gap={2}>
                    {trainerData.specializations.map((skill, index) => (
                      <Badge key={index} colorScheme="blue" fontSize="xs">
                        {skill}
                      </Badge>
                    ))}
                  </Flex>
                </Box>

                {/* Experience & Social Links */}
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                    <Heading size="sm" color="gray.800" mb={3}>Experience</Heading>
                    <Text fontSize="lg" fontWeight="bold" color="purple.500">
                      {trainerData.experience}
                    </Text>
                    <Text fontSize="xs" color="gray.600">in training</Text>
                  </Box>

                  <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                    <Heading size="sm" color="gray.800" mb={3}>Connect</Heading>
                    <VStack spacing={2} align="stretch">
                      <HStack>
                        <Icon as={FiLinkedin} color="blue.600" />
                        <Text fontSize="xs" color="gray.700">{trainerData.linkedin}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiGlobe} color="green.600" />
                        <Text fontSize="xs" color="gray.700">{trainerData.website}</Text>
                      </HStack>
                    </VStack>
                  </Box>
                </Grid>

                {/* Certifications */}
                <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                  <Heading size="sm" color="gray.800" mb={3}>Certifications</Heading>
                  <VStack align="stretch" spacing={2}>
                    {trainerData.certifications.map((cert, index) => (
                      <HStack key={index}>
                        <Icon as={FiAward} color="yellow.500" />
                        <Text fontSize="sm" color="gray.700">{cert}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* Achievements */}
                <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                  <Heading size="sm" color="gray.800" mb={3}>Achievements</Heading>
                  <VStack align="stretch" spacing={3}>
                    {trainerData.achievements.map((achievement, index) => (
                      <Box key={index} p={3} bg="gray.50" borderRadius="lg">
                        <Text fontSize="sm" fontWeight="semibold" mb={1} color="gray.800">
                          {achievement.title}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {achievement.description}
                        </Text>
                      </Box>
                    ))}
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
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                <FormControl>
                  <FormLabel fontSize="sm">First Name</FormLabel>
                  <Input
                    value={editData.firstName}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    size="sm"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Last Name</FormLabel>
                  <Input
                    value={editData.lastName}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    size="sm"
                  />
                </FormControl>
              </Grid>
              
              <FormControl>
                <FormLabel fontSize="sm">Email</FormLabel>
                <Input
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  size="sm"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm">Phone</FormLabel>
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  size="sm"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm">Location</FormLabel>
                <Input
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                  size="sm"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm">Bio</FormLabel>
                <Textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  size="sm"
                  rows={4}
                />
              </FormControl>
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

export default Profile;