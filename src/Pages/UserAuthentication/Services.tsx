import {
    Box,
    Flex,
    Heading,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import feature1 from "../../Images/feature1.png";
import feature2 from "../../Images/feature2.png";
import feature3 from "../../Images/feature3.png";

export default function Services() {
    return (
        <Box bg="white" py={12} px={{ base: 4, md: 12 }}>
            <VStack spacing={3} textAlign="center">
                <Text fontWeight="medium" fontSize="sm" color="gray.600" letterSpacing="0.5px">
                    Our Services
                </Text>
                <Heading as="h2" size="xl" color="#1a202c" fontWeight="extrabold">
                    What We Offer
                </Heading>
            </VStack>

            <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justifyContent={"flex-start"}
                gap={6}
                mb={-12}
            >
                <Image
                    src={feature1}
                    alt="Test Assessments"
                    boxSize="240px"
                    objectFit="contain"
                />
                <Box>
                    <Heading as="h3" size="md" color="#2D3E5E" mb={2}>
                        Community Forum
                    </Heading>
                    <Text fontSize="sm" color="gray.700" maxW="700px">
                        Engage in an inclusive and supportive environment where individuals with disabilities can connect,
                        share experiences, and offer advice. Our community forum fosters meaningful discussions, helping members
                        support one another in overcoming challenges. 
                    </Text>
                </Box>
            </Flex>

            <Flex
                direction={{ base: "column-reverse", md: "row" }}
                align="center"
                justifyContent={"flex-end"}
                mb={-12}
                gap={6}
            >
                <Box>
                    <Heading as="h3" size="md" color="#2D3E5E" mb={2}>
                        Motivational Sessions
                    </Heading>
                    <Text fontSize="sm" color="gray.700" maxW="500px">
                        Stay motivated with our specially designed sessions, featuring inspirational speakers and stories
                        from individuals who have overcome adversity.These sessions aim to boost confidence, instill hope, and
                        inspire positive change. 
                    </Text>
                </Box>
                <Image
                    src={feature2}
                    alt="Career Consultation"
                    boxSize="240px"
                    objectFit="contain"
                />
            </Flex>

            <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justifyContent={"flex-start"}
                gap={6}
                mb={-12}
            >
                <Image
                    src={feature3}
                    alt="Job Readiness"
                    boxSize="240px"
                    objectFit="contain"
                />
                <Box>
                    <Heading as="h3" size="md" color="#2D3E5E" mb={2}>
                        Skill Based Job
                    </Heading>
                    <Text fontSize="sm" color="gray.700" maxW="500px">
                        Access a wide range of job opportunities tailored to your skills and abilities. Our platform connects
                        individuals with disabilities to employers seeking diverse talent. 
                    </Text>
                </Box>
            </Flex>

            {/* <Flex
                direction={{ base: "column-reverse", md: "row" }}
                align="center"
                justifyContent={"flex-end"}
                mb={-12}
                gap={6}
            >
                <Box>
                    <Heading as="h3" size="md" color="#2D3E5E" mb={2}>
                        AI Interview Preparation
                    </Heading>
                    <Text fontSize="sm" color="gray.700" maxW="500px">
                        Prepare for your job interviews with our AI-driven tools that offer personalized practice sessions.
                        Receive feedback on your responses, improve your confidence, and refine your skills with realistic
                        mock interviews. Our AI-powered platform helps you prepare for interviews tailored to your experience and abilities.
                    </Text>
                </Box>
                <Image
                    src={feature2}
                    alt="Career Consultation"
                    boxSize="240px"
                    objectFit="contain"
                />
            </Flex> */}

            {/* <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justifyContent={"flex-start"}
                gap={6}
                mb={-12}
            >
                <Image
                    src={feature3}
                    alt="Job Readiness"
                    boxSize="240px"
                    objectFit="contain"
                />
                <Box>
                    <Heading as="h3" size="md" color="#2D3E5E" mb={2}>
                        Assistive Tech Updates
                    </Heading>
                    <Text fontSize="sm" color="gray.700" maxW="500px">
                        Stay informed about the latest advancements in assistive technologies designed to
                        enhance your daily life and work. From innovative tools to software updates, our platform
                        keeps you up to date with new assistive
                        tech that can improve accessibility, independence, and productivity.
                    </Text>
                </Box>
            </Flex> */}
        </Box>
    );
};
