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
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../../Images/Logo.png";
import authImg1 from "../../Images/authImg1.png";
import authImg2 from "../../Images/authImg2.png";
import authImg3 from "../../Images/authImg3.png";
import authImg4 from "../../Images/authImg4.png";

export default function LoginForm() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:3001/api/login", formData);
            console.log(res.data);
            alert("Login successful!");
            navigate(`/userDashboard?name=${res.data.name || "User"}`);
        } catch (err) {
            console.error(err);
            alert("Login failed. Please try again");
        }
    };


    return (
        <Flex minH="100vh" bg="#1e2738" justify="center" align="center" direction={{ base: "column", md: "row" }}>
            {/* Left side */}
            <Flex
                justifyContent="center"
                alignItems="center"
                p={4}
            >
                <Box
                    bg="white"
                    p={10}
                    py={"30px"}
                    borderRadius="30px"
                    w="100%"
                    maxW="400px"
                >
                    <Stack align="center">
                        <Image src={Logo} alt="Logo" boxSize="70px" />
                        <Heading fontSize="3xl" color="#1A202C">
                            Welcome Back!
                        </Heading>
                        <Text color="gray.800" fontSize="sm" mb={6} textAlign="center">
                            Please enter your email and password to log in.
                        </Text>
                    </Stack>

                    <Stack spacing={5}>
                        <FormControl id="email" isRequired>
                            <FormLabel fontSize="sm" color="gray.700">
                                Email address
                            </FormLabel>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                size="sm"
                                border="none"
                                borderBottom="3px solid #0C2D36"
                                borderRadius="none"
                                bg="#f9fafb"
                                py={6}
                                px={4}
                                _focus={{
                                    borderColor: "#007bff",
                                    boxShadow: "none",
                                }}
                                fontSize="md"
                            />
                        </FormControl>

                        <FormControl id="password" isRequired>
                            <FormLabel fontSize="sm" color="gray.700">
                                Password
                            </FormLabel>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                size="sm"
                                border="none"
                                borderBottom="3px solid #0C2D36"
                                borderRadius="none"
                                bg="#f9fafb"
                                py={6}
                                px={4}
                                _focus={{
                                    borderColor: "#007bff",
                                    boxShadow: "none",
                                }}
                                fontSize="md"
                            />
                        </FormControl>

                        <Text textAlign="right" fontSize="sm" color="#2CA58D" cursor="pointer">
                            Forgot Password?
                        </Text>

                        <Button
                            onClick={handleLogin}
                            bg="#2CA58D"
                            color="white"
                            _hover={{ bg: "#27967F" }}
                            size="sm"
                            mt={2}
                        >
                            Login
                        </Button>

                        <Text fontSize="sm" textAlign="center" color="gray.900">
                            Don’t have an account?{" "}
                            <Link color="#2CA58D" href="/register" fontWeight="semibold">
                                Register Now
                            </Link>
                        </Text>
                    </Stack>
                </Box>
            </Flex>


            {/* Right side */}

           
        </Flex>
    );
}
