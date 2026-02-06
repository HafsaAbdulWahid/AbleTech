import React, { useState } from 'react';
import {
    Container,
    VStack,
    HStack,
    Text,
    Box,
    Select,
    Grid,
    useDisclosure,
    Heading
} from '@chakra-ui/react';
import SideNav from "../UserDashboard/SideNav";
import TopNav from "../UserDashboard/TopNav";
import SetupModal from './components/SetupModal';
import InterviewSession from './components/InterviewSession';
import FeedbackModal from './components/FeedbackModal';
import InterviewerCard from './components/InterviewerCard';
import { Interviewer, SessionConfig } from './types/interview.types';
import { mockInterviewApi } from './services/mockInterviewApi';

const MockInterview: React.FC = () => {
    const [sessionActive, setSessionActive] = useState(false);
    const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    const setupModal = useDisclosure();
    const feedbackModal = useDisclosure();

    const interviewer: Interviewer = {
        id: '1',
        name: 'Standard Interviewer',
        locked: false,
        description: 'Professional AI interviewer for general practice'
    };

    const handleStartInterview = () => {
        setupModal.onOpen();
    };

    const handleLaunch = (config: SessionConfig) => {
        setSessionConfig(config);
        setupModal.onClose();
        setSessionActive(true);
    };

    const handleEndSession = async () => {
        if (currentSessionId) {
            try {
                await mockInterviewApi.endSession(currentSessionId);
            } catch (error) {
                console.error('Failed to end session:', error);
            }
        }
        setSessionActive(false);
        feedbackModal.onOpen();
    };

    const handleCloseFeedback = () => {
        feedbackModal.onClose();
        setSessionConfig(null);
        setCurrentSessionId(null);
    };

    const handleSubmitFeedback = async (rating: number, comments: string) => {
        if (currentSessionId) {
            try {
                await mockInterviewApi.submitFeedback(currentSessionId, { rating, comments });
            } catch (error) {
                console.error('Failed to submit feedback:', error);
            }
        }
    };

    if (sessionActive && sessionConfig) {
        return <InterviewSession config={sessionConfig} onEnd={handleEndSession} />;
    }

    return (
        <Box minH="100vh" bg="gray.50">
            <SideNav />
            <Box>
                <TopNav />
                <Box py={10}>
                    <Container maxW="7xl">
                        <VStack spacing={8} align="stretch">
                            {/* Header */}
                            <VStack spacing={4} textAlign="center">
                                <Heading
                                    as="h1"
                                    size="lg"
                                    color="gray.800"
                                    fontWeight="bold"
                                >
                                    AI Mock Interview
                                </Heading>
                                <Text
                                    color="gray.600"
                                    fontSize="md"
                                    maxW="4xl"
                                    mx="auto"
                                >
                                    Practice your interview skills with our AI interviewer. Get instant feedback
                                    and improve your confidence. Mock Interview with AI anytime, anywhere! Powered
                                    by real interview data and company insights.
                                </Text>
                            </VStack>

                            {/* Interviewer Card */}
                            <Grid
                                templateColumns="1fr"
                                justifyItems="center"
                                mt={8}
                            >
                                <Box maxW="400px" w="100%">
                                    <InterviewerCard
                                        interviewer={interviewer}
                                        onStartInterview={handleStartInterview}              
                                    />
                                </Box>
                            </Grid>
                        </VStack>
                    </Container>

                    {/* Modals */}
                    <SetupModal
                        isOpen={setupModal.isOpen}
                        onClose={setupModal.onClose}
                        onLaunch={handleLaunch}
                    />

                    <FeedbackModal
                        isOpen={feedbackModal.isOpen}
                        onClose={handleCloseFeedback}
                        sessionId={currentSessionId}
                        onSubmit={handleSubmitFeedback}
                    />
                </Box>
            </Box>
        </Box>
    )
};

export default MockInterview;