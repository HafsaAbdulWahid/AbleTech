import {
    Box,
    Flex,
    Text,
    Image,
    Button,
    HStack,
    VStack,
    Link,
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
    Wrap,
    WrapItem,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CalendarIcon, InfoIcon, AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState, useRef, useEffect } from "react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import axios from "axios";
import { createTechNotification } from '../utils/notificationUtils';

const API_BASE_URL = "http://localhost:3001/api/assistive-tech";

interface AssistiveTechItem {
    _id: string;
    title: string;
    category: string;
    description: string;
    features: string[];
    image: string;
    link: string;
    dateAdded: string;
    status: string;
}

export default function AssistiveTechAll() {
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
        category: "",
        description: "",
        features: "",
        image: "",
        link: "",
        status: "New"
    });

    const [assistiveTechItems, setAssistiveTechItems] = useState<AssistiveTechItem[]>([]);

    useEffect(() => {
        fetchTechnologies();
    }, []);

    const fetchTechnologies = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(API_BASE_URL);
            setAssistiveTechItems(response.data);
        } catch (error) {
            console.error("Error fetching technologies:", error);
            toast({
                title: "Error",
                description: "Failed to load assistive technologies. Please try again.",
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
            case "Vision impairment": return "orange";
            case "Hearing impairment": return "cyan";
            case "Physical/Mobility impairment": return "pink";
            case "Speech/Communication impairment": return "yellow";
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
        const item = assistiveTechItems[index];
        setEditIndex(index);
        setIsEditMode(true);
        setFormData({
            title: item.title,
            category: item.category,
            description: item.description,
            features: item.features?.join(', ') || "",
            image: item.image,
            link: item.link,
            status: item.status
        });
        onOpen();
    };

    const handleAddNew = () => {
        setIsEditMode(false);
        setEditIndex(null);
        setFormData({
            title: "",
            category: "",
            description: "",
            features: "",
            image: "",
            link: "",
            status: "New"
        });
        onOpen();
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !formData.link) {
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
            const techData = {
                title: formData.title,
                description: formData.description,
                link: formData.link,
                image: formData.image || "https://via.placeholder.com/150x100?text=No+Image",
                category: formData.category,
                features: formData.features.split(',').map(f => f.trim()).filter(f => f),
                status: formData.status
            };

            if (isEditMode && editIndex !== null) {
                // Update existing technology
                const itemToUpdate = assistiveTechItems[editIndex];
                await axios.put(`${API_BASE_URL}/${itemToUpdate._id}`, techData);

                toast({
                    title: "Technology Updated!",
                    description: `${formData.title} has been successfully updated.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            } else {
                await axios.post(API_BASE_URL, techData);

                createTechNotification(formData.title, formData.category);

                toast({
                    title: "Technology Added!",
                    description: `${formData.title} has been successfully added to the catalog.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top"
                });
            }

            await fetchTechnologies();

            setFormData({
                title: "",
                category: "",
                description: "",
                features: "",
                image: "",
                link: "",
                status: "New"
            });
            setIsEditMode(false);
            setEditIndex(null);

            onClose();
        } catch (error: any) {
            console.error("Error saving technology:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} technology. Please try again.`,
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
            const itemToDelete = assistiveTechItems[deleteIndex];

            try {
                await axios.delete(`${API_BASE_URL}/${itemToDelete._id}`);

                toast({
                    title: "Technology Deleted",
                    description: `${itemToDelete.title} has been removed from the catalog.`,
                    status: "info",
                    duration: 4000,
                    isClosable: true,
                    position: "top"
                });

                await fetchTechnologies();
                setDeleteIndex(null);
                onDeleteClose();
            } catch (error: any) {
                console.error("Error deleting technology:", error);
                toast({
                    title: "Error",
                    description: "Failed to delete technology. Please try again.",
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
            category: "",
            description: "",
            features: "",
            image: "",
            link: "",
            status: "New"
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
                        {!isLoading && assistiveTechItems.length > 0 && (
                            <VStack spacing={8} mb={12} textAlign="center">
                                <Box>
                                    <Heading
                                        fontSize="3xl"
                                        fontWeight="700"
                                        color="gray.800"
                                        mb={4}
                                        letterSpacing="tight"
                                    >
                                        Assistive Technology Solutions
                                    </Heading>
                                    <Text
                                        fontSize="lg"
                                        color="gray.600"
                                        maxW="600px"
                                        lineHeight="1.6"
                                        fontWeight="400"
                                        mb={6}
                                    >
                                        Discover cutting-edge technologies designed to enhance independence and improve quality of life
                                    </Text>
                                </Box>
                            </VStack>
                        )}

                        {/* Add Button */}
                        {!isLoading && assistiveTechItems.length > 0 && (
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
                                    Add New Technology
                                </Button>
                            </Flex>
                        )}

                        {/* Loading State */}
                        {isLoading ? (
                            <Center py={20}>
                                <Spinner size="xl" color="teal.500" thickness="4px" />
                            </Center>
                        ) : assistiveTechItems.length === 0 ? (
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
                                            No Technologies Available
                                        </Heading>
                                        <Text color="gray.600" fontSize="md" textAlign="center" maxW="400px">
                                            Start building your assistive technology catalog by adding your first technology solution.
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
                                        Add Your First Technology
                                    </Button>
                                </VStack>
                            </Center>
                        ) : (
                            /* Products Grid */
                            <Grid templateColumns="repeat(auto-fit, minmax(500px, 1fr))" gap={8}>
                                {assistiveTechItems.map((item, index) => (
                                    <GridItem key={item._id}>
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

                                            <Flex direction={{ base: "column", md: "row" }} h="full">
                                                {/* Image Section */}
                                                <Box
                                                    flex="0 0 200px"
                                                    bg="gray.50"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    p={6}
                                                    position="relative"
                                                >
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        maxW="100%"
                                                        maxH="150px"
                                                        objectFit="contain"
                                                        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
                                                        fallbackSrc="https://via.placeholder.com/150x100?text=No+Image"
                                                    />
                                                </Box>

                                                {/* Content Section */}
                                                <VStack flex="1" p={6} align="stretch" justify="space-between">
                                                    <Box>
                                                        {/* Category & Title */}
                                                        <HStack mb={3} justify="space-between" align="flex-start">
                                                            <VStack align="flex-start" spacing={1}>
                                                                <Badge
                                                                    colorScheme={getCategoryColor(item.category)}
                                                                    variant="subtle"
                                                                    fontSize="xs"
                                                                    px={2}
                                                                    py={1}
                                                                    borderRadius="md"
                                                                >
                                                                    {item.category}
                                                                </Badge>
                                                                <Heading
                                                                    as="h3"
                                                                    fontSize="xl"
                                                                    fontWeight="700"
                                                                    color="gray.800"
                                                                    lineHeight="1.3"
                                                                >
                                                                    {item.title}
                                                                </Heading>
                                                            </VStack>
                                                        </HStack>

                                                        {/* Description */}
                                                        <Text
                                                            fontSize="sm"
                                                            color="gray.600"
                                                            lineHeight="1.6"
                                                            mb={4}
                                                            noOfLines={3}
                                                        >
                                                            {item.description}
                                                        </Text>

                                                        {/* Features */}
                                                        <Wrap spacing={2} mb={4}>
                                                            {item.features?.slice(0, 3).map((feature, idx) => (
                                                                <WrapItem key={idx}>
                                                                    <Badge
                                                                        variant="outline"
                                                                        colorScheme="gray"
                                                                        fontSize="xs"
                                                                        px={2}
                                                                        py={1}
                                                                        borderRadius="md"
                                                                    >
                                                                        {feature}
                                                                    </Badge>
                                                                </WrapItem>
                                                            ))}
                                                            {item.features && item.features.length > 3 && (
                                                                <WrapItem>
                                                                    <Badge
                                                                        variant="outline"
                                                                        colorScheme="gray"
                                                                        fontSize="xs"
                                                                        px={2}
                                                                        py={1}
                                                                        borderRadius="md"
                                                                    >
                                                                        +{item.features.length - 3} more
                                                                    </Badge>
                                                                </WrapItem>
                                                            )}
                                                        </Wrap>
                                                    </Box>

                                                    {/* Footer */}
                                                    <Box>
                                                        <Divider mb={4} />
                                                        <Flex justify="space-between" align="center">
                                                            <HStack spacing={2} color="gray.500">
                                                                <Icon as={CalendarIcon} boxSize={3} />
                                                                <Text fontSize="xs" fontWeight="500">
                                                                    {formatDate(item.dateAdded)}
                                                                </Text>
                                                            </HStack>

                                                            <HStack spacing={3}>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    colorScheme="gray"
                                                                    leftIcon={<InfoIcon />}
                                                                    fontSize="xs"
                                                                    fontWeight="600"
                                                                    _hover={{ bg: "gray.100" }}
                                                                >
                                                                    Details
                                                                </Button>
                                                                <Button
                                                                    as={Link}
                                                                    href={item.link}
                                                                    isExternal
                                                                    size="sm"
                                                                    bg="linear-gradient(135deg, #2CA58D 0%, #27967F 100%)"
                                                                    color="white"
                                                                    rightIcon={<ExternalLinkIcon />}
                                                                    fontSize="xs"
                                                                    fontWeight="600"
                                                                    _hover={{
                                                                        bg: "linear-gradient(135deg, #27967F 0%, #2CA58D 100%)",
                                                                        textDecoration: "none",
                                                                        transform: "translateY(-1px)",
                                                                    }}
                                                                    _active={{
                                                                        transform: "translateY(0)",
                                                                    }}
                                                                    transition="all 0.2s"
                                                                >
                                                                    View Product
                                                                </Button>
                                                            </HStack>
                                                        </Flex>
                                                    </Box>
                                                </VStack>
                                            </Flex>
                                        </Box>
                                    </GridItem>
                                ))}
                            </Grid>
                        )}
                    </Container>

                    {/* Add/Edit Technology Modal */}
                    <Modal isOpen={isOpen} onClose={handleModalClose} size="lg">
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
                                    {isEditMode ? "Edit Technology" : "Add New Technology"}
                                </Heading>
                                <Text fontSize="sm" opacity={0.9}>
                                    {isEditMode ? "Update technology information" : "Share innovative assistive technology solutions"}
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
                                            Technology Name
                                        </FormLabel>
                                        <Input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter technology name"
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
                                            <option value="Vision impairment">Vision impairment</option>
                                            <option value="Hearing impairment">Hearing impairment</option>
                                            <option value="Physical/Mobility impairment">Physical/Mobility impairment</option>
                                            <option value="Speech/Communication impairment">Speech/Communication impairment</option>
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
                                            placeholder="Provide a detailed description of the technology"
                                            rows={3}
                                            focusBorderColor="teal.500"
                                            borderRadius="lg"
                                            bg="gray.50"
                                            _hover={{ bg: "gray.100" }}
                                            resize="vertical"
                                        />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel
                                            color="gray.700"
                                            fontWeight="600"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Key Features
                                        </FormLabel>
                                        <Textarea
                                            name="features"
                                            value={formData.features}
                                            onChange={handleInputChange}
                                            placeholder="Enter key features (separate with commas)"
                                            rows={2}
                                            focusBorderColor="teal.500"
                                            borderRadius="lg"
                                            bg="gray.50"
                                            _hover={{ bg: "gray.100" }}
                                            resize="vertical"
                                        />
                                        <Text fontSize="xs" color="gray.500" mt={1}>
                                            Example: Voice Control, Long Battery Life, Waterproof
                                        </Text>
                                    </FormControl>

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

                                    <FormControl isRequired>
                                        <FormLabel
                                            color="gray.700"
                                            fontWeight="600"
                                            fontSize="sm"
                                            mb={2}
                                        >
                                            Product Link
                                        </FormLabel>
                                        <Input
                                            name="link"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/product"
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
                                        {isEditMode ? "Update Technology" : "Add Technology"}
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
                                    Delete Technology
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Are you sure you want to delete{" "}
                                    <strong>
                                        {deleteIndex !== null ? assistiveTechItems[deleteIndex]?.title : ""}
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