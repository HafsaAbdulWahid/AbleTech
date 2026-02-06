import React from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  Flex,
  Icon,
  Badge,
  HStack,
  Avatar,
  Heading,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiClock, FiBookOpen } from 'react-icons/fi';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface NotificationProps {
  onBack: () => void;
}

const Notifications: React.FC<NotificationProps> = ({ onBack }) => {
  const navigate = useNavigate();

  const enrollmentNotifications = [
    {
      id: 1,
      userName: 'Sarah Johnson',
      userEmail: 'sarah.j@email.com',
      programName: 'HTML & CSS Basics',
      enrolledAt: '2 hours ago',
      status: 'new',
      avatar: 'SJ'
    },
    {
      id: 2,
      userName: 'Ahmed Ali',
      userEmail: 'ahmed.ali@email.com',
      programName: 'Graphic Design Fundamentals',
      enrolledAt: '5 hours ago',
      status: 'new',
      avatar: 'AA'
    },
    {
      id: 3,
      userName: 'Mike Wilson',
      userEmail: 'mike.w@email.com',
      programName: 'Communication Skills',
      enrolledAt: '1 day ago',
      status: 'viewed',
      avatar: 'MW'
    },
    {
      id: 4,
      userName: 'Emma Davis',
      userEmail: 'emma.davis@email.com',
      programName: 'Data Entry Course',
      enrolledAt: '2 days ago',
      status: 'viewed',
      avatar: 'ED'
    },
    {
      id: 5,
      userName: 'John Smith',
      userEmail: 'john.smith@email.com',
      programName: 'Resume Writing Workshop',
      enrolledAt: '3 days ago',
      status: 'viewed',
      avatar: 'JS'
    },
    {
      id: 6,
      userName: 'Fatima Khan',
      userEmail: 'fatima.k@email.com',
      programName: 'Freelancing Skills',
      enrolledAt: '4 days ago',
      status: 'viewed',
      avatar: 'FK'
    }
  ];

  const handleViewProfile = (userId: number) => {
    // Navigate to user profile or details
    console.log('View profile for user:', userId);
  };

  const handleAcceptEnrollment = (notificationId: number) => {
    // Handle enrollment acceptance
    console.log('Accept enrollment:', notificationId);
  };

  return (
    <Box>
      <SideNav />
      <Box>
        <TopNav />
        <Box px={6} ml="100px" mt={8} minH="calc(100vh - 64px)">
          {/* Header Box - Following Recent Activities Style */}
          <Box
            bg="teal.500"
            borderRadius="xl"
            p={5}
            mb={6}
            boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={2}>
                <Heading size="md" color="white">
                   Notifications
                </Heading>
               
              </VStack>
              <Button
                leftIcon={<Icon as={FiArrowLeft} />}
                onClick={onBack}
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

          {/* Notifications List */}
          <Box
            bg="white"
            borderRadius="3xl"
            p={5}
            boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.700">
              New Enrollments ({enrollmentNotifications.filter(n => n.status === 'new').length})
            </Text>

            <VStack spacing={4} align="stretch">
              {enrollmentNotifications.map((notification) => (
                <Box
                  key={notification.id}
                  bg="blue.50"
                  p={4}
                  borderRadius="xl"
                  boxShadow="sm"
                  _hover={{ bg: "gray.100", transform: "translateY(-1px)" }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  <Flex align="start" justify="space-between">
                    <Flex align="start" flex={1}>
                      <Avatar
                        size="md"
                        name={notification.userName}
                        bg="yellow.400"
                        color="white"
                        mr={4}
                        mt={1}
                      />
                      
                      <Box flex={1}>
                        <Flex align="center" mb={2}>
                          <Text fontWeight="bold" fontSize="md" mr={3}>
                            {notification.userName}
                          </Text>
                          {notification.status === 'new' && (
                            <Badge 
                              bg="blue.200"
                              color="blue.800"
                              fontSize="xs"
                              borderRadius="md"
                            >
                              New
                            </Badge>
                          )}
                        </Flex>
                        
                        <Text fontSize="sm" color="gray.600" mb={1}>
                          <strong>Email:</strong> {notification.userEmail}
                        </Text>
                        
                        <Text fontSize="sm" color="gray.600" mb={1}>
                          <strong>Program:</strong> {notification.programName}
                        </Text>

                        <Text fontSize="sm" color="gray.500">
                          Enrolled {notification.enrolledAt}
                        </Text>
                      </Box>
                    </Flex>

                    <VStack spacing={2} ml={4}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewProfile(notification.id)}
                        fontSize="xs"
                        leftIcon={<Icon as={FiUser} boxSize={3} />}
                      >
                        View Profile
                      </Button>
                    </VStack>
                  </Flex>
                </Box>
              ))}
            </VStack>

            {enrollmentNotifications.length === 0 && (
              <Box textAlign="center" py={10}>
                <Text color="gray.500" fontSize="md">
                  No enrollment notifications at the moment.
                </Text>
              </Box>
            )}

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Notifications;