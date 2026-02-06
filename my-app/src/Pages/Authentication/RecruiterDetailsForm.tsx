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
    Textarea,
    Card,
    CardBody,
    Heading,
    Badge,
    Circle
} from "@chakra-ui/react";
import {
    LuBuilding2,
    LuUser,
    LuBriefcase,
    LuMapPin,
    LuUsers
} from "react-icons/lu";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

interface FormData {
    // Personal Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    // Company Information
    companyName: string;
    companyWebsite: string;
    companySize: string;
    industry: string;
    companyDescription: string;
    companyLogo: File | null;

    // Professional Information
    jobTitle: string;
    department: string;
    yearsOfExperience: string;
    recruitingExperience: string;

    // Contact & Location
    workEmail: string;
    linkedinProfile: string;
    companyAddress: string;
    city: string;
    state: string;
    country: string;

    // Recruiting Preferences
    specializations: string[];
    typicalHiringVolume: string;
    urgentPositions: string;
    budgetRange: string;
}

interface FormErrors {
    [key: string]: string;
}

export default function RecruiterDetailsForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    // Get user data from navigation state
    const userData = location.state?.userData;

    const [formData, setFormData] = useState<FormData>({
        // Personal Information
        firstName: "",
        lastName: "",
        email: "",
        phone: "",

        // Company Information
        companyName: "",
        companyWebsite: "",
        companySize: "",
        industry: "",
        companyDescription: "",
        companyLogo: null,

        // Professional Information
        jobTitle: "",
        department: "",
        yearsOfExperience: "",
        recruitingExperience: "",

        // Contact & Location
        workEmail: "",
        linkedinProfile: "",
        companyAddress: "",
        city: "",
        state: "",
        country: "",

        // Recruiting Preferences
        specializations: [],
        typicalHiringVolume: "",
        urgentPositions: "",
        budgetRange: "",

    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

    // Pre-populate form with data from registration
    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || ""
            }));
        }
    }, [userData]);

    const companySizes = [
        "1-10 employees",
        "11-50 employees",
        "51-200 employees",
        "201-500 employees",
        "501-1000 employees",
        "1001-5000 employees",
        "5000+ employees"
    ];

    const industries = [
        "Technology",
        "Healthcare",
        "Finance & Banking",
        "Education",
        "Manufacturing",
        "Retail & E-commerce",
        "Consulting",
        "Real Estate",
        "Media & Entertainment",
        "Government",
        "Non-profit",
        "Automotive",
        "Energy & Utilities",
        "Food & Beverage",
        "Transportation",
        "Other"
    ];

    const jobTitles = [
        "HR Manager",
        "Talent Acquisition Specialist",
        "Senior Recruiter",
        "Head of Talent",
        "HR Director",
        "Talent Acquisition Manager",
        "Executive Recruiter",
        "HR Business Partner",
        "Recruitment Consultant",
        "Chief People Officer",
        "Other"
    ];

    const departments = [
        "Human Resources",
        "Talent Acquisition",
        "People Operations",
        "Executive Search",
        "Recruitment Agency",
        "Other"
    ];

    const experienceLevels = [
        "0-2 years",
        "3-5 years",
        "6-10 years",
        "11-15 years",
        "15+ years"
    ];

    const specializationOptions = [
        "Software Engineering",
        "Data Science",
        "Product Management",
        "Marketing",
        "Sales",
        "Finance",
        "Operations",
        "Design (UI/UX)",
        "Healthcare",
        "Legal",
        "Executive Leadership",
        "Customer Support",
        "DevOps/SRE",
        "Quality Assurance",
        "Business Development"
    ];

    const hiringVolumes = [
        "1-5 hires per month",
        "6-15 hires per month",
        "16-30 hires per month",
        "31-50 hires per month",
        "50+ hires per month"
    ];

    const budgetRanges = [
        "30,000 - 50,000",
        "50,000 - 80,000",
        "80,000 - 120,000",
        "120,000 - 200,000",
        "200,000+"
    ];

    const countries = [
        "Pakistan",
        "United States",
        "United Kingdom",
        "Canada",
        "Australia",
        "Germany",
        "France",
        "India",
        "Singapore",
        "UAE",
        "Other"
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Personal Information Validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }

        // Company Information Validation
        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }
        if (!formData.industry) {
            newErrors.industry = "Industry is required";
        }
        if (!formData.companySize) {
            newErrors.companySize = "Company size is required";
        }

        // Professional Information Validation
        if (!formData.jobTitle) {
            newErrors.jobTitle = "Job title is required";
        }
        if (!formData.yearsOfExperience) {
            newErrors.yearsOfExperience = "Years of experience is required";
        }

        // Location Validation
        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }
        if (!formData.country) {
            newErrors.country = "Country is required";
        }

        // URL Validations
        if (formData.companyWebsite && !formData.companyWebsite.includes('.')) {
            newErrors.companyWebsite = "Please enter a valid website URL";
        }
        if (formData.linkedinProfile && !formData.linkedinProfile.includes('linkedin.com')) {
            newErrors.linkedinProfile = "Please enter a valid LinkedIn URL";
        }
        if (formData.workEmail && formData.workEmail !== formData.email && !/\S+@\S+\.\S+/.test(formData.workEmail)) {
            newErrors.workEmail = "Please enter a valid work email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleSpecializationChange = (specialization: string) => {
        const newSpecializations = selectedSpecializations.includes(specialization)
            ? selectedSpecializations.filter(s => s !== specialization)
            : [...selectedSpecializations, specialization];

        setSelectedSpecializations(newSpecializations);
        handleChange('specializations', newSpecializations);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'companyLogo') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml"];

            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: "Please upload a JPG, JPEG, PNG, or SVG file"
                }));
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({
                    ...prev,
                    [fieldName]: "File size must be less than 5MB"
                }));
                return;
            }

            handleChange(fieldName, file);
            setErrors(prev => ({ ...prev, [fieldName]: "" }));
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
            if (value !== null && value !== undefined && value !== "") {
                if (Array.isArray(value)) {
                    data.append(key, JSON.stringify(value));
                } else {
                    data.append(key, value);
                }
            }
        });

        try {
            await axios.post("http://localhost:3001/api/submit-recruiter-details", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Store recruiter data
            localStorage.setItem('recruiterData', JSON.stringify({
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                companyName: formData.companyName
            }));

            toast({
                title: "Profile Created Successfully!",
                description: "Welcome to the platform! Your recruiter profile is now active.",
                status: "success",
                duration: 4000,
                isClosable: true,
            });

            navigate("/recruiter-dashboard");
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
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined && value !== "";
    }).length;
    const totalFields = 12;
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
                        <Text fontSize="xs" color="gray.400" mt={2}>Complete your recruiter profile</Text>
                    </Box>

                    {/* Navigation Steps */}
                    <VStack spacing={4} align="stretch" mt={"330px"}>
                        {/* Current Step - Recruiter Profile */}
                        <Box
                            bg="linear-gradient(135deg, #2CA58D 0%, #3DB896 100%)"
                            p={5}
                            borderRadius="xl"
                            position="relative"
                            boxShadow="0 8px 25px rgba(44, 165, 141, 0.3)"
                        >
                            <Flex align="center">
                                <Circle size="50px" bg="white" color="#2CA58D" mr={4}>
                                    <Icon as={LuBuilding2} boxSize={6} />
                                </Circle>
                                <Box flex={1}>
                                    <Flex align="center" mb={1}>
                                        <Text fontWeight="bold" color="white" fontSize="md">
                                            Recruiter Profile
                                        </Text>
                                    </Flex>
                                    <Text fontSize="sm" color="rgba(255,255,255,0.9)">
                                        Company & Professional Details
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
                            Create Your Recruiter Profile
                        </Heading>
                        <Text fontSize="lg" color="gray.600" fontWeight="medium">
                            Join our platform and connect with top talent
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
                                        Recruiter Registration
                                    </Text>
                                    <Text color="gray.300" fontSize="sm">
                                        Complete your profile to start recruiting
                                    </Text>
                                </Box>
                                <Circle size="60px" bg="rgba(44, 165, 141, 0.2)" color="#2CA58D">
                                    <Icon as={LuBuilding2} boxSize={8} />
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
                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.firstName}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    First Name
                                                </FormLabel>
                                                <Input
                                                    placeholder="Enter first name"
                                                    value={formData.firstName}
                                                    onChange={e => handleChange("firstName", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isRequired isInvalid={!!errors.lastName}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Last Name
                                                </FormLabel>
                                                <Input
                                                    placeholder="Enter last name"
                                                    value={formData.lastName}
                                                    onChange={e => handleChange("lastName", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>

                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.email}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Email Address
                                                </FormLabel>
                                                <Input
                                                    type="email"
                                                    placeholder="your.email@company.com"
                                                    value={formData.email}
                                                    onChange={e => handleChange("email", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isRequired isInvalid={!!errors.phone}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Phone Number
                                                </FormLabel>
                                                <Input
                                                    type="tel"
                                                    placeholder="+92 333 1234567"
                                                    value={formData.phone}
                                                    onChange={e => handleChange("phone", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.phone}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Company Information Section */}
                                <Box>
                                    <Flex align="center" mb={4}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuBuilding2} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Company Information
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Details about your organization
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={4}>
                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.companyName}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Company Name
                                                </FormLabel>
                                                <Input
                                                    placeholder="Enter company name"
                                                    value={formData.companyName}
                                                    onChange={e => handleChange("companyName", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.companyName}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isInvalid={!!errors.companyWebsite}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Company Website
                                                </FormLabel>
                                                <Input
                                                    type="url"
                                                    placeholder="https://company.com"
                                                    value={formData.companyWebsite}
                                                    onChange={e => handleChange("companyWebsite", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.companyWebsite}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>

                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.industry}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Industry
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select industry"
                                                    value={formData.industry}
                                                    onChange={e => handleChange("industry", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {industries.map(industry => (
                                                        <option key={industry} value={industry}>{industry}</option>
                                                    ))}
                                                </Select>
                                                <FormErrorMessage>{errors.industry}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isRequired isInvalid={!!errors.companySize}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Company Size
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select company size"
                                                    value={formData.companySize}
                                                    onChange={e => handleChange("companySize", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {companySizes.map(size => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </Select>
                                                <FormErrorMessage>{errors.companySize}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>

                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Company Description
                                            </FormLabel>
                                            <Textarea
                                                placeholder="Brief description of your company..."
                                                value={formData.companyDescription}
                                                onChange={e => handleChange("companyDescription", e.target.value)}
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
                                                Company Logo
                                            </FormLabel>
                                            <Box
                                                border="2px dashed"
                                                borderColor={formData.companyLogo ? "#2CA58D" : "gray.300"}
                                                borderRadius="xl"
                                                p={4}
                                                textAlign="center"
                                                position="relative"
                                                bg={formData.companyLogo ? "rgba(44, 165, 141, 0.05)" : "gray.50"}
                                                _hover={{
                                                    borderColor: "#2CA58D",
                                                    bg: "rgba(44, 165, 141, 0.05)"
                                                }}
                                            >
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={e => handleFileChange(e, 'companyLogo')}
                                                    position="absolute"
                                                    top="0"
                                                    left="0"
                                                    width="100%"
                                                    height="100%"
                                                    opacity="0"
                                                    cursor="pointer"
                                                />
                                                <Text fontSize="sm" color="gray.600">
                                                    {formData.companyLogo ? formData.companyLogo.name : "Upload company logo (JPG, PNG, SVG)"}
                                                </Text>
                                            </Box>
                                            <FormErrorMessage>{errors.companyLogo}</FormErrorMessage>
                                        </FormControl>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Professional Information Section */}
                                <Box>
                                    <Flex align="center" mb={4}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuBriefcase} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Professional Information
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Your role and experience details
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={4}>
                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.jobTitle}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Job Title
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select your job title"
                                                    value={formData.jobTitle}
                                                    onChange={e => handleChange("jobTitle", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {jobTitles.map(title => (
                                                        <option key={title} value={title}>{title}</option>
                                                    ))}
                                                </Select>
                                                <FormErrorMessage>{errors.jobTitle}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Department
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select department"
                                                    value={formData.department}
                                                    onChange={e => handleChange("department", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {departments.map(dept => (
                                                        <option key={dept} value={dept}>{dept}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </HStack>

                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.yearsOfExperience}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Years of Experience
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select experience level"
                                                    value={formData.yearsOfExperience}
                                                    onChange={e => handleChange("yearsOfExperience", e.target.value)}
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
                                                <FormErrorMessage>{errors.yearsOfExperience}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Recruiting Experience
                                                </FormLabel>
                                                <Select
                                                    placeholder="Recruiting experience"
                                                    value={formData.recruitingExperience}
                                                    onChange={e => handleChange("recruitingExperience", e.target.value)}
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
                                        </HStack>

                                        <HStack spacing={4} w="full">
                                            <FormControl isInvalid={!!errors.workEmail}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Work Email (if different)
                                                </FormLabel>
                                                <Input
                                                    type="email"
                                                    placeholder="work.email@company.com"
                                                    value={formData.workEmail}
                                                    onChange={e => handleChange("workEmail", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.workEmail}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl isInvalid={!!errors.linkedinProfile}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    LinkedIn Profile
                                                </FormLabel>
                                                <Input
                                                    type="url"
                                                    placeholder="https://linkedin.com/in/yourprofile"
                                                    value={formData.linkedinProfile}
                                                    onChange={e => handleChange("linkedinProfile", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.linkedinProfile}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Location Information Section */}
                                <Box>
                                    <Flex align="center" mb={4}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuMapPin} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Location Information
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Company location details
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={4}>
                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Company Address
                                            </FormLabel>
                                            <Input
                                                placeholder="Enter complete address"
                                                value={formData.companyAddress}
                                                onChange={e => handleChange("companyAddress", e.target.value)}
                                                focusBorderColor="#2CA58D"
                                                borderColor="gray.300"
                                                size="md"
                                                bg="gray.50"
                                                _hover={{ borderColor: "#2CA58D" }}
                                                _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                            />
                                        </FormControl>

                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.city}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    City
                                                </FormLabel>
                                                <Input
                                                    placeholder="Enter city"
                                                    value={formData.city}
                                                    onChange={e => handleChange("city", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.city}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    State/Province
                                                </FormLabel>
                                                <Input
                                                    placeholder="Enter state/province"
                                                    value={formData.state}
                                                    onChange={e => handleChange("state", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                            </FormControl>

                                            <FormControl isRequired isInvalid={!!errors.country}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Country
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select country"
                                                    value={formData.country}
                                                    onChange={e => handleChange("country", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {countries.map(country => (
                                                        <option key={country} value={country}>{country}</option>
                                                    ))}
                                                </Select>
                                                <FormErrorMessage>{errors.country}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Recruiting Preferences Section */}
                                <Box>
                                    <Flex align="center" mb={4}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuUsers} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Recruiting Preferences
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Your recruiting specializations and volume
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={4}>
                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Specializations (Select multiple)
                                            </FormLabel>
                                            <Box
                                                border="1px solid"
                                                borderColor="gray.300"
                                                borderRadius="md"
                                                p={4}
                                                bg="gray.50"
                                                maxH="200px"
                                                overflowY="auto"
                                            >
                                                <Flex wrap="wrap" gap={2}>
                                                    {specializationOptions.map(spec => (
                                                        <Badge
                                                            key={spec}
                                                            colorScheme={selectedSpecializations.includes(spec) ? "green" : "gray"}
                                                            cursor="pointer"
                                                            onClick={() => handleSpecializationChange(spec)}
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            _hover={{
                                                                transform: "translateY(-1px)",
                                                                boxShadow: "sm"
                                                            }}
                                                        >
                                                            {spec}
                                                        </Badge>
                                                    ))}
                                                </Flex>
                                            </Box>
                                            <Text fontSize="xs" color="gray.600" mt={1}>
                                                Click on specializations to select/deselect
                                            </Text>
                                        </FormControl>

                                        <HStack spacing={4} w="full">
                                            <FormControl>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Typical Hiring Volume
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select hiring volume"
                                                    value={formData.typicalHiringVolume}
                                                    onChange={e => handleChange("typicalHiringVolume", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {hiringVolumes.map(volume => (
                                                        <option key={volume} value={volume}>{volume}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Budget Range
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select typical budget range"
                                                    value={formData.budgetRange}
                                                    onChange={e => handleChange("budgetRange", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {budgetRanges.map(range => (
                                                        <option key={range} value={range}>{range}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </HStack>

                                        <FormControl>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Current Urgent Positions
                                            </FormLabel>
                                            <Textarea
                                                placeholder="Describe any positions you're urgently looking to fill..."
                                                value={formData.urgentPositions}
                                                onChange={e => handleChange("urgentPositions", e.target.value)}
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

                                {/* Action Buttons */}
                                <Box pt={6}>
                                    <Flex justify="flex-end" align="center">
                                        <Button
                                            bg="linear-gradient(135deg, #2CA58D 0%, #3DB896 100%)"
                                            color="white"
                                            onClick={handleSubmit}
                                            isLoading={isSubmitting}
                                            loadingText="Creating Profile..."
                                            px={8}
                                            py={3}
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