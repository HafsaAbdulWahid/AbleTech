import React, { useState, useEffect } from "react";
import {
    Box,
    Text,
    Flex,
    VStack,
    HStack,
    Divider,
    Badge,
    Button,
} from "@chakra-ui/react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import { FaBriefcase, FaEye, FaCheckCircle, FaBell, FaGraduationCap } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";

interface Notification {
    id: number;
    type: 'job' | 'profile' | 'application' | 'general' | 'training';
    icon: React.ReactNode;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    priority?: 'high' | 'medium' | 'low';
    programId?: number;
}

interface StoredNotification {
    id: number;
    type: 'job' | 'profile' | 'application' | 'general' | 'training';
    icon: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    priority?: 'high' | 'medium' | 'low';
    programId?: number;
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
        default: return "gray.700";
    }
};

export default function UserNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Load notifications from sessionStorage (CHANGED FROM localStorage)
        const storedNotifications: StoredNotification[] = JSON.parse(
            sessionStorage.getItem('userNotifications') || '[]'
        );
        
        // Convert stored notifications to display format
        const convertedNotifications: Notification[] = storedNotifications.map(stored => ({
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
    }, []);

    const markAsRead = (id: number) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === id 
                    ? { ...notification, isRead: true }
                    : notification
            )
        );

        // Update sessionStorage (CHANGED FROM localStorage)
        const storedNotifications: StoredNotification[] = JSON.parse(
            sessionStorage.getItem('userNotifications') || '[]'
        );
        const updatedStoredNotifications = storedNotifications.map(notification =>
            notification.id === id 
                ? { ...notification, isRead: true }
                : notification
        );
        sessionStorage.setItem('userNotifications', JSON.stringify(updatedStoredNotifications));
    };

    const markAllAsRead = () => {
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, isRead: true }))
        );

        // Update sessionStorage (CHANGED FROM localStorage)
        const storedNotifications: StoredNotification[] = JSON.parse(
            sessionStorage.getItem('userNotifications') || '[]'
        );
        const updatedStoredNotifications = storedNotifications.map(notification => ({
            ...notification,
            isRead: true
        }));
        sessionStorage.setItem('userNotifications', JSON.stringify(updatedStoredNotifications));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        sessionStorage.removeItem('userNotifications'); // CHANGED FROM localStorage
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
                                    Notifications
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    Stay updated with your latest activities and opportunities
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
                                    borderColor={notification.isRead ? "gray.200" : 
                                        notification.type === 'training' ? "teal.200" : "blue.200"}
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
                                            bg={notification.type === 'training' ? "teal.500" : "blue.500"}
                                            borderTopLeftRadius="lg"
                                            borderBottomLeftRadius="lg"
                                        />
                                    )}

                                    <Flex justify="space-between" align="flex-start">
                                        <HStack spacing={4} flex="1">
                                            {/* Icon */}
                                            <Box
                                                bg={notification.isRead ? "gray.100" : 
                                                    notification.type === 'training' ? "teal.50" : "blue.50"}
                                                border="2px solid"
                                                borderColor={notification.isRead ? "gray.300" : 
                                                    notification.type === 'training' ? "teal.300" : "blue.300"}
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
                                                <Flex align="center">
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
                                                </Flex>
                                                <Text
                                                    fontSize="sm"
                                                    color={notification.isRead ? "gray.500" : "gray.600"}
                                                    lineHeight="1.5"
                                                    pr={4}
                                                >
                                                    {notification.message}
                                                </Text>
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
                        {notifications.length === 0 && (
                            <Box textAlign="center" mt={8} py={6}>
                                <Text fontSize="sm" color="gray.500">
                                    No notifications yet. Check back later for updates!
                                </Text>
                            </Box>
                        )}

                        {notifications.length > 0 && (
                            <Box textAlign="center" mt={8} py={6}>
                                <Text fontSize="sm" color="gray.500">
                                    You're all caught up! Check back later for new notifications.
                                </Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}