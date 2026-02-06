import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Stack,
    Text,
    VStack,
    Textarea,
    useToast,
    FormErrorMessage,
    Progress,
    Divider,
    HStack,
    Icon,
    InputGroup,
    InputLeftElement,
    Card,
    CardBody,
    Heading,
    IconButton,
    Badge,
    Circle,
} from "@chakra-ui/react";
import {
    LuShapes,
    LuGraduationCap,
    LuBuilding,
    LuUser,
    LuPlus,
    LuTrash2,
    LuCalendar,
    LuBriefcase
} from "react-icons/lu";
import { MdOutlineCastForEducation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

interface Internship {
    companyName: string;
    position: string;
    description: string;
    duration?: string;
    skills?: string;
}

interface FormData {
    instituteName: string;
    qualification: string;
    graduationYear?: string;
    cgpa?: string;
    internships: Internship[];
}

interface FormErrors {
    [key: string]: string;
}

export default function EducationDetailsForm() {
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState<FormData>({
        instituteName: "",
        qualification: "",
        graduationYear: "",
        cgpa: "",
        internships: [
            { companyName: "", position: "", description: "", duration: "", skills: "" },
        ],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const qualificationOptions = [
        "High School / Matriculation",
        "Intermediate / A-Levels",
        "Bachelor's Degree",
        "Master's Degree",
        "PhD / Doctorate",
        "Diploma",
        "Certificate Course",
        "Other"
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.instituteName.trim()) {
            newErrors.instituteName = "Institute name is required";
        }

        if (!formData.qualification) {
            newErrors.qualification = "Educational qualification is required";
        }

        if (formData.cgpa && (parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 4)) {
            newErrors.cgpa = "CGPA must be between 0 and 4";
        }

        // Validate internships
        formData.internships.forEach((internship, index) => {
            if (internship.companyName || internship.position || internship.description) {
                if (!internship.companyName.trim()) {
                    newErrors[`internship_company_${index}`] = "Company name is required";
                }
                if (!internship.position.trim()) {
                    newErrors[`internship_position_${index}`] = "Position is required";
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInternshipChange = (
        index: number,
        field: keyof Internship,
        value: string
    ) => {
        setFormData(prev => {
            const updatedInternships = [...prev.internships];
            updatedInternships[index][field] = value;
            return { ...prev, internships: updatedInternships };
        });

        // Clear errors
        if (errors[`internship_${field}_${index}`]) {
            setErrors(prev => ({ ...prev, [`internship_${field}_${index}`]: "" }));
        }
    };

    const handleFieldChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear errors
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const addInternship = () => {
        setFormData(prev => ({
            ...prev,
            internships: [
                ...prev.internships,
                { companyName: "", position: "", description: "", duration: "", skills: "" },
            ]
        }));
    };

    const removeInternship = (index: number) => {
        if (formData.internships.length > 1) {
            setFormData(prev => ({
                ...prev,
                internships: prev.internships.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast({
                title: "Please correct the errors below",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);

        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userEmail = userData.email;
        const payload = {
            email: userEmail,  
            ...formData,
            internships: formData.internships.filter(
                internship => internship.companyName || internship.position || internship.description
            )
        };

        try {
            await axios.post("http://localhost:3001/api/users/education-details", payload);

            toast({
                title: "Education Details Submitted Successfully!",
                description: "Your profile is now complete. AI recommendations are being prepared...",
                status: "success",
                duration: 4000,
                isClosable: true,
            });

            setTimeout(() => {
                navigate("/user-dashboard");
            }, 3000);

        } catch (error: any) {
            toast({
                title: "Submission Failed",
                description: error.response?.data?.message || "Please try again later",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const completedSections = [
        formData.instituteName && formData.qualification,
        formData.internships.some(i => i.companyName && i.position)
    ].filter(Boolean).length;
    const totalSections = 2;
    const progressPercentage = (completedSections / totalSections) * 100;

    return (
        <Flex h="100vh" bg="gray.50">
            <Box
                w="350px"
                bg="#1e2738"
                p={8}
                position="relative"
                _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '4px',
                    height: '100%',
                    bg: '#2CA58D',
                }}
            >
                <VStack spacing={5} align="stretch">
                    {/* Header */}
                    <Box textAlign="center">
                        <Heading size="md" color="white">
                            Application Progress
                        </Heading>
                    </Box>

                    {/* Progress Section */}
                    <Box bg="rgba(44, 165, 141, 0.1)" p={6} borderRadius="xl" border="1px solid" borderColor="rgba(44, 165, 141, 0.3)">
                        <Flex justify="space-between" align="center" mb={3}>
                            <Text fontSize="sm" color="#2CA58D" fontWeight="semibold">
                                Overall Progress
                            </Text>
                            <Badge bg="#2CA58D" color="white" px={3} py={1} borderRadius="full">
                                100%
                            </Badge>
                        </Flex>
                        <Progress
                            value={100}
                            bg="rgba(44, 165, 141, 0.2)"
                            borderRadius="full"
                            size="lg"
                            sx={{
                                '& > div': {
                                    bg: 'linear-gradient(90deg, #2CA58D 0%, #3DB896 100%)',
                                }
                            }}
                        />
                        <Text fontSize="xs" color="gray.400" mt={2}>Step 2 of 2</Text>
                    </Box>

                    {/* Navigation Steps */}
                    <VStack spacing={4} align="stretch" mt={"200px"}>
                        {/* Completed Step - Basic Details */}
                        <Box
                            bg="rgba(255,255,255,0.05)"
                            p={5}
                            borderRadius="xl"
                            border="1px solid rgba(44, 165, 141, 0.3)"
                            opacity={0.8}
                        >
                            <Flex align="center">
                                <Circle size="50px" bg="#2CA58D" color="white" mr={4}>
                                    <Icon as={LuShapes} boxSize={6} />
                                </Circle>
                                <Box flex={1}>
                                    <Flex align="center" mb={1}>
                                        <Text fontWeight="bold" color="#2CA58D" fontSize="md">
                                            Basic Details
                                        </Text>
                                    </Flex>
                                    <Text fontSize="sm" color="gray.300">
                                        Personal & Contact Information
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>

                        {/* Current Step - Education Details */}
                        <Box
                            bg="linear-gradient(135deg, #2CA58D 0%, #3DB896 100%)"
                            p={5}
                            borderRadius="xl"
                            position="relative"
                            boxShadow="0 8px 25px rgba(44, 165, 141, 0.3)"
                        >
                            <Flex align="center">
                                <Circle size="50px" bg="white" color="#2CA58D" mr={4}>
                                    <Icon as={MdOutlineCastForEducation} boxSize={6} />
                                </Circle>
                                <Box flex={1}>
                                    <Flex align="center" mb={1}>
                                        <Text fontWeight="bold" color="white" fontSize="md">
                                            Education Details
                                        </Text>
                                    </Flex>
                                    <Text fontSize="sm" color="rgba(255,255,255,0.9)">
                                        Academic Background & Qualifications
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </VStack>
                </VStack>
            </Box>

            {/* Right Side  */}
            <Box flex={1} p={6} overflowY="auto">
                <Box maxW="700px" mx="auto">
                    {/* Header Section */}
                    <Box textAlign="center" mb={6}>
                        <Heading
                            size="lg"
                            color="#1e2738"
                            mb={3}
                            fontWeight="700"
                        >
                            Education & Experience
                        </Heading>
                        <Text fontSize="lg" color="gray.600" fontWeight="medium">
                            Complete your academic and professional background to finish your profile.
                        </Text>
                        <Box w="100px" h="4px" bg="#2CA58D" mx="auto" mt={4} borderRadius="full" />
                    </Box>

                    <Card
                        shadow="2xl"
                        borderRadius="3xl"
                        border="1px solid"
                        borderColor="gray.200"
                        bg="white"
                        overflow="hidden"
                    >
                        {/* Card Header */}
                        <Box
                            bg="linear-gradient(135deg, #1e2738 0%, #2a3441 100%)"
                            p={6}
                            borderBottom="4px solid #2CA58D"
                        >
                            <Flex align="center" justify="space-between">
                                <Box>
                                    <Text color="white" fontSize="lg" fontWeight="bold">
                                        Step 2: Academic & Professional Background
                                    </Text>
                                    <Text color="gray.300" fontSize="sm">
                                        Share your educational and work experience
                                    </Text>
                                </Box>
                                <Circle size="60px" bg="rgba(44, 165, 141, 0.2)" color="#2CA58D">
                                    <Icon as={LuGraduationCap} boxSize={8} />
                                </Circle>
                            </Flex>
                        </Box>

                        <CardBody p={8}>
                            <Stack spacing={6}>
                                {/* Education Section */}
                                <Box>
                                    <Flex align="center" mb={4}>
                                        <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                            <Icon as={LuGraduationCap} boxSize={5} />
                                        </Circle>
                                        <Box>
                                            <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                Educational Background
                                            </Text>
                                            <Text fontSize="sm" color="gray.600">
                                                Your academic qualifications and achievements
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <VStack spacing={4}>
                                        <FormControl isRequired isInvalid={!!errors.instituteName}>
                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                Institute / University Name
                                            </FormLabel>
                                            <InputGroup>
                                                <InputLeftElement>
                                                    <Icon as={LuBuilding} color="gray.400" />
                                                </InputLeftElement>
                                                <Input
                                                    placeholder="Enter your institute or university name"
                                                    value={formData.instituteName}
                                                    onChange={(e) => handleFieldChange("instituteName", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                            </InputGroup>
                                            <FormErrorMessage>{errors.instituteName}</FormErrorMessage>
                                        </FormControl>

                                        <HStack spacing={4} w="full">
                                            <FormControl isRequired isInvalid={!!errors.qualification} flex={2}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Educational Qualification
                                                </FormLabel>
                                                <Select
                                                    placeholder="Select your highest qualification"
                                                    value={formData.qualification}
                                                    onChange={(e) => handleFieldChange("qualification", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                >
                                                    {qualificationOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </Select>
                                                <FormErrorMessage>{errors.qualification}</FormErrorMessage>
                                            </FormControl>

                                            <FormControl flex={1}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    Graduation Year
                                                </FormLabel>
                                                <Input
                                                    type="date"
                                                    value={formData.graduationYear}
                                                    onChange={(e) => handleFieldChange("graduationYear", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                            </FormControl>

                                            <FormControl flex={1} isInvalid={!!errors.cgpa}>
                                                <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                    CGPA
                                                </FormLabel>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="4"
                                                    placeholder="4.0"
                                                    value={formData.cgpa}
                                                    onChange={(e) => handleFieldChange("cgpa", e.target.value)}
                                                    focusBorderColor="#2CA58D"
                                                    borderColor="gray.300"
                                                    size="md"
                                                    bg="gray.50"
                                                    _hover={{ borderColor: "#2CA58D" }}
                                                    _focus={{ bg: "white", boxShadow: "0 0 0 1px #2CA58D" }}
                                                />
                                                <FormErrorMessage>{errors.cgpa}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>
                                    </VStack>
                                </Box>

                                <Divider borderColor="#2CA58D" />

                                {/* Professional Experience Section */}
                                <Box>
                                    <Flex align="center" justify="space-between" mb={4}>
                                        <Flex align="center">
                                            <Circle size="40px" bg="#2CA58D" color="white" mr={4}>
                                                <Icon as={LuBriefcase} boxSize={5} />
                                            </Circle>
                                            <Box>
                                                <Text fontSize="xl" fontWeight="bold" color="#1e2738">
                                                    Professional Experience
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    Internships, jobs, and work experience
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <Button
                                            leftIcon={<LuPlus />}
                                            onClick={addInternship}
                                            bg="#2CA58D"
                                            color="white"
                                            variant="solid"
                                            size="sm"
                                            _hover={{
                                                bg: "#3DB896",
                                                transform: "translateY(-1px)"
                                            }}
                                        >
                                            Add Experience
                                        </Button>
                                    </Flex>

                                    <VStack spacing={4}>
                                        {formData.internships.map((internship, index) => (
                                            <Box
                                                key={index}
                                                w="full"
                                                border="2px solid"
                                                borderColor="gray.200"
                                                borderRadius="2xl"
                                                p={6}
                                                bg="gray.50"
                                                position="relative"
                                                _hover={{
                                                    borderColor: "#2CA58D",
                                                    bg: "white",
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 8px 25px rgba(44, 165, 141, 0.1)"
                                                }}
                                                transition="all 0.2s"
                                            >
                                                <Flex justify="space-between" align="center" mb={4}>
                                                    <Flex align="center">
                                                        <Circle size="30px" bg="#2CA58D" color="white" mr={3}>
                                                            <Text fontSize="sm" fontWeight="bold">{index + 1}</Text>
                                                        </Circle>
                                                        <Text fontSize="md" fontWeight="bold" color="#1e2738">
                                                            Experience {index + 1}
                                                        </Text>
                                                    </Flex>
                                                    {formData.internships.length > 1 && (
                                                        <IconButton
                                                            icon={<LuTrash2 />}
                                                            onClick={() => removeInternship(index)}
                                                            colorScheme="red"
                                                            variant="ghost"
                                                            size="sm"
                                                            aria-label="Remove experience"
                                                            _hover={{
                                                                bg: "red.50",
                                                                color: "red.600"
                                                            }}
                                                        />
                                                    )}
                                                </Flex>

                                                <VStack spacing={4}>
                                                    <HStack spacing={4} w="full">
                                                        <FormControl isInvalid={!!errors[`internship_company_${index}`]}>
                                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                                Company Name
                                                            </FormLabel>
                                                            <InputGroup>
                                                                <InputLeftElement>
                                                                    <Icon as={LuBuilding} color="gray.400" />
                                                                </InputLeftElement>
                                                                <Input
                                                                    placeholder="Company or organization name"
                                                                    value={internship.companyName}
                                                                    onChange={(e) =>
                                                                        handleInternshipChange(index, "companyName", e.target.value)
                                                                    }
                                                                    focusBorderColor="#2CA58D"
                                                                    borderColor="gray.300"
                                                                    bg="white"
                                                                    _hover={{ borderColor: "#2CA58D" }}
                                                                    _focus={{ boxShadow: "0 0 0 1px #2CA58D" }}
                                                                />
                                                            </InputGroup>
                                                            <FormErrorMessage>{errors[`internship_company_${index}`]}</FormErrorMessage>
                                                        </FormControl>

                                                        <FormControl isInvalid={!!errors[`internship_position_${index}`]}>
                                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                                Position / Role
                                                            </FormLabel>
                                                            <InputGroup>
                                                                <InputLeftElement>
                                                                    <Icon as={LuUser} color="gray.400" />
                                                                </InputLeftElement>
                                                                <Input
                                                                    placeholder="Your role or position"
                                                                    value={internship.position}
                                                                    onChange={(e) =>
                                                                        handleInternshipChange(index, "position", e.target.value)
                                                                    }
                                                                    focusBorderColor="#2CA58D"
                                                                    borderColor="gray.300"
                                                                    bg="white"
                                                                    _hover={{ borderColor: "#2CA58D" }}
                                                                    _focus={{ boxShadow: "0 0 0 1px #2CA58D" }}
                                                                />
                                                            </InputGroup>
                                                            <FormErrorMessage>{errors[`internship_position_${index}`]}</FormErrorMessage>
                                                        </FormControl>
                                                    </HStack>

                                                    <HStack spacing={4} w="full">
                                                        <FormControl>
                                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                                Duration
                                                            </FormLabel>
                                                            <Input
                                                                placeholder="e.g., 3 months"
                                                                value={internship.duration}
                                                                onChange={(e) =>
                                                                    handleInternshipChange(index, "duration", e.target.value)
                                                                }
                                                                focusBorderColor="#2CA58D"
                                                                borderColor="gray.300"
                                                                bg="white"
                                                                _hover={{ borderColor: "#2CA58D" }}
                                                                _focus={{ boxShadow: "0 0 0 1px #2CA58D" }}
                                                            />
                                                        </FormControl>

                                                        <FormControl>
                                                            <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                                Key Skills Used
                                                            </FormLabel>
                                                            <Input
                                                                placeholder="e.g., React, Python, Project Management"
                                                                value={internship.skills}
                                                                onChange={(e) =>
                                                                    handleInternshipChange(index, "skills", e.target.value)
                                                                }
                                                                focusBorderColor="#2CA58D"
                                                                borderColor="gray.300"
                                                                bg="white"
                                                                _hover={{ borderColor: "#2CA58D" }}
                                                                _focus={{ boxShadow: "0 0 0 1px #2CA58D" }}
                                                            />
                                                        </FormControl>
                                                    </HStack>

                                                    <FormControl>
                                                        <FormLabel fontSize="sm" fontWeight="bold" color="#1e2738">
                                                            Description & Achievements
                                                        </FormLabel>
                                                        <Textarea
                                                            placeholder="Describe your responsibilities, achievements, and what you learned..."
                                                            value={internship.description}
                                                            onChange={(e) =>
                                                                handleInternshipChange(index, "description", e.target.value)
                                                            }
                                                            focusBorderColor="#2CA58D"
                                                            borderColor="gray.300"
                                                            bg="white"
                                                            rows={3}
                                                            resize="vertical"
                                                            _hover={{ borderColor: "#2CA58D" }}
                                                            _focus={{ boxShadow: "0 0 0 1px #2CA58D" }}
                                                        />
                                                    </FormControl>
                                                </VStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                </Box>

                                {/* Action Buttons */}
                                <Box pt={6}>
                                    <Flex justify="space-between" align="center">
                                        <Button
                                            variant="outline"
                                            borderColor="#2CA58D"
                                            color="#2CA58D"
                                            onClick={() => navigate(-1)}
                                            _hover={{
                                                bg: "#2CA58D",
                                                color: "white",
                                                transform: "translateY(-1px)"
                                            }}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            bg="linear-gradient(135deg, #2CA58D 0%, #3DB896 100%)"
                                            color="white"
                                            onClick={handleSubmit}
                                            isLoading={isSubmitting}
                                            loadingText="Submitting..."
                                            px={6}
                                            py={2}
                                            fontSize="md"
                                            fontWeight="bold"
                                            boxShadow="0 8px 25px rgba(44, 165, 141, 0.3)"
                                            _hover={{
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 12px 35px rgba(44, 165, 141, 0.4)"
                                            }}
                                            _active={{ transform: "translateY(0px)" }}
                                            transition="all 0.2s"
                                        >
                                            Complete Profile
                                        </Button>
                                    </Flex>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </Box>
            </Box>
        </Flex>
    );
}