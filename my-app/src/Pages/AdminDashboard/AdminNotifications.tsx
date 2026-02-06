import React, { useState, useEffect } from "react";
import {
    Box,
    Text,
    Flex,
    Avatar,
    VStack,
    Stack,
    HStack,
    Divider,
    Badge,
    Button,
} from "@chakra-ui/react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import { FaBriefcase, FaEye, FaCheckCircle, FaBell, FaGraduationCap } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
// Removed notificationService import - using direct localStorage access

interface Notification {
    id: number;
    type: 'job' | 'profile' | 'application' | 'general' | 'training' | 'session';
    icon: React.ReactNode;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    priority?: 'high' | 'medium' | 'low';
    programId?: number;
    sessionId?: string;
}

interface StoredNotification {
    id: number;
    type: 'job' | 'profile' | 'application' | 'general' | 'training' | 'session';
    icon: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    priority?: 'high' | 'medium' | 'low';
    programId?: number;
    sessionId?: string;
}

const getIconFromString = (iconName: string): React.ReactNode => {
    switch (iconName) {
        case 'FiBookOpen':
            return <FiBookOpen size="16" />;
        case 'FaBriefcase':
            return <FaBriefcase size="16" />;
        case 'FaEye':
            return <FaEye size="16" />;
        case 'FaCheckCircle':
            return <FaCheckCircle size="16" />;
        case 'FaBell':
            return <FaBell size="16" />;
        case 'FaGraduationCap':
            return <FaGraduationCap size="16" />;
        default:
            return <FaBell size="16" />;
    }
};

const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return "gray.600";

    switch (type) {
        case 'job': return "blue.600";
        case 'application': return "green.600";
        case 'profile': return "purple.600";
        case 'training': return "teal.600";
        case 'session': return "orange.600"; // New color for sessions
        default: return "gray.700";
    }
};

const getNotificationBorderColor = (type: string, isRead: boolean) => {
    if (isRead) return "gray.200";

    switch (type) {
        case 'job': return "blue.200";
        case 'application': return "green.200";
        case 'profile': return "purple.200";
        case 'training': return "teal.200";
        case 'session': return "orange.200"; // New border color for sessions
        default: return "gray.200";
    }
};

const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return "gray.100";

    switch (type) {
        case 'job': return "blue.50";
        case 'application': return "green.50";
        case 'profile': return "purple.50";
        case 'training': return "teal.50";
        case 'session': return "orange.50"; // New background color for sessions
        default: return "gray.50";
    }
};

