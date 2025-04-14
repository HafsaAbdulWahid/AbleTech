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


export default function RegisterForm() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post("http://localhost:3001/api/register", formData);
            console.log(res.data);
            alert("Registration successful!");
            navigate(`/userDashboard?name=${res.data.name || "User"}`);
        } catch (err) {
            console.error(err);
            alert("Something went wrong!");
        }
    };

    return (
        <Flex minH="100vh" bg="#1e2738" justify="center" align="center">

            {/* Left side */}
            <Flex justify="center" align="flex-end" p={4}>
                <Flex
                    justify="center"
                    align="center"
                    p={4}
                >
                    <Box
                        bg="white"
                        px={10}
                        py={"30px"}
                        borderRadius="30px"
                        // border="1px solid #00a79d"
                        // boxShadow="0 0 5px #00a79d, 0 0 20px #00a79d"
                        w="100%"
                        // h={"610px"}
                        maxW="400px"
                    >
                        <Stack align="center">
                            <Image src={Logo} alt="Logo" boxSize="70px" />
                            <Heading fontSize="3xl" color="#1A202C">
                                Sign Up
                            </Heading>
                            <Text color="gray.800" fontSize="sm" mb={6} textAlign="center">
                                Please fill in the form to register a new account.
                            </Text>
                        </Stack>

                        <Stack spacing={5}>
                            <FormControl id="name" isRequired>
                                <FormLabel fontSize="sm" color="gray.700">
                                    Full Name
                                </FormLabel>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
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

                            <Button
                                onClick={handleSubmit}
                                bg="#2CA58D"
                                color="white"
                                _hover={{ bg: "#27967F" }}
                                size="sm"
                                mt={2}
                            >
                                Register
                            </Button>

                            <Text fontSize="sm" textAlign="center" color="gray.900">
                                Already have an account?{" "}
                                <Link color="#2CA58D" href="/login" fontWeight="semibold">
                                    Login Here
                                </Link>
                            </Text>
                        </Stack>
                    </Box>
                </Flex>
            </Flex>


            {/* Right side */}
            {/* <Flex justify="center" align="flex-end" p={4}>
                <Image
                    src={authImg}
                    alt="Illustration"
                    objectFit="contain"
                    maxH="450px"
                />
            </Flex> */}

            <Flex
                direction="column"
                align="flex-start"
                justify="flex-end"
                textAlign="left"
                color="#1a202c"
                p={4}
                ml="50px"
            >
                <Box maxW="610px" mb={5} mt={5}>
                    <Text
                        fontSize="3xl"
                        color="white"
                        fontWeight="bold"
                        mb={4}
                        lineHeight="1.4"
                    >
                        Become a part of our ever-growing community. Join now to connect with both companies and creative people through our powerful platform.
                    </Text>
                </Box>

                <Flex wrap="nowrap" ml={"40px"} justify="center" alignItems={"flex-end"}>
                    {[
                        {
                            src: authImg1,
                            bg: "#5da3a2",
                            height: "230px",
                        },
                        {
                            src: authImg2,
                            bg: "#2D3E5E",
                            height: "290px",
                        },
                        {
                            src: authImg3,
                            bg: "#63ada6",
                            height: "190px",
                        },
                        {
                            src: authImg4,
                            bg: "#3D5A98",
                            height: "300px",
                        },
                    ].map((item, index) => (
                        <Box
                            key={index}
                            w="120px"
                            h={item.height}
                            bg={item.bg}
                            borderTopRadius="60px"
                            overflow="hidden"
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="center"
                            position="relative"
                            mx="1"
                        >
                            <Image
                                src={item.src}
                                alt={`User ${index}`}
                                h="120px"
                                width={"160px"}
                                objectFit="cover"
                            />
                        </Box>
                    ))}
                </Flex>
            </Flex>


        </Flex>
    );
}
