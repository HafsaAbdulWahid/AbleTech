import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    VStack
} from '@chakra-ui/react';

type DynamicMotivationalCardProps = {
    title: string;
    value: number;
    description: string;
    delay?: number;
    color: string;
};

function DynamicMotivationalCard({
    title,
    value,
    description,
    delay = 0,
    color
}: DynamicMotivationalCardProps) {
    const [animatedValue, setAnimatedValue] = useState(0);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            const stepDuration = duration / steps;

            let currentStep = 0;
            const interval = setInterval(() => {
                currentStep++;
                const newValue = Math.min(increment * currentStep, value);
                setAnimatedValue(newValue);
                setDisplayValue(Math.round(newValue));

                if (currentStep >= steps) {
                    clearInterval(interval);
                    setAnimatedValue(value);
                    setDisplayValue(value);
                }
            }, stepDuration);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [value, delay]);

    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={8}
            textAlign="center"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.07)"
        >
            <VStack spacing={4}>
                <Heading size="sm" color="gray.700">
                    {title}
                </Heading>

                <Box position="relative">
                    <CircularProgress
                        value={animatedValue}
                        color={color}
                        size="100px"
                        thickness="12px"
                        trackColor="gray.100"
                    >
                        <CircularProgressLabel fontSize="xl" fontWeight="bold" color="gray.700">
                            {displayValue}%
                        </CircularProgressLabel>
                    </CircularProgress>
                </Box>

                <Text fontSize="sm" color="gray.500" lineHeight="1.4" px={2}>
                    {description}
                </Text>
            </VStack>
        </Box>
    );
}



export default function PerformanceSection() {
    return (
        <Box
            bg="white"
            p={5}
            borderRadius="xl"
            boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
            border="1px solid"
            borderColor="gray.200"
        >
            <Heading size="md" mb={5} color="gray.700">
                Performance Overview
            </Heading>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <DynamicMotivationalCard
                    title="Success Rate"
                    value={60}
                    description="Applications converted to interviews"
                    delay={200}
                    color="blue.500"
                />
                <DynamicMotivationalCard
                    title="Profile Completion"
                    value={85}
                    description="Completed profiles for better matches"
                    delay={600}
                    color="teal.500"
                />
            </SimpleGrid>
        </Box>
    );
}