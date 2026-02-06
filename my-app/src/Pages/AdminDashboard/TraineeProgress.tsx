import React from 'react';
import {
    Box,
    Heading,
    Text,
    Container,
    Button,
    HStack,
    VStack,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Icon,
    IconButton,
    Progress,
    Avatar,
    Flex,
    Spacer
} from '@chakra-ui/react';
import { ArrowBackIcon, DownloadIcon } from '@chakra-ui/icons';
import { FiEye, FiMail, FiEdit } from 'react-icons/fi';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface TraineeType {
    id: number;
    name: string;
    email: string;
    program: string;
    progress: number;
    completedModules: number;
    totalModules: number;
    status: 'IN PROGRESS' | 'COMPLETED' | 'PAUSED';
    score: string;
    lastActivity: string;
    avatar?: string;
}

interface TraineeProgramType {
    id: number;
    name: string;
    category: string;
    totalModules: number;
    duration: string;
    instructor: string;
}

interface TraineeProgressProps {
    programId: number;
    onBack: () => void;
}

const TraineeProgress: React.FC<TraineeProgressProps> = ({ programId, onBack }) => {
    // Mock data for training programs
    const programs: TraineeProgramType[] = [
        {
            id: 1,
            name: "React Development Fundamentals",
            category: "Web Development",
            totalModules: 8,
            duration: "6 weeks",
            instructor: "John Smith"
        },
        {
            id: 2,
            name: "Advanced JavaScript Programming",
            category: "Programming",
            totalModules: 12,
            duration: "8 weeks",
            instructor: "Sarah Johnson"
        },
        {
            id: 3,
            name: "UI/UX Design Principles",
            category: "Design",
            totalModules: 6,
            duration: "4 weeks",
            instructor: "Mike Wilson"
        },
        {
            id: 4,
            name: "Data Science with Python",
            category: "Data Science",
            totalModules: 10,
            duration: "10 weeks",
            instructor: "Dr. Emily Chen"
        },
        {
            id: 5,
            name: "Digital Marketing Strategy",
            category: "Marketing",
            totalModules: 5,
            duration: "3 weeks",
            instructor: "David Brown"
        },
        {
            id: 6,
            name: "English Communication Skills",
            category: "Language",
            totalModules: 4,
            duration: "5 weeks",
            instructor: "Lisa Anderson"
        }
    ];

    // Mock data for all trainees with their enrolled programs
    const allTrainees: (TraineeType & { programId: number })[] = [
        // React Development Fundamentals (programId: 1) - 145 students
        {
            id: 1,
            programId: 1,
            name: "Fatima Khan",
            email: "fatima.khan@example.com",
            program: "React Development Fundamentals",
            progress: 85,
            completedModules: 7,
            totalModules: 8,
            status: "IN PROGRESS",
            score: "92%",
            lastActivity: "2 hours ago"
        },
        {
            id: 2,
            programId: 1,
            name: "Ahmed Ali",
            email: "ahmed.ali@example.com",
            program: "React Development Fundamentals",
            progress: 100,
            completedModules: 8,
            totalModules: 8,
            status: "COMPLETED",
            score: "95%",
            lastActivity: "1 day ago"
        },
        {
            id: 3,
            programId: 1,
            name: "Sara Ahmed",
            email: "sara.ahmed@example.com",
            program: "React Development Fundamentals",
            progress: 62,
            completedModules: 5,
            totalModules: 8,
            status: "IN PROGRESS",
            score: "78%",
            lastActivity: "5 minutes ago"
        },
        {
            id: 4,
            programId: 1,
            name: "Hassan Sheikh",
            email: "hassan.sheikh@example.com",
            program: "React Development Fundamentals",
            progress: 37,
            completedModules: 3,
            totalModules: 8,
            status: "PAUSED",
            score: "65%",
            lastActivity: "3 days ago"
        },

        // Advanced JavaScript Programming (programId: 2) - 89 students
        {
            id: 5,
            programId: 2,
            name: "Ayesha Malik",
            email: "ayesha.malik@example.com",
            program: "Advanced JavaScript Programming",
            progress: 75,
            completedModules: 9,
            totalModules: 12,
            status: "IN PROGRESS",
            score: "88%",
            lastActivity: "1 hour ago"
        },
        {
            id: 6,
            programId: 2,
            name: "Muhammad Ali",
            email: "muhammad.ali@example.com",
            program: "Advanced JavaScript Programming",
            progress: 91,
            completedModules: 11,
            totalModules: 12,
            status: "IN PROGRESS",
            score: "92%",
            lastActivity: "30 minutes ago"
        },
        {
            id: 7,
            programId: 2,
            name: "Zainab Hussain",
            email: "zainab.hussain@example.com",
            program: "Advanced JavaScript Programming",
            progress: 58,
            completedModules: 7,
            totalModules: 12,
            status: "PAUSED",
            score: "72%",
            lastActivity: "1 week ago"
        },

        // UI/UX Design Principles (programId: 3) - 67 students
        {
            id: 8,
            programId: 3,
            name: "Nadia Sheikh",
            email: "nadia.sheikh@example.com",
            program: "UI/UX Design Principles",
            progress: 100,
            completedModules: 6,
            totalModules: 6,
            status: "COMPLETED",
            score: "96%",
            lastActivity: "2 days ago"
        },
        {
            id: 9,
            programId: 3,
            name: "Omar Khan",
            email: "omar.khan@example.com",
            program: "UI/UX Design Principles",
            progress: 83,
            completedModules: 5,
            totalModules: 6,
            status: "IN PROGRESS",
            score: "89%",
            lastActivity: "4 hours ago"
        },
        {
            id: 10,
            programId: 3,
            name: "Farah Ali",
            email: "farah.ali@example.com",
            program: "UI/UX Design Principles",
            progress: 50,
            completedModules: 3,
            totalModules: 6,
            status: "IN PROGRESS",
            score: "75%",
            lastActivity: "6 hours ago"
        },

        // Data Science with Python (programId: 4) - 203 students
        {
            id: 11,
            programId: 4,
            name: "Ali Hassan",
            email: "ali.hassan@example.com",
            program: "Data Science with Python",
            progress: 70,
            completedModules: 7,
            totalModules: 10,
            status: "IN PROGRESS",
            score: "84%",
            lastActivity: "2 hours ago"
        },
        {
            id: 12,
            programId: 4,
            name: "Mariam Khan",
            email: "mariam.khan@example.com",
            program: "Data Science with Python",
            progress: 40,
            completedModules: 4,
            totalModules: 10,
            status: "PAUSED",
            score: "68%",
            lastActivity: "5 days ago"
        },
        {
            id: 13,
            programId: 4,
            name: "Usman Ahmed",
            email: "usman.ahmed@example.com",
            program: "Data Science with Python",
            progress: 90,
            completedModules: 9,
            totalModules: 10,
            status: "IN PROGRESS",
            score: "93%",
            lastActivity: "1 hour ago"
        },

        // Digital Marketing Strategy (programId: 5) - 124 students
        {
            id: 14,
            programId: 5,
            name: "Khadija Malik",
            email: "khadija.malik@example.com",
            program: "Digital Marketing Strategy",
            progress: 100,
            completedModules: 5,
            totalModules: 5,
            status: "COMPLETED",
            score: "91%",
            lastActivity: "3 days ago"
        },
        {
            id: 15,
            programId: 5,
            name: "Tariq Sheikh",
            email: "tariq.sheikh@example.com",
            program: "Digital Marketing Strategy",
            progress: 80,
            completedModules: 4,
            totalModules: 5,
            status: "IN PROGRESS",
            score: "86%",
            lastActivity: "2 hours ago"
        },

        // English Communication Skills (programId: 6) - 78 students
        {
            id: 16,
            programId: 6,
            name: "Samira Ali",
            email: "samira.ali@example.com",
            program: "English Communication Skills",
            progress: 75,
            completedModules: 3,
            totalModules: 4,
            status: "IN PROGRESS",
            score: "82%",
            lastActivity: "1 day ago"
        },
        {
            id: 17,
            programId: 6,
            name: "Bilal Khan",
            email: "bilal.khan@example.com",
            program: "English Communication Skills",
            progress: 100,
            completedModules: 4,
            totalModules: 4,
            status: "COMPLETED",
            score: "94%",
            lastActivity: "1 week ago"
        }
    ];

    // Filter trainees based on selected program
    const trainees = allTrainees.filter(trainee => trainee.programId === programId);

    const currentProgram = programs.find(p => p.id === programId);

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'IN PROGRESS': 'blue',
            'COMPLETED': 'green',
            'PAUSED': 'orange'
        };
        return colors[status] || 'gray';
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getScoreColor = (score: string) => {
        const numericScore = parseInt(score.replace('%', ''));
        if (numericScore >= 90) return 'green.500';
        if (numericScore >= 80) return 'blue.500';
        if (numericScore >= 70) return 'orange.500';
        return 'red.500';
    };

    return (
        <Box>
            <SideNav />
            <Box>
                <TopNav />

                <Box bg="gray.50"
                    minH="100vh"
                    py={10}
                    ml="90px"
                    p={6}
                    maxW="calc(100% - 90px)" >
                    <Container maxW="container.xl">
                        {/* Header with Back Button */}
                        <Flex align="center" justify="space-between" mb={8}>
                            <HStack spacing={4}>
                                <IconButton
                                    icon={<ArrowBackIcon />}
                                    variant="ghost"
                                    size="md"
                                    onClick={onBack}
                                    color="gray.600"
                                    _hover={{ bg: "gray.100" }}
                                    aria-label="Go back"
                                />
                                <Box>
                                    <Heading
                                        as="h1"
                                        size="lg"
                                        color="gray.800"
                                        fontWeight="600"
                                        mb={1}
                                    >
                                        Trainee Progress ({trainees.length})
                                    </Heading>
                                    {currentProgram && (
                                        <Text color="gray.500" fontSize="sm">
                                            {currentProgram.name} • {currentProgram.category}
                                        </Text>
                                    )}
                                </Box>
                            </HStack>
                            <Button
                                leftIcon={<DownloadIcon />}
                                bg="#2CA58D"
                                color="white"
                                _hover={{ bg: "#27967F" }}
                                _active={{ bg: "#239072" }}
                                size="md"
                                fontWeight="500"
                            >
                                Export Report
                            </Button>
                        </Flex>

                        {/* Trainees Table */}
                        <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
                            <TableContainer>
                                <Table variant="simple">
                                    <Thead bg="gray.50">
                                        <Tr>
                                            <Th
                                                color="gray.600"
                                                textTransform="uppercase"
                                                fontSize="xs"
                                                fontWeight="600"
                                                letterSpacing="wide"
                                                px={6}
                                                py={4}
                                            >
                                                Trainee
                                            </Th>
                                            <Th
                                                color="gray.600"
                                                textTransform="uppercase"
                                                fontSize="xs"
                                                fontWeight="600"
                                                letterSpacing="wide"
                                                px={6}
                                                py={4}
                                            >
                                                Program
                                            </Th>
                                            <Th
                                                color="gray.600"
                                                textTransform="uppercase"
                                                fontSize="xs"
                                                fontWeight="600"
                                                letterSpacing="wide"
                                                px={6}
                                                py={4}
                                            >
                                                Progress
                                            </Th>
                                            <Th
                                                color="gray.600"
                                                textTransform="uppercase"
                                                fontSize="xs"
                                                fontWeight="600"
                                                letterSpacing="wide"
                                                px={6}
                                                py={4}
                                            >
                                                Status
                                            </Th>
                                            <Th
                                                color="gray.600"
                                                textTransform="uppercase"
                                                fontSize="xs"
                                                fontWeight="600"
                                                letterSpacing="wide"
                                                px={6}
                                                py={4}
                                            >
                                                Score
                                            </Th>
                                            <Th
                                                color="gray.600"
                                                textTransform="uppercase"
                                                fontSize="xs"
                                                fontWeight="600"
                                                letterSpacing="wide"
                                                px={6}
                                                py={4}
                                            >
                                                Last Activity
                                            </Th>
                                            {/* <Th
                                                color="gray.600"
                                                textTransform="uppercase"
                                                fontSize="xs"
                                                fontWeight="600"
                                                letterSpacing="wide"
                                                px={6}
                                                py={4}
                                            >
                                                Actions
                                            </Th> */}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {trainees.map((trainee) => (
                                            <Tr 
                                                key={trainee.id} 
                                                _hover={{ bg: "gray.50" }}
                                                transition="all 0.2s"
                                            >
                                                <Td px={6} py={4}>
                                                    <HStack spacing={3}>
                                                        <Avatar
                                                            size="md"
                                                            name={trainee.name}
                                                            bg={trainee.id === 1 ? "orange.500" : 
                                                                trainee.id === 2 ? "teal.500" :
                                                                trainee.id === 3 ? "blue.500" :
                                                                trainee.id === 4 ? "cyan.500" :
                                                                trainee.id === 5 ? "green.500" :
                                                                "purple.500"}
                                                            color="white"
                                                            fontWeight="600"
                                                            fontSize="sm"
                                                        >
                                                            {getInitials(trainee.name)}
                                                        </Avatar>
                                                        <Box>
                                                            <Text
                                                                color="gray.800"
                                                                fontWeight="600"
                                                                fontSize="md"
                                                                mb={1}
                                                            >
                                                                {trainee.name}
                                                            </Text>
                                                            <Text color="gray.500" fontSize="sm">
                                                                {trainee.email}
                                                            </Text>
                                                        </Box>
                                                    </HStack>
                                                </Td>
                                                <Td px={6} py={4}>
                                                    <VStack align="start" spacing={1}>
                                                        <Text fontSize="md" fontWeight="600" color="gray.800">
                                                            {trainee.program}
                                                        </Text>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {trainee.completedModules}/{trainee.totalModules} modules
                                                        </Text>
                                                    </VStack>
                                                </Td>
                                                <Td px={6} py={4}>
                                                    <VStack align="start" spacing={2}>
                                                        <Text fontSize="sm" fontWeight="600" color="gray.700">
                                                            {trainee.progress}%
                                                        </Text>
                                                        <Progress
                                                            value={trainee.progress}
                                                            size="md"
                                                            colorScheme="blue"
                                                            bg="gray.200"
                                                            borderRadius="full"
                                                            w="100px"
                                                        />
                                                    </VStack>
                                                </Td>
                                                <Td px={6} py={4}>
                                                    <Badge
                                                        colorScheme={getStatusColor(trainee.status)}
                                                        variant="subtle"
                                                        fontSize="xs"
                                                        px={3}
                                                        py={1}
                                                        textTransform="uppercase"
                                                        fontWeight="600"
                                                        borderRadius="md"
                                                    >
                                                        {trainee.status}
                                                    </Badge>
                                                </Td>
                                                <Td px={6} py={4}>
                                                    <Text 
                                                        fontSize="lg" 
                                                        fontWeight="700" 
                                                        color={getScoreColor(trainee.score)}
                                                    >
                                                        {trainee.score}
                                                    </Text>
                                                </Td>
                                                <Td px={6} py={4}>
                                                    <Text fontSize="sm" color="gray.600">
                                                        {trainee.lastActivity}
                                                    </Text>
                                                </Td>
                                                
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default TraineeProgress;