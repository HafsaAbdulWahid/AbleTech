import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Services from "./Services";
import ContactUs from "./ContactUs";
import AboutUs from "./AboutUs";

export default function HomePageMain() {
    return (
        <Box minH="100vh" bg="white">
            <Navbar />
            <Box mt={"70px"}>
                <AboutUs />
            </Box>
            <Services />
            <ContactUs />
            <Footer />
        </Box>
    );
}