import React from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiCopy, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Box
      bg="white"
      borderRadius="3xl"
      p={6}
      boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
      my={"32px"}
    >
      <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
        Quick Actions
      </Text>

      <Flex gap={4}>
        {/* Main Create Program Card */}
        <Box
          flex="2"
          bgGradient="linear(to-r, #2CA58D, #1e2738)"
          borderRadius="3xl"
          p={8}
          position="relative"
          overflow="hidden"
          cursor="pointer"
          transition="all 0.3s"
          onClick={() => navigate('/create-training')}
          _hover={{
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(44, 165, 141, 0.3)'
          }}
        >
          <Flex align="center" justify="space-between">
            <HStack spacing={6} align="center">
              <Box
                w={16}
                h={16}
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px solid"
                borderColor="whiteAlpha.300"
              >
                <Icon as={FiPlus} boxSize={8} color="white" />
              </Box>

              <VStack align="start" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="white">
                  Create Program
                </Text>
                <Text fontSize="md" color="whiteAlpha.900">
                  Design structured training programs for trainees
                </Text>
              </VStack>
            </HStack>

            <Box
              w={16}
              h={16}
              bg="yellow.400"
              borderRadius="2xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 8px 20px rgba(251, 191, 36, 0.4)"
            >
              <Icon as={FiStar} boxSize={8} color="#1e2738" />
            </Box>
          </Flex>

          {/* Decorative elements */}
          <Box
            position="absolute"
            top="-20px"
            right="-20px"
            w="150px"
            h="150px"
            bg="whiteAlpha.100"
            borderRadius="full"
            filter="blur(40px)"
          />
          <Box
            position="absolute"
            bottom="-30px"
            left="-30px"
            w="200px"
            h="200px"
            bg="#2CA58D"
            opacity={0.2}
            borderRadius="full"
            filter="blur(50px)"
          />
        </Box>

        {/* Side Action Cards */}
        <VStack flex="1" spacing={4}>
          {/* Edit Program Card */}
          <Box
            w="full"
            bg="white"
            borderRadius="2xl"
            p={5}
            border="1px solid"
            borderColor="gray.200"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              boxShadow: 'md',
              borderColor: '#2CA58D',
              transform: 'translateX(-4px)'
            }}
          >
            <HStack spacing={4}>
              <Box
                w={12}
                h={12}
                bg="gray.100"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiEdit2} boxSize={5} color="#1e2738" />
              </Box>

              <VStack align="start" spacing={0}>
                <Text fontSize="md" fontWeight="bold" color="gray.900">
                  Edit Program
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Update existing training programs
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Duplicate Program Card */}
          <Box
            w="full"
            bg="white"
            borderRadius="2xl"
            p={5}
            border="1px solid"
            borderColor="gray.200"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{
              boxShadow: 'md',
              borderColor: '#2CA58D',
              transform: 'translateX(-4px)'
            }}
          >
            <HStack spacing={4}>
              <Box
                w={12}
                h={12}
                bg="gray.100"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiCopy} boxSize={5} color="#1e2738" />
              </Box>

              <VStack align="start" spacing={0}>
                <Text fontSize="md" fontWeight="bold" color="gray.900">
                  Duplicate Program
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Reuse successful programs quickly
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};

export default QuickActions;