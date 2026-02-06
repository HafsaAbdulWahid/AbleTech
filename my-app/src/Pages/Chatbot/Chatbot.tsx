import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    IconButton,
    VStack,
    HStack,
    Input,
    Text,
    useDisclosure,
    Slide,
    Spinner,
} from "@chakra-ui/react";
import { FaComments, FaPaperPlane, FaTimes, FaRobot } from "react-icons/fa";

interface Message {
    sender: "user" | "bot";
    text: string;
}

export default function ChatBot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onToggle, onClose } = useDisclosure();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setMessages([{
                sender: "bot",
                text: "Hello! I'm AbleTech AI Assistant. How can I help you today?"
            }]);
        }
    }, [isOpen]);

    const handleClose = () => {
        onClose();
        setMessages([]);
        setInput("");
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: "user", text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:3001/api/chatbot/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    message: userMessage.text,
                    userId: "12345"
                }),
            });

            if (res.ok) {
                const data = await res.json();

                if (data.reply) {
                    const botMessage: Message = {
                        sender: "bot",
                        text: data.reply 
                    };
                    setMessages(prev => [...prev, botMessage]);
                } else {
                    throw new Error("No reply received from server");
                }
            } else {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
        } catch (error) {
            const errorMessage: Message = {
                sender: "bot",
                text: "Sorry, I'm having connection issues. Please try again."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Updated function to render formatted text properly
    const renderFormattedText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // Bold text
                return (
                    <Text as="span" key={index} fontWeight="bold">
                        {part.slice(2, -2)}
                    </Text>
                );
            } else if (part.includes('*') && !part.includes('**')) {
                // Handle single asterisks for italic
                const italicParts = part.split(/(\*.*?\*)/g);
                return italicParts.map((italicPart, italicIndex) => {
                    if (italicPart.startsWith('*') && italicPart.endsWith('*') && !italicPart.includes('**')) {
                        return (
                            <Text as="span" key={`${index}-${italicIndex}`} fontStyle="italic">
                                {italicPart.slice(1, -1)}
                            </Text>
                        );
                    }
                    return italicPart;
                });
            }
            return part;
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {!isOpen && (
                <IconButton
                    icon={<FaComments />}
                    bg="#2CA58D"
                    color="white"
                    _hover={{ bg: "#27967F" }}
                    borderRadius="full"
                    size="lg"
                    position="fixed"
                    bottom={6}
                    right={6}
                    onClick={onToggle}
                    aria-label="Open chat"
                    shadow="xl"
                    zIndex={1000}
                />
            )}

            {isOpen && (
                <Slide direction="bottom" in={isOpen}>
                    <Box
                        position="fixed"
                        bottom="20px"
                        right="20px"
                        w="400px"
                        h="590px"
                        bg="white"
                        shadow="2xl"
                        borderRadius="xl"
                        overflow="hidden"
                        border="1px solid"
                        borderColor="gray.300"
                        zIndex={999}
                    >
                        <Box bg="#1e2738" color="white" p={4}>
                            <HStack justify="space-between" align="center">
                                <HStack spacing={3}>
                                    <Box bg="#2CA58D" p={2} borderRadius="full">
                                        <FaRobot size={16} />
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold" fontSize="md">
                                            AbleTech AI Assistant
                                        </Text>
                                        <Text fontSize="xs" color="gray.300">
                                            Online • Ready to help
                                        </Text>
                                    </VStack>
                                </HStack>
                                <IconButton
                                    icon={<FaTimes />}
                                    size="sm"
                                    variant="ghost"
                                    color="white"
                                    _hover={{ bg: "rgba(255,255,255,0.1)" }}
                                    onClick={handleClose}
                                    aria-label="Close chat"
                                />
                            </HStack>
                        </Box>

                        <VStack spacing={4} p={5} overflowY="auto" h="440px" bg="gray.50" align="stretch">
                            {messages.map((msg, index) => (
                                <HStack
                                    key={index}
                                    justify={msg.sender === "user" ? "flex-end" : "flex-start"}
                                    align="flex-start"
                                    spacing={3}
                                >
                                    {msg.sender === "bot" && (
                                        <Box
                                            bg="#2CA58D"
                                            p={1.5}
                                            borderRadius="full"
                                            minW="32px"
                                            h="32px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            mt={1}
                                        >
                                            <FaRobot size={14} color="white" />
                                        </Box>
                                    )}
                                    <Box
                                        bg={msg.sender === "user" ? "#2CA58D" : "white"}
                                        color={msg.sender === "user" ? "white" : "#1e2738"}
                                        px={4}
                                        py={3}
                                        borderRadius="xl"
                                        maxW="75%"
                                        whiteSpace="pre-wrap"
                                        shadow="sm"
                                        border="1px solid"
                                        borderColor={msg.sender === "user" ? "transparent" : "gray.200"}
                                        position="relative"
                                    >
                                        <Text fontSize="sm" lineHeight="1.5">
                                            {msg.sender === "bot" ? renderFormattedText(msg.text) : msg.text}
                                        </Text>
                                    </Box>
                                </HStack>
                            ))}

                            {isLoading && (
                                <HStack justify="flex-start" align="flex-start" spacing={3}>
                                    <Box
                                        bg="#2CA58D"
                                        p={1.5}
                                        borderRadius="full"
                                        minW="32px"
                                        h="32px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <FaRobot size={14} color="white" />
                                    </Box>
                                    <Box 
                                        bg="white" 
                                        px={4} 
                                        py={3} 
                                        borderRadius="xl"
                                        border="1px solid"
                                        borderColor="gray.200"
                                        shadow="sm"
                                    >
                                        <HStack spacing={2}>
                                            <Spinner size="xs" color="#2CA58D" />
                                            <Text fontSize="sm" color="gray.600">
                                                Thinking...
                                            </Text>
                                        </HStack>
                                    </Box>
                                </HStack>
                            )}

                            <div ref={messagesEndRef} />
                        </VStack>

                        <Box bg="white" height={"30px"} borderTop="1px solid" borderColor="gray.200">
                            <Box p={4}>
                                <HStack spacing={3}>
                                    <Input
                                        placeholder="Type your message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={isLoading}
                                        size="md"
                                        borderRadius="full"
                                        border="2px solid"
                                        borderColor="gray.200"
                                        _focus={{ borderColor: "#2CA58D", boxShadow: "0 0 0 1px #2CA58D" }}
                                        _hover={{ borderColor: "gray.300" }}
                                        bg="gray.50"
                                        px={4}
                                    />
                                    <IconButton
                                        icon={<FaPaperPlane />}
                                        bg="#2CA58D"
                                        color="white"
                                        _hover={{ bg: "#27967F" }}
                                        _active={{ bg: "#239870" }}
                                        onClick={sendMessage}
                                        disabled={isLoading || !input.trim()}
                                        aria-label="Send message"
                                        size="md"
                                        borderRadius="full"
                                        shadow="md"
                                    />
                                </HStack>
                            </Box>
                        </Box>
                    </Box>
                </Slide>
            )}
        </>
    );
}