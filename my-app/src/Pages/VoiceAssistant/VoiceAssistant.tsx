import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    IconButton,
    VStack,
    HStack,
    Text,
    Badge,
    Progress,
    Button,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Card,
    CardBody,
} from '@chakra-ui/react';
import {
    FiMic,
    FiMicOff,
    FiSettings,
    FiPlay,
    FiPause
} from 'react-icons/fi';
import { useAllVoiceCommands, CommandResult } from './commands/AllVoiceCommands';
import { useVoiceAssistant } from './VoiceAssistantProvider';

// Types
interface User {
    name?: string;
    email?: string;
    userType?: string;
}

interface VoiceAssistantProps {
    navigate: (path: string) => void;
    user: User | null;
    openChatbot?: () => void;
}

interface CommandHistoryItem {
    command: string;
    result: CommandResult;
    timestamp: string;
    confidence: number;
}

// Voice Recognition Hook
const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const [confidence, setConfidence] = useState(0);
    const recognitionRef = useRef<any>(null);
    const toast = useToast();

    useEffect(() => {
        // Check for Web Speech API support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSupported(true);
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            const recognition = recognitionRef.current;
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    const confidence = event.results[i][0].confidence;

                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                        setConfidence(confidence || 0.9);
                    } else {
                        interimTranscript += transcript;
                    }
                }

                setTranscript(finalTranscript || interimTranscript);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                toast({
                    title: "Voice Error",
                    description: `Speech recognition error: ${event.error}`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            };

            recognition.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [toast]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && isSupported) {
            setTranscript('');
            setIsListening(true);
            recognitionRef.current.start();
        }
    }, [isSupported]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    return {
        isListening,
        transcript,
        isSupported,
        confidence,
        startListening,
        stopListening
    };
};

// Speech Synthesis Hook
const useSpeechSynthesis = () => {
    const { voiceSettings } = useVoiceAssistant();
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    const speak = useCallback((text: string, options: any = {}) => {
        if (synthRef.current) {
            // Cancel any ongoing speech
            synthRef.current.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = options.rate || voiceSettings.rate;
            utterance.pitch = options.pitch || voiceSettings.pitch;
            utterance.volume = options.volume || voiceSettings.volume;
            utterance.voice = options.voice || null;

            synthRef.current.speak(utterance);

            return new Promise<void>((resolve) => {
                utterance.onend = () => resolve();
            });
        }
        return Promise.resolve();
    }, [voiceSettings]);

    return { speak };
};

