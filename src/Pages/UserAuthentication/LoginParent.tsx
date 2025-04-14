import React from "react";
import {
    Box,
    Text
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import CarouselBar from "./CarouselBar";
import LoginForm from "./LoginForm";

export default function LoginParent() {
    return (
        <Box>
            <LoginForm />
        </Box>  
    );
};

