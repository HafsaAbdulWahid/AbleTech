import React from "react";
import {
    Box,
    Text
} from "@chakra-ui/react";
import LoginForm from "./LoginForm";
import Navbar from "../HomePage/Navbar";

export default function LoginParent() {
    return (
        <Box>
            <Navbar />
            <LoginForm />
        </Box>  
    );
};

