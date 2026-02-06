import {
    Box,
    Text,
    Image,
    Stack,
    Button,
    Flex,
    Link,
    Spacer,
    Icon,
    Spinner,
    Center
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import MotivationalSessions from "../../Images/MotivationalSessions.jpg";

const API_BASE_URL = "http://localhost:3001/api/motivational-sessions";

interface MotivationalSession {
    _id: string;
    title: string;
    speaker: string;
    description: string;
    date: string;
    duration: string;
    category: string;
    image: string;
    videoLink: string;
    createdAt: string;
}

export default function Sessions() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<MotivationalSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(API_BASE_URL);
            // Get the last 3 sessions (most recently added)
            const lastThree = response.data.slice(-3).reverse();
            setSessions(lastThree);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWatchNow = (videoLink: string) => {
        if (videoLink) {
            window.open(videoLink, '_blank');
        }
    };

    return (
        <Box
            maxW="380px"
            mx="auto"
            mt={1}
            p={5}
            borderRadius="2xl"
            bg="white"
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            border="1px solid"
            borderColor="gray.100"
        >
            <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="md" fontWeight="bold">
                    Motivational Sessions
                </Text>
                <Spacer />
                <Link
                    color="teal.600"
                    fontSize="xs"
                    fontWeight="600"
                    onClick={() => navigate("/motivational-sessions")}
                    cursor="pointer"
                    _hover={{
                        color: "teal.700",
                        textDecoration: "underline",
                        transform: "translateX(2px)"
                    }}
                    transition="all 0.2s"
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mt={1}
                >
                    View All
                    <Icon as={FaExternalLinkAlt} boxSize={2.5} />
                </Link>
            </Flex>

            <Flex justify="center" align="center" w="100%" mb={4}>
                <Image
                    src={MotivationalSessions}
                    alt="Session Illustration"
                    borderRadius="xl"
                    maxH="auto"
                    objectFit="cover"
                    w="60%"
                />
            </Flex>

            {isLoading ? (
                <Center py={8}>
                    <Spinner size="md" color="teal.500" />
                </Center>
            ) : sessions.length === 0 ? (
                <Center py={8}>
                    <Text fontSize="sm" color="gray.500">
                        No sessions available
                    </Text>
                </Center>
            ) : (
                <Stack spacing={3}>
                    {sessions.map((session) => (
                        <Box 
                            key={session._id}
                            position="relative"
                            _hover={{
                                transform: "translateY(-2px)",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                            <Box
                                bg="linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)"
                                p={4}
                                borderRadius="xl"
                                boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                                border="1px solid"
                                borderColor="gray.200"
                                _hover={{
                                    bg: "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
                                    boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.15)",
                                    borderColor: "teal.300",
                                }}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            >
                                <Flex justify="space-between" align="center" gap={3}>
                                    <Box flex={1}>
                                        <Text 
                                            fontWeight="700" 
                                            fontSize="sm" 
                                            color="gray.800"
                                            mb={1}
                                            noOfLines={2}
                                            lineHeight="1.3"
                                        >
                                            {session.title}
                                        </Text>
                                        <Text 
                                            fontSize="xs" 
                                            color="teal.600"
                                            fontWeight="600"
                                        >
                                            by {session.speaker}
                                        </Text>
                                    </Box>
                                    <Button
                                        bg="orange.200"
                                        color="gray.800"
                                        _hover={{ 
                                            bg: "orange.300",
                                            transform: "scale(1.05)"
                                        }}
                                        _active={{
                                            transform: "scale(0.98)"
                                        }}
                                        borderRadius="lg"
                                        boxShadow="md"
                                        size="sm"
                                        fontSize="11px"
                                        fontWeight="600"
                                        px={4}
                                        onClick={() => handleWatchNow(session.videoLink)}
                                        isDisabled={!session.videoLink}
                                        flexShrink={0}
                                        transition="all 0.2s"
                                    >
                                        Watch Now
                                    </Button>
                                </Flex>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
}