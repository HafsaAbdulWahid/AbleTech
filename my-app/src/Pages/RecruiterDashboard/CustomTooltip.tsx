import React from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box bg="white" p={4} borderRadius="xl" shadow="md" border="1px" borderColor="gray.200">
        <Text fontWeight="bold" mb={2} fontSize="sm">{label}</Text>
        {payload.map((entry: any, index: number) => (
          <HStack key={index} spacing={2}>
            <Box w={3} h={3} bg={entry.color} borderRadius="full" />
            <Text fontSize="xs" color="gray.600">
              {entry.name}: <Text as="span" fontWeight="bold" color="gray.900">{entry.value}</Text>
            </Text>
          </HStack>
        ))}
      </Box>
    );
  }
  return null;
};

export default CustomTooltip;