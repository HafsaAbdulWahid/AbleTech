import {
    Box,
    Flex,
    Text,
    Image,
    VStack,
    Stack,
    Spacer,
    Link,
    Spinner,
    Center,
    Badge,
    Icon,
    HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
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

interface UserDisabilityInfo {
    hasDisability?: string;
    disabilityCategories?: string[];
}

export default function AssistiveTech() {
    const navigate = useNavigate();
    const [techItems, setTechItems] = useState<AssistiveTechItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userDisabilityInfo, setUserDisabilityInfo] = useState<UserDisabilityInfo>({});
    const [isPersonalized, setIsPersonalized] = useState(false);

    useEffect(() => {
        loadUserDisabilityInfo();
        fetchRecommendedTechnologies();
    }, []);

    const loadUserDisabilityInfo = () => {
        try {
            const storedData = localStorage.getItem('userDisabilityInfo');
            if (storedData) {
                const disabilityInfo = JSON.parse(storedData);
                setUserDisabilityInfo(disabilityInfo);
            }
        } catch (error) {
            console.error("Error loading user disability info:", error);
        }
    };

    const getRelevantTechCategories = (disabilityCategories: string[]): string[] => {
        const categoryMapping: { [key: string]: string[] } = {
            'Vision impairment': ['Visual Assistance', 'Communication', 'Smart Home'],
            'Hearing impairment': ['Communication', 'Smart Home'],
            'Physical/Mobility impairment': ['Mobility', 'Rehabilitation', 'Smart Home'],
            'Speech/Communication impairment': ['Communication', 'Cognitive'],
        };

        const relevantCategories = new Set<string>();
        
        disabilityCategories.forEach(disability => {
            const mappedCategories = categoryMapping[disability] || [];
            mappedCategories.forEach(cat => relevantCategories.add(cat));
        });

        return Array.from(relevantCategories);
    };

    const calculateRelevanceScore = (tech: AssistiveTechItem, disabilityCategories: string[]): number => {
        let score = 0;
        const relevantCategories = getRelevantTechCategories(disabilityCategories);

        if (relevantCategories.includes(tech.category)) {
            score += 10;
        }

        const keywords = {
            'Vision impairment': ['vision', 'visual', 'blind', 'sight', 'eye', 'read', 'screen reader', 'magnifier', 'orcam'],
            'Hearing impairment': ['hearing', 'deaf', 'sound', 'audio', 'listen', 'transcribe', 'caption', 'sign language'],
            'Physical/Mobility impairment': ['mobility', 'wheelchair', 'walk', 'movement', 'physical', 'ergonomic', 'exoskeleton', 'rewalk'],
            'Speech/Communication impairment': ['speech', 'voice', 'communication', 'speak', 'talk', 'aac', 'augmentative'],
        };

        const techText = `${tech.title} ${tech.description} ${tech.features?.join(' ')}`.toLowerCase();

        disabilityCategories.forEach(disability => {
            const relevantKeywords = keywords[disability as keyof typeof keywords] || [];
            relevantKeywords.forEach(keyword => {
                if (techText.includes(keyword.toLowerCase())) {
                    score += 3;
                }
            });
        });

        const daysSinceAdded = (Date.now() - new Date(tech.dateAdded).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceAdded < 30) {
            score += 2;
        }

        if (tech.status === 'Recommended' || tech.status === 'Popular') {
            score += 1;
        }

        return score;
    };

    const fetchRecommendedTechnologies = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(API_BASE_URL);
            let technologies = response.data;

            const storedData = localStorage.getItem('userDisabilityInfo');
            if (storedData) {
                const disabilityInfo = JSON.parse(storedData);
                
                if (disabilityInfo.hasDisability === 'yes' && 
                    disabilityInfo.disabilityCategories && 
                    disabilityInfo.disabilityCategories.length > 0) {
                    
                    setIsPersonalized(true);

                    const scoredTechnologies = technologies.map((tech: AssistiveTechItem) => ({
                        ...tech,
                        relevanceScore: calculateRelevanceScore(tech, disabilityInfo.disabilityCategories)
                    }));

                    const relevantTech = scoredTechnologies.filter((tech: any) => tech.relevanceScore > 0);

                    if (relevantTech.length > 0) {
                        relevantTech.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
                        technologies = relevantTech.slice(0, 3);
                    } else {
                        technologies = technologies.slice(-3).reverse();
                        setIsPersonalized(false);
                    }
                } else {
                    technologies = technologies.slice(-3).reverse();
                    setIsPersonalized(false);
                }
            } else {
                technologies = technologies.slice(-3).reverse();
                setIsPersonalized(false);
            }

            setTechItems(technologies);
        } catch (error) {
            console.error("Error fetching technologies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const truncateText = (text: string, maxLength: number = 65) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + "...";
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

    return (
        <Box
            maxW="380px"
            mx="auto"
            mt={1}
            p={5}
            borderRadius="2xl"
            bg="white"
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            border="1px solid"
            borderColor="gray.100"
        >
            {/* Header */}
            <Flex justify="space-between" align="flex-start" mb={5}>
                <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                        <Text fontSize="md" fontWeight="bold" color="gray.800" lineHeight="1.2">
                            {isPersonalized ? "Recommended For You" : "Tech Updates"}
                        </Text>
                    </HStack>
                </VStack>

                <Link
                    color="teal.600"
                    fontSize="xs"
                    fontWeight="600"
                    onClick={() => navigate("/assistive-tech")}
                    cursor="pointer"
                    _hover={{ 
                        color: "teal.700", 
                        textDecoration: "underline",
                        transform: "translateX(2px)"
                    }}
                    transition="all 0.2s"
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mt={1}
                >
                    View All
                    <Icon as={FaExternalLinkAlt} boxSize={2.5} />
                </Link>
            </Flex>

            {/* Content */}
            {isLoading ? (
                <Center py={12}>
                    <VStack spacing={3}>
                        <Spinner 
                            size="lg" 
                            color="teal.500" 
                            thickness="3px"
                            speed="0.8s"
                        />
                        <Text fontSize="sm" color="gray.500">Loading recommendations...</Text>
                    </VStack>
                </Center>
            ) : techItems.length === 0 ? (
                <Center py={12}>
                    <VStack spacing={3}>
                        <Box
                            bg="gray.100"
                            p={3}
                            borderRadius="full"
                        >
                            <Icon as={IoSparkles} boxSize={6} color="gray.400" />
                        </Box>
                        <Text fontSize="sm" color="gray.600" textAlign="center" fontWeight="500">
                            No technologies available yet
                        </Text>
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                            Check back soon for updates
                        </Text>
                    </VStack>
                </Center>
            ) : (
                <VStack spacing={3} align="stretch">
                    {techItems.map((item) => (
                        <Box 
                            key={item._id} 
                            position="relative"
                            _hover={{
                                transform: "translateY(-2px)",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                            <Flex
                                bg="linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)"
                                p={4}
                                borderRadius="xl"
                                boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                                border="1px solid"
                                borderColor="gray.200"
                                align="start"
                                cursor="pointer"
                                _hover={{
                                    bg: "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
                                    boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.15)",
                                    borderColor: "teal.300",
                                }}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                onClick={() => window.open(item.link, '_blank')}
                            >
                                {/* Image */}
                                <Box
                                    position="relative"
                                    flexShrink={0}
                                    mr={4}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        boxSize="60px"
                                        borderRadius="xl"
                                        objectFit="cover"
                                        fallbackSrc="https://via.placeholder.com/60x60?text=Tech"
                                        border="2px solid"
                                        borderColor="white"
                                        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
                                    />
                                </Box>

                                {/* Content */}
                                <VStack align="start" spacing={2} flex={1}>
                                    {/* Title */}
                                    <Text 
                                        fontSize="sm" 
                                        fontWeight="700" 
                                        color="gray.800"
                                        lineHeight="1.3"
                                        noOfLines={2}
                                    >
                                        {item.title}
                                    </Text>
                                    
                                    {/* Description */}
                                    <Text 
                                        fontSize="xs" 
                                        color="gray.600"
                                        lineHeight="1.5"
                                        noOfLines={2}
                                    >
                                        {truncateText(item.description, 65)}
                                    </Text>

                                    {/* Category Badge */}
                                    <Badge
                                        colorScheme={getCategoryColor(item.category)}
                                        fontSize="9px"
                                        fontWeight="600"
                                        px={2.5}
                                        py={1}
                                        borderRadius="md"
                                        variant="subtle"
                                        textTransform="uppercase"
                                        letterSpacing="0.3px"
                                    >
                                        {item.category}
                                    </Badge>
                                </VStack>
                            </Flex>
                        </Box>
                    ))}
                </VStack>
            )}
        </Box>
    );
}