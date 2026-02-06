import {
    Box,
    Flex,
    Text,
    Icon,
    Button,
    VStack,
    HStack,
    Badge,
    Circle
} from "@chakra-ui/react";
import { FiArrowRight, FiUser, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Profile from "./UserProfile";
import { useUser } from "../UserDashboard/UserContext";
import imgone from "../../Images/imgone.png";

export default function DashboardCard() {
    const { user } = useUser();
    const navigate = useNavigate();

    const getFirstName = (fullName?: string) => {
        if (!fullName) return "Hafsa";
        return fullName.split(' ')[0];
    };

    const firstName = getFirstName(user?.name);

    const handleViewProfile = () => {
        navigate("/user-profile");
    };

    return (
        <Box
            w="990px"
            h="260px"
            borderRadius="3xl"
            bgGradient="linear(to-r, #2CA58D, #1E2738)"
            color="white"
            p={8}
            display="flex"
            justifyContent="space-between"
            position="relative"
            overflow="hidden"
            boxShadow="0 20px 40px rgba(0, 0, 0, 0.15)"
            _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
            }}
            transition="all 0.3s ease"
        >

            {/* Background Decorative Elements */}
            <Circle
                size="150px"
                bg="whiteAlpha.100"
                position="absolute"
                top="-75px"
                left="-75px"
                zIndex={0}
            />
            <Circle
                size="100px"
                bg="whiteAlpha.50"
                position="absolute"
                bottom="-50px"
                right="250px"
                zIndex={0}
            />

            <VStack align="flex-start" spacing={5} zIndex={2} flex={1}>
                {/* Welcome Message */}
                <VStack align="flex-start" spacing={3}>
                    <HStack spacing={3}>
                        <Box
                            w="50px"
                            h="50px"
                            bg="whiteAlpha.200"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            backdropFilter="blur(5px)"
                        >
                            <Icon as={FiUser} boxSize={6} color="white" />
                        </Box>
                        <VStack align="flex-start" spacing={0}>
                            <Text fontSize="3xl" fontWeight="800" lineHeight="1.2">
                                Welcome back, {firstName}!
                            </Text>
                        </VStack>
                    </HStack>
                </VStack>

                <Button
                    size="md"
                    bg="whiteAlpha.200"
                    color="white"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    borderRadius="full"
                    px={6}
                    py={3}
                    mt={2}
                    ml={"55px"}
                    fontSize="sm"
                    fontWeight="600"
                    backdropFilter="blur(10px)"
                    onClick={handleViewProfile}
                    _hover={{
                        bg: "whiteAlpha.300",
                        borderColor: "whiteAlpha.400",
                        transform: "translateY(-1px)",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                    }}
                    _active={{
                        transform: "translateY(0px)",
                    }}
                    rightIcon={<Icon as={FiArrowRight} boxSize={4} />}
                    transition="all 0.2s ease"
                >
                    View Full Profile
                </Button>
            </VStack>

            {/* Illustration */}
            <Box
                position="absolute"
                right={3}
                top={3}
                w="220px"
                h="220px"
                bgImage={imgone}
                bgSize="contain"
                bgRepeat="no-repeat"
                zIndex={0}
            />
        </Box >
    );
}