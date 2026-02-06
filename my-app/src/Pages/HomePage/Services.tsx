import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    Container,
    SimpleGrid,
    Icon,
    useBreakpointValue,
} from "@chakra-ui/react";
import { FaUsers, FaRocket, FaBriefcase, FaRobot, FaCog, FaGraduationCap } from "react-icons/fa";
import { useState, useEffect } from "react";

const services = [
    {
        id: 1,
        icon: FaUsers,
        title: "Community Forum",
        shortDesc: "Connect & Collaborate",
        fullDesc: "Join an inclusive community where individuals with disabilities share experiences, offer support, and build meaningful relationships. Our platform fosters collaboration and mutual growth through interactive discussions and peer mentoring.",
        color: "#2CA58D",
        gradient: "linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
    },
    {
        id: 2,
        icon: FaRocket,
        title: "Motivational Sessions",
        shortDesc: "Inspire & Empower",
        fullDesc: "Access inspiring workshops featuring successful professionals who have overcome challenges. These interactive sessions boost confidence, provide practical insights, and fuel personal development through real success stories.",
        color: "#2D3E5E",
        gradient: "linear-gradient(135deg, #2D3E5E 0%, #1a2332 100%)"
    },
    {
        id: 3,
        icon: FaBriefcase,
        title: "Smart Job Matching",
        shortDesc: "Find Your Perfect Role",
        fullDesc: "Discover opportunities tailored to your unique abilities through our intelligent AI matching system. We connect talented individuals with forward-thinking employers who value diversity and inclusion in the workplace.",
        color: "#2CA58D",
        gradient: "linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
    },
    {
        id: 4,
        icon: FaRobot,
        title: "AI Interview Preparations",
        shortDesc: "Master Your Interviews",
        fullDesc: "Prepare with confidence using our advanced AI coaching platform. Get real-time feedback, practice with industry-specific scenarios, and build interview skills through personalized training sessions tailored to your needs.",
        color: "#2D3E5E",
        gradient: "linear-gradient(135deg, #2D3E5E 0%, #1a2332 100%)"
    },
    {
        id: 5,
        icon: FaGraduationCap,
        title: "Training Programs",
        shortDesc: "Upskill & Advance",
        fullDesc: "Enhance your professional capabilities with comprehensive training programs designed for diverse learning needs. Access courses in technology, soft skills, and industry-specific knowledge with flexible learning paths and certification opportunities.",
        color: "#2CA58D",
        gradient: "linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
    },
    {
        id: 6,
        icon: FaCog,
        title: "Assistive Tech Hub",
        shortDesc: "Latest Innovations",
        fullDesc: "Stay ahead with cutting-edge assistive technologies and innovations. Access the latest tools, software updates, and resources designed to enhance productivity, independence, and workplace accessibility.",
        color: "#2D3E5E",
        gradient: "linear-gradient(135deg, #2D3E5E 0%, #1a2332 100%)"
    },
];

