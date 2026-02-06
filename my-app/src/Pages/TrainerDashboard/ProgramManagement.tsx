import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  VStack,
  HStack,
  Text,
  Flex,
  Icon,
  Grid,
  GridItem,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tooltip,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Textarea,
  Switch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
} from '@chakra-ui/react';

import {
  FiUsers,
  FiBookOpen,
  FiCheckCircle,
  FiSearch,
  FiEdit,
  FiMoreVertical,
  FiTrash2,
  FiArrowRight,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';
import TopNav from './TopNav';

interface TrainingProgram {
  id: number;
  title: string;
  description: string;
  trainer: string;
  category: string;
  level: string;
  duration: string;
  totalModules: number;
  enrolledUsers: number;
  completionRate: number;
  status: string;
  createdDate: string;
  lastUpdated: string;
  isPublished: boolean;
}

const ProgramManagement = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [programToDelete, setProgramToDelete] = useState<TrainingProgram | null>(null);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Load programs from localStorage on component mount
  useEffect(() => {
    const storedPrograms = JSON.parse(localStorage.getItem('trainingPrograms') || '[]');
    setTrainingPrograms(storedPrograms);
  }, []);

  // Save programs to localStorage whenever trainingPrograms changes
  useEffect(() => {
    localStorage.setItem('trainingPrograms', JSON.stringify(trainingPrograms));
  }, [trainingPrograms]);

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'Beginner': return 'green';
      case 'Intermediate': return 'blue';
      case 'Advanced': return 'purple';
      default: return 'gray';
    }
  };

  const filteredPrograms = trainingPrograms.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEditProgram = (program: TrainingProgram): void => {
    setSelectedProgram(program);
    onEditOpen();
  };

  const handleDeleteProgram = (program: TrainingProgram): void => {
    setProgramToDelete(program);
    onDeleteOpen();
  };

  const handleManageContent = (program: TrainingProgram): void => {
    localStorage.setItem('selectedProgramId', program.id.toString());
    navigate('/content-management');
  };

  const handleSaveEdit = (): void => {
    if (selectedProgram) {
      setTrainingPrograms(prev =>
        prev.map(program =>
          program.id === selectedProgram.id
            ? { ...selectedProgram, lastUpdated: new Date().toISOString().split('T')[0] }
            : program
        )
      );
      toast({
        title: 'Program Updated',
        description: 'Training program has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    onEditClose();
  };

  const handleConfirmDelete = (): void => {
    if (programToDelete) {
      setTrainingPrograms(prev => prev.filter(program => program.id !== programToDelete.id));
      toast({
        title: 'Program Deleted',
        description: `"${programToDelete.title}" has been deleted successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    onDeleteClose();
  };

  const totalEnrolledUsers = trainingPrograms.reduce((acc, program) => acc + program.enrolledUsers, 0);

  return (
    <Box>
      <SideNav activeNav="Program Management" />
      <Box>
        <TopNav />
       
        <Box px={6} ml="100px" mt={8} minH="calc(100vh - 64px)">
          <Box
            p={8}
            bg="white"
            borderRadius="3xl"
            mb={6}
            boxShadow="0px -4px 10px rgba(0, 0, 0, 0.05), 0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            {/* Header Box */}
            <Box bg="#2CA58D" borderRadius="xl" p={5} mb={6}>
              <Text fontSize="xl" color="white" fontWeight="bold">Program Management</Text>
              
            </Box>

            {/* Stats Cards */}
            <Grid templateColumns="2fr 1fr" gap={6} mb={6}>
              <GridItem>
                <Card
                  bg="white"
                  shadow="md"
                  border="1px"
                  borderColor="gray.100"
                  h="200px"
                  borderRadius="xl"
                  _hover={{ boxShadow: "lg" }}
                >
                  <CardBody p={6}>
                    <Flex direction="column" h="full">
                      <Flex align="center" justify="space-between" mb={4}>
                        <Box>
                          <Text fontSize="13px" color="gray.600" mb={1} fontWeight="semibold">
                            TOTAL LEARNING IMPACT
                          </Text>
                          <Text fontSize="4xl" fontWeight="bold" color="#2D3E5E">
                            {totalEnrolledUsers}
                          </Text>
                        </Box>
                        <Box
                          w={16}
                          h={16}
                          bg="#2CA58D"
                          borderRadius="xl"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={FiUsers} boxSize={8} color="white" />
                        </Box>
                      </Flex>
                     
                      <Flex align="center" mt="auto">
                        <HStack spacing={-2} mr={3}>
                          {trainingPrograms.slice(0, 5).map((program, index) => {
                            const colors = ['orange.400', 'blue.400', 'purple.400', 'red.400', 'green.400'];
                            return (
                              <Box
                                key={program.id}
                                w={8}
                                h={8}
                                bg={colors[index]}
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="2px"
                                borderColor="white"
                              >
                                <Text fontSize="10px" fontWeight="bold" color="white">
                                  {program.title.charAt(0)}
                                </Text>
                              </Box>
                            );
                          })}
                        </HStack>
                        <Text fontSize="13px" color="gray.600">
                          Active learners across all programs
                        </Text>
                      </Flex>
                    </Flex>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <VStack spacing={4} h="200px">
                  <Card
                    bg="blue.50"
                    shadow="md"
                    border="1px"
                    borderColor="gray.200"
                    w="full"
                    flex={1}
                    borderRadius="xl"
                    _hover={{ boxShadow: "lg" }}
                  >
                    <CardBody p={4}>
                      <Flex align="center" justify="space-between">
                        <Box
                          w={10}
                          h={10}
                          bg="blue.100"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={FiBookOpen} boxSize={5} color="blue.600" />
                        </Box>
                        <Box textAlign="right">
                          <Text fontSize="2xl" fontWeight="bold" color="#2D3E5E">
                            {trainingPrograms.length}
                          </Text>
                          <Text fontSize="13px" color="gray.600" fontWeight="semibold">
                            Total Programs
                          </Text>
                          <Text fontSize="10px" color="green.500">
                            +{trainingPrograms.length} created
                          </Text>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>

                  <Card
                    bg="blue.50"
                    shadow="md"
                    border="1px"
                    borderColor="gray.200"
                    w="full"
                    flex={1}
                    borderRadius="xl"
                    _hover={{ boxShadow: "lg" }}
                  >
                    <CardBody p={4}>
                      <Flex align="center" justify="space-between">
                        <Box
                          w={10}
                          h={10}
                          bg="green.100"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={FiCheckCircle} boxSize={5} color="green.600" />
                        </Box>
                        <Box textAlign="right">
                          <Text fontSize="2xl" fontWeight="bold" color="#2D3E5E">
                            {trainingPrograms.filter(p => p.status === 'Published').length}
                          </Text>
                          <Text fontSize="13px" color="gray.600" fontWeight="semibold">
                            Published
                          </Text>
                          <Text fontSize="10px" color="green.500">
                            Active programs
                          </Text>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>

                  <Card
                    bg="blue.50"
                    shadow="md"
                    border="1px"
                    borderColor="gray.200"
                    w="full"
                    flex={1}
                    borderRadius="xl"
                    _hover={{ boxShadow: "lg" }}
                  >
                    <CardBody p={4}>
                      <Flex align="center" justify="space-between">
                        <Box
                          w={10}
                          h={10}
                          bg="purple.100"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={FiUsers} boxSize={5} color="purple.600" />
                        </Box>
                        <Box textAlign="right">
                          <Text fontSize="2xl" fontWeight="bold" color="#2D3E5E">
                            {totalEnrolledUsers}
                          </Text>
                          <Text fontSize="13px" color="gray.600" fontWeight="semibold">
                            Total Enrollments
                          </Text>
                          <Text fontSize="10px" color="green.500">
                            +12 this week
                          </Text>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                </VStack>
              </GridItem>
            </Grid>

            {/* Search */}
            <Card
              bg="white"
              shadow="md"
              border="1px"
              borderColor="gray.100"
              mb={6}
              w="65.5%"
              borderRadius="xl"
              _hover={{ boxShadow: "lg" }}
            >
              <CardBody p={4}>
                <Grid templateColumns="3fr 1fr 1fr 1fr" gap={4} alignItems="end">
                  <GridItem>
                    <Text fontSize="13px" fontWeight="semibold" mb={2} color="#2D3E5E">
                      Search Programs
                    </Text>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FiSearch} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search by title, category, or trainer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        borderRadius="md"
                        fontSize="13px"
                      />
                    </InputGroup>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            {/* Training Programs Table */}
            <Card
              bg="white"
              shadow="md"
              border="1px"
              borderColor="gray.200"
              borderRadius="xl"
              _hover={{ boxShadow: "lg" }}
            >
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="#2D3E5E" fontWeight="bold">
                    Training Programs ({filteredPrograms.length})
                  </Heading>
                </Flex>
              </CardHeader>
              <CardBody p={0}>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead bg="blue.50">
                      <Tr>
                        <Th borderColor="gray.200" fontSize="13px" fontWeight="semibold" color="#2D3E5E">Program</Th>
                        <Th borderColor="gray.200" fontSize="13px" fontWeight="semibold" color="#2D3E5E">Category</Th>
                        <Th borderColor="gray.200" fontSize="13px" fontWeight="semibold" color="#2D3E5E">Level</Th>
                        <Th borderColor="gray.200" fontSize="13px" fontWeight="semibold" color="#2D3E5E">Enrolled</Th>
                        <Th borderColor="gray.200" fontSize="13px" fontWeight="semibold" color="#2D3E5E">Completion</Th>
                        <Th borderColor="gray.200" fontSize="13px" fontWeight="semibold" color="#2D3E5E">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredPrograms.length === 0 ? (
                        <Tr>
                          <Td colSpan={6} textAlign="center" py={8}>
                            <Text fontSize="13px" color="gray.500">
                              No training programs found. Create your first program to get started.
                            </Text>
                          </Td>
                        </Tr>
                      ) : (
                        filteredPrograms.map((program) => (
                          <Tr key={program.id} _hover={{ bg: 'gray.50' }}>
                            <Td borderColor="gray.100" py={4}>
                              <Flex align="center">
                                <Box
                                  w={12}
                                  h={12}
                                  bg="gray.100"
                                  borderRadius="lg"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  mr={3}
                                >
                                  <Icon as={FiBookOpen} color="gray.600" boxSize={5} />
                                </Box>
                                <Box>
                                  <Text fontWeight="semibold" fontSize="13px" color="#2D3E5E">
                                    {program.title}
                                  </Text>
                                  
                                  <Text fontSize="10px" color="gray.500">
                                    By {program.trainer}
                                  </Text>
                                </Box>
                              </Flex>
                            </Td>
                            <Td borderColor="gray.100">
                              <Badge
                                colorScheme="blue"
                                variant="subtle"
                                borderRadius="full"
                                px={3}
                                py={1}
                                fontSize="10px"
                              >
                                {program.category}
                              </Badge>
                            </Td>
                            <Td borderColor="gray.100">
                              <Badge
                                colorScheme={getLevelColor(program.level)}
                                variant="subtle"
                                borderRadius="full"
                                px={3}
                                py={1}
                                fontSize="10px"
                              >
                                {program.level}
                              </Badge>
                            </Td>
                            <Td borderColor="gray.100">
                              <Text fontSize="13px" fontWeight="semibold" color="#2D3E5E">
                                {program.enrolledUsers}
                              </Text>
                              <Text fontSize="10px" color="gray.500">
                                students
                              </Text>
                            </Td>
                            <Td borderColor="gray.100">
                              {program.completionRate > 0 ? (
                                <Text
                                  fontSize="13px"
                                  fontWeight="bold"
                                  color={program.completionRate >= 80 ? 'green.600' : program.completionRate >= 60 ? 'orange.600' : 'red.600'}
                                >
                                  {program.completionRate}%
                                </Text>
                              ) : (
                                <Text fontSize="13px" color="gray.400">
                                  N/A
                                </Text>
                              )}
                            </Td>
           
                            <Td borderColor="gray.100">
                              <HStack spacing={1}>
                                <Tooltip label="Manage Content">
                                  <IconButton
                                    aria-label="Manage content"
                                    icon={<Icon as={FiArrowRight} />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="purple"
                                    onClick={() => handleManageContent(program)}
                                  />
                                </Tooltip>
                                <Tooltip label="Edit Program">
                                  <IconButton
                                    aria-label="Edit program"
                                    icon={<Icon as={FiEdit} />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="green"
                                    onClick={() => handleEditProgram(program)}
                                  />
                                </Tooltip>
                                <Menu>
                                  <MenuButton
                                    as={IconButton}
                                    aria-label="More options"
                                    icon={<Icon as={FiMoreVertical} />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="gray"
                                  />
                                  <MenuList>
                                    <MenuItem
                                      icon={<Icon as={FiTrash2} />}
                                      color="red.600"
                                      onClick={() => handleDeleteProgram(program)}
                                      fontSize="13px"
                                    >
                                      Delete
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </HStack>
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Edit Program Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>
            <Text fontSize="lg" fontWeight="bold" color="#2D3E5E">Edit Program</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontSize="13px" fontWeight="semibold" color="#2D3E5E">Program Title</FormLabel>
                <Input
                  value={selectedProgram?.title || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? {...prev, title: e.target.value} : null)}
                  fontSize="13px"
                  borderRadius="md"
                />
              </FormControl>
             
              <FormControl>
                <FormLabel fontSize="13px" fontWeight="semibold" color="#2D3E5E">Program Description</FormLabel>
                <Textarea
                  value={selectedProgram?.description || ''}
                  onChange={(e) => setSelectedProgram(prev => prev ? {...prev, description: e.target.value} : null)}
                  fontSize="13px"
                  borderRadius="md"
                />
              </FormControl>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel fontSize="13px" fontWeight="semibold" color="#2D3E5E">Category</FormLabel>
                  <Select
                    value={selectedProgram?.category || ''}
                    onChange={(e) => setSelectedProgram(prev => prev ? {...prev, category: e.target.value} : null)}
                    fontSize="13px"
                    borderRadius="md"
                  >
                    <option value="HTML Basic">HTML Basic</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Designing">Designing</option>
                    <option value="Programming">Programming</option>
                    <option value="CSS Advanced">CSS Advanced</option>
                    <option value="JavaScript Fundamentals">JavaScript Fundamentals</option>
                    <option value="React Development">React Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
               
                <FormControl>
                  <FormLabel fontSize="13px" fontWeight="semibold" color="#2D3E5E">Level</FormLabel>
                  <Select
                    value={selectedProgram?.level || ''}
                    onChange={(e) => setSelectedProgram(prev => prev ? {...prev, level: e.target.value} : null)}
                    fontSize="13px"
                    borderRadius="md"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </Select>
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel fontSize="13px" fontWeight="semibold" color="#2D3E5E">Total Modules</FormLabel>
                <NumberInput
                  value={selectedProgram?.totalModules || 1}
                  onChange={(valueString) => setSelectedProgram(prev => prev ? {...prev, totalModules: parseInt(valueString) || 1} : null)}
                  min={1}
                  max={50}
                >
                  <NumberInputField fontSize="13px" borderRadius="md" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="publish-switch" mb="0" fontSize="13px" fontWeight="semibold" color="#2D3E5E">
                  Published
                </FormLabel>
                <Switch
                  id="publish-switch"
                  isChecked={selectedProgram?.isPublished || false}
                  onChange={(e) => setSelectedProgram(prev => prev ? {...prev, isPublished: e.target.checked, status: e.target.checked ? 'Published' : 'Draft'} : null)}
                  colorScheme="teal"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSaveEdit}
              fontSize="13px"
              borderRadius="md"
            >
              Save Changes
            </Button>
            <Button
              variant="ghost"
              onClick={onEditClose}
              fontSize="13px"
              borderRadius="md"
            >
              Cancel
            </Button>
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
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="#2D3E5E">
              Delete Program
            </AlertDialogHeader>

            <AlertDialogBody fontSize="13px" color="gray.600">
              Are you sure you want to delete "{programToDelete?.title}"?
              This action cannot be undone and will affect {programToDelete?.enrolledUsers} enrolled students.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onDeleteClose}
                fontSize="13px"
                borderRadius="md"
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmDelete}
                ml={3}
                fontSize="13px"
                borderRadius="md"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProgramManagement;
