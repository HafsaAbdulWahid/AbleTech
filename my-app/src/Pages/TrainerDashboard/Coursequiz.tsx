import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Heading,
  Radio,
  RadioGroup,
  Flex,
  Icon,
  Card,
  CardBody,
  useToast,
  Badge,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiArrowLeft,
  FiRefreshCw,
  FiAward,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';
import axios from 'axios';

interface QuizQuestion {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const CourseQuiz = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [programTitle, setProgramTitle] = useState<string>('');
  const [programId, setProgramId] = useState<string>('');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    const savedProgramTitle = localStorage.getItem('courseQuizProgramTitle');
    const savedProgramId = localStorage.getItem('courseQuizProgramId');

    if (!savedProgramTitle || !savedProgramId) {
      toast({
        title: 'Quiz Not Available',
        description: 'Please start the quiz from a program.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate(-1);
      return;
    }

    setProgramTitle(savedProgramTitle);
    setProgramId(savedProgramId);

    fetchQuizQuestions(savedProgramId);
  }, [navigate, toast]);

  useEffect(() => {
    if (!showResults && timeElapsed > 0) {
      const timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showResults, timeElapsed]);

  const fetchQuizQuestions = async (progId: string) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/quiz-questions/course/${progId}`);

      if (response.data.success) {
        setQuizQuestions(response.data.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to load quiz questions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleStartQuiz = () => {
    if (quizQuestions.length === 0) {
      toast({
        title: 'No Questions',
        description: 'No questions available for this quiz.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      setTimeElapsed(1);
    }, 1000);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const handleSubmit = () => {
    const unanswered = quizQuestions.filter((_, index) => selectedAnswers[index] === undefined);

    if (unanswered.length > 0) {
      toast({
        title: 'Incomplete Quiz',
        description: `Please answer all questions. ${unanswered.length} question(s) remaining.`,
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: quizQuestions.length,
      percentage: Math.round((correct / quizQuestions.length) * 100),
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setTimeElapsed(0);
    handleStartQuiz();
  };

  const handleBackToProgram = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Box>
        <SideNav activeNav="Training Programs" />
        <Box>
          <TopNav />
          <Center h="calc(100vh - 80px)">
            <VStack spacing={4}>
              <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200" color="#2CA58D" size="lg" />
              <Text color="gray.600" fontSize="md">Loading quiz...</Text>
            </VStack>
          </Center>
        </Box>
      </Box>
    );
  }

  if (isStarting) {
    return (
      <Box>
        <SideNav activeNav="Training Programs" />
        <Box>
          <TopNav />
          <Center h="calc(100vh - 80px)">
            <VStack spacing={4}>
              <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200" color="#2CA58D" size="lg" />
              <Text color="gray.600" fontSize="md">Starting quiz...</Text>
            </VStack>
          </Center>
        </Box>
      </Box>
    );
  }

  const score = showResults ? calculateScore() : null;

  return (
    <Box bg="gray.50" minH="100vh">
      <SideNav activeNav="Training Programs" />
      <Box>
        <TopNav />

        <Box
          pl={"80px"}
          py={8}
          maxW={timeElapsed === 0 ? "40%" : "90%"}
          mx={"auto"}
        >
          {/* Header - Only show when quiz is active or results are shown */}
          {timeElapsed > 0 && (
            <Box mb={6}>
              <Heading size="md" color="#1e2738" mb={2}>Course Quiz</Heading>
              <Text fontSize="sm" color="gray.600">{programTitle}</Text>
            </Box>
          )}

          <Card
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            border="1px"
            borderColor="gray.200"
          >
            <CardBody p={0}>
              {timeElapsed === 0 ? (
                // Start Screen - Centered and Improved UI with 40% width
                <Box p={10}>
                  <VStack spacing={8} align="stretch">
                    {/* Header with Icon */}
                    <Box textAlign="center">
                      <Box
                        bg="#2CA58D"
                        w="60px"
                        h="60px"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mx="auto"
                        mb={4}
                      >
                        <Icon as={FiAward} color="white" boxSize={8} />
                      </Box>
                      <Heading size="lg" color="#1e2738" mb={3}>
                        Course Quiz
                      </Heading>
                      <Text fontSize="md" color="gray.600" mb={2}>
                        {programTitle}
                      </Text>
                      <Divider my={4} />
                      <Text fontSize="sm" color="gray.600">
                        Complete this final assessment to demonstrate your course mastery
                      </Text>
                    </Box>

                    {quizQuestions.length > 0 ? (
                      <>
                        {/* Quiz Stats */}
                        <Box
                          bg="gray.50"
                          borderRadius="lg"
                          p={6}
                          border="1px"
                          borderColor="gray.200"
                        >
                          <VStack spacing={4} align="stretch">
                            <HStack justify="space-between" pb={3} borderBottom="1px" borderColor="gray.200">
                              <HStack spacing={2}>
                                <Box w="8px" h="8px" bg="yellow.400" borderRadius="full" />
                                <Text fontSize="sm" color="#1e2738" fontWeight="600">Total Questions</Text>
                              </HStack>
                              <Badge colorScheme="gray" fontSize="sm" px={3} py={1} borderRadius="md">
                                {quizQuestions.length}
                              </Badge>
                            </HStack>

                            <HStack justify="space-between">
                              <HStack spacing={2}>
                                <Box w="8px" h="8px" bg="#2CA58D" borderRadius="full" />
                                <Text fontSize="sm" color="#1e2738" fontWeight="600">Passing Score</Text>
                              </HStack>
                              <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="md">
                                70%
                              </Badge>
                            </HStack>
                          </VStack>
                        </Box>

                        {/* Start Button */}
                        <Button
                          size="lg"
                          bg="#2CA58D"
                          color="white"
                          onClick={handleStartQuiz}
                          _hover={{ bg: "#259179" }}
                          fontSize="15px"
                          fontWeight="600"
                          py={6}
                          borderRadius="lg"
                        >
                          Start Quiz
                        </Button>

                        {/* Back Link */}
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          textAlign="center"
                          cursor="pointer"
                          onClick={handleBackToProgram}
                          _hover={{ color: "#2CA58D" }}
                        >
                          ← Back to program
                        </Text>
                      </>
                    ) : (
                      <Alert status="info" borderRadius="md" variant="left-accent">
                        <AlertIcon />
                        <Box>
                          <AlertTitle fontSize="sm">No questions available</AlertTitle>
                          <AlertDescription fontSize="sm">
                            This quiz hasn't been created yet.
                          </AlertDescription>
                        </Box>
                      </Alert>
                    )}
                  </VStack>
                </Box>
              ) : !showResults ? (
                // Quiz Questions - Full Width
                <Box>
                  {/* Progress Header */}
                  <Box px={8} py={4} borderBottom="1px" borderColor="gray.200" bg="gray.50">
                    <Flex justify="space-between" align="center">
                      <Text fontSize="sm" color="#1e2738" fontWeight="600">
                        Question {Object.keys(selectedAnswers).length} of {quizQuestions.length} answered
                      </Text>
                      {timeElapsed > 0 && (
                        <HStack spacing={2}>
                          <Icon as={FiClock} color="#2CA58D" boxSize={4} />
                          <Text fontSize="sm" color="#1e2738" fontWeight="600">
                            {formatTime(timeElapsed)}
                          </Text>
                        </HStack>
                      )}
                    </Flex>
                  </Box>

                  {/* Questions */}
                  <Box p={8}>
                    <VStack spacing={8} align="stretch">
                      {quizQuestions.map((question, index) => (
                        <Box key={index}>
                          <Text fontSize="md" fontWeight="600" color="#1e2738" mb={4}>
                            {index + 1}. {question.question}
                          </Text>

                          <RadioGroup
                            value={selectedAnswers[index]?.toString()}
                            onChange={(value) => handleAnswerSelect(index, parseInt(value))}
                          >
                            <VStack spacing={3} align="stretch">
                              {question.options.map((option, optIndex) => (
                                <Box
                                  key={optIndex}
                                  p={4}
                                  borderRadius="lg"
                                  border="2px solid"
                                  borderColor={selectedAnswers[index] === optIndex ? '#2CA58D' : 'gray.200'}
                                  bg={selectedAnswers[index] === optIndex ? 'rgba(44, 165, 141, 0.05)' : 'white'}
                                  cursor="pointer"
                                  transition="all 0.2s"
                                  _hover={{
                                    borderColor: selectedAnswers[index] === optIndex ? '#2CA58D' : 'gray.400',
                                    bg: selectedAnswers[index] === optIndex ? 'rgba(44, 165, 141, 0.05)' : 'gray.50'
                                  }}
                                  onClick={() => handleAnswerSelect(index, optIndex)}
                                >
                                  <Radio value={optIndex.toString()} colorScheme="green">
                                    <Text fontSize="sm" color="#1e2738">{option}</Text>
                                  </Radio>
                                </Box>
                              ))}
                            </VStack>
                          </RadioGroup>

                          {index < quizQuestions.length - 1 && <Divider mt={8} />}
                        </Box>
                      ))}
                    </VStack>

                    <Divider my={8} />

                    <Flex justify="flex-end">
                      <Button
                        onClick={handleSubmit}
                        bg="#2CA58D"
                        color="white"
                        size="lg"
                        _hover={{ bg: "#259179" }}
                        fontSize="15px"
                        fontWeight="600"
                        px={8}
                        borderRadius="lg"
                      >
                        Submit Quiz
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              ) : (
                // Results Screen
                <Box p={8}>
                  <VStack spacing={6} align="stretch">
                    {/* Score Display */}
                    <Box textAlign="center" py={6} borderBottom="1px" borderColor="gray.200">
                      <Text fontSize="sm" color="gray.600" mb={2}>Your score</Text>
                      <Heading size="2xl" color={score && score.percentage >= 70 ? '#2CA58D' : 'red.600'} mb={2}>
                        {score?.percentage}%
                      </Heading>
                      <Text fontSize="sm" color="gray.700">
                        {score?.correct} out of {score?.total} correct ({formatTime(timeElapsed)})
                      </Text>
                      <Badge
                        mt={3}
                        colorScheme={score && score.percentage >= 70 ? 'green' : 'red'}
                        fontSize="sm"
                        px={3}
                        py={1}
                      >
                        {score && score.percentage >= 70 ? 'Passed' : 'Not passed'}
                      </Badge>
                    </Box>

                    {/* Message */}
                    <Alert
                      status={score && score.percentage >= 70 ? 'success' : 'warning'}
                      borderRadius="md"
                      variant="left-accent"
                    >
                      <AlertIcon />
                      <Box>
                        <AlertTitle fontSize="sm">
                          {score && score.percentage >= 70
                            ? 'Congratulations! You passed the course quiz.'
                            : 'You need 70% to pass.'}
                        </AlertTitle>
                        <AlertDescription fontSize="sm">
                          {score && score.percentage >= 70
                            ? 'You have successfully completed this course assessment.'
                            : 'Review the course material and try again.'}
                        </AlertDescription>
                      </Box>
                    </Alert>

                    <Divider />

                    {/* Answer Review */}
                    <Box>
                      <Heading size="sm" color="#1e2738" mb={4}>Review</Heading>
                      <VStack spacing={5} align="stretch">
                        {quizQuestions.map((question, qIndex) => {
                          const userAnswer = selectedAnswers[qIndex];
                          const isCorrect = userAnswer === question.correctAnswer;

                          return (
                            <Box
                              key={qIndex}
                              p={4}
                              borderRadius="md"
                              border="1px solid"
                              borderColor="gray.200"
                              bg="white"
                            >
                              <HStack align="start" spacing={3} mb={3}>
                                <Icon
                                  as={isCorrect ? FiCheckCircle : FiXCircle}
                                  color={isCorrect ? '#2CA58D' : 'red.500'}
                                  boxSize={5}
                                  mt={0.5}
                                />
                                <Box flex={1}>
                                  <Text fontSize="sm" fontWeight="600" color="#1e2738" mb={3}>
                                    {qIndex + 1}. {question.question}
                                  </Text>

                                  <VStack spacing={2} align="stretch" fontSize="sm">
                                    <HStack>
                                      <Text color="gray.600" minW="100px">Your answer:</Text>
                                      <Text
                                        color={isCorrect ? '#2CA58D' : 'red.700'}
                                        fontWeight="500"
                                      >
                                        {question.options[userAnswer]}
                                      </Text>
                                    </HStack>

                                    {!isCorrect && (
                                      <HStack>
                                        <Text color="gray.600" minW="100px">Correct answer:</Text>
                                        <Text color="#2CA58D" fontWeight="500">
                                          {question.options[question.correctAnswer]}
                                        </Text>
                                      </HStack>
                                    )}

                                    {question.explanation && (
                                      <Box
                                        mt={2}
                                        pt={3}
                                        borderTop="1px"
                                        borderColor="gray.200"
                                      >
                                        <Text color="gray.600" fontSize="xs" fontWeight="600" mb={1}>
                                          Explanation:
                                        </Text>
                                        <Text color="gray.700" fontSize="xs">
                                          {question.explanation}
                                        </Text>
                                      </Box>
                                    )}
                                  </VStack>
                                </Box>
                              </HStack>
                            </Box>
                          );
                        })}
                      </VStack>
                    </Box>

                    <Divider />

                    {/* Action Buttons */}
                    <Flex gap={3} justify="flex-end">
                      <Button
                        leftIcon={<Icon as={FiArrowLeft} />}
                        onClick={handleBackToProgram}
                        variant="outline"
                        colorScheme="gray"
                        size="md"
                        fontSize="14px"
                      >
                        Back to program
                      </Button>
                      <Button
                        leftIcon={<Icon as={FiRefreshCw} />}
                        onClick={handleRetakeQuiz}
                        bg="#2CA58D"
                        color="white"
                        size="md"
                        _hover={{ bg: '#259179' }}
                        fontSize="14px"
                      >
                        Retake quiz
                      </Button>
                    </Flex>
                  </VStack>
                </Box>
              )}
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseQuiz;