import {
    Box,
    Flex,
    Text,
    Button,
    Image,
    Spacer,
} from "@chakra-ui/react";
import Logo from "../../Images/Logo.png";

export default function Navbar() {
    return (
        <Box bg="#1e2738" px={10} pt={3}>
            <Flex align="center">
                <Flex align="center" gap={2}>
                    <Image
                        src= {Logo}
                        alt="AbleTech Logo"
                        boxSize="60px"
                    />
                    <Text fontSize="lg" fontWeight="bold" color="white">
                        AbleTech
                    </Text>
                </Flex>

                <Spacer />

                <Flex gap={8} align="center" color="white" fontSize="sm">
                    <Text cursor="pointer">Home</Text>
                    <Text cursor="pointer">Jobs</Text>
                    <Text cursor="pointer">About Us</Text>
                    <Text cursor="pointer">Contact Us</Text>
                </Flex>

                <Spacer />

                <Flex gap={2} align="center">
                    <Text color="white" px={6} fontSize="sm" cursor="pointer">
                        Login
                    </Text>
                    <Button size="sm" px={6} bg="#2CA58D" color="white" _hover={{ bg: "#27967F" }}>
                        Register
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

