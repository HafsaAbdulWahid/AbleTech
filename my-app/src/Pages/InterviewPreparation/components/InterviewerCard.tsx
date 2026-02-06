import React from 'react';
import {
    Box,
    VStack,
    Text,
    Button,
    Avatar
} from '@chakra-ui/react';
import { FaVideo } from 'react-icons/fa';
import { Interviewer } from '../types/interview.types';

interface InterviewerCardProps {
    interviewer: Interviewer;
    onStartInterview: (interviewer: Interviewer) => void;
}

const InterviewerCard: React.FC<InterviewerCardProps> = ({
    interviewer,
    onStartInterview
}) => {
    return (
        <Box
            bg="white"
            borderRadius="xl"
            p={6}
            border="1px"
            borderColor="gray.200"
            boxShadow="md"
            transition="all 0.3s"
            _hover={{
                transform: 'scale(1.02)',
                boxShadow: 'xl',
                borderColor: '#2CA58D'
            }}
        >
            <VStack spacing={4} align="stretch">
                {/* Avatar */}
                <Box display="flex" justifyContent="center">
                    <Avatar
                        size="2xl"
                        bg="linear-gradient(135deg, #2CA58D 0%, #1e7a66 100%)"
                        name={interviewer.name}
                        color="white"
                    />
                </Box>

                {/* Interviewer Info */}
                <VStack align="center" spacing={2}>
                    <Text color="gray.800" fontWeight="bold" fontSize="xl">
                        {interviewer.name}
                    </Text>
                    {interviewer.description && (
                        <Text color="gray.600" fontSize="sm" textAlign="center">
                            {interviewer.description}
                        </Text>
                    )}
                </VStack>

                {/* Action Button */}
                <Button
                    colorScheme="orange"
                    bg="linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
                    _hover={{
                        bg: "linear-gradient(135deg, #27967F 0%, #2CA58D 100%)",
                        transform: "translateY(-1px)",
                        shadow: "xl"
                    }}
                    onClick={() => onStartInterview(interviewer)}
                    w="100%"
                    size="lg"
                    borderRadius="xl"
                    shadow="lg"
                    transition="all 0.1s"
                >
                    Start Interview
                </Button>
            </VStack>
        </Box>
    );
};

export default InterviewerCard;