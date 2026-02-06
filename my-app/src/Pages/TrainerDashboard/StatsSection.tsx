import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FiUsers, FiTarget, FiTrendingUp, FiClock, FiArrowUp } from 'react-icons/fi';

interface TrainingProgram {
  id: number;
  enrolledUsers: number;
  completionRate: number;
  status: string;
  sessionDuration?: number;
}

interface RegisteredUser {
  id: number;
  currentPrograms: number[];
}

const StatsSection = () => {
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  useEffect(() => {
    // Using in-memory storage instead of localStorage
    const storedPrograms: TrainingProgram[] = [];
    const storedUsers: RegisteredUser[] = [];
    setTrainingPrograms(storedPrograms);
    setRegisteredUsers(storedUsers);
  }, []);

  const activeTrainees = registeredUsers.filter(user => user.currentPrograms?.length > 0).length;
  const totalPrograms = trainingPrograms.length;
  const publishedPrograms = trainingPrograms.filter(program => program.status === 'Published').length;

  const programsWithEnrolledUsers = trainingPrograms.filter(program => program.enrolledUsers > 0);
  const averageCompletionRate = programsWithEnrolledUsers.length > 0
    ? Math.round(programsWithEnrolledUsers.reduce((acc, program) => acc + program.completionRate, 0) / programsWithEnrolledUsers.length)
    : 0;

  const programsWithDuration = trainingPrograms.filter(program => program.sessionDuration);
  const averageSessionTime = programsWithDuration.length > 0
    ? Math.round(programsWithDuration.reduce((acc, program) => acc + (program.sessionDuration || 45), 0) / programsWithDuration.length)
    : 45;

  const stats = [
    { 
      label: 'Active Trainees', 
      value: activeTrainees.toString(), 
      change: registeredUsers.length > activeTrainees ? `+${registeredUsers.length - activeTrainees} new` : 'All active', 
      icon: FiUsers, 
      iconColor: '#9333EA',
      iconBg: '#F3E8FF'
    },
    { 
      label: 'Programs Created', 
      value: totalPrograms.toString(), 
      change: `${publishedPrograms} published`, 
      icon: FiTarget, 
      iconColor: '#2563EB',
      iconBg: '#DBEAFE'
    },
    { 
      label: 'Completion Rate', 
      value: `${averageCompletionRate}%`, 
      change: averageCompletionRate >= 80 ? 'Excellent' : averageCompletionRate >= 60 ? 'Good' : 'Needs improvement', 
      icon: FiTrendingUp, 
      iconColor: '#10B981',
      iconBg: '#D1FAE5'
    },
    { 
      label: 'Avg Session Time', 
      value: `${averageSessionTime}min`, 
      change: 'Optimal range', 
      icon: FiClock, 
      iconColor: '#F59E0B',
      iconBg: '#FEF3C7'
    },
  ];

  return (
    <Box 
      bg="white" 
      borderRadius="3xl" 
      p={6} 
      boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
      mb={6}
    >
      <Text fontSize="lg" fontWeight="bold" mb={6}>
        Analytics Overview
      </Text>
      
      <VStack spacing={4} align="stretch">
        {stats.map((stat, index) => (
          <Box
            key={index}
            bg="white"
            borderRadius="2xl"
            p={4}
            border="1px solid"
            borderColor="gray.200"
            boxShadow="sm"
            transition="all 0.2s"
            _hover={{
              boxShadow: 'md',
              borderColor: 'gray.300'
            }}
          >
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1} flex={1}>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  {stat.label}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                  {stat.value}
                </Text>
                <HStack spacing={1}>
                  <Icon as={FiArrowUp} boxSize={3} color="green.500" />
                  <Text fontSize="xs" color="green.500" fontWeight="semibold">
                    {stat.change}
                  </Text>
                </HStack>
              </VStack>
              
              <Box
                w={14}
                h={14}
                bg={stat.iconBg}
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={stat.icon} boxSize={7} color={stat.iconColor} />
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default StatsSection;