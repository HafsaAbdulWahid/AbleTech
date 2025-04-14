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

export default function Homepage() {
    return (
        <Box bg="white" py={12} px={{ base: 4, md: 12 }}>
            <VStack spacing={3} textAlign="center">
                <Text fontWeight="medium" fontSize="xs" color="gray.600" letterSpacing="0.5px">
                    Our Services
                </Text>
                <Heading as="h2" size="xl" color="#1a202c" fontWeight="extrabold">
                    What <Box as="span" color="#2D3E5E">We Offer</Box>
                </Heading>
            </VStack>

            {/* Test Assessments */}
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
                        Test Assessments
                    </Heading>
                    <Text fontSize="sm" color="gray.700" maxW="700px">
                        Participate in our test assessment to achieve excellent results and qualify for showcasing
                        in our exclusive jobs list. Your outstanding performance could be your gateway to exciting
                        career opportunities.
                    </Text>
                </Box>
            </Flex>

            {/* Career Consultation */}
            <Flex
                direction={{ base: "column-reverse", md: "row" }}
                align="center"
                justifyContent={"flex-end"}
                mb={-12}
                gap={6}
            >
                <Box>
                    <Heading as="h3" size="md" color="#2D3E5E" mb={2}>
                        Career Consultation
                    </Heading>
                    <Text fontSize="sm" color="gray.700" maxW="500px">
                        We offer personalized career guidance, suggesting the most suitable career paths based on
                        your skills and preferences. Explore top companies and make informed career decisions.
                    </Text>
                </Box>
                <Image
                    src={feature2}
                    alt="Career Consultation"
                    boxSize="240px"
                    objectFit="contain"
                />
            </Flex>

            {/* Job Readiness */}
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
                        Job Readiness
                    </Heading>
                    <Text fontSize="sm" color="gray.700" maxW="500px">
                        Our mission is to help you secure your dream job. With our support and personalized approach,
                        we’ll guide you toward career success and job opportunities that fit you best.
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
};
