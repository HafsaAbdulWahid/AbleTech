import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    VStack,
    Container,
    Stack,
} from "@chakra-ui/react";
import realPerson2 from "../../Images/realPerson2.png";
import { useNavigate } from 'react-router-dom';

export default function About() {
    const navigate = useNavigate();

    return (
        <Box bg="white" py={{ base: 12, md: 20 }} id="about-us">
            <Container maxW="1200px">
                <Flex
                    direction={["column", "column", "row"]}
                    align="center"
                    justify="space-between"
                    gap={12}
                >
                    {/* Left Section */}
                    <VStack align="flex-start" spacing={8} flex={1} maxW="600px">
                        <Box>
                            <Text
                                fontSize="sm"
                                fontWeight="600"
                                color="#2CA58D"
                                textTransform="uppercase"
                                letterSpacing="2px"
                                mb={4}
                            >
                                Welcome to AbleTech
                            </Text>
                            <Heading 
                                fontSize={["2xl", "3xl", "4xl", "5xl"]} 
                                fontWeight="800" 
                                color="#2D3E5E"
                                lineHeight="1.2"
                                mb={6}
                            >
                                Empowering Abilities,{" "}
                                <Box as="span" color="#2CA58D">
                                    Unlocking Opportunities
                                </Box>
                            </Heading>
                        </Box>
                        
                        <Text 
                            fontSize={["md", "lg"]} 
                            color="gray.600" 
                            lineHeight="1.8"
                            maxW="500px"
                        >
                            Empowering individuals of all abilities with cutting-edge tools, 
                            meaningful opportunities, and comprehensive support systems to thrive 
                            in their careers and personal growth journey.
                        </Text>

                        <Stack direction={["column", "row"]} spacing={4} pt={4}>
                            <Button 
                                bg="#2CA58D" 
                                color="white"
                                size="lg" 
                                fontSize="md"
                                fontWeight="600"
                                px={8}
                                py={6}
                                borderRadius="xl"
                                transition="all 0.3s"
                                _hover={{ 
                                    bg: "#27967F", 
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 25px rgba(44, 165, 141, 0.3)"
                                }}
                                _active={{ transform: "translateY(0)" }}
                                onClick={() => navigate("/about")}
                            >
                                Discover Our Mission
                            </Button>
                            <Button 
                                variant="outline"
                                borderColor="#2D3E5E"
                                color="#2D3E5E"
                                size="lg" 
                                fontSize="md"
                                fontWeight="600"
                                px={8}
                                py={6}
                                borderRadius="xl"
                                transition="all 0.3s"
                                _hover={{ 
                                    bg: "#2D3E5E", 
                                    color: "white",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 25px rgba(45, 62, 94, 0.2)"
                                }}
                                _active={{ transform: "translateY(0)" }}
                                onClick={() => navigate("/all-jobs")}
                            >
                                Explore Jobs
                            </Button>
                        </Stack>
                    </VStack>

                    {/* Right Section */}
                    <Box flex={1} position="relative" maxW="600px">
                        <Box
                            position="absolute"
                            top={-4}
                            right={-4}
                            w="full"
                            h="full"
                            bg="linear-gradient(135deg, #2CA58D, #27967F)"
                            borderRadius="3xl"
                            opacity={0.1}
                            zIndex={0}
                        />
                        <Image
                            src={realPerson2}
                            alt="Empowering individuals with disabilities"
                            borderRadius="2xl"
                            w="full"
                            h={["300px", "400px", "500px"]}
                            objectFit="cover"
                            position="relative"
                            zIndex={1}
                            transition="transform 0.3s"
                            _hover={{ transform: "scale(1.02)" }}
                            sx={{
                                borderTopLeftRadius: "40px",
                                borderBottomRightRadius: "40px",
                                borderTopRightRadius: "8px",
                                borderBottomLeftRadius: "8px"
                            }}
                        />
                        
                        {/* Floating Stats Card */}
                        <Box
                            position="absolute"
                            bottom={6}
                            left={-6}
                            bg="white"
                            p={6}
                            borderRadius="xl"
                            boxShadow="0 10px 40px rgba(0,0,0,0.1)"
                            zIndex={2}
                            border="1px solid"
                            borderColor="gray.100"
                        >
                            <VStack align="flex-start" spacing={2}>
                                <Text fontSize="2xl" fontWeight="800" color="#2CA58D">
                                    1000+
                                </Text>
                                <Text fontSize="sm" color="gray.600" fontWeight="500">
                                    Success Stories
                                </Text>
                            </VStack>
                        </Box>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
}