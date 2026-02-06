import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Button,
  Input,
  Select,
  Text,
  FormControl,
  FormLabel,
  Box,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FaRocket, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { SessionConfig } from '../types/interview.types';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (config: SessionConfig) => void;
}

const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onClose, onLaunch }) => {
  const [role, setRole] = useState('');
  const [domain, setDomain] = useState('General');
  const [experience, setExperience] = useState('');

  const canLaunch = role.trim().length > 0;

  const handleLaunch = () => {
    if (canLaunch) {
      onLaunch({
        role: role.trim(),
        domain,
        userId: 'user_' + Date.now()
      });
      setRole('');
      setDomain('General');
      setExperience('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay
        bg="blackAlpha.800"
        backdropFilter="blur(10px)"
      />
      <ModalContent
        bg="linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)"
        color="white"
        borderRadius="2xl"
        border="2px solid"
        borderColor="rgba(44, 165, 141, 0.3)"
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.5)"
      >
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          pt={8}
          pb={4}
          textAlign="center"
        >
          <VStack spacing={2}>
            <Icon as={FaRocket} boxSize={8} color="#2CA58D" />
            <Text>Set Up Your Mock Interview</Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton
          color="gray.400"
          _hover={{ color: 'white', bg: 'rgba(255, 255, 255, 0.1)' }}
          size="lg"
          top={4}
          right={4}
        />

        <ModalBody pb={8} px={8}>
          <VStack spacing={6} align="stretch">
            {/* Role Section */}
            <Box>
              <HStack mb={4} spacing={2}>
                <Icon as={FaBriefcase} color="#2CA58D" boxSize={5} />
                <Text fontSize="lg" fontWeight="bold">
                  Position Details
                </Text>
              </HStack>

              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color="gray.300" mb={2}>
                    Target Role
                  </FormLabel>
                  <Input
                    placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    bg="rgba(45, 55, 72, 0.5)"
                    border="2px solid"
                    borderColor="rgba(44, 165, 141, 0.2)"
                    color="white"
                    size="md"
                    fontSize="md"
                    _hover={{
                      borderColor: 'rgba(44, 165, 141, 0.4)'
                    }}
                    _focus={{
                      borderColor: '#2CA58D',
                      boxShadow: '0 0 0 1px #2CA58D'
                    }}
                    _placeholder={{ color: 'gray.500' }}
                  />
                </FormControl>

                <FormControl my={2}>
                  <FormLabel fontSize="sm" color="gray.300" mb={2}>
                    Years of Experience
                  </FormLabel>
                  <Select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    bg="rgba(45, 55, 72, 0.5)"
                    border="2px solid"
                    borderColor="rgba(44, 165, 141, 0.2)"
                    color="gray.500"
                    size="md"
                    _hover={{
                      borderColor: 'rgba(44, 165, 141, 0.4)'
                    }}
                    _focus={{
                      borderColor: '#2CA58D',
                      boxShadow: '0 0 0 1px #2CA58D'
                    }}
                  >
                    <option value="">Select Experience Level</option>
                    <option value="0-1">0-1 Years (Entry Level)</option>
                    <option value="1-3">1-3 Years (Junior)</option>
                    <option value="3-5">3-5 Years (Mid-Level)</option>
                    <option value="5-8">5-8 Years (Senior)</option>
                    <option value="8+">8+ Years (Lead/Principal)</option>
                  </Select>
                </FormControl>

                <FormControl my={2}>
                  <FormLabel fontSize="sm" color="gray.300" mb={2}>
                    Knowledge Domain
                  </FormLabel>
                  <Select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    bg="rgba(45, 55, 72, 0.5)"
                    border="2px solid"
                    borderColor="rgba(44, 165, 141, 0.2)"
                    color="gray.500"
                    size="md"
                    _hover={{
                      borderColor: 'rgba(44, 165, 141, 0.4)'
                    }}
                    _focus={{
                      borderColor: '#2CA58D',
                      boxShadow: '0 0 0 1px #2CA58D'
                    }}
                  >
                    <option value="General">General Interview</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Data Science">Data Science & Analytics</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Marketing">Marketing & Growth</option>
                    <option value="Sales">Sales & Business Development</option>
                    <option value="Finance">Finance & Accounting</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Design">Design & UX</option>
                    <option value="Operations">Operations & Strategy</option>
                  </Select>
                </FormControl>
              </VStack>
            </Box>

            {/* Action Buttons */}
            <HStack spacing={4} pt={2}>
              <Button
                flex={1}
                onClick={onClose}
                variant="outline"
                borderColor="rgba(44, 165, 141, 0.3)"
                color="white"
                size="md"
                borderRadius="xl"
                _hover={{
                  bg: 'rgba(44, 165, 141, 0.1)',
                  borderColor: '#2CA58D'
                }}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                onClick={handleLaunch}
                isDisabled={!canLaunch}
                bg={canLaunch
                  ? 'linear-gradient(135deg, #2CA58D 0%, #1e7a66 100%)'
                  : 'gray.600'
                }
                color={canLaunch ? 'white' : 'gray.400'}
                size="md"
                borderRadius="xl"
                fontWeight="bold"
                _hover={canLaunch ? {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(44, 165, 141, 0.4)'
                } : {}}
                _active={canLaunch ? {
                  transform: 'translateY(0)'
                } : {}}
                _disabled={{
                  cursor: 'not-allowed',
                  opacity: 0.5
                }}
                transition="all 0.3s"
                leftIcon={<FaRocket />}
              >
                Launch Interview
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SetupModal;