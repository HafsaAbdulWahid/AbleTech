import {
    Box,
    Flex,
    Text,
    Button,
    Image,
    Spacer,
} from "@chakra-ui/react";
import Logo from "../../Images/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const handleHomeClick = () => {
        if (location.pathname === '/') {
            // If already on home page, scroll to top
            scrollToSection('home');
        } else {
            // If on another page, navigate to home
            navigate('/');
        }
    };

    const handleContactClick = () => {
        if (location.pathname === '/') {
            // If on home page, scroll to contact section
            scrollToSection('contact-us');
        } else {
            // If on another page, navigate to home and then scroll to contact
            navigate('/', { state: { scrollTo: 'contact-us' } });
        }
    };

    const isHomePage = location.pathname === '/';

    return (
        <Box
            px={10}
            py={isScrolled ? 2 : 4}
            position="fixed"
            top={0}
            left={0}
            right={0}
            id="home"
            zIndex={1000}
            bg={isScrolled ? "rgba(30, 39, 56, 0.95)" : "transparent"}
            backdropFilter={isScrolled ? "blur(10px)" : "none"}
            transition="all 0.3s ease"
            boxShadow={isScrolled ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "none"}
        >
            <Flex 
                align="center" 
                bg="#1e2738"
                borderRadius="50px"
                px={8}
                py={isScrolled ? 2.5 : 3}
                backdropFilter="blur(10px)"
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
                transition="all 0.3s ease"
            >
                {/* Logo Section */}
                <Flex align="center" gap={2}>
                    <Image
                        src={Logo}
                        alt="AbleTech Logo"
                        boxSize="50px"
                        position="relative"
                        zIndex={10}
                    />
                    <Text fontSize="xl" fontWeight="bold" color="white">
                        AbleTech
                    </Text>
                </Flex>

                <Spacer />

                {/* Navigation Items */}
                <Flex gap={10} align="center" color="white" fontSize="15px" fontWeight="500">
                    <Box position="relative">
                        <Text
                            cursor="pointer"
                            color={isHomePage ? "#2CA58D" : "white"}
                            _hover={{ color: "#2CA58D" }}
                            transition="all 0.3s"
                            onClick={handleHomeClick}
                            pb={1}
                        >
                            Home
                        </Text>
                        <Box
                            position="absolute"
                            bottom="-8px"
                            left="50%"
                            transform="translateX(-50%)"
                            width={isHomePage ? "100%" : "0%"}
                            height="3px"
                            bg="#2CA58D"
                            borderRadius="full"
                            transition="width 0.3s ease"
                            _groupHover={{ width: "100%" }}
                        />
                    </Box>

                    <Box 
                        position="relative"
                        role="group"
                    >
                        <Text
                            cursor="pointer"
                            _hover={{ color: "#2CA58D" }}
                            transition="all 0.3s"
                            onClick={() => handleNavigation('/jobs')}
                            pb={1}
                        >
                            Jobs
                        </Text>
                        <Box
                            position="absolute"
                            bottom="-8px"
                            left="50%"
                            transform="translateX(-50%)"
                            width="0%"
                            height="3px"
                            bg="#2CA58D"
                            borderRadius="full"
                            transition="width 0.3s ease"
                            _groupHover={{ width: "100%" }}
                        />
                    </Box>

                    <Box 
                        position="relative"
                        role="group"
                    >
                        <Text
                            cursor="pointer"
                            _hover={{ color: "#2CA58D" }}
                            transition="all 0.3s"
                            onClick={() => handleNavigation('/about-us')}
                            pb={1}
                        >
                            About Us
                        </Text>
                        <Box
                            position="absolute"
                            bottom="-8px"
                            left="50%"
                            transform="translateX(-50%)"
                            width="0%"
                            height="3px"
                            bg="#2CA58D"
                            borderRadius="full"
                            transition="width 0.3s ease"
                            _groupHover={{ width: "100%" }}
                        />
                    </Box>

                    <Box 
                        position="relative"
                        role="group"
                    >
                        <Text
                            cursor="pointer"
                            _hover={{ color: "#2CA58D" }}
                            transition="all 0.3s"
                            onClick={handleContactClick}
                            pb={1}
                        >
                            Contact Us
                        </Text>
                        <Box
                            position="absolute"
                            bottom="-8px"
                            left="50%"
                            transform="translateX(-50%)"
                            width="0%"
                            height="3px"
                            bg="#2CA58D"
                            borderRadius="full"
                            transition="width 0.3s ease"
                            _groupHover={{ width: "100%" }}
                        />
                    </Box>
                </Flex>

                <Spacer />

                {/* Auth Buttons */}
                <Flex gap={4} align="center">
                    <Text
                        color="white"
                        px={6}
                        py={2}
                        fontSize="15px"
                        fontWeight="500"
                        cursor="pointer"
                        _hover={{ 
                            color: "#2CA58D",
                            transform: "translateY(-1px)"
                        }}
                        transition="all 0.3s"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </Text>
                    <Button
                        size="md"
                        px={8}
                        py={5}
                        bg="#2CA58D"
                        color="white"
                        fontSize="15px"
                        fontWeight="600"
                        borderRadius="full"
                        _hover={{ 
                            bg: "#27967F",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(44, 165, 141, 0.4)"
                        }}
                        transition="all 0.3s"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}