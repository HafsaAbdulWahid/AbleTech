import {
    Box,
    Flex,
    Text,
    Image,
    Button,
    HStack,
    VStack,
    Link,
    Heading,
    Container,
    Badge,
    Grid,
    GridItem,
    Icon,
    Divider,
    Spinner,
    Center,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/assistive-tech";

interface AssistiveTechItem {
    _id: string;
    title: string;
    category: string;
    description: string;
    features: string[];
    image: string;
    link: string;
    dateAdded: string;
    status: string;
}

export default function AssistiveTechAll() {
    const [assistiveTechItems, setAssistiveTechItems] = useState<AssistiveTechItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTechnologies();
    }, []);

    const fetchTechnologies = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(API_BASE_URL);
            setAssistiveTechItems(response.data);
        } catch (error) {
            console.error("Error fetching technologies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Vision impairment": return "orange";
            case "Hearing impairment": return "cyan";
            case "Physical/Mobility impairment": return "pink";
            case "Speech/Communication impairment": return "yellow";
            default: return "gray";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <Box bg="gray.50" minH="100vh">
            <SideNav />
            <Box>
                <TopNav />
                <Box ml="90px">
                    <Container maxW="1400px" py={12}>
                        {/* Header Section */}
                        {!isLoading && assistiveTechItems.length > 0 && (
                            <VStack spacing={8} mb={12} textAlign="center">
                                <Box>
                                    <Heading
                                        fontSize="3xl"
                                        fontWeight="700"
                                        color="gray.800"
                                        mb={4}
                                        letterSpacing="tight"
                                    >
                                        Assistive Technology Solutions
                                    </Heading>
                                    <Text
                                        fontSize="lg"
                                        color="gray.600"
                                        maxW="600px"
                                        lineHeight="1.6"
                                        fontWeight="400"
                                        mb={6}
                                    >
                                        Discover cutting-edge technologies designed to enhance independence and improve quality of life
                                    </Text>
                                </Box>
                            </VStack>
                        )}

                        {/* Loading State */}
                        {isLoading ? (
                            <Center py={20}>
                                <Spinner size="xl" color="teal.500" thickness="4px" />
                            </Center>
                        ) : assistiveTechItems.length === 0 ? (
                            /* Empty State */
                            <Center py={"100px"}>
                                <VStack spacing={6}>
                                    <Box
                                        bg="gray.100"
                                        borderRadius="full"
                                        p={3}
                                    >
                                        <Icon as={InfoIcon} boxSize={8} color="gray.400" />
                                    </Box>
                                    <VStack spacing={2}>
                                        <Heading size="md" color="gray.600">
                                            No Technologies Available
                                        </Heading>
                                        <Text color="gray.600" fontSize="md" textAlign="center" maxW="400px">
                                            Check back soon for new assistive technology solutions.
                                        </Text>
                                    </VStack>
                                </VStack>
                            </Center>
                        ) : (
                            /* Products Grid */
                            <Grid templateColumns="repeat(auto-fit, minmax(500px, 1fr))" gap={8}>
                                {assistiveTechItems.map((item) => (
                                    <GridItem key={item._id}>
                                        <Box
                                            bg="white"
                                            borderRadius="2xl"
                                            overflow="hidden"
                                            shadow="xl"
                                            _hover={{
                                                transform: "translateY(-8px)",
                                                shadow: "2xl",
                                            }}
                                            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            position="relative"
                                        >
                                            <Flex direction={{ base: "column", md: "row" }} h="full">
                                                {/* Image Section */}
                                                <Box
                                                    flex="0 0 200px"
                                                    bg="gray.50"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    p={6}
                                                    position="relative"
                                                >
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        maxW="100%"
                                                        maxH="150px"
                                                        objectFit="contain"
                                                        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
                                                        fallbackSrc="https://via.placeholder.com/150x100?text=No+Image"
                                                    />
                                                </Box>

                                                {/* Content Section */}
                                                <VStack flex="1" p={6} align="stretch" justify="space-between">
                                                    <Box>
                                                        {/* Category & Title */}
                                                        <HStack mb={3} justify="space-between" align="flex-start">
                                                            <VStack align="flex-start" spacing={1}>
                                                                <Badge
                                                                    colorScheme={getCategoryColor(item.category)}
                                                                    variant="subtle"
                                                                    fontSize="xs"
                                                                    px={2}
                                                                    py={1}
                                                                    borderRadius="md"
                                                                >
                                                                    {item.category}
                                                                </Badge>
                                                                <Heading
                                                                    as="h3"
                                                                    fontSize="xl"
                                                                    fontWeight="700"
                                                                    color="gray.800"
                                                                    lineHeight="1.3"
                                                                >
                                                                    {item.title}
                                                                </Heading>
                                                            </VStack>
                                                        </HStack>

                                                        {/* Description */}
                                                        <Text
                                                            fontSize="sm"
                                                            color="gray.600"
                                                            lineHeight="1.6"
                                                            mb={4}
                                                            noOfLines={3}
                                                        >
                                                            {item.description}
                                                        </Text>

                                                        {/* Features */}
                                                        <Wrap spacing={2} mb={4}>
                                                            {item.features?.slice(0, 3).map((feature, idx) => (
                                                                <WrapItem key={idx}>
                                                                    <Badge
                                                                        variant="outline"
                                                                        colorScheme="gray"
                                                                        fontSize="xs"
                                                                        px={2}
                                                                        py={1}
                                                                        borderRadius="md"
                                                                    >
                                                                        {feature}
                                                                    </Badge>
                                                                </WrapItem>
                                                            ))}
                                                            {item.features && item.features.length > 3 && (
                                                                <WrapItem>
                                                                    <Badge
                                                                        variant="outline"
                                                                        colorScheme="gray"
                                                                        fontSize="xs"
                                                                        px={2}
                                                                        py={1}
                                                                        borderRadius="md"
                                                                    >
                                                                        +{item.features.length - 3} more
                                                                    </Badge>
                                                                </WrapItem>
                                                            )}
                                                        </Wrap>
                                                    </Box>

                                                    {/* Footer */}
                                                    <Box>
                                                        <Divider mb={4} />
                                                        <Flex justify="space-between" align="center">
                                                            <HStack spacing={2} color="gray.500">
                                                                <Icon as={CalendarIcon} boxSize={3} />
                                                                <Text fontSize="xs" fontWeight="500">
                                                                    {formatDate(item.dateAdded)}
                                                                </Text>
                                                            </HStack>

                                                            <HStack spacing={3}>
                                                                <Button
                                                                    as={Link}
                                                                    href={item.link}
                                                                    isExternal
                                                                    size="sm"
                                                                    bg="linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
                                                                    color="white"
                                                                    rightIcon={<ExternalLinkIcon />}
                                                                    fontSize="xs"
                                                                    fontWeight="600"
                                                                    _hover={{
                                                                        bg: "linear-gradient(135deg, #27967F 0%, #2CA58D 100%)",
                                                                        textDecoration: "none",
                                                                        transform: "translateY(-1px)",
                                                                    }}
                                                                    _active={{
                                                                        transform: "translateY(0)",
                                                                    }}
                                                                    transition="all 0.2s"
                                                                >
                                                                    View Product
                                                                </Button>
                                                            </HStack>
                                                        </Flex>
                                                    </Box>
                                                </VStack>
                                            </Flex>
                                        </Box>
                                    </GridItem>
                                ))}
                            </Grid>
                        )}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}