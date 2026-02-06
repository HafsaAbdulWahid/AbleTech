import {
    Box,
    Text,
    Button,
    Stack,
    Image,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Link,
    Flex,
    RadioGroup,
    Radio,
    FormErrorMessage,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton,
    VStack,
    HStack,
    Container,
    useToast,
    Spinner,
    Circle,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    ViewIcon,
    ViewOffIcon,
    EmailIcon,
    LockIcon,
    AtSignIcon,
    CheckCircleIcon,
} from "@chakra-ui/icons";
import { useUser } from "../UserDashboard/UserContext";
import Logo from "../../Images/Logo.png";
import authImg1 from "../../Images/authImg1.png";
import authImg2 from "../../Images/authImg2.png";
import authImg3 from "../../Images/authImg3.png";

interface FormData {
    name: string;
    email: string;
    password: string;
    userType: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    userType?: string;
}

export default function RegisterForm() {
    const navigate = useNavigate();
    const toast = useToast();
    const { setUser } = useUser();

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        userType: "", 
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Validation functions
    const validateEmail = (email: string): string | undefined => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "Email is required";
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        return undefined;
    };

    const validatePassword = (password: string): string | undefined => {
        if (!password) return "Password is required";
        if (password.length < 8) return "Password must be at least 8 characters long";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        return undefined;
    };

    const validateName = (name: string): string | undefined => {
        if (!name) return "Full name is required";
        if (name.trim().length < 2) return "Name must be at least 2 characters long";
        if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
        return undefined;
    };

    const validateUserType = (userType: string): string | undefined => {
        if (!userType) return "Please select your role";
        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            name: validateName(formData.name),
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            userType: validateUserType(formData.userType), 
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== undefined);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        let error: string | undefined;
        switch (field) {
            case 'name':
                error = validateName(formData.name);
                break;
            case 'email':
                error = validateEmail(formData.email);
                break;
            case 'password':
                error = validatePassword(formData.password);
                break;
            case 'userType':
                error = validateUserType(formData.userType);
                break;
        }

        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    // Function to get redirect path based on user type
    const getRedirectPath = (userType: string): string => {
        switch (userType) {
            case 'User':
                return '/user-details';
            case 'Trainer':
                return '/trainer-details';
            case 'Recruiter':
                return '/recruiter-details'; 
            default:
                return '/user-details'; 
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast({
                title: "Please check your information",
                description: "Some fields need your attention",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            // Add 2-3 second delay before making the API call
            await new Promise(resolve => setTimeout(resolve, 2500));

            const response = await axios.post("http://localhost:3001/api/register", formData);

             // Store user data in context after successful registration
            setUser({
                name: formData.name,
                email: formData.email,
                userType: formData.userType
            });

            // Show success toast with user type specific message
            const userTypeMessages = {
                'User': 'Your job seeker account has been created successfully',
                'Trainer': 'Your trainer account has been created successfully',
                'Recruiter': 'Your recruiter account has been created successfully'
            };

            toast({
                title: "Welcome aboard! 🎉",
                description: userTypeMessages[formData.userType as keyof typeof userTypeMessages] || "Your account has been created successfully",
                status: "success",
                duration: 4000,
                isClosable: true,
            });

            // Wait another moment before redirecting to the appropriate form
            setTimeout(() => {
                const redirectPath = getRedirectPath(formData.userType);
                // Pass user data to the next form
                navigate(redirectPath, { 
                    state: { 
                        userData: {
                            name: formData.name,
                            email: formData.email,
                            userType: formData.userType
                        }
                    }
                });
            }, 1000);

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";

            toast({
                title: "Registration Failed",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box minH="100vh" bg="#1e2738" position="relative" overflow="hidden">
            {/* Background decoration */}
            <Box position="absolute" top="0" left="0" w="100%" h="100%">
                <Circle
                    size="400px"
                    bg="rgba(44, 165, 141, 0.3)"
                    position="absolute"
                    top="-200px"
                    right="-200px"
                />
                <Circle
                    size="300px"
                    bg="rgba(44, 165, 141, 0.3)"
                    position="absolute"
                    bottom="-150px"
                    left="-150px"
                />
            </Box>

            <Container maxW="7xl" py={12} position="relative" zIndex={1}>
                <Flex direction={{ base: "column", lg: "row" }} align="center" gap={16}>

                    {/* Left Side - Branding */}
                    <VStack flex="1" align="flex-start" spacing={5} pr={{ lg: 8 }}>
                        <Box>
                            <Heading
                                fontSize={{ base: "3xl", md: "5xl" }}
                                color="white"
                                fontWeight="800"
                                lineHeight="1.2"
                                mb={6}
                            >
                                Start Your
                                <Text as="span" color="#2CA58D" display="block">
                                    Professional Journey
                                </Text>
                            </Heading>
                            <Text fontSize="xl" color="whiteAlpha.800" mb={8} maxW="500px">
                                Join thousands of professionals who are already building their careers with us.
                            </Text>
                        </Box>

                        {/* Stats */}
                        <HStack spacing={12} display={{ base: "none", lg: "flex" }}>
                            <VStack spacing={2}>
                                <Text fontSize="3xl" fontWeight="bold" color="#2CA58D">50K+</Text>
                                <Text color="whiteAlpha.700" fontSize="sm">Active Users</Text>
                            </VStack>
                            <VStack spacing={2}>
                                <Text fontSize="3xl" fontWeight="bold" color="#2CA58D">15K+</Text>
                                <Text color="whiteAlpha.700" fontSize="sm">Jobs Posted</Text>
                            </VStack>
                            <VStack spacing={2}>
                                <Text fontSize="3xl" fontWeight="bold" color="#2CA58D">95%</Text>
                                <Text color="whiteAlpha.700" fontSize="sm">Success Rate</Text>
                            </VStack>
                        </HStack>

                        {/* Floating Images */}
                        <Box position="relative" w="100%" h="300px" display={{ base: "none", lg: "block" }}>
                            {[
                                { src: authImg1, top: "20px", left: "0px", delay: "0s" },
                                { src: authImg2, top: "20px", right: "290px", delay: "1s" },
                                { src: authImg3, bottom: "100px", left: "120px", delay: "2s" },
                            ].map((item, index) => (
                                <Box
                                    key={index}
                                    position="absolute"
                                    {...{ [item.top ? 'top' : 'bottom']: item.top || item.bottom }}
                                    {...{ [item.left ? 'left' : 'right']: item.left || item.right }}
                                    w="80px"
                                    h="80px"
                                    borderRadius="20px"
                                    overflow="hidden"
                                    boxShadow="0 10px 30px rgba(0,0,0,0.3)"
                                    animation={`float 3s ease-in-out infinite ${item.delay}`}
                                    bg="white"
                                    p="4px"
                                >
                                    <Image
                                        src={item.src}
                                        alt={`User ${index + 1}`}
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        borderRadius="16px"
                                    />
                                </Box>
                            ))}
                        </Box>
                    </VStack>

                    {/* Right Side - Form (Decreased Width) */}
                    <Box flex="1" maxW="450px" w="100%" mr={"90px"}>
                        <Box
                            bg="white"
                            borderRadius="32px"
                            p={8}
                            boxShadow="0 25px 50px rgba(0, 0, 0, 0.25)"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            position="relative"
                        >
                            <VStack spacing={2} mb={8}>
                                <Heading fontSize="2xl" color="gray.800" textAlign="center">
                                    Create Account
                                </Heading>
                                <Text color="gray.500" fontSize="sm" textAlign="center">
                                    Fill in your details to get started
                                </Text>
                            </VStack>

                            <form onSubmit={handleSubmit}>
                                <VStack spacing={5}>
                                    {/* Name Field */}
                                    <FormControl isInvalid={!!(errors.name && touched.name)} isRequired>
                                        <FormLabel
                                            fontSize="sm"
                                            color="gray.700"
                                            fontWeight="600"
                                            mb={3}
                                        >
                                            Full Name
                                        </FormLabel>
                                        <InputGroup size="lg">
                                            <InputLeftElement>
                                                <AtSignIcon color="gray.400" boxSize={4} />
                                            </InputLeftElement>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('name')}
                                                placeholder="Enter your full name"
                                                borderRadius="16px"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                bg="gray.50"
                                                _hover={{ borderColor: "gray.300" }}
                                                _focus={{
                                                    borderColor: "#2CA58D",
                                                    boxShadow: "0 0 0 1px #2CA58D",
                                                    bg: "white"
                                                }}
                                                fontSize="md"
                                            />
                                            {formData.name && !errors.name && (
                                                <InputRightElement>
                                                    <CheckCircleIcon color="green.500" />
                                                </InputRightElement>
                                            )}
                                        </InputGroup>
                                        <FormErrorMessage fontSize="xs" mt={2}>
                                            {errors.name}
                                        </FormErrorMessage>
                                    </FormControl>

                                    {/* Email Field */}
                                    <FormControl isInvalid={!!(errors.email && touched.email)} isRequired>
                                        <FormLabel
                                            fontSize="sm"
                                            color="gray.700"
                                            fontWeight="600"
                                            mb={3}
                                        >
                                            Email Address
                                        </FormLabel>
                                        <InputGroup size="lg">
                                            <InputLeftElement>
                                                <EmailIcon color="gray.400" boxSize={4} />
                                            </InputLeftElement>
                                            <Input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('email')}
                                                placeholder="Enter your email"
                                                borderRadius="16px"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                bg="gray.50"
                                                _hover={{ borderColor: "gray.300" }}
                                                _focus={{
                                                    borderColor: "#2CA58D",
                                                    boxShadow: "0 0 0 1px #2CA58D",
                                                    bg: "white"
                                                }}
                                                fontSize="md"
                                            />
                                            {formData.email && !errors.email && (
                                                <InputRightElement>
                                                    <CheckCircleIcon color="green.500" />
                                                </InputRightElement>
                                            )}
                                        </InputGroup>
                                        <FormErrorMessage fontSize="xs" mt={2}>
                                            {errors.email}
                                        </FormErrorMessage>
                                    </FormControl>

                                    {/* Password Field */}
                                    <FormControl isInvalid={!!(errors.password && touched.password)} isRequired>
                                        <FormLabel
                                            fontSize="sm"
                                            color="gray.700"
                                            fontWeight="600"
                                            mb={3}
                                        >
                                            Password
                                        </FormLabel>
                                        <InputGroup size="lg">
                                            <InputLeftElement>
                                                <LockIcon color="gray.400" boxSize={4} />
                                            </InputLeftElement>
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('password')}
                                                placeholder="Create a strong password"
                                                borderRadius="16px"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                bg="gray.50"
                                                _hover={{ borderColor: "gray.300" }}
                                                _focus={{
                                                    borderColor: "#2CA58D",
                                                    boxShadow: "0 0 0 1px #2CA58D",
                                                    bg: "white"
                                                }}
                                                fontSize="md"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    variant="ghost"
                                                    size="sm"
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage fontSize="xs" mt={2}>
                                            {errors.password}
                                        </FormErrorMessage>
                                    </FormControl>

                                    {/* User Type */}
                                    <FormControl isInvalid={!!(errors.userType)} isRequired>
                                        <FormLabel
                                            fontSize="sm"
                                            color="gray.700"
                                            fontWeight="600"
                                            mb={4}
                                        >
                                            I'm joining as a...
                                        </FormLabel>
                                        <RadioGroup
                                            value={formData.userType}
                                            onChange={(value) => {
                                                setFormData(prev => ({ ...prev, userType: value }));
                                                if (errors.userType) {
                                                    setErrors(prev => ({ ...prev, userType: undefined }));
                                                }
                                            }}
                                        >
                                            <Stack spacing={3}>
                                                {[
                                                    { 
                                                        value: "User", 
                                                        label: "Job Seeker", 
                                                        desc: "Looking for opportunities",
                                                        route: "/user-details"
                                                    },
                                                    { 
                                                        value: "Recruiter", 
                                                        label: "Recruiter", 
                                                        desc: "Hiring talent",
                                                        route: "/recruiter-details"
                                                    },
                                                    { 
                                                        value: "Trainer", 
                                                        label: "Trainer", 
                                                        desc: "Teaching skills",
                                                        route: "/trainer-details"
                                                    }
                                                ].map((option) => (
                                                    <Box
                                                        key={option.value}
                                                        p={3}
                                                        borderRadius="12px"
                                                        border="2px solid"
                                                        borderColor={formData.userType === option.value ? "#2CA58D" : "gray.200"}
                                                        bg={formData.userType === option.value ? "rgba(44, 165, 141, 0.05)" : "gray.50"}
                                                        cursor="pointer"
                                                        transition="all 0.2s"
                                                        _hover={{ borderColor: "#2CA58D" }}
                                                    >
                                                        <Radio value={option.value} colorScheme="teal">
                                                            <VStack align="flex-start" spacing={1}>
                                                                <Text fontWeight="600" fontSize="sm">
                                                                    {option.label}
                                                                </Text>
                                                                <Text fontSize="xs" color="gray.600">
                                                                    {option.desc}
                                                                </Text>
                                                            </VStack>
                                                        </Radio>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </RadioGroup>
                                        <FormErrorMessage fontSize="xs" mt={2}>
                                            {errors.userType}
                                        </FormErrorMessage>
                                    </FormControl>

                                    {/* Submit Button - Fixed Text */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        w="100%"
                                        bg="#2CA58D"
                                        color="white"
                                        borderRadius="16px"
                                        fontWeight="600"
                                        fontSize="md"
                                        py={7}
                                        _hover={{
                                            bg: "#27967F",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 10px 25px rgba(44, 165, 141, 0.3)"
                                        }}
                                        _active={{ transform: "translateY(0)" }}
                                        isLoading={isLoading}
                                        loadingText=""
                                        spinner={<Spinner size="md" />}
                                        transition="all 0.3s ease"
                                        disabled={isLoading}
                                    >
                                        {!isLoading && "Create My Account"}
                                    </Button>

                                    {/* Login Link */}
                                    <Text fontSize="sm" textAlign="center" color="gray.600">
                                        Already have an account?{" "}
                                        <Link
                                            color="#2CA58D"
                                            href="/login"
                                            fontWeight="600"
                                            _hover={{ textDecoration: "underline" }}
                                        >
                                            Sign in here
                                        </Link>
                                    </Text>
                                </VStack>
                            </form>
                        </Box>
                    </Box>
                </Flex>
            </Container>

            {/* CSS for animations */}
            <style>
                {`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                `}
            </style>
        </Box>
    );
}