export default function UserNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Listen for new notifications
    useEffect(() => {
        const handleNewNotification = (event: CustomEvent) => {
            console.log('New notification received:', event.detail);
            loadNotifications(); // Reload notifications when a new one is added
        };

        window.addEventListener('newNotification', handleNewNotification as EventListener);
        
        return () => {
            window.removeEventListener('newNotification', handleNewNotification as EventListener);
        };
    }, []);

    // Simple notification functions - no external service needed
    const getNotifications = () => {
        try {
            const stored = localStorage.getItem('userNotifications');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading notifications:', error);
            return [];
        }
    };

    const addSampleNotification = () => {
        try {
            const notifications = getNotifications();
            const newNotification = {
                id: Date.now(),
                type: 'session',
                icon: 'FiBookOpen',
                title: 'Welcome! Sample Session Added',
                message: 'This is a sample notification to show how session notifications work.',
                timestamp: formatTimestamp(new Date()),
                isRead: false,
                priority: 'medium'
            };

            notifications.unshift(newNotification);
            const limitedNotifications = notifications.slice(0, 50);
            localStorage.setItem('userNotifications', JSON.stringify(limitedNotifications));
            return true;
        } catch (error) {
            console.error('Error adding sample notification:', error);
            return false;
        }
    };

    const formatTimestamp = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const loadNotifications = () => {
        const storedNotifications = getNotifications();
        
        // Convert stored notifications to display format
        const convertedNotifications: Notification[] = storedNotifications.map((stored: StoredNotification) => ({
            ...stored,
            icon: getIconFromString(stored.icon)
        }));
        
        // Sort by timestamp (newest first)
        const sortedNotifications = convertedNotifications.sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime() || 0;
            const dateB = new Date(b.timestamp).getTime() || 0;
            return dateB - dateA;
        });
        
        setNotifications(sortedNotifications);
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const markAsRead = (id: number) => {
        try {
            const notifications = getNotifications();
            const updated = notifications.map((notification: StoredNotification) =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification
            );
            localStorage.setItem('userNotifications', JSON.stringify(updated));
            loadNotifications(); // Reload to reflect changes
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = () => {
        try {
            const notifications = getNotifications();
            const updated = notifications.map((notification: StoredNotification) => ({
                ...notification,
                isRead: true
            }));
            localStorage.setItem('userNotifications', JSON.stringify(updated));
            loadNotifications(); // Reload to reflect changes
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const clearAllNotifications = () => {
        try {
            localStorage.removeItem('userNotifications');
            setNotifications([]);
            console.log('All notifications cleared');
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <Box bg="gray.50" minH="100vh">
            <SideNav />
            <Box>
                <TopNav />
                <Box maxW="1200px" mx="auto" p={6}>
                    <Box mt={4} ml={"70px"}>
                        {/* Header Section */}
                        <Flex justify="space-between" align="center" mb={6}>
                            <Box>
                                <Text fontSize="2xl" fontWeight="700" color="#1a365d" mb={1}>
                                    Notifications 🔔
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Stay updated with your latest activities and opportunities
                                </Text>
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    Auto-refresh enabled • Real-time updates
                                </Text>
                            </Box>
                            <HStack spacing={3}>
                                {unreadCount > 0 && (
                                    <Badge colorScheme="blue" fontSize="xs" px={3} py={1} borderRadius="full">
                                        {unreadCount} New
                                    </Badge>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={markAllAsRead}
                                    isDisabled={unreadCount === 0}
                                    fontSize="12px"
                                >
                                    Mark All Read
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    colorScheme="red"
                                    onClick={clearAllNotifications}
                                    fontSize="12px"
                                >
                                    Clear All
                                </Button>
                            </HStack>
                        </Flex>

                        {/* Notifications List */}
                        <VStack spacing={3} align="stretch">
                            {notifications.map((notification) => (
                                <Box
                                    key={notification.id}
                                    bg="white"
                                    border="1px solid"
                                    borderColor={getNotificationBorderColor(notification.type, notification.isRead)}
                                    borderRadius="lg"
                                    p={5}
                                    shadow={notification.isRead ? "sm" : "md"}
                                    position="relative"
                                    onClick={() => markAsRead(notification.id)}
                                    _hover={{
                                        shadow: "lg",
                                        cursor: "pointer",
                                        transform: "translateY(-1px)",
                                        transition: "all 0.2s"
                                    }}
                                    transition="all 0.2s"
                                >
                                    {/* Unread indicator */}
                                    {!notification.isRead && (
                                        <Box
                                            position="absolute"
                                            left="0"
                                            top="0"
                                            bottom="0"
                                            w="4px"
                                            bg={getNotificationColor(notification.type, false)}
                                            borderTopLeftRadius="lg"
                                            borderBottomLeftRadius="lg"
                                        />
                                    )}

                                    <Flex justify="space-between" align="flex-start">
                                        <HStack spacing={4} flex="1">
                                            {/* Icon */}
                                            <Box
                                                bg={getNotificationBgColor(notification.type, notification.isRead)}
                                                border="2px solid"
                                                borderColor={getNotificationBorderColor(notification.type, notification.isRead)}
                                                borderRadius="full"
                                                p={3}
                                                w="45px"
                                                h="45px"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                color={getNotificationColor(notification.type, notification.isRead)}
                                            >
                                                {notification.icon}
                                            </Box>

                                            {/* Content */}
                                            <VStack align="flex-start" spacing={1} flex="1">
                                                <Flex align="center" flexWrap="wrap">
                                                    <Text
                                                        fontSize="md"
                                                        fontWeight={notification.isRead ? "500" : "600"}
                                                        color={notification.isRead ? "gray.700" : "#1a365d"}
                                                    >
                                                        {notification.title}
                                                    </Text>
                                                    {notification.type === 'training' && (
                                                        <Badge colorScheme="teal" size="xs" ml={2}>
                                                            Training
                                                        </Badge>
                                                    )}
                                                    {notification.type === 'session' && (
                                                        <Badge colorScheme="orange" size="xs" ml={2}>
                                                            New Session
                                                        </Badge>
                                                    )}
                                                    {notification.priority === 'high' && (
                                                        <Badge colorScheme="red" size="xs" ml={2}>
                                                            High Priority
                                                        </Badge>
                                                    )}
                                                </Flex>
                                                <Text
                                                    fontSize="sm"
                                                    color={notification.isRead ? "gray.500" : "gray.600"}
                                                    lineHeight="1.5"
                                                    pr={4}
                                                >
                                                    {notification.message}
                                                </Text>
                                                {notification.type === 'session' && !notification.isRead && (
                                                    <Text
                                                        fontSize="xs"
                                                        color="orange.600"
                                                        fontWeight="500"
                                                        mt={1}
                                                    >
                                                        🎯 Click to view new motivational content!
                                                    </Text>
                                                )}
                                            </VStack>
                                        </HStack>

                                        {/* Timestamp */}
                                        <Text
                                            fontSize="xs"
                                            color="gray.400"
                                            whiteSpace="nowrap"
                                            mt={1}
                                        >
                                            {notification.timestamp}
                                        </Text>
                                    </Flex>
                                </Box>
                            ))}
                        </VStack>

                        {/* Empty state */}
                        {/* {notifications.length === 0 && (
                            <Box textAlign="center" mt={8} py={6}>
                                <Text fontSize="lg" color="gray.400" mb={2}>
                                    🔔
                                </Text>
                                <Text fontSize="sm" color="gray.500" mb={4}>
                                    No notifications yet. Check back later for updates!
                                </Text>
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    variant="outline"
                                    onClick={() => {
                                        // Add a sample notification for demo
                                        const success = addSampleNotification();
                                        if (success) {
                                            loadNotifications();
                                        }
                                    }}
                                >
                                    Add Sample Notification
                                </Button>
                            </Box>
                        )} */}

                        {notifications.length > 0 && (
                            <Box textAlign="center" mt={8} py={6}>
                                <Text fontSize="sm" color="gray.500">
                                    You're all caught up! 🎉 Check back later for new notifications.
                                </Text>
                                <Text fontSize="xs" color="gray.400" mt={1}>
                                    Total notifications: {notifications.length} | Unread: {unreadCount}
                                </Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}