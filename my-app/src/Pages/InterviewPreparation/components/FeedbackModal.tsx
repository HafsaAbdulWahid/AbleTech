import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Button,
  Text,
  Box,
  Textarea,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { FaHome } from 'react-icons/fa';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string | null;
  onSubmit?: (rating: number, comments: string) => void;
}

export default function FeedbackModal({ 
  isOpen, 
  onClose, 
  sessionId,
  onSubmit 
}: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a rating before submitting.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (onSubmit) {
      onSubmit(rating, comments);
    }

    setSubmitted(true);

    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for your valuable feedback!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setTimeout(() => {
      setRating(0);
      setComments('');
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setRating(0);
    setComments('');
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
      <ModalContent 
        bg="#1a1f2e"
        borderRadius="2xl" 
        p={8}
        border="1px solid"
        borderColor="rgba(44, 165, 141, 0.2)"
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.5)"
      >
        <ModalCloseButton 
          color="gray.400" 
          _hover={{ color: 'white', bg: 'rgba(255, 255, 255, 0.1)' }}
          top={4}
          right={4}
        />
        
        <ModalBody p={0}>
          {!submitted ? (
            <VStack spacing={8} align="stretch">
              {/* Header */}
              <VStack spacing={3} textAlign="center">
                <Box
                  w="60px"
                  h="60px"
                  borderRadius="full"
                  bg="rgba(44, 165, 141, 0.1)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="3xl">✨</Text>
                </Box>
                <Text fontSize="2xl" fontWeight="bold" color="white">
                  How was your experience?
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Your feedback helps us improve
                </Text>
              </VStack>

              {/* Rating Stars */}
              <VStack spacing={4}>
                <HStack spacing={3} justify="center">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Box
                      key={num}
                      as="button"
                      onClick={() => setRating(num)}
                      onMouseEnter={() => setHoveredRating(num)}
                      onMouseLeave={() => setHoveredRating(0)}
                      transition="all 0.2s"
                      _hover={{ transform: 'scale(1.2)' }}
                    >
                      <StarIcon
                        boxSize={10}
                        color={num <= (hoveredRating || rating) ? '#FFC857' : 'gray.600'}
                        transition="all 0.2s"
                        filter={num <= (hoveredRating || rating) 
                          ? 'drop-shadow(0 0 8px rgba(255, 200, 87, 0.6))' 
                          : 'none'
                        }
                      />
                    </Box>
                  ))}
                </HStack>
                
                {rating > 0 && (
                  <Text fontSize="sm" color="#FFC857" fontWeight="medium">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </Text>
                )}
              </VStack>

              {/* Comments */}
              <VStack spacing={2} align="stretch">
                <Text fontSize="sm" color="gray.300" fontWeight="medium">
                  Additional Comments (Optional)
                </Text>
                <Textarea
                  placeholder="Tell us more about your experience..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  resize="vertical"
                  minH="100px"
                  bg="rgba(45, 55, 72, 0.3)"
                  border="1px solid"
                  borderColor="rgba(74, 85, 104, 0.4)"
                  color="white"
                  fontSize="sm"
                  _hover={{
                    borderColor: 'rgba(44, 165, 141, 0.4)'
                  }}
                  _focus={{
                    borderColor: '#2CA58D',
                    boxShadow: '0 0 0 1px #2CA58D',
                    bg: 'rgba(45, 55, 72, 0.5)'
                  }}
                  _placeholder={{ color: 'gray.500' }}
                />
              </VStack>

              {/* Action Buttons */}
              <VStack spacing={3}>
                <Button
                  w="full"
                  h="50px"
                  bg="linear-gradient(135deg, #2CA58D 0%, #1e7a66 100%)"
                  color="white"
                  fontSize="md"
                  fontWeight="bold"
                  onClick={handleSubmit}
                  borderRadius="xl"
                  _hover={{ 
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(44, 165, 141, 0.4)'
                  }}
                  _active={{
                    transform: 'translateY(0)'
                  }}
                  transition="all 0.2s"
                >
                  Submit Feedback
                </Button>

                <Button
                  w="full"
                  h="50px"
                  variant="ghost"
                  color="gray.400"
                  fontSize="md"
                  onClick={handleClose}
                  borderRadius="xl"
                  leftIcon={<Icon as={FaHome} />}
                  _hover={{ 
                    bg: 'rgba(45, 55, 72, 0.5)',
                    color: 'white'
                  }}
                >
                  Skip & Return Home
                </Button>
              </VStack>
            </VStack>
          ) : (
            <VStack spacing={6} textAlign="center" py={4}>
              {/* Success State */}
              <Box
                w="80px"
                h="80px"
                borderRadius="full"
                bg="rgba(44, 165, 141, 0.1)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                animation="scaleIn 0.5s ease-out"
              >
                <Text fontSize="5xl">🎉</Text>
              </Box>

              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color="white">
                  Thank You!
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Your feedback has been submitted successfully
                </Text>
              </VStack>

              <Button
                w="full"
                h="50px"
                bg="linear-gradient(135deg, #2CA58D 0%, #1e7a66 100%)"
                color="white"
                fontSize="md"
                fontWeight="bold"
                onClick={handleClose}
                borderRadius="xl"
                leftIcon={<Icon as={FaHome} />}
                _hover={{ 
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(44, 165, 141, 0.4)'
                }}
              >
                Back to Home
              </Button>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>

      <style>
        {`
          @keyframes scaleIn {
            0% { 
              transform: scale(0);
              opacity: 0;
            }
            50% { 
              transform: scale(1.1);
            }
            100% { 
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Modal>
  );
}