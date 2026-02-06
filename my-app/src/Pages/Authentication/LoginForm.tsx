import {
    Box,
    Text,
    Button,
    Image,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Link,
    Flex,
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
    CheckCircleIcon,
} from "@chakra-ui/icons";
import { useUser } from "../UserDashboard/UserContext";
import Logo from "../../Images/Logo.png";

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

export default function LoginForm() {
    const navigate = useNavigate();
    const toast = useToast();
    const { setUser } = useUser();

    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Admin credentials
    const ADMIN_EMAIL = "hafsaabdulwahid26@gmail.com";
    const ADMIN_PASSWORD = "Hafsa123";

    // Validation functions
    const validateEmail = (email: string): string | undefined => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return "Email is required";
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        return undefined;
    };

    const validatePassword = (password: string): string | undefined => {
        if (!password) return "Password is required";
        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
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
            case 'email':
                error = validateEmail(formData.email);
                break;
            case 'password':
                error = validatePassword(formData.password);
                break;
        }

        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    // Function to determine dashboard route based on userType
    const getDashboardRoute = (userType: string): string => {
        switch (userType) {
            case 'User':
                return '/user-dashboard';
            case 'Recruiter':
                return '/recruiter-dashboard';
            case 'Trainer':
                return '/trainer-dashboard';
            default:
                return '/user-dashboard';
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
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
            // Check if admin credentials
            if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
                // Admin login
                localStorage.setItem('token', 'admin-token-' + Date.now());
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('userEmail', formData.email);

                // Set admin user in context
                setUser({
                    name: "Admin",
                    email: formData.email,
                    userType: "Admin"
                });

                toast({
                    title: "Welcome Admin!",
                    description: "Admin access granted successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                setTimeout(() => {
                    navigate("/admin-dashboard");
                }, 1500);
            } else {
                // Regular user login - make API call
                const response = await axios.post("http://localhost:3001/api/login", formData);

                // Extract user data from response
                const userData = response.data.user; 
                const token = response.data.token;

                // Save token to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userRole', userData.userType);
                localStorage.setItem('userEmail', userData.email);
                localStorage.setItem('userName', userData.name);

                // Set user data in context
                setUser({
                    name: userData.name,
                    email: userData.email,
                    userType: userData.userType
                });

                toast({
                    title: "Welcome back! 🎉",
                    description: "You've been logged in successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                // Set default auth header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Get the appropriate dashboard route based on userType
                const dashboardRoute = getDashboardRoute(userData.userType);

                setTimeout(() => {
                    navigate(dashboardRoute);
                }, 1500);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";

            toast({
                title: "Login Failed",
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
                <Flex justify="center" align="center" minH="80vh">
                    {/* Form */}
                    <Box maxW="400px" w="100%">
                        <Box
                            bg="white"
                            borderRadius="32px"
                            p={10}
                            boxShadow="0 25px 50px rgba(0, 0, 0, 0.25)"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                            position="relative"
                        >
                            <VStack spacing={2} mb={8} align="center">
                                <Image src={Logo} alt="Logo" boxSize="80px" mb={4} />
                                <Heading fontSize="2xl" color="gray.800" textAlign="center">
                                    Welcome Back!
                                </Heading>
                                <Text color="gray.500" fontSize="sm" textAlign="center">
                                    Please enter your credentials to continue
                                </Text>
                            </VStack>

                            <form onSubmit={handleLogin}>
                                <VStack spacing={6}>
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
                                                placeholder="Enter your password"
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

                                    {/* Forgot Password Link */}
                                    <Box w="100%" textAlign="right">
                                        <Link
                                            color="#2CA58D"
                                            fontSize="sm"
                                            fontWeight="600"
                                            _hover={{ textDecoration: "underline" }}
                                        >
                                            Forgot Password?
                                        </Link>
                                    </Box>

                                    {/* Submit Button */}
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
                                        loadingText="Logging you in..."
                                        spinner={<Spinner size="sm" />}
                                        transition="all 0.3s ease"
                                    >
                                        Sign In to Dashboard
                                    </Button>

                                    {/* Register Link */}
                                    <Text fontSize="sm" textAlign="center" color="gray.600">
                                        New to our platform?{" "}
                                        <Link
                                            color="#2CA58D"
                                            href="/register"
                                            fontWeight="600"
                                            _hover={{ textDecoration: "underline" }}
                                        >
                                            Create Account
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
                        50% { transform: translateY(-15px); }
                    } 
                `}
            </style>
        </Box>
    );
}