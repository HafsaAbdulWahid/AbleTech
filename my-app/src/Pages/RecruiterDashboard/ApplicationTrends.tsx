import React from 'react';
import {
  Box,
  Text,
  Flex,
  Link,
  Spacer,
} from '@chakra-ui/react';
import { 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';

const ApplicationTrends = () => {
  const applicationTrendsData = [
    { month: 'Jul', applications: 125, shortlisted: 40, approved: 25, rejected: 30 },
    { month: 'Aug', applications: 135, shortlisted: 45, approved: 28, rejected: 35 },
    { month: 'Sep', applications: 142, shortlisted: 48, approved: 30, rejected: 38 },
    { month: 'Oct', applications: 158, shortlisted: 52, approved: 35, rejected: 42 },
    { month: 'Nov', applications: 165, shortlisted: 55, approved: 38, rejected: 45 },
    { month: 'Dec', applications: 172, shortlisted: 58, approved: 40, rejected: 48 }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={4} borderRadius="xl" shadow="md" border="1px" borderColor="gray.200">
          <Text fontWeight="bold" mb={2} fontSize="sm">{label}</Text>
          {payload.map((entry: any, index: number) => (
            <Flex key={index} align="center" gap={2}>
              <Box w={3} h={3} bg={entry.color} borderRadius="full" />
              <Text fontSize="xs" color="gray.600">
                {entry.name}: <Text as="span" fontWeight="bold" color="gray.900">{entry.value}</Text>
              </Text>
            </Flex>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      bg="white"
      borderRadius="3xl"
      p={5}
      boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="md" fontWeight="bold">
          Application Trends
        </Text>
      </Flex>
      
      <Box h="245px">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={applicationTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2CA58D" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2CA58D" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="shortlistedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E2738" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1E2738" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#48BB78" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#48BB78" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="rejectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F56565" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F56565" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#718096', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#2CA58D"
              strokeWidth={2}
              fill="url(#applicationsGradient)"
              name="Applications"
            />
            <Area
              type="monotone"
              dataKey="shortlisted"
              stroke="#1E2738"
              strokeWidth={2}
              fill="url(#shortlistedGradient)"
              name="Shortlisted"
            />
            <Area
              type="monotone"
              dataKey="approved"
              stroke="#48BB78"
              strokeWidth={2}
              fill="url(#approvedGradient)"
              name="Approved"
            />
            <Area
              type="monotone"
              dataKey="rejected"
              stroke="#F56565"
              strokeWidth={2}
              fill="url(#rejectedGradient)"
              name="Rejected"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ApplicationTrends;
