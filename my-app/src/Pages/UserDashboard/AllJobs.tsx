import {
    Box,
    Input,
    Checkbox,
    Text,
    Stack,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Flex,
    Tag,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    IconButton,
    VStack,
    HStack,
    Badge,
    Divider,
    useCheckboxGroup,
    CheckboxGroup,
    Heading,
    InputGroup,
    InputLeftElement,
    Tooltip,
    Spinner,
    Alert,
    AlertIcon
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import { BsBookmark, BsSearch, BsBuilding, BsClock, BsCurrencyDollar, BsGeoAlt } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdFilterList, MdClear } from "react-icons/md";

interface Job {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    experience: string;
    deadline: string;
    status: string;
    datePosted: string;
    company?: string;
    salary?: string;
    category?: string;
    time?: string;
}

const JobCard = ({ job }: { job: Job }) => (
    <Box
        bg="white"
        borderRadius="16px"
        shadow="sm"
        p={6}
        w="100%"
        mb={4}
        _hover={{
            shadow: "lg",
            transform: "translateY(-2px)",
            borderColor: "#2CA58D"
        }}
        border="1px"
        borderColor="gray.200"
        transition="all 0.3s ease"
        cursor="pointer"
    >
        <Flex justify="space-between" align="start">
            <HStack align="start" spacing={4} flex={1}>
                <Box
                    boxSize="60px"
                    bg="gray.100"
                    borderRadius="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <BsBuilding size="24px" color="#2CA58D" />
                </Box>
                <Box flex={1}>
                    <HStack mb={2}>
                        <Badge
                            colorScheme="green"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="600"
                            bg="#2CA58D"
                            color="white"
                        >
                            {job.type}
                        </Badge>
                    </HStack>
                    <Heading
                        size="md"
                        mb={3}
                        color="gray.800"
                        fontWeight="700"
                        lineHeight="1.3"
                    >
                        {job.title}
                    </Heading>
                    <HStack mt={2} spacing={4} color="gray.600" fontSize="sm">
                        <HStack><Box as="span">🏢</Box><Text>{job.department || job.company}</Text></HStack>
                        <HStack><Box as="span">🕒</Box><Text>{job.type}</Text></HStack>
                        <HStack><Box as="span">💰</Box><Text>{job.salary || 'Not specified'}</Text></HStack>
                        <HStack><Box as="span">📍</Box><Text>{job.location}</Text></HStack>
                    </HStack>
                </Box>
            </HStack>
            <VStack spacing={3}>
                <Tooltip label="Save Job" placement="top">
                    <IconButton
                        aria-label="bookmark"
                        icon={<BsBookmark />}
                        variant="ghost"
                        size="lg"
                        color="gray.500"
                        _hover={{
                            color: "#2CA58D",
                            bg: "#2CA58D10"
                        }}
                    />
                </Tooltip>
                <Button
                    bg="#2CA58D"
                    color="white"
                    size="sm"
                    px={6}
                    borderRadius="8px"
                    fontWeight="600"
                    _hover={{
                        bg: "#27967F",
                        transform: "translateY(-1px)"
                    }}
                    transition="all 0.2s"
                >
                    View Details
                </Button>
            </VStack>
        </Flex>
    </Box>
);

