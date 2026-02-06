import {
    Box,
    Flex,
    Heading,
    Text,
    Input,
    Textarea,
    Button,
    Icon,
    Stack,
    FormControl,
    FormLabel,
    Container,
    VStack,
    HStack,
    useToast,
} from "@chakra-ui/react";
import { MdEmail, MdCall, MdLocationOn, MdSchedule } from "react-icons/md";
import { FaPhoneAlt, FaEnvelope, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";

export default function ContactUs() {
    const toast = useToast();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add form submission logic here
        toast({
            title: "Message sent successfully!",
            description: "We'll get back to you within 24 hours.",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        // Reset form
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            message: ""
        });
    };

    const contactInfo = [
        {
            icon: FaPhoneAlt,
            title: "Call Us Directly",
            subtitle: "Ready to help you",
            details: "+92-320-8139253",
            color: "#2CA58D"
        },
        {
            icon: FaEnvelope,
            title: "Email Support",
            subtitle: "24/7 assistance",
            details: "abletech.connect@gmail.com",
            color: "#2D3E5E"
        },
        {
            icon: FaMapMarkerAlt,
            title: "Visit Our Office",
            subtitle: "Come meet our team",
            details: "Karachi, Pakistan",
            color: "#2CA58D"
        },
        {
            icon: FaClock,
            title: "Business Hours",
            subtitle: "Always here for you",
            details: "Mon-Fri: 9AM-6PM",
            color: "#2D3E5E"
        }
    ];

    return (
        <Box id="contact-us" bg="white" py={{ base: 10, md: 20 }}>
            <Container maxW="1200px">
                {/* Header Section */}
                <VStack spacing={6} textAlign="center" mb={16}>
                    <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="#2CA58D"
                        textTransform="uppercase"
                        letterSpacing="2px"
                    >
                        Get In Touch
                    </Text>
                    <Heading
                        fontSize={["2xl", "3xl", "4xl", "5xl"]}
                        color="#2D3E5E"
                        fontWeight="800"
                        lineHeight="1.2"
                    >
                        Ready to{" "}
                        <Box as="span" color="#2CA58D">
                            Transform Your Future?
                        </Box>
                    </Heading>
                    <Text
                        fontSize="lg"
                        color="gray.600"
                        maxW="600px"
                        lineHeight="1.8"
                    >
                        We're here to support your journey every step of the way.
                        Reach out and let's build something amazing together.
                    </Text>
                </VStack>

                <Flex
                    direction={{ base: "column", lg: "row" }}
                    gap={12}
                    align="stretch"
                >
                    {/* Left Section - Contact Info */}
                    <Box flex={1}>
                        <VStack align="stretch" spacing={8}>
                            <Box>
                                <Heading fontSize="2xl" mb={4} color="#2D3E5E">
                                    Let's Start a Conversation
                                </Heading>
                                <Text fontSize="md" color="gray.600" lineHeight="1.8">
                                    We believe in the power of connection. Whether you have questions,
                                    need support, or want to explore opportunities, our dedicated team
                                    is ready to listen and help you succeed.
                                </Text>
                            </Box>

                            <Stack spacing={6}>
                                {contactInfo.map((info, index) => (
                                    <Flex key={index} align="center" gap={4}>
                                        <Box
                                            p={3}
                                            bg={`${info.color}15`}
                                            borderRadius="xl"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Icon
                                                as={info.icon}
                                                boxSize={5}
                                                color={info.color}
                                            />
                                        </Box>
                                        <Box>
                                            <Text fontWeight="700" fontSize="md" color="#2D3E5E">
                                                {info.title}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500" mb={1}>
                                                {info.subtitle}
                                            </Text>
                                            <Text fontSize="md" color="gray.700" fontWeight="500">
                                                {info.details}
                                            </Text>
                                        </Box>
                                    </Flex>
                                ))}
                            </Stack>

                            {/* Success Promise */}
                            <Box
                                p={6}
                                bg="linear-gradient(135deg, #2CA58D15, #2D3E5E15)"
                                borderRadius="xl"
                                border="1px solid"
                                borderColor="gray.100"
                            >
                                <Text fontWeight="700" fontSize="lg" color="#2D3E5E" mb={2}>
                                    Our Promise to You
                                </Text>
                                <Text fontSize="sm" color="gray.600" lineHeight="1.7">
                                    Every inquiry is met with genuine care and expertise.
                                    We're committed to understanding your unique needs and
                                    providing solutions that truly make a difference.
                                </Text>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Right Section - Contact Form */}
                    <Box
                        flex={1}
                        bg="gray.50"
                        p={8}
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor="gray.100"
                    >
                        <VStack align="stretch" spacing={6}>
                            <Box textAlign="center">
                                <Heading fontSize="xl" mb={2} color="#2D3E5E">
                                    Send Us a Message
                                </Heading>
                                <Text fontSize="sm" color="gray.600">
                                    Fill out the form below and we'll respond within 24 hours
                                </Text>
                            </Box>

                            <form onSubmit={handleSubmit}>
                                <VStack spacing={6}>
                                    <Flex gap={4} w="full">
                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="600" color="#2D3E5E">
                                                First Name *
                                            </FormLabel>
                                            <Input
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                bg="white"
                                                placeholder="Enter your first name"
                                                size="md"
                                                borderRadius="lg"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "#2CA58D",
                                                    boxShadow: "0 0 0 1px #2CA58D"
                                                }}
                                                required
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="600" color="#2D3E5E">
                                                Last Name *
                                            </FormLabel>
                                            <Input
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                bg="white"
                                                placeholder="Enter your last name"
                                                size="md"
                                                borderRadius="lg"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                _focus={{
                                                    borderColor: "#2CA58D",
                                                    boxShadow: "0 0 0 1px #2CA58D"
                                                }}
                                                required
                                            />
                                        </FormControl>
                                    </Flex>

                                    <FormControl>
                                        <FormLabel fontSize="sm" fontWeight="600" color="#2D3E5E">
                                            Email Address *
                                        </FormLabel>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            bg="white"
                                            placeholder="your.email@example.com"
                                            size="md"
                                            borderRadius="lg"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            _focus={{
                                                borderColor: "#2CA58D",
                                                boxShadow: "0 0 0 1px #2CA58D"
                                            }}
                                            required
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel fontSize="sm" fontWeight="600" color="#2D3E5E">
                                            Message *
                                        </FormLabel>
                                        <Textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            bg="white"
                                            placeholder="Tell us how we can help you..."
                                            size="md"
                                            borderRadius="lg"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            rows={5}
                                            _focus={{
                                                borderColor: "#2CA58D",
                                                boxShadow: "0 0 0 1px #2CA58D"
                                            }}
                                            required
                                        />
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        bg="#2CA58D"
                                        color="white"
                                        size="lg"
                                        width="full"
                                        fontWeight="600"
                                        borderRadius="lg"
                                        py={6}
                                        transition="all 0.3s"
                                        _hover={{
                                            bg: "#27967F",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 8px 25px rgba(44, 165, 141, 0.3)"
                                        }}
                                        _active={{ transform: "translateY(0)" }}
                                    >
                                        Send Message
                                    </Button>
                                </VStack>
                            </form>
                        </VStack>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
}