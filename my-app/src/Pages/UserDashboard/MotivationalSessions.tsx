import {
    Box,
    Text,
    Button,
    Flex,
    Heading,
    Container,
    Grid,
    Badge,
    HStack,
    VStack,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Spinner,
    Center,
    Icon,
    Image
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import { BsSearch, BsCalendar3, BsClock, BsPlay, BsBookmark } from "react-icons/bs";
import { InfoIcon } from "@chakra-ui/icons";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/motivational-sessions";

interface MotivationalSession {
    _id: string;
    title: string;
    speaker: string;
    description: string;
    date: string;
    duration: string;
    category: string;
    image: string;
    videoLink: string;
    createdAt: string;
}

const SessionCard = ({ session }: { session: MotivationalSession }) => {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Career Growth": return "teal";
            case "Personal Development": return "purple";
            case "Mental Health": return "pink";
            case "Success Stories": return "orange";
            case "Leadership": return "blue";
            case "Wellness": return "green";
            default: return "gray";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const isUpcoming = (dateString: string) => {
        const sessionDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return sessionDate >= today;
    };

    const isPast = (dateString: string) => {
        const sessionDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return sessionDate < today;
    };

    const getSessionStatus = () => {
        if (isUpcoming(session.date)) {
            return { label: 'Upcoming', color: 'green' };
        } else {
            return { label: 'Recorded', color: 'blue' };
        }
    };

    const status = getSessionStatus();

    return (
        <Box
            bg="white"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="0px -2px 8px rgba(0, 0, 0, 0.03), 0px 4px 12px rgba(0, 0, 0, 0.08)"
            _hover={{
                transform: "translateY(-4px)",
                boxShadow: "0px -4px 12px rgba(0, 0, 0, 0.05), 0px 8px 20px rgba(0, 0, 0, 0.12)"
            }}
            transition="all 0.3s ease"
            border="1px solid"
            borderColor="gray.100"
        >
            {/* Image Section */}
            <Box
                h="180px"
                bg="gray.100"
                position="relative"
                overflow="hidden"
            >
                <Image
                    src={session.image}
                    alt={session.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/400x180?text=Motivational+Session"
                />
                <Box
                    position="absolute"
                    top={3}
                    right={3}
                >
                    <Badge
                        colorScheme={status.color}
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        textTransform="capitalize"
                        bg={`${status.color}.500`}
                        color="white"
                    >
                        {status.label}
                    </Badge>
                </Box>
                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bgGradient="linear(to-t, blackAlpha.700, transparent)"
                    p={3}
                >
                    <Badge
                        colorScheme={getCategoryColor(session.category)}
                        variant="solid"
                        fontSize="xs"
                        px={3}
                        py={1}
                        borderRadius="full"
                    >
                        {session.category}
                    </Badge>
                </Box>
            </Box>

            {/* Content Section */}
            <Box p={5}>
                <Flex justify="space-between" align="start" mb={3}>
                    <Box flex={1}>
                        <Heading size="md" mb={2} color="gray.800" fontWeight="700" noOfLines={2}>
                            {session.title}
                        </Heading>

                        <Text fontSize="sm" color="teal.600" fontWeight="600" mb={2}>
                            by {session.speaker}
                        </Text>

                        <Text fontSize="sm" color="gray.600" mb={3} lineHeight="1.6" noOfLines={2}>
                            {session.description}
                        </Text>

                        <HStack spacing={4} fontSize="xs" color="gray.500" mb={4}>
                            <HStack>
                                <BsCalendar3 />
                                <Text>{formatDate(session.date)}</Text>
                            </HStack>
                            <HStack>
                                <BsClock />
                                <Text>{session.duration}</Text>
                            </HStack>
                        </HStack>
                    </Box>
                </Flex>

                {/* Action Buttons */}
                <Flex gap={2}>
                    {session.videoLink ? (
                        <Button
                            as="a"
                            href={session.videoLink}
                            target="_blank"
                            bg="linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
                            color="white"
                            _hover={{
                                bg: "linear-gradient(135deg, #27967F 0%, #2CA58D 100%)",
                                transform: "translateY(-1px)"
                            }}
                            borderRadius="lg"
                            size="sm"
                            fontSize="xs"
                            fontWeight="600"
                            leftIcon={<BsPlay />}
                            flex={1}
                        >
                            {isPast(session.date) ? 'Watch Recording' : 'Watch Session'}
                        </Button>
                    ) : (
                        <Button
                            bg="gray.200"
                            color="gray.600"
                            borderRadius="lg"
                            size="sm"
                            fontSize="xs"
                            fontWeight="600"
                            flex={1}
                            isDisabled
                        >
                            Coming Soon
                        </Button>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};

export default function MotivationalSessionsPage() {
    const [sessions, setSessions] = useState<MotivationalSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredSessions, setFilteredSessions] = useState<MotivationalSession[]>([]);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(API_BASE_URL);
            setSessions(response.data);
            setFilteredSessions(response.data);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get unique categories from sessions
    const categories = ["all", ...Array.from(new Set(sessions.map(s => s.category)))];

    const filterSessions = (search: string, category: string) => {
        let filtered = sessions;

        if (search) {
            filtered = filtered.filter(session =>
                session.title.toLowerCase().includes(search.toLowerCase()) ||
                session.speaker.toLowerCase().includes(search.toLowerCase()) ||
                session.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category !== "all") {
            filtered = filtered.filter(session => session.category === category);
        }

        setFilteredSessions(filtered);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        filterSessions(value, selectedCategory);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedCategory(value);
        filterSessions(searchTerm, value);
    };

    const isUpcoming = (dateString: string) => {
        const sessionDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return sessionDate >= today;
    };

    const isPast = (dateString: string) => {
        const sessionDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return sessionDate < today;
    };

    const getUpcomingSessions = () => {
        return filteredSessions.filter(session => isUpcoming(session.date));
    };

    const getRecordedSessions = () => {
        return filteredSessions.filter(session => isPast(session.date));
    };

    // Voice filtering functionality - listens for custom voice events
    useEffect(() => {
        const handleVoiceSessionFilter = (event: CustomEvent) => {
            const { filterType, filterValue } = event.detail;

            if (filterType === 'category') {
                setSelectedCategory(filterValue);
                filterSessions(searchTerm, filterValue);
                setActiveTab(0);
            } else if (filterType === 'status') {
                if (filterValue === 'upcoming') {
                    setActiveTab(1);
                } else if (filterValue === 'recorded') {
                    setActiveTab(2);
                } else {
                    setActiveTab(0);
                }
                setSelectedCategory("all");
            }
        };

        window.addEventListener('voiceSessionFilter' as any, handleVoiceSessionFilter);

        return () => {
            window.removeEventListener('voiceSessionFilter' as any, handleVoiceSessionFilter);
        };
    }, [searchTerm]);

    return (
        <Box>
            <SideNav />
            <Box>
                <TopNav />

                <Box bg="#f8fafc" minH="100vh">
                    {/* Header Section */}
                    <Box bg="white" borderBottom="1px solid" borderColor="gray.200">
                        <Container maxW="1250px" py={10}>
                            <Flex mb={6}>
                                <Box>
                                    <Heading size="lg" color="gray.800" fontWeight="700">
                                        Motivational Sessions
                                    </Heading>
                                    <Text color="gray.600" mt={1}>
                                        Discover inspiring content to boost your motivation and personal growth
                                    </Text>
                                </Box>
                            </Flex>

                            {/* Search and Filter Section */}
                            <Flex gap={4} flexWrap="wrap">
                                <InputGroup maxW="400px" flex={1}>
                                    <InputLeftElement>
                                        <BsSearch color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Search sessions..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        borderRadius="xl"
                                        border="2px solid"
                                        borderColor="gray.200"
                                        _focus={{
                                            borderColor: "teal.300",
                                            boxShadow: "0 0 0 3px rgba(44, 165, 141, 0.1)"
                                        }}
                                    />
                                </InputGroup>

                                <Select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    maxW="200px"
                                    borderRadius="xl"
                                    border="2px solid"
                                    borderColor="gray.200"
                                    _focus={{
                                        borderColor: "teal.300",
                                        boxShadow: "0 0 0 3px rgba(44, 165, 141, 0.1)"
                                    }}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === "all" ? "All Categories" : category}
                                        </option>
                                    ))}
                                </Select>
                            </Flex>
                        </Container>
                    </Box>

                    {/* Main Content Section */}
                    <Container maxW="1200px" py={8} pl={10}>
                        {isLoading ? (
                            <Center py={20}>
                                <VStack spacing={4}>
                                    <Spinner size="xl" color="teal.500" thickness="4px" />
                                    <Text color="gray.600" fontSize="lg">
                                        Loading sessions...
                                    </Text>
                                </VStack>
                            </Center>
                        ) : sessions.length === 0 ? (
                            <Center py={20}>
                                <VStack spacing={6}>
                                    <Box
                                        bg="gray.100"
                                        borderRadius="full"
                                        p={6}
                                    >
                                        <Icon as={InfoIcon} boxSize={12} color="gray.400" />
                                    </Box>
                                    <VStack spacing={2}>
                                        <Heading size="md" color="gray.600">
                                            No Sessions Available
                                        </Heading>
                                        <Text color="gray.500" textAlign="center" maxW="400px">
                                            Check back soon for inspiring motivational sessions
                                        </Text>
                                    </VStack>
                                </VStack>
                            </Center>
                        ) : (
                            <Tabs
                                variant="soft-rounded"
                                colorScheme="teal"
                                index={activeTab}
                                onChange={(index) => setActiveTab(index)}
                            >
                                <TabList mb={6} bg="white" p={2} borderRadius="2xl" boxShadow="sm">
                                    <Tab fontWeight="600">All Sessions ({filteredSessions.length})</Tab>
                                    <Tab fontWeight="600">Upcoming ({getUpcomingSessions().length})</Tab>
                                    <Tab fontWeight="600">Recorded ({getRecordedSessions().length})</Tab>
                                </TabList>

                                <TabPanels>
                                    {/* All Sessions Tab */}
                                    <TabPanel p={0}>
                                        {filteredSessions.length > 0 ? (
                                            <Grid templateColumns="repeat(auto-fit, minmax(350px, 1fr))" gap={6}>
                                                {filteredSessions.map((session) => (
                                                    <SessionCard key={session._id} session={session} />
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Box
                                                bg="white"
                                                borderRadius="2xl"
                                                p={16}
                                                textAlign="center"
                                                boxShadow="sm"
                                            >
                                                <Text fontSize="lg" fontWeight="600" color="gray.600" mb={2}>
                                                    No sessions found
                                                </Text>
                                                <Text color="gray.500">
                                                    Try adjusting your search or filter criteria
                                                </Text>
                                            </Box>
                                        )}
                                    </TabPanel>

                                    {/* Upcoming Sessions Tab */}
                                    <TabPanel p={0}>
                                        {getUpcomingSessions().length > 0 ? (
                                            <Grid templateColumns="repeat(auto-fit, minmax(350px, 1fr))" gap={6}>
                                                {getUpcomingSessions().map((session) => (
                                                    <SessionCard key={session._id} session={session} />
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Box
                                                bg="white"
                                                borderRadius="2xl"
                                                p={16}
                                                textAlign="center"
                                                boxShadow="sm"
                                            >
                                                <Text fontSize="lg" fontWeight="600" color="gray.600" mb={2}>
                                                    No upcoming sessions
                                                </Text>
                                                <Text color="gray.500">
                                                    New sessions will be scheduled soon
                                                </Text>
                                            </Box>
                                        )}
                                    </TabPanel>

                                    {/* Recorded Sessions Tab */}
                                    <TabPanel p={0}>
                                        {getRecordedSessions().length > 0 ? (
                                            <Grid templateColumns="repeat(auto-fit, minmax(350px, 1fr))" gap={6}>
                                                {getRecordedSessions().map((session) => (
                                                    <SessionCard key={session._id} session={session} />
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Box
                                                bg="white"
                                                borderRadius="2xl"
                                                p={16}
                                                textAlign="center"
                                                boxShadow="sm"
                                            >
                                                <Text fontSize="lg" fontWeight="600" color="gray.600" mb={2}>
                                                    No recorded sessions
                                                </Text>
                                                <Text color="gray.500">
                                                    Recorded sessions will appear here after live sessions end
                                                </Text>
                                            </Box>
                                        )}
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        )}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}