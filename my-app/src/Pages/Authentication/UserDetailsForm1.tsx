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
    Select,
    useToast,
    FormErrorMessage,
    Progress,
    Divider,
    HStack,
    Icon,
    InputGroup,
    Textarea,
    Card,
    CardBody,
    Heading,
    Badge,
    Circle,
} from "@chakra-ui/react";
import { LuShapes, LuUser, LuMail, LuFileText } from "react-icons/lu";
import { TbDisabled2 } from "react-icons/tb";
import { MdOutlineCastForEducation } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

interface FormData {
    name: string;
    age: string;
    gender: string;
    role: string;
    email: string;
    linkedin: string;
    resume: File | null;
    phone?: string;
    experience?: string;
    summary?: string;
    hasDisability?: string;
    disabilityCategories?: string[];
    accommodationsNeeded?: string;
    assistiveTechnologies?: string;
    workPreferences?: string[];
}

interface FormErrors {
    [key: string]: string;
}

export default function UserDetailsForm1() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const userData = location.state?.userData;

    const [formData, setFormData] = useState<FormData>({
        name: "",
        age: "",
        gender: "",
        role: "",
        email: "",
        linkedin: "",
        resume: null,
        phone: "",
        experience: "",
        summary: "",
        hasDisability: "",
        disabilityCategories: [],
        accommodationsNeeded: "",
        assistiveTechnologies: "",
        workPreferences: [],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                name: userData.name || "",
                email: userData.email || ""
            }));
        }
    }, [userData]);

    const roleOptions = [
        "Customer Support",
        "Data Entry Specialist",
        "Content Writer",
        "Transcriptionist",
        "Technical Support Specialist",
        "Online Tutor",
        "Social Media Manager",
        "Graphic Designer",
        "Web Content Manager",
        "Research Analyst",
        "Administrative Assistant",
        "Sales Representative",
        "Call Center Agent",
    ];

    const experienceLevels = [
        "Entry Level (0-1 years)",
        "Junior (1-3 years)",
        "Mid-Level (3-5 years)",
        "Senior (5-8 years)",
        "Lead (8+ years)",
        "Executive (10+ years)"
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

        if (!formData.age) {
            newErrors.age = "Age is required";
        } else if (parseInt(formData.age) < 16 || parseInt(formData.age) > 80) {
            newErrors.age = "Age must be between 16 and 80";
        }

        if (!formData.gender) {
            newErrors.gender = "Gender is required";
        }

        if (!formData.role) {
            newErrors.role = "Role is required";
        }

        if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (formData.linkedin && !formData.linkedin.includes('linkedin.com')) {
            newErrors.linkedin = "Please enter a valid LinkedIn URL";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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

            if (file.size > 5 * 1024 * 1024) {
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

    const handleNext = async () => {
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
            if (key === 'disabilityCategories' || key === 'workPreferences') {
                if (Array.isArray(value) && value.length > 0) {
                    data.append(key, JSON.stringify(value));
                }
            } else if (value !== null && value !== undefined && value !== "") {
                data.append(key, value);
            }
        });

        try {
            await axios.post("http://localhost:3001/api/users/submit-details", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            localStorage.setItem('userDisabilityInfo', JSON.stringify({
                hasDisability: formData.hasDisability,
                disabilityCategories: formData.disabilityCategories || [],
            }));

            const userData = {
                email: formData.email,
                name: formData.name,
                hasDisabilityInfo: formData.hasDisability === 'yes'
            };

            localStorage.setItem('userData', JSON.stringify(userData));

            toast({
                title: "Application Submitted Successfully!",
                description: "Your details have been saved. Proceeding to education details.",
                status: "success",
                duration: 4000,
                isClosable: true,
            });

            navigate("/education-details", {
                state: { userData }
            });
        } catch (error: any) {
            console.error('Submission error:', error);
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

    const completedFields = Object.values(formData).filter(value =>
        value !== null && value !== undefined && value !== ""
    ).length;
    const totalFields = 7;
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
                            Application Progress
                        </Heading>
                    </Box>

                    {/* Progress Section */}
                    <Box bg="rgba(44, 165, 141, 0.1)" p={6} borderRadius="xl" border="1px solid" borderColor="rgba(44, 165, 141, 0.3)">
                        <Flex justify="space-between" align="center" mb={3}>
                            <Text fontSize="sm" color="#2CA58D" fontWeight="semibold">
                                Overall Progress
                            </Text>
                            <Badge bg="#2CA58D" color="white" px={3} py={1} borderRadius="full">
                                50%
                            </Badge>
                        </Flex>
                        <Progress
                            value={50}
                            bg="rgba(44, 165, 141, 0.2)"
                            borderRadius="full"
                            size="lg"
                            sx={{
                                '& > div': {
                                    bg: 'linear-gradient(90deg, #2CA58D 0%, #3DB896 100%)',
                                }
                            }}
                        />
                        <Text fontSize="xs" color="gray.400" mt={2}>Step 1 of 2</Text>
                    </Box>

                    {/* Navigation Steps */}
                    <VStack spacing={4} align="stretch" mt={"200px"}>
                        {/* Current Step - Basic Details */}
                        <Box
                            bg="linear-gradient(135deg, #2CA58D 0%, #3DB896 100%)"
                            p={5}
                            borderRadius="xl"
                            position="relative"
                            boxShadow="0 8px 25px rgba(44, 165, 141, 0.3)"
                        >
                            <Flex align="center">
                                <Circle size="50px" bg="white" color="#2CA58D" mr={4}>
                                    <Icon as={LuShapes} boxSize={6} />
                                </Circle>
                                <Box flex={1}>
                                    <Flex align="center" mb={1}>
                                        <Text fontWeight="bold" color="white" fontSize="md">
                                            Basic Details
                                        </Text>
                                    </Flex>
                                    <Text fontSize="sm" color="rgba(255,255,255,0.9)">
                                        Personal & Contact Information
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>

                        {/* Next Step - Education Details */}
                        <Box
                            bg="rgba(255,255,255,0.05)"
                            p={5}
                            borderRadius="xl"
                            border="1px solid rgba(255,255,255,0.1)"
                            opacity={0.7}
                        >
                            <Flex align="center">
                                <Circle size="50px" bg="rgba(255,255,255,0.1)" color="gray.400" mr={4}>
                                    <Icon as={MdOutlineCastForEducation} boxSize={6} />
                                </Circle>
                                <Box>
                                    <Text fontWeight="semibold" color="gray.300" fontSize="md">
                                        Education Details
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Academic Background & Qualifications
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </VStack>
                </VStack>
            </Box>

            {/* Enhanced Form Area */}
            <Box flex={1} p={6} overflowY="auto">
                <Box maxW="700px" mx="auto">
                    {/* Header Section */}
                    <Box textAlign="center" mb={6}>
                        <Heading
                            size="lg"
                            color="#1e2738"
                            mb={3}
                            fontWeight="700"
                        >
                            Profile Setup
                        </Heading>
                        {userData && (
                            <Text fontSize="lg" color="gray.600" fontWeight="medium">
                                Welcome, <Text as="span" color="#2CA58D" fontWeight="bold">{userData.name}</Text>!
                                Let's complete your professional profile.
                            </Text>
                        )}
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
                                        Step 1: Basic Information
                                    </Text>
                                    <Text color="gray.300" fontSize="sm">
                                        Fill in your personal and professional details
                                    </Text>
                                </Box>
                                <Circle size="60px" bg="rgba(44, 165, 141, 0.2)" color="#2CA58D">
                                    <Icon as={LuUser} boxSize={8} />
                                </Circle>
                            </Flex>
                        </Box>

                        <CardBody p={8}>
                            <Stack spacing={6}>
                                {/* Personal Information Section */}
                                <Box>
                                    <Flex align="center" mb={4}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuUser} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Personal Information
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Your basic personal details
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
                                                bg="gray.50"
                                                _hover={{ borderColor: "#2CA58D" }}
                                                _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                            />
                                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                                        </FormControl>

                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.age}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Age
                                                </FormLabel>
                                                <Input
                                                    type="number"
                                                    placeholder="Age"
                                                    value={formData.age}
                                                    onChange={e => handleChange("age", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    min="16"
                                                    max="80"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.age}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isRequired isInvalid={!!errors.gender}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Gender
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select gender"
                                                    value={formData.gender}
                                                    onChange={e => handleChange("gender", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </Select>
                                                <FormErrorMessage>{errors.gender}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Professional Information Section */}
                                <Box>
                                    <Flex align="center" mb={4}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuShapes} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Professional Information
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Your career and experience details
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={4}>
                                        <FormControl isRequired isInvalid={!!errors.role}>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Interested Role
                                            </FormLabel>
                                            <Select
                                                placeholder="Select your desired role"
                                                value={formData.role}
                                                onChange={e => handleChange("role", e.target.value)}
                                                focusBorderColor="#2CA58D"
                                                borderColor="gray.300"
                                                size="md"
                                                bg="gray.50"
                                                _hover={{ borderColor: "#2CA58D" }}
                                                _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                            >
                                                {roleOptions.map(role => (
                                                    <option key={role} value={role}>{role}</option>
                                                ))}
                                            </Select>
                                            <FormErrorMessage>{errors.role}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Experience Level
                                            </FormLabel>
                                            <Select
                                                placeholder="Select your experience level"
                                                value={formData.experience}
                                                onChange={e => handleChange("experience", e.target.value)}
                                                focusBorderColor="#2CA58D"
                                                borderColor="gray.300"
                                                size="md"
                                                bg="gray.50"
                                                _hover={{ borderColor: "#2CA58D" }}
                                                _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                            >
                                                {experienceLevels.map(level => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Professional Summary
                                            </FormLabel>
                                            <Textarea
                                                placeholder="Brief summary of your professional background and goals..."
                                                value={formData.summary}
                                                onChange={e => handleChange("summary", e.target.value)}
                                                focusBorderColor="#2CA58D"
                                                borderColor="gray.300"
                                                bg="gray.50"
                                                rows={3}
                                                resize="vertical"
                                                _hover={{ borderColor: "#2CA58D" }}
                                                _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                            />
                                        </FormControl>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Accessibility & Support Information Section */}
                                <Box>
                                    <Flex align="center" mb={4}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={TbDisabled2} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Accessibility & Support Information
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Help us understand how we can better support you
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={4}>
                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Do you have a disability or condition that may require workplace accommodations?
                                            </FormLabel>
                                            <Select
                                                placeholder="Select an option"
                                                value={formData.hasDisability}
                                                onChange={e => handleChange("hasDisability", e.target.value)}
                                                focusBorderColor="#2CA58D"
                                                borderColor="gray.300"
                                                size="md"
                                                bg="gray.50"
                                                _hover={{ borderColor: "#2CA58D" }}
                                                _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                            >
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                                <option value="prefer-not-to-say">Prefer not to say</option>
                                            </Select>
                                        </FormControl>

                                        {formData.hasDisability === 'yes' && (
                                            <>
                                                <FormControl>
                                                    <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                        Disability Category (Select all that apply)
                                                    </FormLabel>
                                                    <VStack align="start" spacing={2} p={4} bg="gray.50" borderRadius="md">
                                                        {[
                                                            'Vision impairment',
                                                            'Hearing impairment',
                                                            'Physical/Mobility impairment',
                                                            'Speech/Communication impairment',
                                                        ].map((category) => (
                                                            <Box key={category}>
                                                                <input
                                                                    type="checkbox"
                                                                    id={category}
                                                                    value={category}
                                                                    checked={formData.disabilityCategories?.includes(category) || false}
                                                                    onChange={(e) => {
                                                                        const categories = formData.disabilityCategories || [];
                                                                        if (e.target.checked) {
                                                                            handleChange("disabilityCategories", [...categories, category]);
                                                                        } else {
                                                                            handleChange("disabilityCategories", categories.filter(c => c !== category));
                                                                        }
                                                                    }}
                                                                    style={{ marginRight: '8px' }}
                                                                />
                                                                <label htmlFor={category} style={{ fontSize: '14px', color: '#2d3748' }}>
                                                                    {category}
                                                                </label>
                                                            </Box>
                                                        ))}
                                                    </VStack>
                                                </FormControl>

                                                <FormControl>
                                                    <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                        Workplace Accommodations Needed
                                                    </FormLabel>
                                                    <Textarea
                                                        placeholder="Please describe any workplace accommodations that would help you perform your job effectively (e.g., screen reader software, flexible hours, ergonomic equipment, quiet workspace, etc.)"
                                                        value={formData.accommodationsNeeded}
                                                        onChange={e => handleChange("accommodationsNeeded", e.target.value)}
                                                        focusBorderColor="#2CA58D"
                                                        borderColor="gray.300"
                                                        bg="gray.50"
                                                        rows={4}
                                                        resize="vertical"
                                                        _hover={{ borderColor: "#2CA58D" }}
                                                        _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                    />
                                                    <Text fontSize="xs" color="gray.500" mt={1}>
                                                        This information helps employers prepare appropriate support and accommodations
                                                    </Text>
                                                </FormControl>

                                                <FormControl>
                                                    <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                        Assistive Technologies You Use
                                                    </FormLabel>
                                                    <Textarea
                                                        placeholder="List any assistive technologies or tools you currently use (e.g., screen readers, voice recognition software, mobility aids, communication devices, etc.)"
                                                        value={formData.assistiveTechnologies}
                                                        onChange={e => handleChange("assistiveTechnologies", e.target.value)}
                                                        focusBorderColor="#2CA58D"
                                                        borderColor="gray.300"
                                                        bg="gray.50"
                                                        rows={3}
                                                        resize="vertical"
                                                        _hover={{ borderColor: "#2CA58D" }}
                                                        _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                    />
                                                </FormControl>

                                                <FormControl>
                                                    <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                        Work Environment Preferences
                                                    </FormLabel>
                                                    <VStack align="start" spacing={2} p={4} bg="gray.50" borderRadius="md">
                                                        {[
                                                            'Remote work',
                                                            'On-site work'
                                                        ].map((preference) => (
                                                            <Box key={preference}>
                                                                <input
                                                                    type="checkbox"
                                                                    id={preference}
                                                                    value={preference}
                                                                    checked={formData.workPreferences?.includes(preference) || false}
                                                                    onChange={(e) => {
                                                                        const preferences = formData.workPreferences || [];
                                                                        if (e.target.checked) {
                                                                            handleChange("workPreferences", [...preferences, preference]);
                                                                        } else {
                                                                            handleChange("workPreferences", preferences.filter(p => p !== preference));
                                                                        }
                                                                    }}
                                                                    style={{ marginRight: '8px' }}
                                                                />
                                                                <label htmlFor={preference} style={{ fontSize: '14px', color: '#2d3748' }}>
                                                                    {preference}
                                                                </label>
                                                            </Box>
                                                        ))}
                                                    </VStack>
                                                </FormControl>
                                            </>
                                        )}

                                        <Box bg="blue.50" p={4} borderRadius="md" border="1px solid" borderColor="blue.200">
                                            <Text fontSize="sm" color="blue.800" fontWeight="semibold" mb={2}>
                                                Privacy & Data Protection
                                            </Text>
                                            <Text fontSize="xs" color="blue.700" lineHeight="1.5">
                                                Your disability information is completely voluntary and confidential. This data is used solely to:
                                                • Match you with inclusive employers and suitable opportunities
                                                • Provide appropriate accommodations during the application process
                                                • Connect you with relevant resources and support services
                                                • Improve our platform's accessibility features

                                                You can update or remove this information at any time from your profile settings.
                                            </Text>
                                        </Box>
                                    </VStack>
                                </Box>

                                {/* Contact Information Section */}
                                <Box>
                                    <Flex align="center" mb={4}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuMail} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Contact Information
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                How we can reach you
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={4}>
                                        <FormControl isRequired isInvalid={!!errors.email}>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Email Address
                                            </FormLabel>
                                            <InputGroup size="md">
                                                <Input
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    value={formData.email}
                                                    onChange={e => handleChange("email", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                            </InputGroup>
                                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                                        </FormControl>

                                        <HStack spacing={4} w="full">
                                            <FormControl isInvalid={!!errors.phone}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Phone Number
                                                </FormLabel>
                                                <InputGroup size="md">
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

                                            <FormControl isInvalid={!!errors.linkedin}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    LinkedIn Profile
                                                </FormLabel>
                                                <InputGroup size="md">
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
                                        </HStack>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Document Upload Section */}
                                <Box>
                                    <Flex align="center" mb={4}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuFileText} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Documents
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Upload your resume or CV
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <FormControl isInvalid={!!errors.resume}>
                                        <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                            Resume / CV
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
                                </Box>

                                {/* Action Buttons */}
                                <Box pt={6}>
                                    <Flex justify="flex-end" align="center">
                                        <Button
                                            bg="linear-gradient(135deg, #2CA58D 0%, #3DB896 100%)"
                                            color="white"
                                            onClick={handleNext}
                                            isLoading={isSubmitting}
                                            loadingText="Submitting..."
                                            px={6}
                                            py={2}
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
                                            Next
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