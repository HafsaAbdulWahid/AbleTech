import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FiPlay } from 'react-icons/fi';

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  videoTitle: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ isOpen, onClose, videoUrl, videoTitle }) => {
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return '';
   
    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return url;
  };

  const embedUrl = convertToEmbedUrl(videoUrl);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="6xl"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay 
        bg="blackAlpha.800" 
        backdropFilter="blur(8px)" 
      />
      <ModalContent 
        borderRadius="2xl" 
        overflow="hidden"
        maxW="1200px"
        maxH="90vh"
        bg="gray.900"
        boxShadow="2xl"
      >
        <ModalHeader 
          bg="gray.900" 
          borderBottom="1px" 
          borderColor="gray.700"
          py={4}
        >
          <HStack spacing={3}>
            <Box
              w={8}
              h={8}
              bg="green.500"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiPlay} color="white" boxSize={4} />
            </Box>
            <Text color="white" fontSize="16px" fontWeight="600" noOfLines={1}>
              {videoTitle || 'Video Player'}
            </Text>
          </HStack>
        </ModalHeader>
        
        <ModalCloseButton 
          color="white" 
          _hover={{ bg: 'whiteAlpha.200' }}
          size="lg"
          top={3}
          right={3}
        />
        
        <ModalBody p={0} bg="black">
          {embedUrl ? (
            <Box
              position="relative"
              width="100%"
              paddingBottom="56.25%"
              height="0"
              overflow="hidden"
            >
              <iframe
                src={embedUrl}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videoTitle}
              />
            </Box>
          ) : (
            <Box
              p={12}
              textAlign="center"
              bg="gray.800"
              minHeight="400px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiPlay} boxSize={16} color="gray.600" mb={4} />
              <Text color="gray.400" fontSize="lg" fontWeight="500">
                No video URL provided
              </Text>
              <Text color="gray.500" fontSize="sm" mt={2}>
                Please add a valid video link to play content
              </Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VideoPlayer;