// Main Voice Assistant Component
const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ navigate, user, openChatbot }) => {
    const {
        isListening,
        transcript,
        isSupported,
        confidence,
        startListening,
        stopListening
    } = useSpeechRecognition();

    const { speak } = useSpeechSynthesis();
    const { voiceSettings, updateVoiceSettings } = useVoiceAssistant();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Use the consolidated voice commands
    const { processCommand, startWelcomeTour } = useAllVoiceCommands(navigate, speak, user);

    const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [hasWelcomed, setHasWelcomed] = useState(false);
    const toast = useToast();

    // Welcome user only on user dashboard
    useEffect(() => {
        if (isSupported && !hasWelcomed && user && voiceSettings.autoWelcome) {
            // Check if current path is user dashboard
            const currentPath = window.location.pathname;
            if (currentPath === '/user-dashboard') {
                const welcomeUser = async () => {
                    await speak("Welcome to AbleTech! I'm your voice assistant.");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await speak("Say help to hear available commands, or start tour for a guided introduction.");
                    setHasWelcomed(true);
                };

                // Delay welcome message slightly to ensure everything is loaded
                setTimeout(welcomeUser, 2000);
            }
        }
    }, [isSupported, hasWelcomed, user, speak, voiceSettings.autoWelcome]);

    // Process completed commands
    useEffect(() => {
        if (transcript && !isListening && transcript.length > 2) {
            handleCommand(transcript);
        }
    }, [transcript, isListening]);

    const handleCommand = async (command: string) => {
        if (!command.trim()) return;

        setIsProcessing(true);
        try {
            const result = await processCommand(command);
            const timestamp = new Date().toLocaleTimeString();

        } catch (error) {
            console.error('Command processing error:', error);
            toast({
                title: "Command Error",
                description: "Failed to process voice command",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const testSpeak = async () => {
        setIsSpeaking(true);
        await speak("Voice assistant is working perfectly.", {
            rate: voiceSettings.rate,
            volume: voiceSettings.volume,
            pitch: voiceSettings.pitch
        });
        setIsSpeaking(false);
    };

    if (!isSupported) {
        return (
            <Box
                position="fixed"
                bottom="120px"
                right="20px"
                p={4}
                bg="red.50"
                borderRadius="md"
                maxW="300px"
                boxShadow="lg"
            >
                <Text color="red.600" fontSize="sm">
                    Voice Assistant is not supported in this browser.
                    Please use Chrome, Edge, or Safari for the best experience.
                </Text>
            </Box>
        );
    }

    return (
        <>
            {/* Floating Voice Button  */}
            <Box
                position="fixed"
                bottom="80px"
                right="20px"
                zIndex={1000}
            >
                <VStack spacing={2}>
                    {isListening && (
                        <Card bg="white" shadow="lg" size="sm">
                            <CardBody p={3}>
                                <VStack spacing={2} align="center">
                                    <Box textAlign="center">
                                        <Text fontSize="xs" fontWeight="bold" color="#1e2738">
                                            Listening...
                                        </Text>
                                        <Progress
                                            size="xs"
                                            isIndeterminate
                                            colorScheme="gray"
                                            mt={1}
                                            borderRadius="full"
                                            sx={{
                                                '& > div': {
                                                    backgroundColor: '#1e2738'
                                                }
                                            }}
                                        />
                                    </Box>
                                    {transcript && (
                                        <Text fontSize="xs" color="gray.600" maxW="200px" noOfLines={2}>
                                            "{transcript}"
                                        </Text>
                                    )}
                                    {confidence > 0 && (
                                        <Badge
                                            colorScheme={confidence > 0.8 ? 'green' : 'yellow'}
                                            size="sm"
                                            bg={confidence > 0.8 ? '#1e2738' : 'yellow.400'}
                                            color="white"
                                        >
                                            {Math.round(confidence * 100)}% confident
                                        </Badge>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    <HStack spacing={2}>
                        <IconButton
                            aria-label="Voice settings"
                            icon={<FiSettings />}
                            size="sm"
                            variant="ghost"
                            bg="white"
                            shadow="md"
                            onClick={onOpen}
                            color="#1e2738"
                            _hover={{
                                transform: "scale(1.05)",
                                bg: "#1e2738",
                                color: "white"
                            }}
                            transition="all 0.2s"
                        />

                        <IconButton
                            aria-label={isListening ? "Stop listening" : "Start listening"}
                            icon={isListening ? <FiMicOff /> : <FiMic />}
                            size="lg"
                            bg={isListening ? "#dc3545" : "#1e2738"}
                            color="white"
                            isRound
                            shadow="lg"
                            onClick={toggleListening}
                            isLoading={isProcessing}
                            _hover={{
                                transform: "scale(1.1)",
                                bg: isListening ? "#c82333" : "#2d3b52"
                            }}
                            _active={{ transform: "scale(0.95)" }}
                            transition="all 0.2s"
                        />
                    </HStack>
                </VStack>
            </Box>

            {/* Settings Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color="#1e2738">Voice Assistant Settings</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={6} align="stretch">
                            {/* Test Voice */}
                            <Card>
                                <CardBody>
                                    <HStack justify="space-between">
                                        <Box>
                                            <Text fontWeight="semibold" color="#1e2738">Test Voice Output</Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Test if speech synthesis is working
                                            </Text>
                                        </Box>
                                        <Button
                                            leftIcon={isSpeaking ? <FiPause /> : <FiPlay />}
                                            bg="#1e2738"
                                            color="white"
                                            size="sm"
                                            onClick={testSpeak}
                                            isLoading={isSpeaking}
                                            _hover={{ bg: "#2d3b52" }}
                                        >
                                            {isSpeaking ? "Speaking..." : "Test Voice"}
                                        </Button>
                                    </HStack>
                                </CardBody>
                            </Card>

                            {/* Welcome Tour Button */}
                            <Card>
                                <CardBody>
                                    <HStack justify="space-between">
                                        <Box>
                                            <Text fontWeight="semibold" color="#1e2738">Platform Tour</Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Get a guided tour of AbleTech platform features
                                            </Text>
                                        </Box>
                                        <Button
                                            bg="#1e2738"
                                            color="white"
                                            size="sm"
                                            onClick={startWelcomeTour}
                                            _hover={{ bg: "#2d3b52" }}
                                        >
                                            Start Tour
                                        </Button>
                                    </HStack>
                                </CardBody>
                            </Card>

                            {/* Voice Settings - Only Volume */}
                            <Card>
                                <CardBody>
                                    <VStack spacing={4} align="stretch">
                                        <Text fontWeight="semibold" color="#1e2738">Voice Settings</Text>

                                        <Box>
                                            <Text fontSize="sm" mb={2}>Volume: {voiceSettings.volume.toFixed(1)}</Text>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={voiceSettings.volume}
                                                onChange={(e) => updateVoiceSettings({ volume: parseFloat(e.target.value) })}
                                                style={{
                                                    width: '100%',
                                                    accentColor: '#1e2738'
                                                }}
                                            />
                                        </Box>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default VoiceAssistant;