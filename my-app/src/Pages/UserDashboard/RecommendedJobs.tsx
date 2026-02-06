import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Spacer,
    VStack,
    Text,
    Link,
    Spinner,
    Alert,
    AlertIcon,
    Badge,
    Tooltip,
    Progress,
    Card,
    CardBody,
    Circle,
    Icon
} from "@chakra-ui/react";
import { FaStar, FaMapPin, FaClock, FaUsers, FaHome, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import { IoAccessibilitySharp } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";

interface Job {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    experience: string;
    deadline: string;
    status: string;
    datePosted: string;
    company?: string;
    salary?: string;
    category?: string;
    time?: string;
    relevanceScore?: number;
    matchedSkills?: string[];
    matchedKeywords?: string[];
    requirements?: string[];
}

interface UserProfile {
    name: string;
    role: string;
    experience: string;
    hasDisability: string;
    workPreferences: string[];
}

interface RecommendationStats {
    highRelevance: number;
    mediumRelevance: number;
    lowRelevance: number;
}

export default function RecommendedJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPersonalized, setIsPersonalized] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<RecommendationStats | null>(null);

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get user email from localStorage
                const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                const email = userData.email;

                let response;
                let data;

                // Try personalized recommendations if email exists
                if (email) {
                    console.log('Fetching personalized recommendations for:', email);
                    try {
                        response = await fetch(`http://localhost:3001/api/recommendations/${email}?limit=4`);
                        data = await response.json();

                        console.log('Personalized response:', data);

                        if (response.ok && data.success && data.data && data.data.length > 0) {
                            setJobs(data.data);
                            setUserEmail(email);
                            setUserProfile(data.userProfile || null);
                            setStats(data.recommendationStats || null);
                            setIsPersonalized(true);
                            setLoading(false);
                            return; // Exit early on success
                        } else {
                            console.log('No personalized recommendations, trying fallback');
                        }
                    } catch (personalizedError) {
                        console.log("Personalized recommendations error:", personalizedError);
                    }
                }

                // Fallback to general recommendations
                console.log('Fetching general recommendations');
                const fallbackResponse = await fetch("http://localhost:3001/api/recommendations?limit=4");
                const fallbackData = await fallbackResponse.json();
                
                console.log('Fallback response:', fallbackData);

                if (fallbackData.success && fallbackData.data) {
                    setJobs(fallbackData.data);
                    setIsPersonalized(false);
                } else {
                    setJobs([]);
                }

                setLoading(false);

            } catch (err) {
                console.error("Error fetching job recommendations:", err);
                setError("Failed to fetch job recommendations. Please try again later.");
                setJobs([]);
                setLoading(false);
            }
        };

        fetchRecommendedJobs();
    }, []); // Only run once on mount

    const logUserInteraction = async (jobId: string, interaction: string) => {
        if (!userEmail) return;

        try {
            await fetch('http://localhost:3001/api/recommendations/interaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail,
                    jobId,
                    interaction
                })
            });
        } catch (error) {
            console.log('Failed to log interaction:', error);
        }
    };

    const getCompanyLogo = (companyName: string) => {
        const colors = ['#3182CE', '#38A169', '#D69E2E', '#9F7AEA', '#E53E3E'];
        const color = colors[companyName.length % colors.length];
        return color;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "1 Day Ago";
        if (diffDays < 7) return `${diffDays} Days Ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} Week${Math.floor(diffDays / 7) > 1 ? 's' : ''} Ago`;
        return `${Math.floor(diffDays / 30)} Month${Math.floor(diffDays / 30) > 1 ? 's' : ''} Ago`;
    };

    const getApplicantsInfo = () => {
        const count = Math.floor(Math.random() * 20) + 1;
        const color = count > 10 ? "red.500" : "green.500";
        return { count: `${count} Applicants`, color };
    };

    const getRelevanceColor = (score?: number) => {
        if (!score) return "gray";
        if (score >= 80) return "green";
        if (score >= 60) return "blue";
        if (score >= 40) return "yellow";
        return "orange";
    };

    const getAccessibilityIcon = (job: Job) => {
        if (!userProfile?.hasDisability || userProfile.hasDisability === 'no') return null;

        const isRemote = job.location.toLowerCase().includes('remote');
        const isFlexible = job.description.toLowerCase().includes('flexible');

        if (isRemote || isFlexible) {
            return (
                <Tooltip label="Accessibility friendly workplace" placement="top">
                    <Box>
                        <Icon as={IoAccessibilitySharp} color="green.500" size="sm" />
                    </Box>
                </Tooltip>
            );
        }
        return null;
    };

    const handleViewJob = (jobId: string) => {
        logUserInteraction(jobId, 'viewed');
        window.location.href = `/job/${jobId}`;
    };

    const handleSeeAll = () => {
        window.location.href = '/all-jobs';
    };

    if (loading) {
        return (
            <Card maxW="990px" mx="auto" shadow="xl" borderRadius="2xl">
                <CardBody textAlign="center" py={12}>
                    <Spinner size="lg" color="#2CA58D" thickness="4px" />
                    <Text mt={4} color="gray.600" fontSize="lg" fontWeight="medium">
                        {userEmail ? "Finding personalized job recommendations..." : "Loading job recommendations..."}
                    </Text>
                    {isPersonalized && (
                        <Text fontSize="sm" color="gray.500" mt={2}>
                            Analyzing your profile and matching with suitable opportunities
                        </Text>
                    )}
                </CardBody>
            </Card>
        );
    }

    if (error) {
        return (
            <Card maxW="990px" mx="auto" shadow="xl" borderRadius="2xl">
                <CardBody>
                    <Alert status="error" borderRadius="xl">
                        <AlertIcon />
                        {error}
                    </Alert>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card maxW="990px" mx="auto" shadow="xl" borderRadius="2xl" overflow="hidden">
            <CardBody p={6}>
                {/* Header Section */}
                <Flex justify="space-between" align="center" mb={4}>
                    <VStack align="start" spacing={1}>
                        <HStack spacing={3}>
                            <Text fontSize="xl" fontWeight="bold" color="gray.800">
                                {isPersonalized ? "Recommended Jobs" : "Job Recommendations"}
                            </Text>
                            {isPersonalized && (
                                <HStack spacing={2}>
                                    <Badge colorScheme="green" variant="solid" fontSize="xs" px={2} py={1}>
                                        <Icon as={HiTrendingUp} size="xs" mr={1} />
                                        AI Powered
                                    </Badge>
                                    {userProfile?.hasDisability === 'yes' && (
                                        <Badge colorScheme="blue" variant="solid" fontSize="xs" px={2} py={1}>
                                            <Icon as={FaShieldAlt} size="xs" mr={1} />
                                            Accessibility Focus
                                        </Badge>
                                    )}
                                </HStack>
                            )}
                        </HStack>
                    </VStack>

                    <Link
                        color="teal.600"
                        fontSize="xs"
                        fontWeight="600"
                        onClick={handleSeeAll}
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

                {/* Recommendation Stats */}
                {isPersonalized && stats && (
                    <Box mb={6} p={4} bg="gray.50" borderRadius="xl" border="1px solid" borderColor="gray.200">
                        <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
                            Match Quality Distribution
                        </Text>
                        <HStack spacing={6}>
                            <VStack align="start" spacing={1}>
                                <HStack>
                                    <Circle size="8px" bg="green.500" />
                                    <Text fontSize="xs" color="green.600" fontWeight="medium">
                                        High Match ({stats.highRelevance})
                                    </Text>
                                </HStack>
                                <Progress value={(stats.highRelevance / (stats.highRelevance + stats.mediumRelevance + stats.lowRelevance)) * 100} size="sm" colorScheme="green" bg="gray.200" borderRadius="full" />
                            </VStack>
                            <VStack align="start" spacing={1}>
                                <HStack>
                                    <Circle size="8px" bg="blue.500" />
                                    <Text fontSize="xs" color="blue.600" fontWeight="medium">
                                        Medium Match ({stats.mediumRelevance})
                                    </Text>
                                </HStack>
                                <Progress value={(stats.mediumRelevance / (stats.highRelevance + stats.mediumRelevance + stats.lowRelevance)) * 100} size="sm" colorScheme="blue" bg="gray.200" borderRadius="full" />
                            </VStack>
                            <VStack align="start" spacing={1}>
                                <HStack>
                                    <Circle size="8px" bg="orange.500" />
                                    <Text fontSize="xs" color="orange.600" fontWeight="medium">
                                        Lower Match ({stats.lowRelevance})
                                    </Text>
                                </HStack>
                                <Progress value={(stats.lowRelevance / (stats.highRelevance + stats.mediumRelevance + stats.lowRelevance)) * 100} size="sm" colorScheme="orange" bg="gray.200" borderRadius="full" />
                            </VStack>
                        </HStack>
                    </Box>
                )}

                {/* Job Listings */}
                {jobs.length > 0 ? (
                    <VStack spacing={4}>
                        {jobs.map((job) => {
                            const applicantsInfo = getApplicantsInfo();
                            const relevanceColor = getRelevanceColor(job.relevanceScore);
                            const accessibilityIcon = getAccessibilityIcon(job);

                            return (
                                <Card
                                    key={job._id}
                                    w="100%"
                                    variant="outline"
                                    _hover={{
                                        shadow: "lg",
                                        borderColor: "#2CA58D",
                                        transform: "translateY(-2px)"
                                    }}
                                    transition="all 0.3s ease"
                                    cursor="pointer"
                                    onClick={() => handleViewJob(job._id)}
                                >
                                    <CardBody p={5}>
                                        <Flex align="start" gap={4}>
                                            {/* Company Avatar */}
                                            <Avatar
                                                bg={getCompanyLogo(job.company || job.department)}
                                                color="white"
                                                name={job.company || job.department}
                                                size="md"
                                                fontWeight="bold"
                                            />

                                            <Box flex={1}>
                                                {/* Job Title and Company */}
                                                <Flex justify="space-between" align="start" mb={2}>
                                                    <VStack align="start" spacing={1}>
                                                        <HStack spacing={2}>
                                                            <Text fontWeight="bold" fontSize="lg" color="gray.800">
                                                                {job.title}
                                                            </Text>
                                                            {accessibilityIcon}
                                                        </HStack>
                                                        <HStack spacing={2} color="gray.600">
                                                            <Text fontSize="md">
                                                                {job.company || job.department}
                                                            </Text>
                                                            <Text fontSize="sm">•</Text>
                                                            <HStack spacing={1}>
                                                                <Icon as={FaMapPin} size="sm" />
                                                                <Text fontSize="sm">{job.location}</Text>
                                                            </HStack>
                                                        </HStack>
                                                    </VStack>

                                                    {/* Relevance Score */}
                                                    {isPersonalized && job.relevanceScore && (
                                                        <Tooltip
                                                            label={`${job.relevanceScore}% match based on your profile`}
                                                            placement="top"
                                                        >
                                                            <VStack spacing={1} align="center" minW="60px">
                                                                <Badge
                                                                    colorScheme={relevanceColor}
                                                                    variant="solid"
                                                                    fontSize="xs"
                                                                    px={2}
                                                                    py={1}
                                                                    borderRadius="full"
                                                                >
                                                                    {job.relevanceScore}%
                                                                </Badge>
                                                                <HStack spacing={0}>
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Icon
                                                                            key={star}
                                                                            as={FaStar}
                                                                            size="xs"
                                                                            color={
                                                                                star <= Math.round((job.relevanceScore || 0) / 20)
                                                                                    ? "yellow.400"
                                                                                    : "gray.300"
                                                                            }
                                                                            fill={
                                                                                star <= Math.round((job.relevanceScore || 0) / 20)
                                                                                    ? "yellow.400"
                                                                                    : "transparent"
                                                                            }
                                                                        />
                                                                    ))}
                                                                </HStack>
                                                            </VStack>
                                                        </Tooltip>
                                                    )}
                                                </Flex>

                                                {/* Job Details */}
                                                <HStack spacing={4} mb={3} fontSize="sm" color="gray.600">
                                                    <HStack spacing={1}>
                                                        <Icon as={FaClock} size="sm" />
                                                        <Text>{formatDate(job.datePosted)}</Text>
                                                    </HStack>
                                                    <HStack spacing={1}>
                                                        <Icon as={FaUsers} size="sm" />
                                                        <Text color={applicantsInfo.color}>{applicantsInfo.count}</Text>
                                                    </HStack>
                                                    <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                                                        {job.type}
                                                    </Badge>
                                                    <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                                                        {job.experience}
                                                    </Badge>
                                                </HStack>

                                                {/* Job Description Preview */}
                                                <Text fontSize="sm" color="gray.700" mb={3} noOfLines={2}>
                                                    {job.description}
                                                </Text>

                                                {/* Matched Skills */}
                                                {isPersonalized && job.matchedKeywords && job.matchedKeywords.length > 0 && (
                                                    <Box mb={3}>
                                                        <Text fontSize="xs" color="gray.500" mb={2} fontWeight="medium">
                                                            Skills Match:
                                                        </Text>
                                                        <HStack spacing={2} flexWrap="wrap">
                                                            {job.matchedKeywords.slice(0, 4).map((skill, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    colorScheme="green"
                                                                    variant="outline"
                                                                    fontSize="xs"
                                                                    textTransform="capitalize"
                                                                    px={2}
                                                                    py={1}
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                            {job.matchedKeywords.length > 4 && (
                                                                <Text fontSize="xs" color="gray.500">
                                                                    +{job.matchedKeywords.length - 4} more
                                                                </Text>
                                                            )}
                                                        </HStack>
                                                    </Box>
                                                )}

                                                {/* Action Buttons */}
                                                <Flex justify="space-between" align="center" mt={4}>
                                                    <HStack spacing={1}>
                                                        <Icon as={FaCalendarAlt} size="sm" color="red.500" />
                                                        <Text fontSize="xs" color="red.600" fontWeight="medium">
                                                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                                                        </Text>
                                                    </HStack>

                                                    <Button
                                                        bg="#2CA58D"
                                                        color="white"
                                                        size="sm"
                                                        fontWeight="medium"
                                                        px={6}
                                                        borderRadius="full"
                                                        _hover={{
                                                            bg: "#3DB896",
                                                            transform: "scale(1.05)"
                                                        }}
                                                        _active={{
                                                            transform: "scale(0.95)"
                                                        }}
                                                        transition="all 0.2s"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewJob(job._id);
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                </Flex>
                                            </Box>
                                        </Flex>
                                    </CardBody>
                                </Card>
                            );
                        })}
                    </VStack>
                ) : (
                    <Card variant="outline">
                        <CardBody textAlign="center" py={12}>
                            <VStack spacing={4}>
                                <Circle size="60px" bg="gray.100">
                                    <Icon as={HiTrendingUp} size="lg" color="gray.400" />
                                </Circle>
                                <VStack spacing={2}>
                                    <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                                        No job recommendations available
                                    </Text>
                                    <Text fontSize="sm" color="gray.500" maxW="400px">
                                        {isPersonalized
                                            ? "We're working on finding the perfect matches for your profile. Check back soon!"
                                            : "Complete your profile to get personalized AI-powered job recommendations tailored to your skills and accessibility needs."
                                        }
                                    </Text>
                                </VStack>
                                {!isPersonalized && (
                                    <Button
                                        colorScheme="green"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.location.href = '/profile-setup'}
                                    >
                                        Complete Profile
                                    </Button>
                                )}
                            </VStack>
                        </CardBody>
                    </Card>
                )}

                {/* Profile Enhancement Tip */}
                {isPersonalized && userProfile?.hasDisability === 'yes' && (
                    <Box mt={6} p={4} bg="green.50" borderRadius="xl" border="1px solid" borderColor="green.200">
                        <HStack spacing={3}>
                            <Icon as={IoAccessibilitySharp} color="green.600" size="md" />
                            <VStack align="start" spacing={1} flex={1}>
                                <Text fontSize="sm" color="green.800" fontWeight="semibold">
                                    Accessibility-Focused Matching Active
                                </Text>
                                <Text fontSize="xs" color="green.700" lineHeight="1.4">
                                    Our AI is prioritizing roles and companies that align with your accessibility needs and work preferences.
                                    Jobs with remote work options and flexible accommodations are given higher relevance scores.
                                </Text>
                            </VStack>
                        </HStack>
                    </Box>
                )}
            </CardBody>
        </Card>
    );
}