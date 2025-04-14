import {
    Box,
    Text,
    Flex
} from "@chakra-ui/react";


export default function CarouselBar() {
    return (
        <Box bg={"black"} px={10} py={6}>
                <Text fontSize="5xl" mt={10} textAlign={"center"} fontWeight="bold" color="white">
                    Login to your account
                </Text>

                <Text fontSize="xl" mt={3} mb={"100px"} textAlign={"center"} fontWeight="bold" color="white">
                    Welcome back! Select the below login methods.
                </Text>
        </Box>
    );
};