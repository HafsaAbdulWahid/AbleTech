import React from 'react';
import { Box, VStack, HStack, Text, Icon } from '@chakra-ui/react';
import { FiFileText, FiUserCheck, FiCheckCircle, FiXCircle, FiArrowUp } from 'react-icons/fi';

interface JobListing {
  applications: number;
  shortlisted: number;
  approved: number;
  rejected: number;
}

interface QuickStatsProps {
  jobListings: JobListing[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ jobListings }) => {
  const totalApplications = jobListings.reduce((acc, job) => acc + job.applications, 0);
  const totalApproved = jobListings.reduce((acc, job) => acc + job.approved, 0);
  const totalRejected = jobListings.reduce((acc, job) => acc + job.rejected, 0);
  const totalShortlisted = jobListings.reduce((acc, job) => acc + job.shortlisted, 0);

  const stats = [
    { 
      label: 'Total Applications', 
      value: totalApplications.toString(),
      change: 'All positions',
      icon: FiFileText,
      iconColor: '#9333EA',
      iconBg: '#F3E8FF'
    },
    { 
      label: 'Shortlisted', 
      value: totalShortlisted.toString(),
      change: 'Under review',
      icon: FiUserCheck,
      iconColor: '#2563EB',
      iconBg: '#DBEAFE'
    },
    { 
      label: 'Approved', 
      value: totalApproved.toString(),
      change: 'Hired candidates',
      icon: FiCheckCircle,
      iconColor: '#10B981',
      iconBg: '#D1FAE5'
    },
    { 
      label: 'Rejected', 
      value: totalRejected.toString(),
      change: 'Not suitable',
      icon: FiXCircle,
      iconColor: '#EF4444',
      iconBg: '#FEE2E2'
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
        Quick Stats
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

export default QuickStats;