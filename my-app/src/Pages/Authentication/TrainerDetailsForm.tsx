import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Text,
    VStack,
    Image,
    Select,
    useToast,
    FormErrorMessage,
    Progress,
    Divider,
    HStack,
    Icon,
    InputGroup,
    InputLeftElement,
    Textarea,
    Card,
    CardBody,
    Heading,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Checkbox,
    CheckboxGroup,
    SimpleGrid,
    Badge,
    Circle,
} from "@chakra-ui/react";
import {
    LuUser,
    LuMail,
    LuFileText,
    LuLinkedin,
    LuGraduationCap,
    LuBriefcase,
    LuAward,
    LuGlobe,
    LuCalendar,
    LuShapes
} from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { MdOutlineCastForEducation } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import FormImg from "../../Images/FormImg.png";
import axios from "axios";

interface TrainerFormData {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    expertise: string[];
    experience: string;
    education: string;
    certifications: string;
    bio: string;
    availability: string;
    timezone: string;
    resume: File | null;
    portfolio: string;
}

interface FormErrors {
    [key: string]: string;
}

interface UserData {
    name?: string;
    email?: string;
    userType?: string;
}

export default function TrainerDetailsForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    // Extract user data from navigation state
    const userData: UserData = location.state?.userData || {};

    const [formData, setFormData] = useState<TrainerFormData>({
        name: userData.name || "", // Pre-fill from registration
        email: userData.email || "", // Pre-fill from registration
        phone: "",
        linkedin: "",
        expertise: [],
        experience: "",
        education: "",
        certifications: "",
        bio: "",
        availability: "",
        timezone: "",
        resume: null,
        portfolio: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const expertiseOptions = [
        "Programming & Development",
        "Data Science & Analytics",
        "UI/UX Design",
        "Digital Marketing",
        "Project Management",
        "Cloud Computing",
        "Cybersecurity",
        "Business & Entrepreneurship",
        "Language Teaching",
        "Personal Development",
        "Graphic Design",
        "Mobile Development"
    ];

    const experienceLevels = [
        "1-2 years",
        "3-5 years",
        "6-10 years",
        "10+ years",
        "15+ years"
    ];

    const availabilityOptions = [
        "Full-time (40+ hours/week)",
        "Part-time (20-40 hours/week)",
        "Flexible (10-20 hours/week)",
        "Weekend only",
        "Evening only"
    ];

    const timezones = [
        "UTC+0 (GMT)",
        "UTC+5 (PKT)",
        "UTC-5 (EST)",
        "UTC-8 (PST)",
        "UTC+1 (CET)",
        "UTC+5:30 (IST)",
        "UTC+8 (CST)",
        "UTC+9 (JST)"
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (formData.expertise.length === 0) {
            newErrors.expertise = "Please select at least one area of expertise";
        }

        if (!formData.experience) {
            newErrors.experience = "Experience level is required";
        }

        if (!formData.bio.trim()) {
            newErrors.bio = "Professional bio is required";
        } else if (formData.bio.trim().length < 50) {
            newErrors.bio = "Bio must be at least 50 characters";
        }

        if (!formData.availability) {
            newErrors.availability = "Availability is required";
        }

        if (!formData.timezone) {
            newErrors.timezone = "Timezone is required";
        }

        if (formData.linkedin && !formData.linkedin.includes('linkedin.com')) {
            newErrors.linkedin = "Please enter a valid LinkedIn URL";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof TrainerFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ];

            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    resume: "Please upload a PDF, DOC, or DOCX file"
                }));
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({
                    ...prev,
                    resume: "File size must be less than 5MB"
                }));
                return;
            }

            handleChange("resume", file);
            setErrors(prev => ({ ...prev, resume: "" }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast({
                title: "Please correct the errors below",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                data.append(key, JSON.stringify(value));
            } else if (value !== null && value !== undefined && value !== "") {
                data.append(key, value);
            }
        });

        try {
            await axios.post("http://localhost:3001/api/trainer-details", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast({
                title: "Profile Setup Complete!",
                description: "Your trainer profile has been successfully created. Redirecting to dashboard...",
                status: "success",
                duration: 4000,
                isClosable: true,
            });

            // Add 3-second delay before redirecting (same as user details form)
            setTimeout(() => {
                navigate("/trainer-dashboard");
            }, 3000);

        } catch (error: any) {
            toast({
                title: "Submission Failed",
                description: error.response?.data?.message || "Please try again later",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const completedFields = Object.values(formData).filter(value => {
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== null && value !== undefined && value !== "";
    }).length;
    const totalFields = 8; // Updated required fields count (removed languages, currency, hourlyRate)
    const progressPercentage = (completedFields / totalFields) * 100;

    return (
        <Flex h="100vh" bg="gray.50">
            {/* Enhanced Sidebar with Theme Colors */}
            <Box
                w="350px"
                bg="#1e2738"
                p={8}
                position="relative"
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '4px',
                    height: '100%',
                    bg: '#2CA58D',
                }}
            >
                <VStack spacing={5} align="stretch">
                    {/* Header */}
                    <Box textAlign="center">
                        <Heading size="md" color="white">
                            Trainer Profile Setup
                        </Heading>
                        {userData.name && (
                            <Text fontSize="sm" color="#2CA58D" mt={2}>
                                Welcome back, {userData.name}!
                            </Text>
                        )}
                    </Box>

                    {/* Progress Section */}
                    <Box bg="rgba(44, 165, 141, 0.1)" p={6} borderRadius="xl" border="1px solid" borderColor="rgba(44, 165, 141, 0.3)">
                        <Flex justify="space-between" align="center" mb={3}>
                            <Text fontSize="sm" color="#2CA58D" fontWeight="semibold">
                                Profile Completion
                            </Text>
                            <Badge bg="#2CA58D" color="white" px={3} py={1} borderRadius="full">
                                {Math.round(progressPercentage)}%
                            </Badge>
                        </Flex>
                        <Progress
                            value={progressPercentage}
                            bg="rgba(44, 165, 141, 0.2)"
                            borderRadius="full"
                            size="lg"
                            sx={{
                                '& > div': {
                                    bg: 'linear-gradient(90deg, #2CA58D 0%, #3DB896 100%)',
                                }
                            }}
                        />
                        <Text fontSize="xs" color="gray.400" mt={2}>Complete your trainer profile</Text>
                    </Box>

                    {/* Navigation Steps */}
                    <VStack spacing={4} align="stretch" mt={"300px"}>
                        {/* Trainer Profile Step */}
                        <Box
                            bg="linear-gradient(135deg, #2CA58D 0%, #3DB896 100%)"
                            p={5}
                            borderRadius="xl"
                            position="relative"
                            boxShadow="0 8px 25px rgba(44, 165, 141, 0.3)"
                        >
                            <Flex align="center">
                                <Circle size="50px" bg="white" color="#2CA58D" mr={4}>
                                    <Icon as={LuUser} boxSize={6} />
                                </Circle>
                                <Box flex={1}>
                                    <Flex align="center" mb={1}>
                                        <Text fontWeight="bold" color="white" fontSize="md">
                                            Trainer Profile
                                        </Text>
                                    </Flex>
                                    <Text fontSize="sm" color="rgba(255,255,255,0.9)">
                                        Professional Information & Expertise
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </VStack>
                </VStack>
            </Box>

            {/* Enhanced Form Area */}
            <Box flex={1} p={6} overflowY="auto">
                <Box maxW="800px" mx="auto">
                    {/* Header Section */}
                    <Box textAlign="center" mb={6}>
                        <Heading
                            size="lg"
                            color="#1e2738"
                            mb={3}
                            fontWeight="700"
                        >
                            Trainer Profile Setup
                        </Heading>
                        <Text fontSize="lg" color="gray.600" fontWeight="medium">
                            Share your expertise and start your teaching journey
                        </Text>
                        <Box w="100px" h="4px" bg="#2CA58D" mx="auto" mt={4} borderRadius="full" />
                    </Box>

                    <Card
                        shadow="2xl"
                        borderRadius="3xl"
                        border="1px solid"
                        borderColor="gray.200"
                        bg="white"
                        overflow="hidden"
                    >
                        {/* Card Header */}
                        <Box
                            bg="linear-gradient(135deg, #1e2738 0%, #2a3441 100%)"
                            p={6}
                            borderBottom="4px solid #2CA58D"
                        >
                            <Flex align="center" justify="space-between">
                                <Box>
                                    <Text color="white" fontSize="lg" fontWeight="bold">
                                        Professional Trainer Profile
                                    </Text>
                                    <Text color="gray.300" fontSize="sm">
                                        Tell us about your expertise and teaching experience
                                    </Text>
                                </Box>
                                <Circle size="60px" bg="rgba(44, 165, 141, 0.2)" color="#2CA58D">
                                    <Icon as={LuGraduationCap} boxSize={8} />
                                </Circle>
                            </Flex>
                        </Box>

                        <CardBody p={8}>
                            <Stack spacing={8}>
                                {/* Personal Information Section */}
                                <Box>
                                    <Flex align="center" mb={6}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuUser} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Personal Information
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Your basic contact details
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={4}>
                                        <FormControl isRequired isInvalid={!!errors.name}>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Full Name
                                            </FormLabel>
                                            <Input
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={e => handleChange("name", e.target.value)}
                                                focusBorderColor="#2CA58D"
                                                borderColor="gray.300"
                                                size="md"
                                                bg={userData.name ? "rgba(44, 165, 141, 0.05)" : "gray.50"}
                                                _hover={{ borderColor: "#2CA58D" }}
                                                _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                readOnly={!!userData.name}
                                                cursor={userData.name ? "not-allowed" : "text"}
                                            />
                                            {userData.name && (
                                                <Text fontSize="xs" color="gray.500" mt={1}>
                                                    This field was pre-filled from your registration
                                                </Text>
                                            )}
                                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                                        </FormControl>

                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.email}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Email Address
                                                </FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        type="email"
                                                        placeholder="your.email@example.com"
                                                        value={formData.email}
                                                        onChange={e => handleChange("email", e.target.value)}
                                                        focusBorderColor="#2CA58D"
                                                        borderColor="gray.300"
                                                        bg={userData.email ? "rgba(44, 165, 141, 0.05)" : "gray.50"}
                                                        _hover={{ borderColor: "#2CA58D" }}
                                                        _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                        readOnly={!!userData.email}
                                                        cursor={userData.email ? "not-allowed" : "text"}
                                                    />
                                                </InputGroup>
                                                {userData.email && (
                                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                                        This field was pre-filled from your registration
                                                    </Text>
                                                )}
                                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isRequired isInvalid={!!errors.phone}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Phone Number
                                                </FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        type="tel"
                                                        placeholder="+92 333 1234567"
                                                        value={formData.phone}
                                                        onChange={e => handleChange("phone", e.target.value)}
                                                        focusBorderColor="#2CA58D"
                                                        borderColor="gray.300"
                                                        bg="gray.50"
                                                        _hover={{ borderColor: "#2CA58D" }}
                                                        _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                    />
                                                </InputGroup>
                                                <FormErrorMessage>{errors.phone}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>

                                        <FormControl isInvalid={!!errors.linkedin}>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                LinkedIn Profile
                                            </FormLabel>
                                            <InputGroup>
                                                <Input
                                                    type="url"
                                                    placeholder="https://linkedin.com/in/yourprofile"
                                                    value={formData.linkedin}
                                                    onChange={e => handleChange("linkedin", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                            </InputGroup>
                                            <FormErrorMessage>{errors.linkedin}</FormErrorMessage>
                                        </FormControl>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Professional Background Section */}
                                <Box>
                                    <Flex align="center" mb={6}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuBriefcase} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Professional Background
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Your expertise and experience
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={6}>
                                        <FormControl isRequired isInvalid={!!errors.expertise}>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Areas of Expertise
                                            </FormLabel>
                                            <CheckboxGroup
                                                value={formData.expertise}
                                                onChange={(values) => handleChange("expertise", values)}
                                            >
                                                <SimpleGrid columns={2} spacing={3}>
                                                    {expertiseOptions.map(option => (
                                                        <Checkbox key={option} value={option} colorScheme="teal">
                                                            <Text fontSize="sm">{option}</Text>
                                                        </Checkbox>
                                                    ))}
                                                </SimpleGrid>
                                            </CheckboxGroup>
                                            <FormErrorMessage>{errors.expertise}</FormErrorMessage>
                                        </FormControl>

                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.experience}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Teaching Experience
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select experience level"
                                                    value={formData.experience}
                                                    onChange={e => handleChange("experience", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {experienceLevels.map(level => (
                                                        <option key={level} value={level}>{level}</option>
                                                    ))}
                                                </Select>
                                                <FormErrorMessage>{errors.experience}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Education Level
                                                </FormLabel>
                                                <Input
                                                    placeholder="e.g., Master's in Computer Science"
                                                    value={formData.education}
                                                    onChange={e => handleChange("education", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                            </FormControl>
                                        </HStack>

                                        <FormControl isRequired isInvalid={!!errors.bio}>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Professional Bio
                                            </FormLabel>
                                            <Textarea
                                                placeholder="Tell students about your background, experience, and teaching approach..."
                                                value={formData.bio}
                                                onChange={e => handleChange("bio", e.target.value)}
                                                focusBorderColor="#2CA58D"
                                                borderColor="gray.300"
                                                bg="gray.50"
                                                rows={4}
                                                resize="vertical"
                                                _hover={{ borderColor: "#2CA58D" }}
                                                _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                            />
                                            <Text fontSize="xs" color="gray.500" mt={1}>
                                                {formData.bio.length}/500 characters (minimum 50)
                                            </Text>
                                            <FormErrorMessage>{errors.bio}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Certifications
                                            </FormLabel>
                                            <Textarea
                                                placeholder="List any relevant certifications, awards, or credentials..."
                                                value={formData.certifications}
                                                onChange={e => handleChange("certifications", e.target.value)}
                                                focusBorderColor="#2CA58D"
                                                borderColor="gray.300"
                                                bg="gray.50"
                                                rows={2}
                                                resize="vertical"
                                                _hover={{ borderColor: "#2CA58D" }}
                                                _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                            />
                                        </FormControl>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Availability Section */}
                                <Box>
                                    <Flex align="center" mb={6}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuCalendar} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Availability & Preferences
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                When you prefer to teach
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={4}>
                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.availability}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Availability
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select availability"
                                                    value={formData.availability}
                                                    onChange={e => handleChange("availability", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {availabilityOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </Select>
                                                <FormErrorMessage>{errors.availability}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isRequired isInvalid={!!errors.timezone}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Timezone
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select timezone"
                                                    value={formData.timezone}
                                                    onChange={e => handleChange("timezone", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {timezones.map(zone => (
                                                        <option key={zone} value={zone}>{zone}</option>
                                                    ))}
                                                </Select>
                                                <FormErrorMessage>{errors.timezone}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>

                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Portfolio URL (Optional)
                                            </FormLabel>
                                            <Input
                                                type="url"
                                                placeholder="https://yourportfolio.com"
                                                value={formData.portfolio}
                                                onChange={e => handleChange("portfolio", e.target.value)}
                                                focusBorderColor="#2CA58D"
                                                borderColor="gray.300"
                                                bg="gray.50"
                                                _hover={{ borderColor: "#2CA58D" }}
                                                _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                            />
                                        </FormControl>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Documents Section */}
                                <Box>
                                    <Flex align="center" mb={6}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuFileText} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Documents
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Upload your resume
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={6}>
                                        <FormControl isInvalid={!!errors.resume}>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Resume / CV (Optional)
                                            </FormLabel>
                                            <Box
                                                border="3px dashed"
                                                borderColor={formData.resume ? "#2CA58D" : "gray.300"}
                                                borderRadius="2xl"
                                                p={6}
                                                textAlign="center"
                                                position="relative"
                                                bg={formData.resume ? "rgba(44, 165, 141, 0.05)" : "gray.50"}
                                                _hover={{
                                                    borderColor: "#2CA58D",
                                                    bg: "rgba(44, 165, 141, 0.05)",
                                                    transform: "translateY(-2px)",
                                                    transition: "all 0.2s"
                                                }}
                                                transition="all 0.2s"
                                            >
                                                <Input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileChange}
                                                    position="absolute"
                                                    top="0"
                                                    left="0"
                                                    width="100%"
                                                    height="100%"
                                                    opacity="0"
                                                    cursor="pointer"
                                                />
                                                <Circle size="60px" bg={formData.resume ? "#2CA58D" : "gray.300"} color="white" mx="auto" mb={3}>
                                                    <Icon as={LuFileText} boxSize={8} />
                                                </Circle>
                                                <Text fontSize="md" fontWeight="bold" color="#1e2738" mb={1}>
                                                    {formData.resume ? formData.resume.name : "Upload your resume"}
                                                </Text>
                                                <Text fontSize="sm" color="gray.600" mb={1}>
                                                    {formData.resume ? "File uploaded successfully" : "Click to upload or drag and drop"}
                                                </Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    PDF, DOC, DOCX (Max 5MB)
                                                </Text>
                                            </Box>
                                            <FormErrorMessage>{errors.resume}</FormErrorMessage>
                                        </FormControl>
                                    </VStack>
                                </Box>

                                {/* Action Buttons */}
                                <Box pt={6}>
                                    <Flex justify="flex-end" align="center">
                                        <Button
                                            bg="linear-gradient(135deg, #2CA58D 0%, #3DB896 100%)"
                                            color="white"
                                            onClick={handleSubmit}
                                            isLoading={isSubmitting}
                                            loadingText="Setting up profile..."
                                            px={8}
                                            py={6}
                                            fontSize="md"
                                            fontWeight="bold"
                                            boxShadow="0 8px 25px rgba(44, 165, 141, 0.3)"
                                            _hover={{
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 12px 35px rgba(44, 165, 141, 0.4)"
                                            }}
                                            _active={{ transform: "translateY(0px)" }}
                                            transition="all 0.2s"
                                        >
                                            Complete Profile
                                        </Button>
                                    </Flex>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </Box>
            </Box>
        </Flex>
    );
}