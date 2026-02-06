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
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FiEdit3,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiArrowLeft,
  FiTarget,
  FiEye,
  FiHeart,
  FiCamera,
} from 'react-icons/fi';
import RecruiterSideNav from './SideNav';
import RecruiterTopNav from './TopNav';

interface OrganizationProfileProps {
  onBack?: () => void;
}

const OrganizationProfile: React.FC<OrganizationProfileProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [orgData, setOrgData] = useState({
    name: 'AbleTech Solutions',
    description: 'Leading technology company specializing in innovative software solutions and digital transformation services.',
    industry: 'Information Technology',
    size: '500-1000 employees',
    founded: '2015',
    headquarters: 'Karachi, Pakistan',
    website: 'https://abletech.com',
    email: 'info@abletech.com',
    phone: '+92 21 1234567',
    logo: '',
    mission: 'To empower businesses through innovative technology solutions that drive growth and efficiency.',
    vision: 'To be the leading technology partner for businesses worldwide, fostering digital transformation and innovation.',
    values: ['Innovation', 'Excellence', 'Integrity', 'Collaboration', 'Customer Focus'],
    totalEmployees: 850,
    activeProjects: 45,
    clientsServed: 200,
    yearsOfExperience: 9
  });

  const [editData, setEditData] = useState({ ...orgData });

  const handleSave = () => {
    setOrgData({ ...editData });
    setIsEditing(false);
    toast({
      title: 'Organization Profile Updated',
      description: 'Your organization profile has been successfully updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCancel = () => {
    setEditData({ ...orgData });
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
      <RecruiterSideNav />
      <RecruiterTopNav />
      
      <Box ml="90px" pt={0}>
        <Box p={6}>
          {/* Header */}
          <Box bg="#2CA58D" borderRadius="xl" p={5} mb={6}>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Text fontSize="xl" color="white" fontWeight="bold">Organization Profile</Text>
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
            {/* Left Column */}
            <GridItem>
              <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100" mb={4}>
                <VStack spacing={4}>
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      name={orgData.name}
                      src={orgData.logo}
                      bg="blue.500"
                    />
                    <IconButton
                      icon={<Icon as={FiCamera} />}
                      size="sm"
                      borderRadius="full"
                      position="absolute"
                      bottom={0}
                      right={0}
                      bg="#2CA58D"
                      color="white"
                      _hover={{ bg: '#259a7d' }}
                      aria-label="Change organization logo"
                    />
                  </Box>
                  
                  <VStack spacing={1}>
                    <Heading size="md" color="gray.800" textAlign="center">
                      {orgData.name}
                    </Heading>
                    <Text color="gray.600" fontSize="sm">{orgData.industry}</Text>
                    <HStack>
                      <Badge colorScheme="blue" fontSize="xs">
                        Since {orgData.founded}
                      </Badge>
                    </HStack>
                  </VStack>

                  <Divider />

                  <VStack spacing={3} align="stretch" w="full">
                    <HStack>
                      <Icon as={FiMail} color="gray.500" />
                      <Text fontSize="sm" color="gray.700">{orgData.email}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiPhone} color="gray.500" />
                      <Text fontSize="sm" color="gray.700">{orgData.phone}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiMapPin} color="gray.500" />
                      <Text fontSize="sm" color="gray.700">{orgData.headquarters}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiGlobe} color="gray.500" />
                      <Text fontSize="sm" color="blue.500" as="a" href={orgData.website} target="_blank">
                        {orgData.website}
                      </Text>
                    </HStack>
                  </VStack>

                  <Button
                    leftIcon={<Icon as={FiEdit3} />}
                    bg="#2CA58D"
                    color="white"
                    _hover={{ bg: '#259a7d' }}
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
                    <Text fontSize="2xl" fontWeight="bold" color="#2CA58D">
                      {orgData.totalEmployees}
                    </Text>
                    <Text fontSize="xs" color="gray.600">Total Employees</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      {orgData.activeProjects}
                    </Text>
                    <Text fontSize="xs" color="gray.600">Active Projects</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                      {orgData.clientsServed}+
                    </Text>
                    <Text fontSize="xs" color="gray.600">Clients Served</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="green.500">
                      {orgData.yearsOfExperience}
                    </Text>
                    <Text fontSize="xs" color="gray.600">Years Experience</Text>
                  </Box>
                </Grid>
              </Box>
            </GridItem>

            {/* Right Column */}
            <GridItem>
              <VStack spacing={4} align="stretch">
                {/* About */}
                <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                  <Heading size="sm" color="gray.800" mb={3}>About</Heading>
                  <Text fontSize="sm" lineHeight="tall" color="gray.700">
                    {orgData.description}
                  </Text>
                </Box>

                {/* Company Details */}
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                    <Heading size="sm" color="gray.800" mb={3}>Company Size</Heading>
                    <Text fontSize="lg" fontWeight="bold" color="purple.500">
                      {orgData.size}
                    </Text>
                    <Text fontSize="xs" color="gray.600">employees</Text>
                  </Box>

                  <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                    <Heading size="sm" color="gray.800" mb={3}>Founded</Heading>
                    <Text fontSize="lg" fontWeight="bold" color="green.500">
                      {orgData.founded}
                    </Text>
                    <Text fontSize="xs" color="gray.600">established</Text>
                  </Box>
                </Grid>

                {/* Mission */}
                <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                  <HStack mb={3}>
                    <Icon as={FiTarget} color="#2CA58D" />
                    <Heading size="sm" color="gray.800">Mission Statement</Heading>
                  </HStack>
                  <Text fontSize="sm" lineHeight="tall" color="gray.700">
                    {orgData.mission}
                  </Text>
                </Box>

                {/* Vision */}
                <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                  <HStack mb={3}>
                    <Icon as={FiEye} color="blue.500" />
                    <Heading size="sm" color="gray.800">Vision Statement</Heading>
                  </HStack>
                  <Text fontSize="sm" lineHeight="tall" color="gray.700">
                    {orgData.vision}
                  </Text>
                </Box>

                {/* Company Values */}
                <Box bg="white" borderRadius="xl" p={5} shadow="sm" border="1px" borderColor="gray.100">
                  <HStack mb={3}>
                    <Icon as={FiHeart} color="red.500" />
                    <Heading size="sm" color="gray.800">Company Values</Heading>
                  </HStack>
                  <Flex wrap="wrap" gap={2}>
                    {orgData.values.map((value, index) => (
                      <Badge key={index} colorScheme="blue" fontSize="xs">
                        {value}
                      </Badge>
                    ))}
                  </Flex>
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
          <ModalHeader>Edit Organization Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Organization Name</FormLabel>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  size="sm"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm">Industry</FormLabel>
                <Input
                  value={editData.industry}
                  onChange={(e) => setEditData({...editData, industry: e.target.value})}
                  size="sm"
                />
              </FormControl>
              
              <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
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
              </Grid>
              
              <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                <FormControl>
                  <FormLabel fontSize="sm">Headquarters</FormLabel>
                  <Input
                    value={editData.headquarters}
                    onChange={(e) => setEditData({...editData, headquarters: e.target.value})}
                    size="sm"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Website</FormLabel>
                  <Input
                    value={editData.website}
                    onChange={(e) => setEditData({...editData, website: e.target.value})}
                    size="sm"
                  />
                </FormControl>
              </Grid>
              
              <FormControl>
                <FormLabel fontSize="sm">Description</FormLabel>
                <Textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  size="sm"
                  rows={3}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm">Mission Statement</FormLabel>
                <Textarea
                  value={editData.mission}
                  onChange={(e) => setEditData({...editData, mission: e.target.value})}
                  size="sm"
                  rows={3}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm">Vision Statement</FormLabel>
                <Textarea
                  value={editData.vision}
                  onChange={(e) => setEditData({...editData, vision: e.target.value})}
                  size="sm"
                  rows={3}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm">Company Values (comma-separated)</FormLabel>
                <Input
                  value={editData.values.join(', ')}
                  onChange={(e) => setEditData({...editData, values: e.target.value.split(', ').map(v => v.trim())})}
                  size="sm"
                  placeholder="Innovation, Excellence, Integrity..."
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCancel}>
              Cancel
            </Button>
            <Button bg="#2CA58D" color="white" _hover={{ bg: '#259a7d' }} onClick={handleSave}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OrganizationProfile;