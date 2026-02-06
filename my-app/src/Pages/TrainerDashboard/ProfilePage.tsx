import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Flex,
    Text,
    VStack,
    HStack,
    Icon,
    Avatar,
    Badge,
    Divider,
    Button,
    Card,
    CardBody,
    SimpleGrid,
    Heading,
    IconButton,
    useToast
} from '@chakra-ui/react';
import {
    FiArrowLeft,
    FiMail,
    FiPhone,
    FiLinkedin,
    FiMapPin,
    FiUser,
    FiBriefcase,
    FiCalendar,
    FiFileText,
    FiEdit2,
    FiGlobe,
    FiUsers,
    FiAward,
    FiClock,
    FiBook
} from 'react-icons/fi';
import { LuGraduationCap, LuBuilding2 } from 'react-icons/lu';
import { TbDisabled2 } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserProfile {
    // Basic Info
    name: string;
    email: string;
    phone?: string;
    age?: string;
    gender?: string;
    
    // User specific
    role?: string;
    experience?: string;
    summary?: string;
    linkedin?: string;
    hasDisability?: string;
    disabilityCategories?: string[];
    accommodationsNeeded?: string;
    assistiveTechnologies?: string;
    workPreferences?: string[];
    
    // Education
    instituteName?: string;
    qualification?: string;
    graduationYear?: string;
    cgpa?: string;
    internships?: Array<{
        companyName: string;
        position: string;
        description: string;
        duration?: string;
        skills?: string;
    }>;
    
    // Trainer specific
    expertise?: string[];
    education?: string;
    certifications?: string;
    bio?: string;
    availability?: string;
    timezone?: string;
    portfolio?: string;
    
    // Recruiter specific
    firstName?: string;
    lastName?: string;
    companyName?: string;
    companyWebsite?: string;
    companySize?: string;
    industry?: string;
    companyDescription?: string;
    jobTitle?: string;
    department?: string;
    yearsOfExperience?: string;
    recruitingExperience?: string;
    workEmail?: string;
    linkedinProfile?: string;
    companyAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    specializations?: string[];
    typicalHiringVolume?: string;
    urgentPositions?: string;
    budgetRange?: string;
}

