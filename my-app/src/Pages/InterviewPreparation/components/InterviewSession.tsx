import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Grid,
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  Avatar,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import {
  PhoneIcon,
} from '@chakra-ui/icons';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash
} from 'react-icons/fa';
import Webcam from 'react-webcam';
import { SessionConfig, Message } from '../types/interview.types';
import { mockInterviewApi } from '../services/mockInterviewApi';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import axios from 'axios';

interface InterviewSessionProps {
  config: SessionConfig;
  onEnd: () => void;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ config, onEnd }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const webcamRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const toast = useToast();

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (!isConnecting && sessionId) {
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnecting, sessionId]);

  useEffect(() => {
    const initSession = async () => {
      console.log('=== INIT SESSION ===');
      console.log('Config:', config);

      try {
        console.log('Calling startSession API...');
        const result = await mockInterviewApi.startSession(config);
        console.log('Start session result:', result);

        setSessionId(result.sessionId);
        setIsConnecting(false);

        const welcomeMsg: Message = {
          role: 'ai',
          text: result.firstQuestion,
          time: formatTime(new Date())
        };

        setMessages([welcomeMsg]);
        generateAvatar(result.firstQuestion);

        console.log('=== INIT SESSION SUCCESS ===\n');
      } catch (error) {
        console.error('=== INIT SESSION ERROR ===');
        console.error('Failed to start session:', error);

        toast({
          title: 'Connection Error',
          description: 'Failed to start the interview session. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    initSession();
  }, [config]);

  const handleVoiceToggle = async () => {
    console.log('=== VOICE TOGGLE ===');

    if (!audioEnabled) {
      toast({
        title: 'Microphone Disabled',
        description: 'Please enable your microphone first.',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (isListening) {
      stopListening();

      if (transcript.trim()) {
        await handleSendMessage(transcript.trim());
        resetTranscript();
      }
    } else {
      startListening();
    }
  };

  const handleSendMessage = async (text: string) => {
    console.log('\n=== SEND MESSAGE ===');

    if (!sessionId || !text.trim() || isProcessing) {
      return;
    }

    setIsProcessing(true);

    const userMsg: Message = {
      role: 'user',
      text,
      time: formatTime(new Date())
    };

    setMessages(prev => [...prev, userMsg]);
    setStreamingMessage('');

    try {
      await mockInterviewApi.sendMessageStream(
        sessionId,
        text,
        (chunk: string) => {
          setStreamingMessage(prev => prev + chunk);
        },
        (data) => {
          const aiMsg: Message = {
            role: 'ai',
            text: data.fullResponse,
            time: formatTime(new Date())
          };

          setMessages(prev => [...prev, aiMsg]);
          setStreamingMessage('');
          setIsProcessing(false);

          generateAvatar(data.fullResponse);
        },
        (error) => {
          console.error('Message error:', error);
          setStreamingMessage('');
          setIsProcessing(false);

          toast({
            title: 'Message Error',
            description: 'Failed to get response. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      );

    } catch (error) {
      console.error('Failed to send message:', error);
      setIsProcessing(false);
      setStreamingMessage('');

      toast({
        title: 'Message Error',
        description: 'Failed to send your message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const generateAvatar = async (text: string) => {
    console.log('\n=== GENERATE AVATAR ===');
    console.log('Text length:', text.length);
    
    if (isGeneratingAvatar) {
      console.log('Avatar generation already in progress, skipping...');
      return;
    }

    setIsGeneratingAvatar(true);
    
    try {
      console.log('Sending request to backend...');
      
      const response = await axios.post("http://localhost:3001/api/avatar/talking-avatar", { 
        text 
      }, {
        timeout: 180000
      });
      
      console.log('Avatar generation response:', response.data);
      
      if (response.data.result_url) {
        console.log('✓ Avatar video URL received:', response.data.result_url);
        setAvatarVideoUrl(response.data.result_url);
        
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error('Video autoplay error:', err);
            });
          }
        }, 100);
        
        toast({
          title: "Avatar Ready",
          description: "AI avatar video generated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      
    } catch (error: any) {
      console.error('=== AVATAR GENERATION ERROR ===');
      console.error('Error:', error);
      console.error('Response:', error.response?.data);
      
      toast({
        title: "Avatar Error",
        description: error.response?.data?.details || "Failed to generate AI avatar.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const toggleVideo = () => {
    setVideoEnabled(prev => !prev);
  };

  const toggleAudio = () => {
    setAudioEnabled(prev => {
      if (prev && isListening) {
        stopListening();
      }
      return !prev;
    });
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatRecordingTime = (): string => {
    const hours = Math.floor(recordingTime / 3600);
    const minutes = Math.floor((recordingTime % 3600) / 60);
    const seconds = recordingTime % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isConnecting) {
    return (
      <Center minH="100vh" bg="linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)">
        <VStack spacing={6}>
          <Spinner size="xl" color="#2CA58D" thickness="4px" />
          <Text color="white" fontSize="2xl" fontWeight="bold">Connecting to AI Interviewer</Text>
          <Text color="#FFC857" fontSize="md">Setting up your interview session...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%)">
      {/* Top Navigation Bar */}
      <Flex
        justify="space-between"
        align="center"
        px={6}
        py={4}
        bg="rgba(26, 31, 46, 0.95)"
        backdropFilter="blur(10px)"
        borderBottom="1px solid"
        borderColor="rgba(44, 165, 141, 0.2)"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      >
        <HStack spacing={4}>
          <HStack spacing={2}>
            <Box
              w={3}
              h={3}
              bg="red.500"
              borderRadius="full"
              animation="pulse 2s infinite"
              boxShadow="0 0 10px rgba(239, 68, 68, 0.5)"
            />
            <Text color="white" fontSize="md" fontWeight="medium">
              {formatRecordingTime()}
            </Text>
          </HStack>
        </HStack>

        <HStack spacing={4}>
          <Avatar
            size="md"
            bg="linear-gradient(135deg, #2CA58D 0%, #1e7a66 100%)"
            name="User"
            border="2px solid"
            borderColor="#2CA58D"
          />

          <Button
            leftIcon={<PhoneIcon />}
            colorScheme="red"
            size="md"
            onClick={onEnd}
            borderRadius="xl"
            px={6}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            End Interview
          </Button>
        </HStack>
      </Flex>

      <Grid
        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        gap={6}
        p={6}
      >
        {/* Video Section - Final Round AI Style */}
        <Box>
          {/* AI Avatar Video Container - Black Background */}
          <Box
            bg="#000000"
            borderRadius="2xl"
            overflow="hidden"
            position="relative"
            border="2px solid"
            borderColor="rgba(44, 165, 141, 0.3)"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
            h="600px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* AI Interviewer Badge */}
            <Badge
              position="absolute"
              top={4}
              left={4}
              colorScheme="green"
              fontSize="xs"
              px={3}
              py={1}
              borderRadius="full"
              zIndex={10}
            >
              AI INTERVIEWER
            </Badge>

            {/* Avatar Video - Centered and Smaller */}
            {avatarVideoUrl ? (
              <Box
                position="relative"
                w="400px"
                h="400px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <video
                  ref={videoRef}
                  src={avatarVideoUrl}
                  autoPlay
                  loop={false}
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "12px"
                  }}
                  onEnded={() => {
                    console.log('Avatar video ended');
                  }}
                  onError={(e) => {
                    console.error('Video playback error:', e);
                  }}
                />
              </Box>
            ) : (
              <VStack spacing={4}>
                <Box
                  w="120px"
                  h="120px"
                  borderRadius="full"
                  bg="linear-gradient(135deg, #2CA58D 0%, #1e7a66 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="4px solid"
                  borderColor="#2CA58D"
                  boxShadow="0 0 40px rgba(44, 165, 141, 0.6)"
                >
                  {isGeneratingAvatar ? (
                    <Spinner color="white" size="xl" thickness="4px" />
                  ) : (
                    <Text color="white" fontSize="4xl" fontWeight="bold">AI</Text>
                  )}
                </Box>
                <Badge
                  colorScheme={isGeneratingAvatar ? "yellow" : isProcessing ? "green" : "gray"}
                  fontSize="sm"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  {isGeneratingAvatar ? "🎬 Generating Avatar..." : isProcessing ? "🤔 Thinking..." : "👂 Listening..."}
                </Badge>
              </VStack>
            )}

            {/* User Camera - Bottom Right Corner */}
            <Box
              position="absolute"
              bottom={4}
              right={4}
              w="200px"
              h="150px"
              borderRadius="xl"
              overflow="hidden"
              border="2px solid"
              borderColor="rgba(44, 165, 141, 0.5)"
              boxShadow="0 4px 12px rgba(0, 0, 0, 0.5)"
              bg="#1a1f2e"
            >
              {/* YOU Badge */}
              <Badge
                position="absolute"
                top={2}
                left={2}
                colorScheme="blue"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
                zIndex={10}
              >
                YOU
              </Badge>

              {videoEnabled ? (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  mirrored={true}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: 'user'
                  }}
                />
              ) : (
                <Center h="100%" bg="#1a1f2e">
                  <VStack spacing={2}>
                    <FaVideoSlash size={30} color="#2CA58D" />
                    <Text color="white" fontSize="xs">Camera Off</Text>
                  </VStack>
                </Center>
              )}

              {/* Camera Controls */}
              <HStack
                position="absolute"
                bottom={2}
                left="50%"
                transform="translateX(-50%)"
                spacing={2}
                bg="rgba(0, 0, 0, 0.7)"
                backdropFilter="blur(10px)"
                px={2}
                py={1}
                borderRadius="full"
              >
                <IconButton
                  icon={videoEnabled ? <FaVideo /> : <FaVideoSlash />}
                  aria-label="Toggle Video"
                  onClick={toggleVideo}
                  colorScheme={videoEnabled ? "green" : "red"}
                  size="xs"
                  borderRadius="full"
                />
                <IconButton
                  icon={audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
                  aria-label="Toggle Audio"
                  onClick={toggleAudio}
                  colorScheme={audioEnabled ? "green" : "red"}
                  size="xs"
                  borderRadius="full"
                />
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* Chat Section */}
        <Box
          bg="rgba(26, 31, 46, 0.8)"
          backdropFilter="blur(10px)"
          borderRadius="2xl"
          display="flex"
          flexDirection="column"
          h="600px"
          border="2px solid"
          borderColor="rgba(44, 165, 141, 0.3)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          overflow="hidden"
        >
          <Box
            px={6}
            py={4}
            borderBottom="1px solid"
            borderColor="rgba(44, 165, 141, 0.2)"
            bg="rgba(26, 31, 46, 0.5)"
          >
            <Text color="white" fontSize="lg" fontWeight="bold">
              Interview Transcript
            </Text>
          </Box>

          <VStack
            flex={1}
            overflowY="auto"
            p={6}
            spacing={4}
            align="stretch"
            css={{
              '&::-webkit-scrollbar': { width: '8px' },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(26, 31, 46, 0.5)',
                borderRadius: '10px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#2CA58D',
                borderRadius: '10px',
                '&:hover': {
                  background: '#248c75'
                }
              }
            }}
          >
            {messages.map((msg, idx) => (
              <Flex
                key={idx}
                gap={3}
                flexDirection={msg.role === 'user' ? 'row-reverse' : 'row'}
              >
                <Avatar
                  size="md"
                  bg={msg.role === 'ai' ? 'linear-gradient(135deg, #2CA58D 0%, #1e7a66 100%)' : 'gray.600'}
                  name={msg.role === 'ai' ? 'AI' : 'User'}
                  border="2px solid"
                  borderColor={msg.role === 'ai' ? '#2CA58D' : 'gray.500'}
                />
                <Box flex={1} textAlign={msg.role === 'user' ? 'right' : 'left'}>
                  <Text color="gray.400" fontSize="xs" mb={1}>
                    {msg.time}
                  </Text>
                  <Box
                    display="inline-block"
                    bg={msg.role === 'ai'
                      ? 'linear-gradient(135deg, rgba(44, 165, 141, 0.2) 0%, rgba(30, 122, 102, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(45, 55, 72, 0.8) 0%, rgba(26, 31, 46, 0.8) 100%)'
                    }
                    p={4}
                    borderRadius="xl"
                    maxW="85%"
                    border="1px solid"
                    borderColor={msg.role === 'ai' ? 'rgba(44, 165, 141, 0.3)' : 'rgba(74, 85, 104, 0.3)'}
                    backdropFilter="blur(10px)"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                  >
                    <Text color="white" fontSize="md" lineHeight="1.6">
                      {msg.text}
                    </Text>
                  </Box>
                </Box>
              </Flex>
            ))}

            {streamingMessage && (
              <Flex gap={3} flexDirection="row">
                <Avatar
                  size="md"
                  bg="linear-gradient(135deg, #2CA58D 0%, #1e7a66 100%)"
                  name="AI"
                  border="2px solid"
                  borderColor="#2CA58D"
                />
                <Box flex={1}>
                  <Text color="gray.400" fontSize="xs" mb={1}>
                    {formatTime(new Date())}
                  </Text>
                  <Box
                    display="inline-block"
                    bg="linear-gradient(135deg, rgba(44, 165, 141, 0.2) 0%, rgba(30, 122, 102, 0.2) 100%)"
                    p={4}
                    borderRadius="xl"
                    maxW="85%"
                    border="1px solid"
                    borderColor="rgba(44, 165, 141, 0.3)"
                    backdropFilter="blur(10px)"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                  >
                    <Text color="white" fontSize="md" lineHeight="1.6">
                      {streamingMessage}
                      <Box
                        as="span"
                        display="inline-block"
                        w="2px"
                        h="1em"
                        bg="#2CA58D"
                        ml={1}
                        animation="blink 1s infinite"
                      />
                    </Text>
                  </Box>
                </Box>
              </Flex>
            )}

            <div ref={messagesEndRef} />
          </VStack>

          <Box
            p={6}
            borderTop="1px solid"
            borderColor="rgba(44, 165, 141, 0.2)"
            bg="rgba(26, 31, 46, 0.5)"
          >
            <VStack spacing={3}>
              <Button
                w="100%"
                h="70px"
                onClick={handleVoiceToggle}
                isDisabled={isProcessing}
                bg={isListening
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #2CA58D 0%, #1e7a66 100%)'
                }
                color="white"
                fontSize="lg"
                fontWeight="bold"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)'
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                _disabled={{
                  opacity: 0.6,
                  cursor: 'not-allowed'
                }}
                leftIcon={isListening ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
                borderRadius="xl"
                transition="all 0.3s"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.2)"
              >
                {isProcessing ? 'AI is responding...' : isListening ? 'Stop & Send Response' : 'Click to Start Speaking'}
              </Button>

              {isListening && (
                <HStack spacing={2} w="100%" justify="center">
                  {[...Array(5)].map((_, i) => (
                    <Box
                      key={i}
                      w="3px"
                      h="20px"
                      bg="#FFC857"
                      borderRadius="full"
                      animation={`wave 1s ease-in-out infinite ${i * 0.1}s`}
                    />
                  ))}
                </HStack>
              )}

              {transcript && isListening && (
                <Box
                  w="100%"
                  p={4}
                  bg="rgba(255, 200, 87, 0.1)"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="rgba(255, 200, 87, 0.3)"
                >
                  <Text color="#FFC857" fontSize="sm" fontStyle="italic">
                    "{transcript}"
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
        </Box>
      </Grid>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { 
              opacity: 1;
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
            }
            50% { 
              opacity: 0.7;
              box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
            }
          }
          @keyframes wave {
            0%, 100% { height: 20px; }
            50% { height: 40px; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
};

export default InterviewSession;