import React, { useState, useEffect } from 'react';
import {
 Box,
 Button,
 Text,
 VStack,
 HStack,
 Table,
 Thead,
 Tbody,
 Tr,
 Th,
 Td,
 Select,
 Input,
 useToast,
 Modal,
 ModalOverlay,
 ModalContent,
 ModalHeader,
 ModalBody,
 ModalFooter,
 ModalCloseButton,
 useDisclosure,
 Divider,
 Icon,
 Flex,
 IconButton,
 InputGroup,
 InputLeftElement,
 Grid,
 GridItem,
 Avatar,
 Tooltip,
 Badge,
 Textarea,
 FormControl,
 FormLabel,
 Tabs,
 TabList,
 Tab,
 TabPanels,
 TabPanel,
 Alert,
 AlertIcon,
 Checkbox,
 SimpleGrid,
} from '@chakra-ui/react';
import { FiEye, FiDownload, FiMail, FiSearch, FiSend, FiClock, FiCheckCircle, FiUser, FiBriefcase } from 'react-icons/fi';
import SideNav from './SideNav';
import TopNav from './TopNav';
import { emailTemplates, EmailTemplate } from './emailTemplates';

interface JobApplication {
 id: number;
 jobId: number;
 jobTitle: string;
 candidateName: string;
 candidateEmail: string;
 applicationDate: string;
 status: 'Pending' | 'Shortlisted' | 'Approved' | 'Rejected';
 resume: string;
 coverLetter: string;
 experience: string;
 skills: string[];
 emailHistory?: EmailRecord[];
}

interface EmailRecord {
 id: string;
 templateType: string;
 subject: string;
 sentDate: string;
 status: 'sent' | 'opened' | 'replied';
}

