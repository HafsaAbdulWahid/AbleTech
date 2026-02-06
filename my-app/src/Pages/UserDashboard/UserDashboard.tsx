import React, { useState, useEffect } from "react"; 
import {
  Box,
  HStack,
  Flex,
  useToast,
  Spinner,
  Center
} from '@chakra-ui/react';
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import DashboardCard from "./DashboardCard";
import AssistiveTech from "./AssistiveTech";
import Sessions from "./Sessions";
import RecommendedJobs from "./RecommendedJobs";
import ChatBot from "../Chatbot/Chatbot";

interface UserDashboardProps {
  children?: React.ReactNode;
}

export default function UserDashboard({ children }: UserDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOpenChatbot = () => {
      try {
        const tryClickChatbot = (attempts = 0) => {
          const maxAttempts = 5;
          
          const chatbotButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement ||
                               document.querySelector('.chatbot-trigger') as HTMLButtonElement ||
                               document.querySelector('#chatbot-button') as HTMLButtonElement ||
                               document.querySelector('[data-chatbot-trigger="true"]') as HTMLButtonElement;
          
          if (chatbotButton && !chatbotButton.disabled) {
            chatbotButton.click();
            console.log('Chatbot opened via voice command');
            
            // Show toast notification
            toast({
              title: "Chatbot Opened",
              description: "AI Assistant is ready to help you!",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top-right"
            });
            return true;
          }
          
          if (attempts < maxAttempts) {
            setTimeout(() => tryClickChatbot(attempts + 1), 200);
          } else {
            console.warn('Chatbot button not found after multiple attempts');
            const event = new CustomEvent('openChatbot');
            window.dispatchEvent(event);
          }
        };
        
        tryClickChatbot();
      } catch (error) {
        console.error('Voice command error:', error);
        
        toast({
          title: "Voice Command Error",
          description: "Could not open chatbot. Please try manually.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right"
        });
      }
    };

    const handleCloseChatbot = () => {
      try {
        const closeButton = document.querySelector('[aria-label="Close chat"]') as HTMLButtonElement;
        
        if (closeButton) {
          closeButton.click();
          
          toast({
            title: "Chatbot Closed",
            description: "AI Assistant session ended.",
            status: "info",
            duration: 2000,
            isClosable: true,
            position: "top-right"
          });
        } else {
          const event = new CustomEvent('closeChatbot');
          window.dispatchEvent(event);
        }
      } catch (error) {
        console.error('Voice command close error:', error);
      }
    };

    const handleToggleChatbot = () => {
      try {
        // Check if chatbot is currently open
        const closeButton = document.querySelector('[aria-label="Close chat"]') as HTMLButtonElement;
        
        if (closeButton) {
          // Chatbot is open, so close it
          handleCloseChatbot();
        } else {
          // Chatbot is closed, so open it
          handleOpenChatbot();
        }
      } catch (error) {
        console.error('Voice toggle error:', error);
      }
    };

    // Voice command events
    const voiceEvents = [
      'openChatbot', 
      'showChatbot', 
      'startChatbot',
      'aiChatbot',
      'aiAssistant',
      'openAI',
      'helpBot',
      'assistantKholo'
    ];
    
    const closeEvents = [
      'closeChatbot',
      'hideChatbot',
      'stopChatbot',
      'closeAI',
      'assistantBand'
    ];

    const toggleEvents = [
      'toggleChatbot',
      'chatbotToggle',
      'switchChatbot'
    ];

    // Add event listeners for voice commands
    voiceEvents.forEach(event => {
      window.addEventListener(event, handleOpenChatbot);
    });

    closeEvents.forEach(event => {
      window.addEventListener(event, handleCloseChatbot);
    });

    toggleEvents.forEach(event => {
      window.addEventListener(event, handleToggleChatbot);
    });

    // Speech Recognition Setup
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; 
      
      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        
        // Voice command patterns
        if (command.includes('open chatbot') || 
            command.includes('start assistant') ||
            command.includes('help me')) {
          handleOpenChatbot();
        } else if (command.includes('close chatbot') || 
                   command.includes('stop assistant')) {
          handleCloseChatbot();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      (window as any).dashboardSpeechRecognition = recognition;
    }

    // Cleanup event listeners
    return () => {
      voiceEvents.forEach(event => {
        window.removeEventListener(event, handleOpenChatbot);
      });
      closeEvents.forEach(event => {
        window.removeEventListener(event, handleCloseChatbot);
      });
      toggleEvents.forEach(event => {
        window.removeEventListener(event, handleToggleChatbot);
      });

      // Cleanup speech recognition
      if ((window as any).dashboardSpeechRecognition) {
        (window as any).dashboardSpeechRecognition.abort();
        delete (window as any).dashboardSpeechRecognition;
      }
    };
  }, [toast]);

  // Loading state
  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Center h="100vh">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#2CA58D"
            size="xl"
          />
        </Center>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Side Navigation */}
      <SideNav />
      
      {/* Main Content Area */}
      <Box>
        {/* Top Navigation */}
        <TopNav />
        
        {/* Dashboard Content */}
        <Box 
          px={6} 
          ml="100px" 
          mt={8} 
          minH="calc(100vh - 64px)"
          pb={8}
        >
          <Flex 
            justify="space-between" 
            gap={6} 
            align="start"
            direction={{ base: "column", lg: "row" }}
          >
            {/* Left Column - Main Content */}
            <Box 
              w={{ base: "100%", lg: "70%" }} 
              mb={{ base: 6, lg: 0 }}
            >
              <DashboardCard />
              <Box mt={6}>
                <RecommendedJobs />
              </Box>
            </Box>
            
            {/* Right Column - Sidebar Content */}
            <Box 
              w={{ base: "100%", lg: "28%" }}
              ml={{ base: 0, lg: 6 }}
            >
              <AssistiveTech />
              <Box mt={6}>
                <Sessions />
              </Box>
            </Box>
          </Flex>
          
          {/* Additional Content */}
          {children && (
            <Box mt={8}>
              {children}
            </Box>
          )}
        </Box>
      </Box>
      
      {/* ChatBot with voice control support */}
      <Box position="fixed" bottom="20px" right="20px" zIndex="1000">
        <ChatBot />
      </Box>
    </Box>
  );
}



