import {
    Box,
    Flex,
    Heading,
    Text,
    VStack,
    Image,
    Container,
    SimpleGrid,
    Icon,
    Stack,
} from "@chakra-ui/react";
import { FaUsers, FaHandshake, FaRocket, FaHeart } from "react-icons/fa";
import avatar from "../../Images/avatar1.png";
import Footer from "./Footer";
import Navbar from "./Navbar";

const teamMembers = [
    {
        name: "Hafiza Anisa Ahmed",
        role: "Project Lead",
        image: avatar,
        description: "Leading our mission with passion and expertise in inclusive technology solutions."
    },
    {
        name: "Fariha Aqeel",
        role: "UI/UX Designer",
        image: avatar,
        description: "Crafting intuitive and accessible user experiences that empower every individual."
    },
    {
        name: "Hafsa Abdul Wahid",
        role: "Full Stack Developer",
        image: avatar,
        description: "Designing & connecting inclusive interfaces with backend that break barriers and create opportunities."
    },
    {
        name: "Laiba Khalid",
        role: "Content Strategist & Graphic Designer",
        image: avatar,
        description: "Graphic Designer, crafted content workflows, and contributed to front-end development."
    }
];

const values = [
    {
        icon: FaUsers,
        title: "Inclusivity First",
        description: "We believe every individual deserves equal opportunities to showcase their talents and achieve their dreams."
    },
    {
        icon: FaHandshake,
        title: "Empowerment Through Technology",
        description: "Leveraging cutting-edge AI and technology to break down barriers and create pathways to success."
    },
    {
        icon: FaRocket,
        title: "Innovation & Growth",
        description: "Continuously evolving our platform to meet the changing needs of our diverse community."
    },
    {
        icon: FaHeart,
        title: "Community & Support",
        description: "Building a supportive ecosystem where everyone can thrive, learn, and grow together."
    }
];