const ProfilePage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [userType, setUserType] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            // Get user data from localStorage to determine user type
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const recruiterData = JSON.parse(localStorage.getItem('recruiterData') || '{}');
            const trainerData = JSON.parse(localStorage.getItem('trainerData') || '{}');
            
            let email = userData.email || recruiterData.email || trainerData.email;
            let type = userData.userType || (recruiterData.email ? 'Recruiter' : 'Trainer');
            
            setUserType(type);

            // Fetch data based on user type
            if (type === 'User') {
                // Fetch user basic and education details
                const [basicRes, educationRes] = await Promise.all([
                    axios.get(`http://localhost:3001/api/users/details/${email}`),
                    axios.get(`http://localhost:3001/api/users/education/${email}`)
                ]);
                
                setProfile({
                    ...basicRes.data,
                    ...educationRes.data
                });
            } else if (type === 'Trainer') {
                const response = await axios.get(`http://localhost:3001/api/trainers/details/${email}`);
                setProfile(response.data);
            } else if (type === 'Recruiter') {
                const response = await axios.get(`http://localhost:3001/api/recruiters/details/${email}`);
                setProfile(response.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast({
                title: 'Error loading profile',
                description: 'Could not load profile data',
                status: 'error',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const InfoItem = ({ icon, label, value }: { icon: any; label: string; value?: string | string[] }) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return null;
        
        return (
            <HStack align="start" spacing={3}>
                <Icon as={icon} boxSize={5} color="#2CA58D" mt={1} />
                <Box flex={1}>
                    <Text fontSize="sm" color="gray.600" fontWeight="semibold" mb={1}>
                        {label}
                    </Text>
                    {Array.isArray(value) ? (
                        <Flex wrap="wrap" gap={2}>
                            {value.map((item, index) => (
                                <Badge key={index} colorScheme="teal" px={3} py={1} borderRadius="full">
                                    {item}
                                </Badge>
                            ))}
                        </Flex>
                    ) : (
                        <Text fontSize="md" color="gray.800">
                            {value}
                        </Text>
                    )}
                </Box>
            </HStack>
        );
    };

    if (loading) {
        return (
            <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
                <Text>Loading profile...</Text>
            </Box>
        );
    }

    if (!profile) {
        return (
            <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
                <Text>Profile not found</Text>
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg="gray.50">
            {/* Header */}
            <Box bg="#1e2738" py={4} boxShadow="md">
                <Container maxW="1200px">
                    <Flex justify="space-between" align="center">
                        <HStack spacing={4}>
                            <IconButton
                                icon={<FiArrowLeft />}
                                onClick={() => navigate(-1)}
                                variant="ghost"
                                color="white"
                                _hover={{ bg: 'whiteAlpha.200' }}
                                aria-label="Go back"
                            />
                            <Heading size="lg" color="white">
                                Profile
                            </Heading>
                        </HStack>
                        <IconButton
                            icon={<FiEdit2 />}
                            variant="ghost"
                            color="white"
                            _hover={{ bg: 'whiteAlpha.200' }}
                            aria-label="Edit profile"
                        />
                    </Flex>
                </Container>
            </Box>

            <Container maxW="1200px" py={8}>
                {/* Profile Header Card */}
                <Card mb={6} shadow="lg" borderRadius="2xl">
                    <CardBody p={8}>
                        <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
                            <Avatar
                                size="2xl"
                                name={profile.name || profile.firstName + ' ' + profile.lastName}
                                bg="#2CA58D"
                                color="white"
                            />
                            <VStack align={{ base: 'center', md: 'flex-start' }} spacing={2} flex={1}>
                                <Heading size="xl" color="#1e2738">
                                    {profile.name || `${profile.firstName} ${profile.lastName}`}
                                </Heading>
                                <HStack spacing={3}>
                                    <Badge colorScheme="teal" fontSize="md" px={4} py={1} borderRadius="full">
                                        {userType}
                                    </Badge>
                                    {profile.role && (
                                        <Badge colorScheme="blue" fontSize="md" px={4} py={1} borderRadius="full">
                                            {profile.role}
                                        </Badge>
                                    )}
                                    {profile.jobTitle && (
                                        <Badge colorScheme="blue" fontSize="md" px={4} py={1} borderRadius="full">
                                            {profile.jobTitle}
                                        </Badge>
                                    )}
                                </HStack>
                                {(profile.summary || profile.bio || profile.companyDescription) && (
                                    <Text color="gray.600" mt={2} textAlign={{ base: 'center', md: 'left' }}>
                                        {profile.summary || profile.bio || profile.companyDescription}
                                    </Text>
                                )}
                            </VStack>
                        </Flex>
                    </CardBody>
                </Card>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {/* Personal Information */}
                    <Card shadow="lg" borderRadius="2xl">
                        <CardBody p={6}>
                            <Heading size="md" color="#1e2738" mb={6}>
                                <HStack>
                                    <Icon as={FiUser} color="#2CA58D" />
                                    <Text>Personal Information</Text>
                                </HStack>
                            </Heading>
                            <VStack spacing={4} align="stretch">
                                <InfoItem icon={FiMail} label="Email" value={profile.email || profile.workEmail} />
                                <InfoItem icon={FiPhone} label="Phone" value={profile.phone} />
                                {profile.age && <InfoItem icon={FiCalendar} label="Age" value={profile.age} />}
                                {profile.gender && <InfoItem icon={FiUser} label="Gender" value={profile.gender} />}
                                {(profile.linkedin || profile.linkedinProfile) && (
                                    <InfoItem icon={FiLinkedin} label="LinkedIn" value={profile.linkedin || profile.linkedinProfile} />
                                )}
                                {profile.city && (
                                    <InfoItem icon={FiMapPin} label="Location" value={`${profile.city}${profile.state ? ', ' + profile.state : ''}${profile.country ? ', ' + profile.country : ''}`} />
                                )}
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Professional/Company Information */}
                    {userType === 'User' && (
                        <Card shadow="lg" borderRadius="2xl">
                            <CardBody p={6}>
                                <Heading size="md" color="#1e2738" mb={6}>
                                    <HStack>
                                        <Icon as={FiBriefcase} color="#2CA58D" />
                                        <Text>Professional Information</Text>
                                    </HStack>
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <InfoItem icon={FiBriefcase} label="Interested Role" value={profile.role} />
                                    <InfoItem icon={FiClock} label="Experience Level" value={profile.experience} />
                                    <InfoItem icon={FiFileText} label="Work Preferences" value={profile.workPreferences} />
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    {userType === 'Trainer' && (
                        <Card shadow="lg" borderRadius="2xl">
                            <CardBody p={6}>
                                <Heading size="md" color="#1e2738" mb={6}>
                                    <HStack>
                                        <Icon as={FiBriefcase} color="#2CA58D" />
                                        <Text>Professional Information</Text>
                                    </HStack>
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <InfoItem icon={FiAward} label="Expertise" value={profile.expertise} />
                                    <InfoItem icon={FiClock} label="Experience" value={profile.experience} />
                                    <InfoItem icon={LuGraduationCap} label="Education" value={profile.education} />
                                    <InfoItem icon={FiCalendar} label="Availability" value={profile.availability} />
                                    <InfoItem icon={FiGlobe} label="Timezone" value={profile.timezone} />
                                    {profile.portfolio && (
                                        <InfoItem icon={FiGlobe} label="Portfolio" value={profile.portfolio} />
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    {userType === 'Recruiter' && (
                        <Card shadow="lg" borderRadius="2xl">
                            <CardBody p={6}>
                                <Heading size="md" color="#1e2738" mb={6}>
                                    <HStack>
                                        <Icon as={LuBuilding2} color="#2CA58D" />
                                        <Text>Company Information</Text>
                                    </HStack>
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <InfoItem icon={LuBuilding2} label="Company" value={profile.companyName} />
                                    <InfoItem icon={FiGlobe} label="Website" value={profile.companyWebsite} />
                                    <InfoItem icon={FiUsers} label="Company Size" value={profile.companySize} />
                                    <InfoItem icon={FiBriefcase} label="Industry" value={profile.industry} />
                                    <InfoItem icon={FiMapPin} label="Address" value={profile.companyAddress} />
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    {/* Education Section - For Users */}
                    {userType === 'User' && profile.instituteName && (
                        <Card shadow="lg" borderRadius="2xl">
                            <CardBody p={6}>
                                <Heading size="md" color="#1e2738" mb={6}>
                                    <HStack>
                                        <Icon as={LuGraduationCap} color="#2CA58D" />
                                        <Text>Education</Text>
                                    </HStack>
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <InfoItem icon={LuBuilding2} label="Institute" value={profile.instituteName} />
                                    <InfoItem icon={FiBook} label="Qualification" value={profile.qualification} />
                                    {profile.graduationYear && (
                                        <InfoItem icon={FiCalendar} label="Graduation Year" value={profile.graduationYear} />
                                    )}
                                    {profile.cgpa && (
                                        <InfoItem icon={FiAward} label="CGPA" value={profile.cgpa} />
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    {/* Certifications - For Trainers */}
                    {userType === 'Trainer' && profile.certifications && (
                        <Card shadow="lg" borderRadius="2xl">
                            <CardBody p={6}>
                                <Heading size="md" color="#1e2738" mb={6}>
                                    <HStack>
                                        <Icon as={FiAward} color="#2CA58D" />
                                        <Text>Certifications</Text>
                                    </HStack>
                                </Heading>
                                <Text color="gray.700">{profile.certifications}</Text>
                            </CardBody>
                        </Card>
                    )}

                    {/* Recruiting Preferences - For Recruiters */}
                    {userType === 'Recruiter' && (
                        <Card shadow="lg" borderRadius="2xl">
                            <CardBody p={6}>
                                <Heading size="md" color="#1e2738" mb={6}>
                                    <HStack>
                                        <Icon as={FiUsers} color="#2CA58D" />
                                        <Text>Recruiting Preferences</Text>
                                    </HStack>
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <InfoItem icon={FiAward} label="Specializations" value={profile.specializations} />
                                    <InfoItem icon={FiUsers} label="Hiring Volume" value={profile.typicalHiringVolume} />
                                    <InfoItem icon={FiBriefcase} label="Budget Range" value={profile.budgetRange} />
                                    <InfoItem icon={FiClock} label="Years of Experience" value={profile.yearsOfExperience} />
                                    <InfoItem icon={FiBriefcase} label="Department" value={profile.department} />
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    {/* Accessibility Information - For Users */}
                    {userType === 'User' && profile.hasDisability === 'yes' && (
                        <Card shadow="lg" borderRadius="2xl" gridColumn={{ base: '1', lg: 'span 2' }}>
                            <CardBody p={6}>
                                <Heading size="md" color="#1e2738" mb={6}>
                                    <HStack>
                                        <Icon as={TbDisabled2} color="#2CA58D" />
                                        <Text>Accessibility & Support</Text>
                                    </HStack>
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <InfoItem icon={TbDisabled2} label="Disability Categories" value={profile.disabilityCategories} />
                                    {profile.accommodationsNeeded && (
                                        <Box>
                                            <Text fontSize="sm" color="gray.600" fontWeight="semibold" mb={2}>
                                                Workplace Accommodations Needed
                                            </Text>
                                            <Text color="gray.700">{profile.accommodationsNeeded}</Text>
                                        </Box>
                                    )}
                                    {profile.assistiveTechnologies && (
                                        <Box>
                                            <Text fontSize="sm" color="gray.600" fontWeight="semibold" mb={2}>
                                                Assistive Technologies Used
                                            </Text>
                                            <Text color="gray.700">{profile.assistiveTechnologies}</Text>
                                        </Box>
                                    )}
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    {/* Experience/Internships Section - For Users */}
                    {userType === 'User' && profile.internships && profile.internships.length > 0 && (
                        <Card shadow="lg" borderRadius="2xl" gridColumn={{ base: '1', lg: 'span 2' }}>
                            <CardBody p={6}>
                                <Heading size="md" color="#1e2738" mb={6}>
                                    <HStack>
                                        <Icon as={FiBriefcase} color="#2CA58D" />
                                        <Text>Professional Experience</Text>
                                    </HStack>
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    {profile.internships.map((internship, index) => (
                                        <Box key={index} p={4} bg="gray.50" borderRadius="xl" border="1px" borderColor="gray.200">
                                            <Heading size="sm" color="#1e2738" mb={2}>
                                                {internship.position}
                                            </Heading>
                                            <Text color="#2CA58D" fontWeight="semibold" mb={2}>
                                                {internship.companyName}
                                            </Text>
                                            {internship.duration && (
                                                <Text fontSize="sm" color="gray.600" mb={2}>
                                                    Duration: {internship.duration}
                                                </Text>
                                            )}
                                            {internship.description && (
                                                <Text color="gray.700" mb={2}>
                                                    {internship.description}
                                                </Text>
                                            )}
                                            {internship.skills && (
                                                <HStack mt={2} wrap="wrap">
                                                    {internship.skills.split(',').map((skill, idx) => (
                                                        <Badge key={idx} colorScheme="teal" px={3} py={1} borderRadius="full">
                                                            {skill.trim()}
                                                        </Badge>
                                                    ))}
                                                </HStack>
                                            )}
                                        </Box>
                                    ))}
                                </VStack>
                            </CardBody>
                        </Card>
                    )}

                    {/* Urgent Positions - For Recruiters */}
                    {userType === 'Recruiter' && profile.urgentPositions && (
                        <Card shadow="lg" borderRadius="2xl" gridColumn={{ base: '1', lg: 'span 2' }}>
                            <CardBody p={6}>
                                <Heading size="md" color="#1e2738" mb={4}>
                                    <HStack>
                                        <Icon as={FiBriefcase} color="#2CA58D" />
                                        <Text>Current Urgent Positions</Text>
                                    </HStack>
                                </Heading>
                                <Text color="gray.700">{profile.urgentPositions}</Text>
                            </CardBody>
                        </Card>
                    )}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default ProfilePage;