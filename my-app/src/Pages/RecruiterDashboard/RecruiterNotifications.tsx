import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  Badge,
  Icon,
  Button,
  IconButton,
} from '@chakra-ui/react';
import SideNav from './SideNav';
import TopNav from './TopNav';
import { IoLogoXing } from 'react-icons/io5';
import { FiBell, FiX } from 'react-icons/fi';

interface Notification {
  id: number;
  type: 'application' | 'interview' | 'system' | 'job';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

const RecruiterNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: 1,
        type: 'job',
        title: 'New Job Available',
        message: 'Call Center Job is available at ABC company',
        timestamp: '03:21 PM',
        isRead: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'application',
        title: 'Profile Views',
        message: 'John Doe and 3 others viewed your profile. See the full list.',
        timestamp: 'Yesterday, 03:21 PM',
        isRead: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'interview',
        title: 'Shortlisted',
        message: 'You are shortlisted for Linsible Technologies UX/UI Designer Post',
        timestamp: 'Yesterday, 03:21 PM',
        isRead: false,
        priority: 'high'
      },
      {
        id: 4,
        type: 'application',
        title: 'Profile Views',
        message: 'John Doe and 3 others viewed your profile. See the full list.',
        timestamp: '23rd June, 03:21 PM',
        isRead: true,
        priority: 'medium'
      },
      {
        id: 5,
        type: 'system',
        title: 'System Update',
        message: 'Your profile has been updated successfully',
        timestamp: '22nd June, 03:21 PM',
        isRead: true,
        priority: 'low'
      },
      {
        id: 6,
        type: 'application',
        title: 'Profile Views',
        message: 'John Doe and 3 others viewed your profile. See the full list.',
        timestamp: '19th June, 03:21 PM',
        isRead: false,
        priority: 'low'
      },
      {
        id: 7,
        type: 'job',
        title: 'Job Application',
        message: 'Your application for Software Engineer role has been received',
        timestamp: '18th June, 03:21 PM',
        isRead: true,
        priority: 'medium'
      }
    ];

    setNotifications(sampleNotifications);
  }, []);

  const getNotificationBorderColor = (type: string) => {
    const colors = {
      application: 'blue.400',
      interview: 'green.400',
      job: 'purple.400',
      system: 'orange.400'
    };
    return colors[type as keyof typeof colors] || 'gray.400';
  };

  const getPriorityColorScheme = (priority: string) => {
    const schemes = {
      high: 'red',
      medium: 'yellow',
      low: 'gray'
    };
    return schemes[priority as keyof typeof schemes] || 'gray';
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Box>
      <SideNav activeNav="Notifications" />
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
              <Text fontSize="xl" color="white" fontWeight="bold">Notifications</Text>
            </Box>

            {/* Header Actions */}
            <Flex justify="space-between" align="center" mb={6}>
              <Text fontSize="md" fontWeight="bold" color="#2D3E5E">
                All Notifications ({notifications.length})
              </Text>
              {unreadCount > 0 && (
                <Button
                  bg="#2CA58D"
                  color="white"
                  _hover={{ bg: "#249a82" }}
                  onClick={markAllAsRead}
                  size="sm"
                  fontSize="13px"
                >
                  Mark all as read ({unreadCount})
                </Button>
              )}
            </Flex>

            {/* Notifications List */}
            <VStack spacing={3} align="stretch">
              {notifications.length === 0 ? (
                <Box
                  w="100%"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  p={12}
                  textAlign="center"
                >
                  <Icon as={FiBell} boxSize={12} color="gray.300" mb={4} />
                  <Text color="gray.500" fontSize="md" mb={2}>
                    No notifications yet
                  </Text>
                  <Text color="gray.400" fontSize="13px">
                    You'll see updates about your job postings and applications here
                  </Text>
                </Box>
              ) : (
                notifications.map((notification) => (
                  <Box
                    key={notification.id}
                    w="100%"
                    bg={!notification.isRead ? "blue.50" : "white"}
                    border="1px solid"
                    borderColor={!notification.isRead ? "blue.200" : "gray.200"}
                    borderLeft="4px solid"
                    borderLeftColor={!notification.isRead ? getNotificationBorderColor(notification.type) : "gray.200"}
                    borderRadius="lg"
                    p={5}
                    boxShadow="sm"
                    _hover={{ 
                      boxShadow: "md", 
                      cursor: "pointer"
                    }}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <Flex justify="space-between" align="center">
                      <HStack spacing={4} flex={1}>
                        {/* Icon */}
                        <Box
                          bg="white"
                          border="2px"
                          borderColor="gray.300"
                          borderRadius="full"
                          p={2}
                          w="40px"
                          h="40px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                          boxShadow="sm"
                        >
                          <IoLogoXing size="20" />
                        </Box>
                        
                        {/* Content */}
                        <Box flex={1}>
                          <HStack spacing={2} mb={2}>
                            <Text fontWeight="semibold" fontSize="14px" color="gray.900">
                              {notification.title}
                            </Text>
                            
                            <Badge 
                              colorScheme={getPriorityColorScheme(notification.priority)}
                              size="sm"
                              fontSize="10px"
                            >
                              {notification.priority}
                            </Badge>
                            
                            {!notification.isRead && (
                              <Badge colorScheme="blue" size="sm" fontSize="10px">
                                New
                              </Badge>
                            )}
                          </HStack>
                          
                          <Text fontSize="13px" color="gray.600" mb={1}>
                            {notification.message}
                          </Text>
                        </Box>
                      </HStack>
                      
                      {/* Actions and Timestamp */}
                      <HStack spacing={4}>
                        <Text fontSize="12px" color="gray.500">
                          {notification.timestamp}
                        </Text>
                        
                        <HStack spacing={2}>
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              fontSize="11px"
                            >
                              Mark as read
                            </Button>
                          )}
                          
                          <IconButton
                            aria-label="Delete notification"
                            icon={<FiX />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          />
                        </HStack>
                      </HStack>
                    </Flex>
                  </Box>
                ))
              )}
            </VStack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RecruiterNotifications;