import {
    Box,
    Text
} from "@chakra-ui/react";
import RegisterForm from "./RegisterForm";
import Navbar from "../HomePage/Navbar";

export default function RegisterParent() {
    return (
        <Box>
            <Navbar />
            <RegisterForm />
        </Box>
    );
};