export default function AboutAbleTech() {
    return (
        <Stack spacing={0}>
            <Navbar />
            
            {/* Hero Section */}
            <Box bg="white" py={{ base: 16, md: 24 }}>
                <Container maxW="1200px">
                    <VStack spacing={8} textAlign="center" mb={16}>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="#2CA58D"
                            textTransform="uppercase"
                            letterSpacing="2px"
                        >
                            Our Story
                        </Text>
                        <Heading 
                            fontSize={["2xl", "3xl", "4xl", "5xl"]} 
                            fontWeight="800" 
                            color="#2D3E5E"
                            lineHeight="1.2"
                            maxW="800px"
                        >
                            Transforming Lives Through{" "}
                            <Box as="span" color="#2CA58D">
                                Technology & Opportunity
                            </Box>
                        </Heading>
                    </VStack>

                    <Box maxW="900px" mx="auto">
                        <Text 
                            fontSize={["md", "lg"]} 
                            color="gray.600" 
                            lineHeight="1.8"
                            textAlign="justify"
                            mb={8}
                        >
                            AbleTech represents more than just a platform its' a movement toward true inclusivity 
                            in the professional world. We're a community-focused ecosystem designed to empower 
                            individuals with disabilities by addressing systemic challenges in employment, support, 
                            and accessibility.
                        </Text>
                        
                        <Text 
                            fontSize={["md", "lg"]} 
                            color="gray.600" 
                            lineHeight="1.8"
                            textAlign="justify"
                            mb={8}
                        >
                            Our intelligent AI-powered platform goes beyond traditional job matching, we understand 
                            unique skills, preferences, and accommodation needs to create perfect synergies between 
                            talented individuals and forward-thinking employers. Whether remote or on-site, 
                            part-time or full-time, we ensure every opportunity is accessible and meaningful.
                        </Text>

                        <Text 
                            fontSize={["md", "lg"]} 
                            color="gray.600" 
                            lineHeight="1.8"
                            textAlign="justify"
                        >
                            Beyond employment, AbleTech offers comprehensive training programs, mental health 
                            support, assistive technology resources, and vibrant community forums. Our motivational 
                            sessions and personalized coaching create an inclusive space where individuals don't 
                            just find jobs they build careers, develop skills, and thrive as valued professionals.
                        </Text>
                    </Box>
                </Container>
            </Box>

            {/* Values Section */}
            <Box bg="gray.50" py={{ base: 16, md: 24 }}>
                <Container maxW="1200px">
                    <VStack spacing={6} textAlign="center" mb={16}>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="#2CA58D"
                            textTransform="uppercase"
                            letterSpacing="2px"
                        >
                            Our Values
                        </Text>
                        <Heading 
                            fontSize={["2xl", "3xl", "4xl"]} 
                            color="#2D3E5E"  
                            fontWeight="800"
                            lineHeight="1.2"
                        >
                            What Drives Us Forward
                        </Heading>
                        <Text 
                            fontSize="lg" 
                            color="gray.600" 
                            maxW="600px"
                            lineHeight="1.8"
                        >
                            Our core values shape every decision we make and every feature we build, 
                            ensuring we stay true to our mission of creating equal opportunities for all.
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                        {values.map((value, index) => (
                            <Flex key={index} gap={6} align="flex-start">
                                <Box
                                    p={4}
                                    bg="#2CA58D"
                                    borderRadius="xl"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    flexShrink={0}
                                >
                                    <Icon as={value.icon} boxSize={6} color="white" />
                                </Box>
                                <VStack align="flex-start" spacing={3}>
                                    <Heading 
                                        as="h3" 
                                        fontSize="xl" 
                                        color="#2D3E5E" 
                                        fontWeight="700"
                                    >
                                        {value.title}
                                    </Heading>
                                    <Text 
                                        fontSize="md" 
                                        color="gray.600" 
                                        lineHeight="1.7"
                                    >
                                        {value.description}
                                    </Text>
                                </VStack>
                            </Flex>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Team Section */}
            <Box bg="white" py={{ base: 16, md: 24 }}>
                <Container maxW="1200px">
                    <VStack spacing={6} textAlign="center" mb={16}>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="#2CA58D"
                            textTransform="uppercase"
                            letterSpacing="2px"
                        >
                            Meet Our Team
                        </Text>
                        <Heading 
                            fontSize={["2xl", "3xl", "4xl"]} 
                            color="#2D3E5E"
                            fontWeight="800"
                            lineHeight="1.2"
                        >
                            The Visionaries Behind AbleTech
                        </Heading>
                        <Text 
                            fontSize="lg" 
                            color="gray.600" 
                            maxW="600px"
                            lineHeight="1.8"
                        >
                            Our diverse team brings together expertise in technology, design, and accessibility 
                            to create solutions that truly make a difference.
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
                        {teamMembers.map((member, index) => (
                            <Box
                                key={index}
                                bg="white"
                                borderRadius="2xl"
                                boxShadow="0 10px 40px rgba(0,0,0,0.08)"
                                p={8}
                                textAlign="center"
                                transition="all 0.3s"
                                _hover={{ 
                                    transform: "translateY(-8px)",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.12)"
                                }}
                                border="1px solid"
                                borderColor="gray.100"
                            >
                                <VStack spacing={6}>
                                    <Box position="relative">
                                        <Box
                                            position="absolute"
                                            top={-2}
                                            left={-2}
                                            w="full"
                                            h="full"
                                            bg="linear-gradient(135deg, #2CA58D, #27967F)"
                                            borderRadius="full"
                                            opacity={0.2}
                                        />
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            boxSize="120px"
                                            borderRadius="full"
                                            objectFit="cover"
                                            position="relative"
                                            border="4px solid white"
                                            boxShadow="0 8px 30px rgba(0,0,0,0.1)"
                                        />
                                    </Box>
                                    
                                    <VStack spacing={2}>
                                        <Heading 
                                            as="h4" 
                                            fontSize="lg" 
                                            fontWeight="700" 
                                            color="#2D3E5E"
                                            lineHeight="1.3"
                                        >
                                            {member.name}
                                        </Heading>
                                        <Text 
                                            fontSize="sm" 
                                            color="#2CA58D" 
                                            fontWeight="600"
                                            textTransform="uppercase"
                                            letterSpacing="1px"
                                        >
                                            {member.role}
                                        </Text>
                                        <Text 
                                            fontSize="sm" 
                                            color="gray.600" 
                                            lineHeight="1.6"
                                            textAlign="center"
                                        >
                                            {member.description}
                                        </Text>
                                    </VStack>
                                </VStack>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            <Footer />
        </Stack>
    );
}