const ViewJobApplications = () => {
 const toast = useToast();
 const { isOpen, onOpen, onClose } = useDisclosure();
 const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure();
 
 const [applications, setApplications] = useState<JobApplication[]>([]);
 const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
 const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
 const [filterStatus, setFilterStatus] = useState<string>('All');
 const [searchTerm, setSearchTerm] = useState<string>('');
 const [filterJob, setFilterJob] = useState<string>('All');
 
 // Email system states
 const [selectedTemplate, setSelectedTemplate] = useState<string>('');
 const [emailSubject, setEmailSubject] = useState<string>('');
 const [emailBody, setEmailBody] = useState<string>('');
 const [emailRecipient, setEmailRecipient] = useState<JobApplication | null>(null);
 const [ccEmails, setCcEmails] = useState<string>('');
 const [sendCopy, setSendCopy] = useState<boolean>(false);

 useEffect(() => {
   const sampleApplications: JobApplication[] = [
     {
       id: 1,
       jobId: 1,
       jobTitle: 'Senior Software Engineer',
       candidateName: 'John Smith',
       candidateEmail: 'john.smith@email.com',
       applicationDate: '2025-01-20',
       status: 'Pending',
       resume: 'john_smith_resume.pdf',
       coverLetter: 'john_smith_cover.pdf',
       experience: '5 years',
       skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
       emailHistory: [
         {
           id: 'email_1',
           templateType: 'Application Received',
           subject: 'Application Received - Senior Software Engineer Position',
           sentDate: '2025-01-20',
           status: 'opened'
         }
       ]
     },
     {
       id: 2,
       jobId: 1,
       jobTitle: 'Senior Software Engineer',
       candidateName: 'Sarah Johnson',
       candidateEmail: 'sarah.johnson@email.com',
       applicationDate: '2025-01-19',
       status: 'Shortlisted',
       resume: 'sarah_johnson_resume.pdf',
       coverLetter: 'sarah_johnson_cover.pdf',
       experience: '7 years',
       skills: ['React', 'Python', 'Docker', 'Kubernetes'],
       emailHistory: [
         {
           id: 'email_2',
           templateType: 'Application Received',
           subject: 'Application Received - Senior Software Engineer Position',
           sentDate: '2025-01-19',
           status: 'opened'
         },
         {
           id: 'email_3',
           templateType: 'Shortlisted for Interview',
           subject: 'Congratulations! You\'ve been shortlisted',
           sentDate: '2025-01-21',
           status: 'sent'
         }
       ]
     },
     {
       id: 3,
       jobId: 2,
       jobTitle: 'Product Manager',
       candidateName: 'Mike Wilson',
       candidateEmail: 'mike.wilson@email.com',
       applicationDate: '2025-01-18',
       status: 'Approved',
       resume: 'mike_wilson_resume.pdf',
       coverLetter: 'mike_wilson_cover.pdf',
       experience: '4 years',
       skills: ['Product Strategy', 'Analytics', 'Agile', 'Figma'],
       emailHistory: [
         {
           id: 'email_4',
           templateType: 'Job Offer',
           subject: 'Job Offer - Product Manager Position',
           sentDate: '2025-01-22',
           status: 'replied'
         }
       ]
     },
     {
       id: 4,
       jobId: 2,
       jobTitle: 'Product Manager',
       candidateName: 'Lisa Chen',
       candidateEmail: 'lisa.chen@email.com',
       applicationDate: '2025-01-17',
       status: 'Rejected',
       resume: 'lisa_chen_resume.pdf',
       coverLetter: 'lisa_chen_cover.pdf',
       experience: '2 years',
       skills: ['Product Design', 'User Research', 'SQL'],
       emailHistory: [
         {
           id: 'email_5',
           templateType: 'Application Update',
           subject: 'Update on Your Application - Product Manager Position',
           sentDate: '2025-01-23',
           status: 'sent'
         }
       ]
     },
     {
       id: 5,
       jobId: 3,
       jobTitle: 'UX Designer',
       candidateName: 'Alex Thompson',
       candidateEmail: 'alex.thompson@email.com',
       applicationDate: '2025-01-16',
       status: 'Pending',
       resume: 'alex_thompson_resume.pdf',
       coverLetter: 'alex_thompson_cover.pdf',
       experience: '3 years',
       skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
       emailHistory: []
     }
   ];
   
   setApplications(sampleApplications);
   setFilteredApplications(sampleApplications);
 }, []);

 useEffect(() => {
   let filtered = applications;

   if (filterStatus !== 'All') {
     filtered = filtered.filter(app => app.status === filterStatus);
   }

   if (filterJob !== 'All') {
     filtered = filtered.filter(app => app.jobTitle === filterJob);
   }

   if (searchTerm) {
     filtered = filtered.filter(app =>
       app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
     );
   }

   setFilteredApplications(filtered);
 }, [applications, filterStatus, searchTerm, filterJob]);

 const handleViewApplication = (application: JobApplication) => {
   setSelectedApplication(application);
   onOpen();
 };

 const handleStatusChange = (applicationId: number, newStatus: JobApplication['status']) => {
   setApplications(prev =>
     prev.map(app =>
       app.id === applicationId ? { ...app, status: newStatus } : app
     )
   );

   toast({
     title: 'Status Updated',
     description: `Application status has been updated to ${newStatus}.`,
     status: 'success',
     duration: 3000,
     isClosable: true,
   });
 };

 const handleOpenEmailModal = (application: JobApplication) => {
   setEmailRecipient(application);
   setSelectedTemplate('');
   setEmailSubject('');
   setEmailBody('');
   setCcEmails('');
   setSendCopy(false);
   onEmailOpen();
 };

 const handleTemplateChange = (templateId: string) => {
   setSelectedTemplate(templateId);
   const template = emailTemplates.find(t => t.id === templateId);
   
   if (template && emailRecipient) {
     const subject = template.subject
       .replace('{jobTitle}', emailRecipient.jobTitle)
       .replace('{candidateName}', emailRecipient.candidateName);
     
     const body = template.body
       .replace('{candidateName}', emailRecipient.candidateName)
       .replace('{jobTitle}', emailRecipient.jobTitle)
       .replace('{recruiterName}', 'Sarah Ahmed');
     
     setEmailSubject(subject);
     setEmailBody(body);
   }
 };

 const handleSendEmail = () => {
   if (!emailRecipient || !emailSubject || !emailBody) {
     toast({
       title: 'Missing Information',
       description: 'Please fill in all required fields before sending.',
       status: 'error',
       duration: 3000,
       isClosable: true,
     });
     return;
   }

   const newEmailRecord: EmailRecord = {
     id: `email_${Date.now()}`,
     templateType: emailTemplates.find(t => t.id === selectedTemplate)?.name || 'Custom Email',
     subject: emailSubject,
     sentDate: new Date().toISOString().split('T')[0],
     status: 'sent'
   };

   setApplications(prev =>
     prev.map(app =>
       app.id === emailRecipient.id
         ? {
             ...app,
             emailHistory: [...(app.emailHistory || []), newEmailRecord]
           }
         : app
     )
   );

   toast({
     title: 'Email Sent Successfully',
     description: `Professional email sent to ${emailRecipient.candidateName}`,
     status: 'success',
     duration: 3000,
     isClosable: true,
   });

   onEmailClose();
 };

 const uniqueJobs = Array.from(new Set(applications.map(app => app.jobTitle)));

 const getStatusColor = (status: string) => {
   switch (status) {
     case 'sent': return 'blue';
     case 'opened': return 'green';
     case 'replied': return 'purple';
     default: return 'gray';
   }
 };

 return (
   <Box>
     <SideNav activeNav="Job Applications" />
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
           {/* Header */}
           <Box bg="#2CA58D" borderRadius="xl" p={5} mb={6}>
             <Text fontSize="xl" color="white" fontWeight="bold">Job Applications Management</Text>
           </Box>

           {/* Filter Section */}
           <Box
             bg="fff"
             p={4}
             borderRadius="xl"
             mb={6}
             boxShadow="md"
             _hover={{ boxShadow: "lg" }}
           >
             <Grid templateColumns="2fr 1fr 1fr" gap={4} alignItems="end">
               <GridItem>
                 <Text fontSize="13px" fontWeight="semibold" mb={2} color="#2D3E5E">
                   Search Applications
                 </Text>
                 <InputGroup>
                   <InputLeftElement>
                     <Icon as={FiSearch} color="gray.400" />
                   </InputLeftElement>
                   <Input
                     placeholder="Search by candidate or job title..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     borderRadius="md"
                     fontSize="13px"
                   />
                 </InputGroup>
               </GridItem>
               <GridItem>
                 <Text fontSize="13px" fontWeight="semibold" mb={2} color="#2D3E5E">
                   Filter by Status
                 </Text>
                 <Select
                   value={filterStatus}
                   onChange={(e) => setFilterStatus(e.target.value)}
                   borderRadius="md"
                   fontSize="13px"
                 >
                   <option value="All">All Status</option>
                   <option value="Pending">Pending</option>
                   <option value="Shortlisted">Shortlisted</option>
                   <option value="Approved">Approved</option>
                   <option value="Rejected">Rejected</option>
                 </Select>
               </GridItem>
               <GridItem>
                 <Text fontSize="13px" fontWeight="semibold" mb={2} color="#2D3E5E">
                   Filter by Job
                 </Text>
                 <Select
                   value={filterJob}
                   onChange={(e) => setFilterJob(e.target.value)}
                   borderRadius="md"
                   fontSize="13px"
                 >
                   <option value="All">All Jobs</option>
                   {uniqueJobs.map(job => (
                     <option key={job} value={job}>{job}</option>
                   ))}
                 </Select>
               </GridItem>
             </Grid>
           </Box>

           {/* Applications Table */}
           <Box
             bg="fff"
             borderRadius="xl"
             boxShadow="md"
             _hover={{ boxShadow: "lg" }}
           >
             <Box p={4} borderBottom="1px" borderColor="gray.200">
               <Flex justify="space-between" align="center">
                 <Text fontSize="md" fontWeight="bold" color="#2D3E5E">
                   Applications ({filteredApplications.length})
                 </Text>
                 <Button
                   bg="#2CA58D"
                   color="white"
                   _hover={{ bg: "#249a82" }}
                   leftIcon={<Icon as={FiDownload} />}
                   size="sm"
                   borderRadius="md"
                   fontSize="10px"
                 >
                   Export Report
                 </Button>
               </Flex>
             </Box>
             <Box overflowX="auto">
               <Table variant="simple">
                 <Thead bg="blue.50">
                   <Tr>
                     <Th borderColor="gray.300" fontSize="10px">Candidate</Th>
                     <Th borderColor="gray.300" fontSize="10px">Job Position</Th>
                     <Th borderColor="gray.300" fontSize="10px">Applied Date</Th>
                     <Th borderColor="gray.300" fontSize="10px">Experience</Th>
                     <Th borderColor="gray.300" fontSize="10px">Status</Th>
                     <Th borderColor="gray.300" fontSize="10px">Email Status</Th>
                     <Th borderColor="gray.300" fontSize="10px">Actions</Th>
                   </Tr>
                 </Thead>
                 <Tbody>
                   {filteredApplications.map((application) => (
                     <Tr key={application.id} _hover={{ bg: 'gray.50' }}>
                       <Td borderColor="gray.200" py={4}>
                         <Flex align="center">
                           <Avatar 
                             size="sm" 
                             name={application.candidateName} 
                             mr={3}
                             bg="blue.500"
                           />
                           <Box>
                             <Text fontWeight="semibold" fontSize="13px">{application.candidateName}</Text>
                             <Text fontSize="10px" color="gray.500">{application.candidateEmail}</Text>
                           </Box>
                         </Flex>
                       </Td>
                       <Td borderColor="gray.200">
                         <Text fontSize="13px" fontWeight="semibold">{application.jobTitle}</Text>
                       </Td>
                       <Td borderColor="gray.200">
                         <Text fontSize="13px">{new Date(application.applicationDate).toLocaleDateString()}</Text>
                       </Td>
                       <Td borderColor="gray.200">
                         <Text fontSize="13px">{application.experience}</Text>
                       </Td>
                       <Td borderColor="gray.200">
                         <Select
                           value={application.status}
                           onChange={(e) => handleStatusChange(application.id, e.target.value as JobApplication['status'])}
                           size="sm"
                           w="140px"
                           fontSize="13px"
                         >
                           <option value="Pending">Pending</option>
                           <option value="Shortlisted">Shortlisted</option>
                           <option value="Approved">Approved</option>
                           <option value="Rejected">Rejected</option>
                         </Select>
                       </Td>
                       <Td borderColor="gray.200">
                         <HStack spacing={1}>
                           {application.emailHistory && application.emailHistory.length > 0 ? (
                             <>
                               <Badge colorScheme={getStatusColor(application.emailHistory[application.emailHistory.length - 1].status)} fontSize="9px">
                                 {application.emailHistory[application.emailHistory.length - 1].status}
                               </Badge>
                               <Text fontSize="10px" color="gray.500">
                                 ({application.emailHistory.length})
                               </Text>
                             </>
                           ) : (
                             <Badge colorScheme="gray" fontSize="9px">No emails</Badge>
                           )}
                         </HStack>
                       </Td>
                       <Td borderColor="gray.200">
                         <HStack spacing={1}>
                           <Tooltip label="View Details">
                             <IconButton
                               aria-label="View application"
                               icon={<Icon as={FiEye} />}
                               size="sm"
                               variant="ghost"
                               colorScheme="blue"
                               onClick={() => handleViewApplication(application)}
                             />
                           </Tooltip>
                           <Tooltip label="Send Professional Email">
                             <IconButton
                               aria-label="Send professional email"
                               icon={<Icon as={FiMail} />}
                               size="sm"
                               variant="ghost"
                               colorScheme="green"
                               onClick={() => handleOpenEmailModal(application)}
                             />
                           </Tooltip>
                         </HStack>
                       </Td>
                     </Tr>
                   ))}
                 </Tbody>
               </Table>
             </Box>
             
             {filteredApplications.length === 0 && (
               <Box textAlign="center" py={8}>
                 <Text color="gray.500" fontSize="13px">No applications found matching your criteria.</Text>
               </Box>
             )}
           </Box>
         </Box>
       </Box>
     </Box>

     {/* Application Detail Modal */}
     <Modal isOpen={isOpen} onClose={onClose} size="xl">
       <ModalOverlay />
       <ModalContent>
         <ModalHeader>
           <Flex align="center">
             <Avatar 
               size="md" 
               name={selectedApplication?.candidateName} 
               mr={3}
               bg="blue.500"
             />
             <Box>
               <Text fontSize="md" fontWeight="bold">{selectedApplication?.candidateName}</Text>
               <Text fontSize="13px" color="gray.500">{selectedApplication?.candidateEmail}</Text>
             </Box>
             {selectedApplication && (
               <Badge ml={3} colorScheme={selectedApplication.status === 'Pending' ? 'yellow' : selectedApplication.status === 'Shortlisted' ? 'blue' : selectedApplication.status === 'Approved' ? 'green' : 'red'} fontSize="10px">
                 {selectedApplication.status}
               </Badge>
             )}
           </Flex>
         </ModalHeader>
         <ModalCloseButton />
         <ModalBody>
           {selectedApplication && (
             <Tabs>
               <TabList>
                 <Tab fontSize="12px">Candidate Info</Tab>
                 <Tab fontSize="12px">Email History</Tab>
               </TabList>
               <TabPanels>
                 <TabPanel>
                   <VStack spacing={4} align="stretch">
                     <Box>
                       <Text fontWeight="bold" mb={2} fontSize="13px">Basic Information</Text>
                       <SimpleGrid columns={2} gap={4}>
                         <Box>
                           <Text fontSize="10px" color="gray.600">Name</Text>
                           <Text fontSize="13px" fontWeight="semibold">{selectedApplication.candidateName}</Text>
                         </Box>
                         <Box>
                           <Text fontSize="10px" color="gray.600">Email</Text>
                           <Text fontSize="13px" fontWeight="semibold">{selectedApplication.candidateEmail}</Text>
                         </Box>
                         <Box>
                           <Text fontSize="10px" color="gray.600">Experience</Text>
                           <Text fontSize="13px" fontWeight="semibold">{selectedApplication.experience}</Text>
                         </Box>
                         <Box>
                           <Text fontSize="10px" color="gray.600">Applied for</Text>
                           <Text fontSize="13px" fontWeight="semibold">{selectedApplication.jobTitle}</Text>
                         </Box>
                         <Box>
                           <Text fontSize="10px" color="gray.600">Application Date</Text>
                           <Text fontSize="13px" fontWeight="semibold">{new Date(selectedApplication.applicationDate).toLocaleDateString()}</Text>
                         </Box>
                       </SimpleGrid>
                     </Box>

                     <Divider />

                     <Box>
                       <Text fontWeight="bold" mb={2} fontSize="13px">Skills</Text>
                       <Flex wrap="wrap" gap={2}>
                         {selectedApplication.skills.map((skill, index) => (
                           <Badge key={index} colorScheme="blue" fontSize="10px">{skill}</Badge>
                         ))}
                       </Flex>
                     </Box>

                     <Divider />

                     <Box>
                       <Text fontWeight="bold" mb={2} fontSize="13px">Documents</Text>
                       <VStack spacing={2} align="stretch">
                         <HStack justify="space-between">
                           <Text fontSize="13px">Resume: {selectedApplication.resume}</Text>
                           <IconButton
                             aria-label="Download resume"
                             icon={<Icon as={FiDownload} />}
                             size="sm"
                             variant="ghost"
                             colorScheme="blue"
                           />
                         </HStack>
                         <HStack justify="space-between">
                           <Text fontSize="13px">Cover Letter: {selectedApplication.coverLetter}</Text>
                           <IconButton
                             aria-label="Download cover letter"
                             icon={<Icon as={FiDownload} />}
                             size="sm"
                             variant="ghost"
                             colorScheme="blue"
                           />
                         </HStack>
                       </VStack>
                     </Box>
                   </VStack>
                 </TabPanel>
                 <TabPanel>
                   <VStack spacing={3} align="stretch">
                     {selectedApplication.emailHistory && selectedApplication.emailHistory.length > 0 ? (
                       selectedApplication.emailHistory.map((email) => (
                         <Box key={email.id} p={3} border="1px" borderColor="gray.200" borderRadius="md">
                           <Flex justify="space-between" align="center" mb={2}>
                             <Text fontSize="13px" fontWeight="semibold">{email.subject}</Text>
                             <Badge colorScheme={getStatusColor(email.status)} fontSize="9px">
                               {email.status}
                             </Badge>
                           </Flex>
                           <Text fontSize="11px" color="gray.600">{email.templateType}</Text>
                           <Text fontSize="10px" color="gray.500">{new Date(email.sentDate).toLocaleDateString()}</Text>
                         </Box>
                       ))
                     ) : (
                       <Box textAlign="center" py={4}>
                         <Icon as={FiMail} size="24px" color="gray.400" mb={2} />
                         <Text fontSize="13px" color="gray.500">No email history available</Text>
                       </Box>
                     )}
                   </VStack>
                 </TabPanel>
               </TabPanels>
             </Tabs>
           )}
         </ModalBody>
         <ModalFooter>
           
           <Button variant="ghost" onClick={onClose} fontSize="13px">Close</Button>
         </ModalFooter>
       </ModalContent>
     </Modal>

     {/* Professional Email Modal */}
     <Modal isOpen={isEmailOpen} onClose={onEmailClose} size="2xl">
       <ModalOverlay />
       <ModalContent>
         <ModalHeader>
           <Flex align="center">
             <Icon as={FiMail} mr={3} color="#2CA58D" />
             <Box>
               <Text fontSize="md" fontWeight="bold">Send Email</Text>
               {emailRecipient && (
                 <Text fontSize="13px" color="gray.500">
                   To: {emailRecipient.candidateName} ({emailRecipient.candidateEmail})
                 </Text>
               )}
             </Box>
           </Flex>
         </ModalHeader>
         <ModalCloseButton />
         <ModalBody>
           <VStack spacing={4} align="stretch">
             {/* Email Template Selection */}
             <FormControl>
               <FormLabel fontSize="13px" fontWeight="semibold">Select Email Template</FormLabel>
               <Select
                 placeholder="Choose a template..."
                 value={selectedTemplate}
                 onChange={(e) => handleTemplateChange(e.target.value)}
                 fontSize="13px"
               >
                 {emailTemplates.map((template) => (
                   <option key={template.id} value={template.id}>
                     {template.name}
                   </option>
                 ))}
               </Select>
               
             </FormControl>

             {/* Email Subject */}
             <FormControl>
               <FormLabel fontSize="13px" fontWeight="semibold">Email Subject *</FormLabel>
               <Input
                 value={emailSubject}
                 onChange={(e) => setEmailSubject(e.target.value)}
                 placeholder="Enter email subject..."
                 fontSize="13px"
               />
             </FormControl>

             {/* Email Body */}
             <FormControl>
               <FormLabel fontSize="13px" fontWeight="semibold">Email Content *</FormLabel>
               <Textarea
                 value={emailBody}
                 onChange={(e) => setEmailBody(e.target.value)}
                 placeholder="Enter email content..."
                 rows={12}
                 fontSize="13px"
                 resize="vertical"
               />
              
             </FormControl>

             {/* Additional Options */}
             <Box p={3} bg="gray.50" borderRadius="md">
               <Text fontSize="12px" fontWeight="semibold" mb={3}>Additional Options</Text>
               <VStack spacing={3} align="stretch">
                 <FormControl>
                   <FormLabel fontSize="12px">CC Recipients (Optional)</FormLabel>
                   <Input
                     value={ccEmails}
                     onChange={(e) => setCcEmails(e.target.value)}
                     placeholder="Enter additional email addresses separated by commas"
                     fontSize="12px"
                   />
                 </FormControl>
                 
                 <Checkbox
                   isChecked={sendCopy}
                   onChange={(e) => setSendCopy(e.target.checked)}
                   fontSize="12px"
                 >
                   Send a copy to myself
                 </Checkbox>
               </VStack>
             </Box>

             {/* Email Preview Alert */}
             {emailSubject && emailBody && (
               <Alert status="info" borderRadius="md">
                 <AlertIcon />
                 <Box fontSize="12px">
                   <Text fontWeight="semibold">Email Ready to Send</Text>
                   <Text>This email will be sent through our professional email system and will be tracked for delivery and opens.</Text>
                 </Box>
               </Alert>
             )}
           </VStack>
         </ModalBody>
         <ModalFooter>
           <Button
             bg="#2CA58D"
             color="white"
             _hover={{ bg: "#249a82" }}
             leftIcon={<Icon as={FiSend} />}
             onClick={handleSendEmail}
             fontSize="13px"
             isDisabled={!emailSubject || !emailBody}
           >
             Send  Email
           </Button>
           <Button variant="ghost" onClick={onEmailClose} ml={3} fontSize="13px">
             Cancel
           </Button>
         </ModalFooter>
       </ModalContent>
     </Modal>
   </Box>
 );
};

export default ViewJobApplications;