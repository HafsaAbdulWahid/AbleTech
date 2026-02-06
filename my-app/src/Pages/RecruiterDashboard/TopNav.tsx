import {
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    IconButton,
    Avatar,
    Box,
    Text,
    HStack,
    Button,
    Icon,
} from "@chakra-ui/react";
import { FiSearch, FiBell, FiMessageSquare, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserDashboard/UserContext";

export default function TopNav() {
    const navigate = useNavigate();
    const { user } = useUser();
    
    // Get display name from user context or use default
    const displayName = user?.name || "Recruiter";
    const userRole = user?.userType || "Recruiter";

    return (
        <Flex
            ml="80px"
            height="80px"
            bg="#1e2738"
            px={6}
            py={8}
            align="center"
            justify="space-between"
            position="sticky"
            top={0}
            zIndex={1000}
        >
            <Text color={"white"} fontWeight={"bold"} fontSize={"30px"} letterSpacing={2}>
                AbleTech
            </Text>

            <HStack spacing={3} align="center">
                <IconButton
                    aria-label="Notifications"
                    icon={<Icon as={FiBell} />}
                    variant="ghost"
                    color="white"
                    size="md"
                    _hover={{ bg: "whiteAlpha.200" }}
                    onClick={() => navigate('/notifications')}
                />

                <Avatar size="sm" name={displayName} />

                <Box textAlign="left" color="white">
                    <Text fontWeight="medium" fontSize="sm">
                        {displayName}
                    </Text>
                    <Text fontSize="xs" color="gray.300">
                        {userRole}
                    </Text>
                </Box>
            </HStack>
        </Flex>
    );
}