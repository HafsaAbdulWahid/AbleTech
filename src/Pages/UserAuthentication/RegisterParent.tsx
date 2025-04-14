import React from "react";
import {
    Box,
    Text
} from "@chakra-ui/react";
import RegisterForm from "./RegisterForm";
import Navbar from "./Navbar";

export default function RegisterParent() {
    return (
        <Box>
            {/* <Navbar /> */}
            <RegisterForm />
        </Box>
    );
};

