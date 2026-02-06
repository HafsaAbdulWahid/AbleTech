import {
    Box,
    Flex,
    Text,
    VStack,
    HStack,
    Button,
    Link,
    Divider,
    Image,
    IconButton,
    Container,
    SimpleGrid,
    Heading,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaArrowRight } from "react-icons/fa";
import bgImage from "../../Images/bgImage.png";
import Logo from "../../Images/Logo.png";
import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();

    const companyLinks = [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "AI Interview Preparation", href: "/interview-prep" },
        { name: "Jobs", href: "/all-jobs" },
        { name: "Contact Us", href: "#ContactUs" },
    ];

    const jobCategories = [
        { name: "Content Writing", href: "/jobs/content-writing" },
        { name: "IT & Software", href: "/jobs/it-software" },
        { name: "Marketing", href: "/jobs/marketing" },
        { name: "Design", href: "/jobs/design" },
        { name: "Development", href: "/jobs/development" },
    ];

    const socialLinks = [
        { name: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com", color: "#0077B5" },
        { name: "Twitter", icon: FaTwitter, href: "https://twitter.com", color: "#1DA1F2" },
        { name: "Facebook", icon: FaFacebook, href: "https://facebook.com", color: "#1877F2" },
        { name: "Instagram", icon: FaInstagram, href: "https://instagram.com", color: "#E4405F" },
    ];

    return (
        <>
            {/* CTA Section */}
            <Box
                bgImage={bgImage}
                bgSize="cover"
                bgPosition="center"
                position="relative"
                py={"150px"}
            >
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="linear-gradient(135deg, rgba(44, 165, 141, 0.9), rgba(45, 62, 94, 0.8))"
                    zIndex={0}
                />

                <Container maxW="1200px" position="relative" zIndex={1}>
                    <VStack spacing={8} textAlign="center" color="white">
                        <Heading 
                            fontSize={["2xl", "3xl", "4xl"]} 
                            fontWeight="800"
                            maxW="800px"
                            lineHeight="1.3"
                        >
                            Ready to Connect Talent with Opportunity?
                        </Heading>
                        <Text 
                            fontSize={["md", "lg"]} 
                            maxW="600px"
                            opacity={0.9}
                            lineHeight="1.7"
                        >
                            Join thousands of people who've found their perfect match. 
                            Whether you're seeking talent or looking for your next opportunity, 
                            we're here to make it happen.
                        </Text>
                        <HStack spacing={4} pt={4}>
                            <Button
                                size="lg"
                                bg="white"
                                color="#2D3E5E"
                                fontWeight="700"
                                px={8}
                                py={6}
                                borderRadius="xl"
                                rightIcon={<FaArrowRight />}
                                transition="all 0.3s"
                                _hover={{ 
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 10px 30px rgba(255,255,255,0.3)"
                                }}
                                onClick={() => navigate("/register")}
                            >
                                Get Started Today
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                borderColor="white"
                                color="white"
                                fontWeight="700"
                                px={8}
                                py={6}
                                borderRadius="xl"
                                transition="all 0.3s"
                                _hover={{ 
                                    bg: "white",
                                    color: "#2D3E5E",
                                    transform: "translateY(-2px)"
                                }}
                                onClick={() => navigate("/all-jobs")}
                            >
                                Browse Jobs
                            </Button>
                        </HStack>
                    </VStack>
                </Container>
            </Box>

            {/* Main Footer */}
            <Box bg="#1e2738" color="white">
                <Container maxW="1200px" py={16}>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
                        {/* Brand Section */}
                        <VStack align="flex-start" spacing={6}>
                            <HStack spacing={3}>
                                <Image
                                    src={Logo}
                                    alt="AbleTech Logo"
                                    boxSize="50px"
                                />
                                <Text fontSize="2xl" fontWeight="800">
                                    AbleTech
                                </Text>
                            </HStack>
                            <Text fontSize="md" color="gray.300" lineHeight="1.7" maxW="280px">
                                Empowering individuals with disabilities through innovative technology, 
                                meaningful connections, and unlimited opportunities.
                            </Text>
                            <VStack align="flex-start" spacing={2}>
                                <Text fontSize="sm" fontWeight="600" color="#2CA58D">
                                    Join Our Community
                                </Text>
                                <HStack spacing={3}>
                                    {socialLinks.map((social) => (
                                        <Link key={social.name} href={social.href} isExternal>
                                            <IconButton
                                                icon={<social.icon />}
                                                isRound
                                                size="md"
                                                bg="rgba(255,255,255,0.1)"
                                                color="white"
                                                transition="all 0.3s"
                                                _hover={{ 
                                                    bg: social.color,
                                                    transform: "translateY(-2px)"
                                                }}
                                                aria-label={social.name}
                                            />
                                        </Link>
                                    ))}
                                </HStack>
                            </VStack>
                        </VStack>

                        {/* Company Links */}
                        <VStack align="flex-start" spacing={4}>
                            <Text fontSize="lg" fontWeight="700" mb={2}>
                                Company
                            </Text>
                            {companyLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    fontSize="sm"
                                    color="gray.300"
                                    transition="all 0.2s"
                                    _hover={{ 
                                        color: "#2CA58D",
                                        transform: "translateX(4px)"
                                    }}
                                    onClick={(e) => {
                                        if (link.href.startsWith('#')) {
                                            e.preventDefault();
                                            const element = document.getElementById(link.href.substring(1));
                                            element?.scrollIntoView({ behavior: 'smooth' });
                                        } else if (link.href.startsWith('/')) {
                                            e.preventDefault();
                                            navigate(link.href);
                                        }
                                    }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </VStack>

                        {/* Job Categories */}
                        <VStack align="flex-start" spacing={4}>
                            <Text fontSize="lg" fontWeight="700" mb={2}>
                                Job Categories
                            </Text>
                            {jobCategories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    fontSize="sm"
                                    color="gray.300"
                                    transition="all 0.2s"
                                    _hover={{ 
                                        color: "#2CA58D",
                                        transform: "translateX(4px)"
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(category.href);
                                    }}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </VStack>

                        {/* Contact Info */}
                        <VStack align="flex-start" spacing={4}>
                            <Text fontSize="lg" fontWeight="700" mb={2}>
                                Get In Touch
                            </Text>
                            <VStack align="flex-start" spacing={3}>
                                <Box>
                                    <Text fontSize="sm" fontWeight="600" color="#2CA58D">
                                        Email Us
                                    </Text>
                                    <Text fontSize="sm" color="gray.300">
                                        abletech.connect@gmail.com
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="sm" fontWeight="600" color="#2CA58D">
                                        Call Us
                                    </Text>
                                    <Text fontSize="sm" color="gray.300">
                                        +92-320-8139253
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="sm" fontWeight="600" color="#2CA58D">
                                        Office Hours
                                    </Text>
                                    <Text fontSize="sm" color="gray.300">
                                        Mon-Fri: 9AM-6PM PKT
                                    </Text>
                                </Box>
                            </VStack>
                        </VStack>
                    </SimpleGrid>
                </Container>

                <Divider borderColor="gray.600" />

                {/* Bottom Footer */}
                <Container maxW="1200px" py={8}>
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align="center"
                        gap={4}
                    >
                        <Text fontSize="sm" color="gray.400">
                            © 2025 AbleTech. All rights reserved. Built with ❤️ for inclusivity.
                        </Text>
                        <HStack spacing={6} fontSize="sm">
                            <Link 
                                href="/privacy" 
                                color="gray.400"
                                transition="color 0.2s"
                                _hover={{ color: "#2CA58D" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/privacy');
                                }}
                            >
                                Privacy Policy
                            </Link>
                            <Link 
                                href="/terms" 
                                color="gray.400"
                                transition="color 0.2s"
                                _hover={{ color: "#2CA58D" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/terms');
                                }}
                            >
                                Terms & Conditions
                            </Link>
                            <Link 
                                href="/accessibility" 
                                color="gray.400"
                                transition="color 0.2s"
                                _hover={{ color: "#2CA58D" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/accessibility');
                                }}
                            >
                                Accessibility
                            </Link>
                        </HStack>
                    </Flex>
                </Container>
            </Box>
        </>
    );
}