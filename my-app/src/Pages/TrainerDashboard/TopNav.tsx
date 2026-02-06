// Updated TopNav.tsx
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
} from "@chakra-ui/react";
import { FiSearch, FiBell, FiMessageSquare } from "react-icons/fi";
import { useUser } from "../UserDashboard/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function TopNav() {
    const { user } = useUser();
    const [activeNav, setActiveNav] = useState("Dashboard");
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const displayName = user?.name || "Hafsa Abdul Wahid";

    const handleNav = (label: string, path: string) => {
        if (label === "Log Out") {
            setIsLoggingOut(true);
            setActiveNav(label);
            setTimeout(() => {
                setIsLoggingOut(false);
                navigate("/");
            }, 2000);
        } else {
            setActiveNav(label);
            navigate(path);
        }
    };

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
                    aria-label="notifications"
                    icon={<FiBell />}
                    variant="ghost"
                    color="white"
                    mr={5}
                    _hover={{ bg: "gray.700" }}
                    onClick={() => handleNav("Notifications", "/trainer-notifications")}
                />
                {/* <IconButton
                    aria-label="messages"
                    icon={<FiMessageSquare />}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "gray.700" }}
                /> */}

                <Avatar size="sm" name={displayName} />

                <Box textAlign="left" color="white">
                    <Text fontWeight="medium" fontSize="sm">
                        {displayName}
                    </Text>
                    {user?.userType && (
                        <Text fontSize="xs" color="gray.300">
                            {user.userType}
                        </Text>
                    )}
                </Box>
            </HStack>
        </Flex>
    );
}