import { Box, Heading, useColorModeValue, HStack, Text, Circle } from '@chakra-ui/react';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const chartData = [
    { month: 'Jan', Jobs: 2, Users: 3 },
    { month: 'Feb', Jobs: 3, Users: 4 },
    { month: 'Mar', Jobs: 6, Users: 4 },
    { month: 'Apr', Jobs: 4, Users: 3 },
    { month: 'May', Jobs: 8, Users: 5 },
    { month: 'Jun', Jobs: 6, Users: 4 },
    { month: 'Jul', Jobs: 7, Users: 6 },
];

// Custom Legend Component
function CustomLegend() {
    return (
        <HStack spacing={6} mb={4} justify="center">
            <HStack spacing={2}>
                <Circle size="12px" bg="blue.500" />
                <Text fontSize="sm" color="gray.600" fontWeight="medium">Jobs</Text>
            </HStack>
            <HStack spacing={2}>
                <Circle size="12px" bg="teal.500" />
                <Text fontSize="sm" color="gray.600" fontWeight="medium">Users</Text>
            </HStack>
        </HStack>
    );
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <Box
                bg="white"
                p={3}
                borderRadius="lg"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 15px rgba(0, 0, 0, 0.1)"
                border="1px solid"
                borderColor="gray.200"
            >
                <Text fontSize="sm" fontWeight="semibold" mb={2}>{label}</Text>
                {payload.map((entry: any, index: number) => (
                    <Text key={index} fontSize="sm" color={entry.color}>
                        {entry.name}: {entry.value}
                    </Text>
                ))}
            </Box>
        );
    }
    return null;
};

export default function OverviewChart() {
    const cardBg = useColorModeValue('white', 'gray.800');

    return (
        <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
            border="1px solid"
            borderColor="gray.100"
            width="100%"
            height="350px"
        >
            <Heading size="md" mb={4} color="gray.700">
                Monthly Overview
            </Heading>

            <CustomLegend />
            
            <ResponsiveContainer width="100%" height="75%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid 
                        stroke="#f7fafc" 
                        strokeDasharray="5 5" 
                        horizontal={true}
                        vertical={false}
                    />
                    <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#718096' }}
                        dy={10}
                    />
                    <YAxis 
                        domain={[0, 10]} 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#718096' }}
                        dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="Jobs"
                        stroke="#3182CE"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#3182CE', strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 6, fill: '#3182CE' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Users"
                        stroke="#38B2AC"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#38B2AC', strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 6, fill: '#38B2AC' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}