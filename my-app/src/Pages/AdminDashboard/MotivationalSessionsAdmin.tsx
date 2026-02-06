import {
    Box,
    Flex,
    Text,
    Image,
    Button,
    HStack,
    VStack,
    Heading,
    Container,
    Badge,
    Grid,
    GridItem,
    Icon,
    Divider,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect } from "react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import axios from "axios";
import { createSessionNotification } from '../utils/notificationUtils';

const API_BASE_URL = "http://localhost:3001/api/motivational-sessions";

interface MotivationalSession {
    _id: string;
    title: string;
    speaker: string;
    description: string;
    date: string;
    duration: string;
    category: string;
    image: string;
    videoLink: string;
    dateAdded: string;
}

export default function MotivationalSessionsAdmin() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        speaker: "",
        description: "",
        date: "",
        duration: "",
        category: "",
        image: "",
        videoLink: ""
    });

    const [sessions, setSessions] = useState<MotivationalSession[]>([]);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(API_BASE_URL);
            setSessions(response.data);
        } catch (error) {
            console.error("Error fetching sessions:", error);
            toast({
                title: "Error",
                description: "Failed to load motivational sessions. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Career Growth": return "teal";
            case "Personal Development": return "purple";
            case "Mental Health": return "pink";
            case "Success Stories": return "orange";
            case "Leadership": return "blue";
            case "Wellness": return "green";
            default: return "gray";
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditClick = (index: number) => {
        const session = sessions[index];
        setEditIndex(index);
        setIsEditMode(true);
        setFormData({
            title: session.title,
            speaker: session.speaker,
            description: session.description,
            date: session.date,
            duration: session.duration,
            category: session.category,
            image: session.image,
            videoLink: session.videoLink
        });
        onOpen();
    };

    const handleAddNew = () => {
        setIsEditMode(false);
        setEditIndex(null);
        setFormData({
            title: "",
            speaker: "",
            description: "",
            date: "",
            duration: "",
            category: "",
            image: "",
            videoLink: ""
        });
        onOpen();
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.speaker || !formData.description || !formData.date || !formData.category) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const sessionData = {
                title: formData.title,
                speaker: formData.speaker,
                description: formData.description,
                date: formData.date,
                duration: formData.duration || "1 hour",
                category: formData.category,
                image: formData.image || "https://via.placeholder.com/400x250?text=Motivational+Session",
                videoLink: formData.videoLink
            };

            if (isEditMode && editIndex !== null) {
                const sessionToUpdate = sessions[editIndex];
                await axios.put(`${API_BASE_URL}/${sessionToUpdate._id}`, sessionData);

                toast({
                    title: "Session Updated!",
                    description: `${formData.title} has been successfully updated.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            } else {
                await axios.post(API_BASE_URL, sessionData);

                const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                createSessionNotification(formData.title, formData.speaker, formattedDate);

                toast({
                    title: "Session Added!",
                    description: `${formData.title} has been successfully added.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            }

            await fetchSessions();

            setFormData({
                title: "",
                speaker: "",
                description: "",
                date: "",
                duration: "",
                category: "",
                image: "",
                videoLink: ""
            });
            setIsEditMode(false);
            setEditIndex(null);

            onClose();
        } catch (error: any) {
            console.error("Error saving session:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} session. Please try again.`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (index: number) => {
        setDeleteIndex(index);
        onDeleteOpen();
    };

    const confirmDelete = async () => {
        if (deleteIndex !== null) {
            const sessionToDelete = sessions[deleteIndex];

            try {
                await axios.delete(`${API_BASE_URL}/${sessionToDelete._id}`);

                toast({
                    title: "Session Deleted",
                    description: `${sessionToDelete.title} has been removed.`,
                    status: "info",
                    duration: 4000,
                    isClosable: true,
                    position: "top"
                });

                await fetchSessions();
                setDeleteIndex(null);
                onDeleteClose();
            } catch (error: any) {
                console.error("Error deleting session:", error);
                toast({
                    title: "Error",
                    description: "Failed to delete session. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleModalClose = () => {
        setIsEditMode(false);
        setEditIndex(null);
        setFormData({
            title: "",
            speaker: "",
            description: "",
            date: "",
            duration: "",
            category: "",
            image: "",
            videoLink: ""
        });
        onClose();
    };

    return (
        <Box bg="gray.50" minH="100vh">
            <SideNav />
            <Box>
                <TopNav />
                <Box ml="90px">
                    <Container maxW="1400px" py={12}>
                        {/* Header Section */}
                        {!isLoading && sessions.length > 0 && (
                            <VStack spacing={8} mb={12} textAlign="center">
                                <Box>
                                    <Heading
                                        fontSize="3xl"
                                        fontWeight="700"
                                        color="gray.800"
                                        mb={4}
                                        letterSpacing="tight"
                                    >
                                        Motivational Sessions
                                    </Heading>
                                    <Text
                                        fontSize="lg"
                                        color="gray.600"
                                        maxW="600px"
                                        lineHeight="1.6"
                                        fontWeight="400"
                                        mb={6}
                                    >
                                        Inspire and empower through engaging motivational content
                                    </Text>
                                </Box>
                            </VStack>
                        )}

                        {/* Add Button */}
                        {!isLoading && sessions.length > 0 && (
                            <Flex justify="flex-end" mb={8}>
                                <Button
                                    onClick={handleAddNew}
                                    bg="linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
                                    color="white"
                                    size="md"
                                    leftIcon={<AddIcon />}
                                    px={6}
                                    py={4}
                                    fontSize="md"
                                    fontWeight="600"
                                    _hover={{
                                        bg: "linear-gradient(135deg, #27967F 0%, #2CA58D 100%)",
                                        transform: "translateY(-2px)",
                                        shadow: "xl"
                                    }}
                                    borderRadius="xl"
                                    shadow="lg"
                                    transition="all 0.3s"
                                >
                                    Add New Session
                                </Button>
                            </Flex>
                        )}

                        {/* Loading State */}
                        {isLoading ? (
                            <Center py={20}>
                                <Spinner size="xl" color="teal.500" thickness="4px" />
                            </Center>
                        ) : sessions.length === 0 ? (
                            /* Empty State */
                            <Center py={"100px"}>
                                <VStack spacing={6}>
                                    <Box
                                        bg="gray.100"
                                        borderRadius="full"
                                        p={3}
                                    >
                                        <Icon as={InfoIcon} boxSize={8} color="gray.400" />
                                    </Box>
                                    <VStack spacing={2}>
                                        <Heading size="md" color="gray.600">
                                            No Sessions Available
                                        </Heading>
                                        <Text color="gray.600" fontSize="md" textAlign="center" maxW="400px">
                                            Start inspiring others by adding the first motivational session.
                                        </Text>
                                    </VStack>
                                    <Button
                                        onClick={handleAddNew}
                                        bg="linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
                                        color="white"
                                        size="lg"
                                        leftIcon={<AddIcon />}
                                        px={8}
                                        py={6}
                                        fontSize="md"
                                        fontWeight="600"
                                        _hover={{
                                            bg: "linear-gradient(135deg, #27967F 0%, #2CA58D 100%)",
                                            transform: "translateY(-2px)",
                                            shadow: "xl"
                                        }}
                                        borderRadius="xl"
                                        shadow="lg"
                                        transition="all 0.3s"
                                    >
                                        Add First Session
                                    </Button>
                                </VStack>
                            </Center>
                        ) : (
                            /* Sessions Grid */
                            <Grid templateColumns="repeat(auto-fill, minmax(380px, 1fr))" gap={8}>
                                {sessions.map((session, index) => (
                                    <GridItem key={session._id}>
                                        <Box
                                            bg="white"
                                            borderRadius="2xl"
                                            overflow="hidden"
                                            shadow="xl"
                                            _hover={{
                                                transform: "translateY(-8px)",
                                                shadow: "2xl",
                                            }}
                                            transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            position="relative"
                                        >
                                            {/* Edit and Delete Buttons */}
                                            <HStack
                                                position="absolute"
                                                top={4}
                                                right={4}
                                                zIndex={2}
                                                spacing={2}
                                            >
                                                <Button
                                                    size="sm"
                                                    colorScheme="blue"
                                                    variant="solid"
                                                    onClick={() => handleEditClick(index)}
                                                    leftIcon={<EditIcon />}
                                                    fontSize="xs"
                                                    fontWeight="600"
                                                    _hover={{
                                                        transform: "scale(1.05)",
                                                    }}
                                                    borderRadius="lg"
                                                    shadow="md"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    colorScheme="red"
                                                    variant="solid"
                                                    onClick={() => handleDeleteClick(index)}
                                                    leftIcon={<DeleteIcon />}
                                                    fontSize="xs"
                                                    fontWeight="600"
                                                    _hover={{
                                                        transform: "scale(1.05)",
                                                    }}
                                                    borderRadius="lg"
                                                    shadow="md"
                                                >
                                                    Delete
                                                </Button>
                                            </HStack>

                                            {/* Image Section */}
                                            <Box
                                                h="200px"
                                                bg="gray.100"
                                                position="relative"
                                                overflow="hidden"
                                            >
                                                <Image
                                                    src={session.image}
                                                    alt={session.title}
                                                    w="100%"
                                                    h="100%"
                                                    objectFit="cover"
                                                    fallbackSrc="https://via.placeholder.com/400x250?text=Motivational+Session"
                                                />
                                                <Box
                                                    position="absolute"
                                                    bottom={0}
                                                    left={0}
                                                    right={0}
                                                    bgGradient="linear(to-t, blackAlpha.700, transparent)"
                                                    p={4}
                                                >
                                                    <Badge
                                                        colorScheme={getCategoryColor(session.category)}
                                                        variant="solid"
                                                        fontSize="xs"
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                    >
                                                        {session.category}
                                                    </Badge>
                                                </Box>
                                            </Box>

                                            {/* Content Section */}
                                            <VStack p={6} align="stretch" spacing={4}>
                                                {/* Title & Speaker */}
                                                <Box>
                                                    <Heading
                                                        as="h3"
                                                        fontSize="xl"
                                                        fontWeight="700"
                                                        color="gray.800"
                                                        lineHeight="1.3"
                                                        mb={2}
                                                        noOfLines={2}
                                                    >
                                                        {session.title}
                                                    </Heading>
                                                    <Text
                                                        fontSize="sm"
                                                        color="teal.600"
                                                        fontWeight="600"
                                                    >
                                                        By {session.speaker}
                                                    </Text>
                                                </Box>

                                                {/* Description */}
                                                <Text
                                                    fontSize="sm"
                                                    color="gray.600"
                                                    lineHeight="1.6"
                                                    noOfLines={3}
                                                >
                                                    {session.description}
                                                </Text>

                                                {/* Date Info */}
                                                <HStack spacing={4} color="gray.600">
                                                    <HStack spacing={1}>
                                                        <Icon as={CalendarIcon} boxSize={3} />
                                                        <Text fontSize="xs" fontWeight="500">
                                                            {formatDate(session.date)}
                                                        </Text>
                                                    </HStack>
                                                </HStack>

                                                <Divider />

                                                {/* Footer Actions */}
                                                <Flex justify="space-between" align="center">
                                                    {session.duration && (
                                                        <Text fontSize="xs" color="gray.500" fontWeight="500">
                                                            Duration: {session.duration}
                                                        </Text>
                                                    )}
                                                    {session.videoLink && (
                                                        <Button
                                                            as="a"
                                                            href={session.videoLink}
                                                            target="_blank"
                                                            size="sm"
                                                            bg="linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
                                                            color="white"
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                            _hover={{
                                                                bg: "linear-gradient(135deg, #27967F 0%, #2CA58D 100%)",
                                                                textDecoration: "none",
                                                                transform: "translateY(-1px)",
                                                            }}
                                                            transition="all 0.2s"
                                                        >
                                                            Watch Session
                                                        </Button>
                                                    )}
                                                </Flex>
                                            </VStack>
                                        </Box>
                                    </GridItem>
                                ))}
                            </Grid>
                        )}
                    </Container>

                    {/* Add/Edit Session Modal */}
                    <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
                        <ModalOverlay
                            bg="blackAlpha.600"
                            backdropFilter="blur(10px)"
                        />
                        <ModalContent
                            mx={4}
                            borderRadius="2xl"
                            overflow="hidden"
                            shadow="2xl"
                        >
                            <Box
                                bgGradient="linear(135deg, #2CA58D 0%, #27967F 100%)"
                                p={6}
                                color="white"
                            >
                                <Heading size="lg" mb={1} fontWeight="700">
                                    {isEditMode ? "Edit Session" : "Add New Session"}
                                </Heading>
                                <Text fontSize="sm" opacity={0.9}>
                                    {isEditMode ? "Update session information" : "Create an inspiring motivational session"}
                                </Text>
                            </Box>

                            <ModalCloseButton
                                color="white"
                                size="md"
                                _hover={{ bg: "whiteAlpha.200" }}
                            />

                            <ModalBody py={6} px={6}>
                                <VStack spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel
                                            color="gray.700"
                                            fontWeight="600"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Session Title
                                        </FormLabel>
                                        <Input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter session title"
                                            size="md"
                                            focusBorderColor="teal.500"
                                            borderRadius="lg"
                                            bg="gray.50"
                                            _hover={{ bg: "gray.100" }}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel
                                            color="gray.700"
                                            fontWeight="600"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Speaker Name
                                        </FormLabel>
                                        <Input
                                            name="speaker"
                                            value={formData.speaker}
                                            onChange={handleInputChange}
                                            placeholder="Enter speaker name"
                                            size="md"
                                            focusBorderColor="teal.500"
                                            borderRadius="lg"
                                            bg="gray.50"
                                            _hover={{ bg: "gray.100" }}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel
                                            color="gray.700"
                                            fontWeight="600"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Category
                                        </FormLabel>
                                        <Select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            placeholder="Select category"
                                            size="md"
                                            focusBorderColor="teal.500"
                                            borderRadius="lg"
                                            bg="gray.50"
                                            _hover={{ bg: "gray.100" }}
                                        >
                                            <option value="Career Growth">Career Growth</option>
                                            <option value="Personal Development">Personal Development</option>
                                            <option value="Mental Health">Mental Health</option>
                                            <option value="Success Stories">Success Stories</option>
                                            <option value="Leadership">Leadership</option>
                                            <option value="Wellness">Wellness</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel
                                            color="gray.700"
                                            fontWeight="600"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Description
                                        </FormLabel>
                                        <Textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Provide a detailed description of the session"
                                            rows={3}
                                            focusBorderColor="teal.500"
                                            borderRadius="lg"
                                            bg="gray.50"
                                            _hover={{ bg: "gray.100" }}
                                            resize="vertical"
                                        />
                                    </FormControl>

                                    <HStack spacing={4} w="full">
                                        <FormControl isRequired>
                                            <FormLabel
                                                color="gray.700"
                                                fontWeight="600"
                                                fontSize="sm"
                                                mb={2}
                                            >
                                                Date
                                            </FormLabel>
                                            <Input
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                type="date"
                                                size="md"
                                                focusBorderColor="teal.500"
                                                borderRadius="lg"
                                                bg="gray.50"
                                                _hover={{ bg: "gray.100" }}
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel
                                                color="gray.700"
                                                fontWeight="600"
                                                fontSize="sm"
                                                mb={2}
                                            >
                                                Duration
                                            </FormLabel>
                                            <Input
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 45 minutes"
                                                size="md"
                                                focusBorderColor="teal.500"
                                                borderRadius="lg"
                                                bg="gray.50"
                                                _hover={{ bg: "gray.100" }}
                                            />
                                        </FormControl>
                                    </HStack>

                                    <FormControl>
                                        <FormLabel
                                            color="gray.700"
                                            fontWeight="600"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Image URL
                                        </FormLabel>
                                        <Input
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/image.jpg"
                                            type="url"
                                            size="md"
                                            focusBorderColor="teal.500"
                                            borderRadius="lg"
                                            bg="gray.50"
                                            _hover={{ bg: "gray.100" }}
                                        />
                                        <Text fontSize="xs" color="gray.500" mt={1}>
                                            Leave blank for default placeholder image
                                        </Text>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel
                                            color="gray.700"
                                            fontWeight="600"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Video Link
                                        </FormLabel>
                                        <Input
                                            name="videoLink"
                                            value={formData.videoLink}
                                            onChange={handleInputChange}
                                            placeholder="https://youtube.com/watch?v=..."
                                            type="url"
                                            size="md"
                                            focusBorderColor="teal.500"
                                            borderRadius="lg"
                                            bg="gray.50"
                                            _hover={{ bg: "gray.100" }}
                                        />
                                    </FormControl>
                                </VStack>
                            </ModalBody>

                            <ModalFooter
                                bg="gray.50"
                                px={6}
                                py={4}
                                borderTop="1px solid"
                                borderColor="gray.200"
                            >
                                <HStack spacing={3} width="full" justify="flex-end">
                                    <Button
                                        variant="ghost"
                                        onClick={handleModalClose}
                                        color="gray.600"
                                        size="md"
                                        px={6}
                                        fontWeight="600"
                                        _hover={{ bg: "gray.200" }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        bg="linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
                                        color="white"
                                        onClick={handleSubmit}
                                        isLoading={isSubmitting}
                                        loadingText={isEditMode ? "Updating..." : "Adding..."}
                                        size="md"
                                        px={6}
                                        fontWeight="600"
                                        _hover={{
                                            bg: "linear-gradient(135deg, #27967F 0%, #2CA58D 100%)",
                                            transform: "translateY(-2px)",
                                            shadow: "lg"
                                        }}
                                        shadow="md"
                                        transition="all 0.3s"
                                    >
                                        {isEditMode ? "Update Session" : "Add Session"}
                                    </Button>
                                </HStack>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                    {/* Delete Confirmation Dialog */}
                    <AlertDialog
                        isOpen={isDeleteOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onDeleteClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                    Delete Session
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Are you sure you want to delete{" "}
                                    <strong>
                                        {deleteIndex !== null ? sessions[deleteIndex]?.title : ""}
                                    </strong>
                                    ? This action cannot be undone.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onDeleteClose}>
                                        Cancel
                                    </Button>
                                    <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                                        Delete
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </Box>
            </Box>
        </Box>
    );
}