export default function Services() {
    const [activeService, setActiveService] = useState(1);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const isMobile = useBreakpointValue({ base: true, md: false });

    // Auto-rotate services
    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setActiveService(prev => prev === services.length ? 1 : prev + 1);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlay]);

    const activeServiceData = services.find(s => s.id === activeService) || services[0];

    return (
        <Box bg="white" py={{ base: 10, md: 20 }} overflow="hidden">
            <Container maxW="1400px">
                {/* Header Section */}
                <VStack spacing={6} textAlign="center" mb={16}>
                    <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="#2CA58D"
                        textTransform="uppercase"
                        letterSpacing="2px"
                    >
                        Our Services
                    </Text>
                    <Heading
                        fontSize={["2xl", "3xl", "4xl", "5xl"]}
                        color="#2D3E5E"
                        fontWeight="800"
                        lineHeight="1.2"
                    >
                        Innovative Solutions for{" "}
                        <Box as="span" color="#2CA58D">
                            Your Success Journey
                        </Box>
                    </Heading>
                    <Text
                        fontSize="lg"
                        color="gray.600"
                        maxW="600px"
                        lineHeight="1.8"
                    >
                        Discover our comprehensive suite of AI-powered tools and community-driven
                        resources designed to unlock your potential.
                    </Text>
                </VStack>

                <Flex
                    direction={{ base: "column", lg: "row" }}
                    gap={10}
                    align="stretch"
                    minH="600px"
                >
                    {/* Left Side - Service Navigation */}
                    <VStack
                        flex={1}
                        spacing={4}
                        align="stretch"
                        onMouseEnter={() => setIsAutoPlay(false)}
                        onMouseLeave={() => setIsAutoPlay(true)}
                    >
                        {services.map((service, index) => (
                            <Box
                                key={service.id}
                                p={6}
                                borderRadius="2xl"
                                cursor="pointer"
                                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                                position="relative"
                                overflow="hidden"
                                bg={activeService === service.id ? "white" : "gray.50"}
                                border="2px solid"
                                borderColor={activeService === service.id ? service.color : "transparent"}
                                boxShadow={activeService === service.id ?
                                    `0 20px 60px ${service.color}20` :
                                    "0 4px 20px rgba(0,0,0,0.08)"
                                }
                                transform={activeService === service.id ? "scale(1.02)" : "scale(1)"}
                                onClick={() => {
                                    setActiveService(service.id);
                                    setIsAutoPlay(false);
                                }}
                                _hover={{
                                    transform: "scale(1.02)",
                                    boxShadow: `0 20px 60px ${service.color}15`,
                                }}
                            >
                                {/* Animated Background */}
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={activeService === service.id ? 0 : "-100%"}
                                    width="100%"
                                    height="100%"
                                    bg={service.gradient}
                                    opacity={0.05}
                                    transition="left 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                                    zIndex={0}
                                />

                                <Flex align="center" gap={4} position="relative" zIndex={1}>
                                    <Box
                                        p={4}
                                        borderRadius="xl"
                                        bg={activeService === service.id ? service.color : "gray.200"}
                                        transition="all 0.3s"
                                    >
                                        <Icon
                                            as={service.icon}
                                            boxSize={6}
                                            color={activeService === service.id ? "white" : "gray.600"}
                                        />
                                    </Box>

                                    <Box flex={1}>
                                        <Heading
                                            fontSize="lg"
                                            fontWeight="700"
                                            color={activeService === service.id ? service.color : "#2D3E5E"}
                                            mb={1}
                                            transition="color 0.3s"
                                        >
                                            {service.title}
                                        </Heading>
                                        <Text
                                            fontSize="sm"
                                            color="gray.600"
                                            fontWeight="500"
                                        >
                                            {service.shortDesc}
                                        </Text>
                                    </Box>

                                    {/* Progress Bar */}
                                    {activeService === service.id && (
                                        <Box
                                            position="absolute"
                                            bottom={0}
                                            left={0}
                                            h="3px"
                                            bg={service.color}
                                            borderRadius="full"
                                            animation={isAutoPlay ? "progressBar 4s linear infinite" : "none"}
                                        />
                                    )}
                                </Flex>
                            </Box>
                        ))}
                    </VStack>

                    {/* Right Side - Active Service Display */}
                    <Box
                        flex={1.2}
                        position="relative"
                        borderRadius="3xl"
                        overflow="hidden"
                        boxShadow="0 25px 80px rgba(0,0,0,0.15)"
                        bg="white"
                    >
                        {/* Background Image with Overlay */}
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            height="100%"
                            bgImage={`url(${activeServiceData})`}
                            bgSize="cover"
                            bgPosition="center"
                            transition="all 0.8s ease-in-out"
                        />

                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            height="100%"
                            bg={activeServiceData.gradient}
                            opacity={0.9}
                            transition="all 0.6s ease-in-out"
                        />

                        {/* Content Overlay */}
                        <VStack
                            position="relative"
                            zIndex={2}
                            height="100%"
                            justify="center"
                            align="flex-start"
                            p={12}
                            spacing={6}
                            color="white"
                        >
                            <Box
                                p={4}
                                borderRadius="xl"
                                bg="rgba(255,255,255,0.15)"
                                backdropFilter="blur(10px)"
                            >
                                <Icon
                                    as={activeServiceData.icon}
                                    boxSize={10}
                                    color="white"
                                />
                            </Box>

                            <VStack align="flex-start" spacing={4}>
                                <Heading
                                    fontSize={["2xl", "3xl", "4xl"]}
                                    fontWeight="800"
                                    lineHeight="1.2"
                                >
                                    {activeServiceData.title}
                                </Heading>

                                <Text
                                    fontSize="lg"
                                    lineHeight="1.8"
                                    opacity={0.95}
                                    maxW="500px"
                                >
                                    {activeServiceData.fullDesc}
                                </Text>
                            </VStack>

                            {/* Service Counter */}
                            <Flex gap={2} mt={6}>
                                {services.map((_, index) => (
                                    <Box
                                        key={index}
                                        w="30px"
                                        h="3px"
                                        bg={index + 1 === activeService ? "white" : "rgba(255,255,255,0.3)"}
                                        borderRadius="full"
                                        transition="all 0.3s"
                                    />
                                ))}
                            </Flex>
                        </VStack>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
}