export default function JobListingPage() {
    const [jobTitle, setJobTitle] = useState("");
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [displayedCount, setDisplayedCount] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
    const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([]);
    const [selectedDatePosted, setSelectedDatePosted] = useState<string[]>([]);
    const [salaryRange, setSalaryRange] = useState([0, 100]);

    const categories = ['Content Writing', 'IT & Software', 'Marketing', 'Designing', 'Development', 'Call Center'];
    const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Freelance'];
    const experienceLevels = ['No-experience', 'Fresher', 'Intermediate', 'Expert'];
    const datePostedOptions = ['All', 'Last Hour', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days'];
    const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Quetta", "Peshawar", "Multan", "Faisalabad", "Hyderabad"];

    const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJobTitle(e.target.value);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setJobTitle("");
        setSelectedCity("");
        setSelectedCategories([]);
        setSelectedJobTypes([]);
        setSelectedExperienceLevels([]);
        setSelectedDatePosted([]);
        setSalaryRange([0, 100]);
    };

    // Fetch jobs from database on component mount
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:3001/api/jobs", {
                    params: {
                        page: 1,
                        limit: 100, 
                    },
                });
                console.log("API Response:", response.data);
                const jobsData = response.data.data || [];
                setAllJobs(jobsData);
                setFilteredJobs(jobsData);
                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching jobs:", err.response || err.message);
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to fetch jobs. Please try again later."
                );
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Apply all filters whenever any filter changes
    useEffect(() => {
        if (allJobs.length === 0) return;

        const filtered = allJobs.filter((job) => {
            // Job title filter
            const matchesTitle = jobTitle
                ? job.title.toLowerCase().includes(jobTitle.toLowerCase())
                : true;

            // City filter
            const matchesCity = selectedCity
                ? job.location.toLowerCase().includes(selectedCity.toLowerCase())
                : true;

            // Category filter
            const matchesCategory = selectedCategories.length > 0
                ? selectedCategories.some(cat =>
                    job.department?.toLowerCase().includes(cat.toLowerCase()) ||
                    job.title.toLowerCase().includes(cat.toLowerCase()) ||
                    job.category?.toLowerCase().includes(cat.toLowerCase())
                )
                : true;

            // Job type filter
            const matchesJobType = selectedJobTypes.length > 0
                ? selectedJobTypes.some(type =>
                    job.type?.toLowerCase().includes(type.toLowerCase())
                )
                : true;

            // Experience level filter
            const matchesExperience = selectedExperienceLevels.length > 0
                ? selectedExperienceLevels.some(level =>
                    job.experience?.toLowerCase().includes(level.toLowerCase()) ||
                    job.title.toLowerCase().includes(level.toLowerCase())
                )
                : true;

            const matchesSalary = true; 

            return matchesTitle && matchesCity && matchesCategory && matchesJobType && matchesExperience && matchesSalary;
        });

        setFilteredJobs(filtered);
        setDisplayedCount(10); 
    }, [jobTitle, selectedCity, selectedCategories, selectedJobTypes, selectedExperienceLevels, selectedDatePosted, salaryRange, allJobs]);

    // Voice command listener for job filtering 
    useEffect(() => {
        const handleVoiceJobFilter = (event: CustomEvent) => {
            const { filterType, filterValue } = event.detail;
            
            switch (filterType) {
                case 'category':
                    setSelectedCategories([filterValue]);
                    break;
                case 'location':
                    setSelectedCity(filterValue);
                    break;
                case 'jobType':
                    setSelectedJobTypes([filterValue]);
                    break;
                case 'experience':
                    setSelectedExperienceLevels([filterValue]);
                    break;
                case 'salary':
                    if (filterValue === 'high') {
                        setSalaryRange([70, 100]);
                    } else if (filterValue === 'entry') {
                        setSalaryRange([0, 40]);
                    }
                    break;
                case 'combined':
                    // Handle combined filters like "design jobs in islamabad"
                    const filters = filterValue.split(',');
                    filters.forEach((filter: string) => {
                        const [type, value] = filter.split(':');
                        switch (type) {
                            case 'category':
                                setSelectedCategories([value]);
                                break;
                            case 'location':
                                setSelectedCity(value);
                                break;
                            case 'jobType':
                                setSelectedJobTypes([value]);
                                break;
                        }
                    });
                    break;
                case 'clear':
                    clearAllFilters();
                    break;
                case 'search':
                    setJobTitle(filterValue);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('voiceJobFilter', handleVoiceJobFilter as EventListener);
        
        return () => {
            window.removeEventListener('voiceJobFilter', handleVoiceJobFilter as EventListener);
        };
    }, []);

    return (
        <Box bg="#f8fafc" minH="100vh">
            <SideNav />
            <Box>
                <TopNav />
                <Box maxW="1320px" mt={2} mx="auto" p={6}>
                    <Flex gap={10} minH="100vh">
                        {/* Enhanced Sidebar */}
                        <Box
                            w="300px"
                            bg="white"
                            p={5}
                            borderRadius="20px"
                            shadow="sm"
                            border="1px"
                            borderColor="gray.200"
                            h="fit-content"
                            // position="sticky"
                            top="6"
                        >
                            <HStack justify="space-between" mb={6}>
                                <HStack>
                                    <MdFilterList size="20px" color="#2CA58D" />
                                    <Heading size="md" fontWeight="700" color="gray.800">
                                        Filters
                                    </Heading>
                                </HStack>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    leftIcon={<MdClear />}
                                    onClick={clearAllFilters}
                                    color="gray.600"
                                    _hover={{ color: "#2CA58D" }}
                                >
                                    Clear All
                                </Button>
                            </HStack>

                            <VStack spacing={5} align="stretch">
                                {/* Job Title Search */}
                                <Box>
                                    <Text fontWeight="600" mb={3} color="gray.700">
                                        Search by Job Title
                                    </Text>
                                    <InputGroup>
                                        <InputLeftElement>
                                            <BsSearch color="#2CA58D" />
                                        </InputLeftElement>
                                        <Input
                                            placeholder="Enter job title..."
                                            value={jobTitle}
                                            onChange={handleJobTitleChange}
                                            borderColor="gray.300"
                                            borderRadius="12px"
                                            _focus={{
                                                borderColor: "#2CA58D",
                                                boxShadow: "0 0 0 3px rgba(44, 165, 141, 0.1)"
                                            }}
                                        />
                                    </InputGroup>
                                </Box>

                                <Divider />

                                {/* Location Filter */}
                                <Box>
                                    <Text fontWeight="600" mb={3} color="gray.700">
                                        Location
                                    </Text>
                                    <Menu>
                                        {({ isOpen }) => (
                                            <>
                                                <MenuButton
                                                    as={Button}
                                                    rightIcon={isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                                    w="100%"
                                                    borderColor="gray.300"
                                                    variant="outline"
                                                    textAlign="left"
                                                    justifyContent="space-between"
                                                    borderRadius="12px"
                                                    _focus={{
                                                        borderColor: "#2CA58D",
                                                        boxShadow: "0 0 0 3px rgba(44, 165, 141, 0.1)"
                                                    }}
                                                >
                                                    {selectedCity || "Choose city"}
                                                </MenuButton>
                                                <MenuList borderRadius="12px" border="1px solid" borderColor="gray.200">
                                                    <MenuItem
                                                        onClick={() => setSelectedCity("")}
                                                        bg={!selectedCity ? "#2CA58D10" : "white"}
                                                        color={!selectedCity ? "#2CA58D" : "gray.700"}
                                                    >
                                                        All Cities
                                                    </MenuItem>
                                                    {cities.map(city => (
                                                        <MenuItem
                                                            key={city}
                                                            onClick={() => setSelectedCity(city)}
                                                            bg={selectedCity === city ? "#2CA58D10" : "white"}
                                                            color={selectedCity === city ? "#2CA58D" : "gray.700"}
                                                            _hover={{ bg: "#2CA58D10" }}
                                                        >
                                                            {city}
                                                        </MenuItem>
                                                    ))}
                                                </MenuList>
                                            </>
                                        )}
                                    </Menu>
                                </Box>

                                <Divider />

                                {/* Category Filter */}
                                <Box>
                                    <Text fontWeight="600" mb={3} color="gray.700">
                                        Category
                                    </Text>
                                    <CheckboxGroup
                                        value={selectedCategories}
                                        onChange={(values) => setSelectedCategories(values as string[])}
                                    >
                                        <Stack spacing={2}>
                                            {categories.map(cat => (
                                                <Checkbox
                                                    key={cat}
                                                    value={cat}
                                                    borderColor="gray.400"
                                                    colorScheme="teal"
                                                    _checked={{
                                                        "& .chakra-checkbox__control": {
                                                            bg: "#2CA58D",
                                                            borderColor: "#2CA58D"
                                                        }
                                                    }}
                                                >
                                                    <Text fontSize="sm">{cat}</Text>
                                                </Checkbox>
                                            ))}
                                        </Stack>
                                    </CheckboxGroup>
                                </Box>

                                <Divider />

                                {/* Job Type Filter */}
                                <Box>
                                    <Text fontWeight="600" mb={3} color="gray.700">
                                        Job Type
                                    </Text>
                                    <CheckboxGroup
                                        value={selectedJobTypes}
                                        onChange={(values) => setSelectedJobTypes(values as string[])}
                                    >
                                        <Stack spacing={2}>
                                            {jobTypes.map(type => (
                                                <Checkbox
                                                    key={type}
                                                    value={type}
                                                    borderColor="gray.400"
                                                    colorScheme="teal"
                                                    _checked={{
                                                        "& .chakra-checkbox__control": {
                                                            bg: "#2CA58D",
                                                            borderColor: "#2CA58D"
                                                        }
                                                    }}
                                                >
                                                    <Text fontSize="sm">{type}</Text>
                                                </Checkbox>
                                            ))}
                                        </Stack>
                                    </CheckboxGroup>
                                </Box>

                                <Divider />

                                {/* Experience Level Filter */}
                                <Box>
                                    <Text fontWeight="600" mb={3} color="gray.700">
                                        Experience Level
                                    </Text>
                                    <CheckboxGroup
                                        value={selectedExperienceLevels}
                                        onChange={(values) => setSelectedExperienceLevels(values as string[])}
                                    >
                                        <Stack spacing={2}>
                                            {experienceLevels.map(level => (
                                                <Checkbox
                                                    key={level}
                                                    value={level}
                                                    borderColor="gray.400"
                                                    colorScheme="teal"
                                                    _checked={{
                                                        "& .chakra-checkbox__control": {
                                                            bg: "#2CA58D",
                                                            borderColor: "#2CA58D"
                                                        }
                                                    }}
                                                >
                                                    <Text fontSize="sm">{level}</Text>
                                                </Checkbox>
                                            ))}
                                        </Stack>
                                    </CheckboxGroup>
                                </Box>

                                <Divider />

                                {/* Salary Range */}
                                <Box>
                                    <Text fontWeight="600" mb={3} color="gray.700">
                                        Salary Range
                                    </Text>
                                    <Slider
                                        value={salaryRange[1]}
                                        onChange={(val) => setSalaryRange([0, val])}
                                        min={0}
                                        max={100}
                                        step={5}
                                        mb={2}
                                        colorScheme="teal"
                                    >
                                        <SliderTrack bg="gray.200">
                                            <SliderFilledTrack bg="#2CA58D" />
                                        </SliderTrack>
                                        <SliderThumb bg="#2CA58D" />
                                    </Slider>
                                    <Text fontSize="sm" color="gray.600">
                                        Salary: ${salaryRange[0] * 1000} - ${salaryRange[1] * 1000}
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>

                        {/* Main Jobs Section */}
                        <Box flex={1}>
                            <Box mb={6}>
                                <HStack justify="space-between" align="center" mb={4}>
                                    <Box>
                                        <Heading size="lg" color="gray.800" fontWeight="700">
                                            Job Listings
                                        </Heading>
                                        <Text color="gray.600" mt={1}>
                                            {loading ? "Loading jobs..." : `Found ${filteredJobs.length} jobs matching your criteria`}
                                        </Text>
                                    </Box>
                                    <HStack>
                                        {(jobTitle || selectedCity || selectedCategories.length > 0 || selectedJobTypes.length > 0) && (
                                            <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                                                {[jobTitle, selectedCity, ...selectedCategories, ...selectedJobTypes]
                                                    .filter(Boolean).length} filters applied
                                            </Badge>
                                        )}
                                    </HStack>
                                </HStack>
                            </Box>

                            {loading ? (
                                <Box textAlign="center" py={10}>
                                    <Spinner size="xl" color="#2CA58D" />
                                    <Text mt={4} color="gray.600">Loading jobs from database...</Text>
                                </Box>
                            ) : error ? (
                                <Alert status="error" borderRadius="12px">
                                    <AlertIcon />
                                    {error}
                                </Alert>
                            ) : filteredJobs.length > 0 ? (
                                <VStack spacing={3} align="stretch">
                                    {filteredJobs.slice(0, displayedCount).map((job) => (
                                        <JobCard key={job._id} job={job} />
                                    ))}
                                    {filteredJobs.length > displayedCount && (
                                        <Box textAlign="center" my={3}>
                                            <Button
                                                onClick={() => setDisplayedCount(displayedCount + 10)}
                                                bg="#2CA58D"
                                                color="white"
                                                size="lg"
                                                px={8}
                                                borderRadius="12px"
                                                fontWeight="600"
                                                _hover={{
                                                    bg: "#27967F",
                                                    transform: "translateY(-2px)"
                                                }}
                                                transition="all 0.2s"
                                            >
                                                Load More Jobs ({filteredJobs.length - displayedCount} remaining)
                                            </Button>
                                        </Box>
                                    )}
                                </VStack>
                            ) : (
                                <Box
                                    textAlign="center"
                                    py={16}
                                    bg="white"
                                    borderRadius="20px"
                                    border="1px solid"
                                    borderColor="gray.200"
                                >
                                    <Text fontSize="xl" fontWeight="600" color="gray.600" mb={2}>
                                        No jobs found
                                    </Text>
                                    <Text color="gray.500" mb={4}>
                                        Try adjusting your filters to see more results
                                    </Text>
                                    <Button
                                        onClick={clearAllFilters}
                                        variant="outline"
                                        borderColor="#2CA58D"
                                        color="#2CA58D"
                                        _hover={{ bg: "#2CA58D10" }}
                                    >
                                        Clear All Filters
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
}