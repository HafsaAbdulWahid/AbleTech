import { Box, Flex, Text, Icon, SimpleGrid, VStack, Spinner } from '@chakra-ui/react';
import { FiBriefcase, FiFileText, FiBookOpen } from 'react-icons/fi';
import { TbDisabled2 } from 'react-icons/tb';
import { IconType } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

type StatCardProps = {
    title: string;
    value: number | string;
    color: string;
    icon: IconType;
    onClick?: () => void;
    isLoading?: boolean;
};

function StatCard({ title, value, color, icon, onClick, isLoading }: StatCardProps) {
    return (
        <Box
            bg={color}
            p={7}
            height={"150px"}
            borderRadius="xl"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.07)"
            border="1px solid"
            borderColor="gray.100"
            onClick={onClick}
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1)",
                borderColor: color
            }}
        >
            <Flex align="center" justify="space-between">
                <VStack align="start" spacing={2}>
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="white"
                        textTransform="uppercase"
                        letterSpacing="wide"
                    >
                        {title}
                    </Text>
                    {isLoading ? (
                        <Spinner size="md" color="white" />
                    ) : (
                        <Text
                            fontSize="3xl"
                            fontWeight="bold"
                            color="gray.100"
                            lineHeight="1"
                        >
                            {value}
                        </Text>
                    )}
                </VStack>
                <Box
                    p={3}
                    borderRadius="lg"
                    bg={`${color.split('.')[0]}.50`}
                >
                    <Icon as={icon} boxSize={6} color={color} />
                </Box>
            </Flex>
        </Box>
    );
}

// Main StatsCards Component
export default function StatsCards() {
    const navigate = useNavigate();
    const [jobCount, setJobCount] = useState<number>(0);
    const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
    const [trainingCount, setTrainingCount] = useState<number>(0);
    const [isLoadingTraining, setIsLoadingTraining] = useState<boolean>(true);

    useEffect(() => {
        const fetchJobCount = async () => {
            try {
                setIsLoadingJobs(true);
                const response = await axios.get("http://localhost:3001/api/jobs", {
                    params: {
                        page: 1,
                        limit: 1000, // Get all jobs to count them
                    },
                });
                const jobsData = response.data.data || [];
                setJobCount(jobsData.length);
                setIsLoadingJobs(false);
            } catch (err) {
                console.error("Error fetching job count:", err);
                setJobCount(0);
                setIsLoadingJobs(false);
            }
        };

        const fetchTrainingCount = async () => {
            try {
                setIsLoadingTraining(true);
                const response = await axios.get("http://localhost:3001/api/trainers/training-programs");
                const trainingData = response.data.data || [];
                setTrainingCount(trainingData.length);
                setIsLoadingTraining(false);
            } catch (err) {
                console.error("Error fetching training count:", err);
                setTrainingCount(0);
                setIsLoadingTraining(false);
            }
        };

        fetchJobCount();
        fetchTrainingCount();
    }, []);

    const handleCardClick = (cardType: string) => {
        switch (cardType) {
            case 'Jobs':
                navigate('/admin-job-listings');
                break;
            case 'Applications':
                navigate('/Applications');
                break;
            case 'Assistive Technologies':
                navigate('/assistive-tech-for-admin');
                break;
            case 'Training':
                navigate('/training-programs-for-admin');
                break;
            default:
                break;
        }
    };

    return (
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8} mt={2}>
            <StatCard
                title="Jobs"
                value={jobCount}
                color="blue.500"
                icon={FiBriefcase}
                onClick={() => handleCardClick('Jobs')}
                isLoading={isLoadingJobs}
            />
            <StatCard
                title="Applications"
                value="10"
                color="teal.500"
                icon={FiFileText}
                onClick={() => handleCardClick('Applications')}
            />
            <StatCard
                title="Assistive Technologies"
                value="15"
                color="blue.600"
                icon={TbDisabled2}
                onClick={() => handleCardClick('Assistive Technologies')}
            />
            <StatCard
                title="Training"
                value={trainingCount}
                color="yellow.400"
                icon={FiBookOpen}
                onClick={() => handleCardClick('Training')}
                isLoading={isLoadingTraining}
            />
        </SimpleGrid>
    );
}