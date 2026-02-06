import React, { createContext, useContext, ReactNode, useState, useRef } from 'react';
import VoiceAssistant from './VoiceAssistant';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Pages/UserDashboard/UserContext';

// Types
interface VoiceAssistantContextType {
    isActive: boolean;
    toggleVoiceAssistant: () => void;
    isVoiceEnabled: boolean;
    setVoiceEnabled: (enabled: boolean) => void;
    openChatbot: () => void;
    closeChatbot: () => void;
    isChatbotOpen: boolean;
    voiceSettings: VoiceSettings;
    updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
    resetVoiceSettings: () => void;
}

interface VoiceSettings {
    volume: number;
    rate: number;
    pitch: number;
    language: string;
    autoWelcome: boolean;
}

interface VoiceAssistantProviderProps {
    children: ReactNode;
    chatbotComponent?: React.ComponentType<any>;
    onChatbotToggle?: (isOpen: boolean) => void;
}

// Default voice settings (simplified)
const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
    volume: 1,
    rate: 1,
    pitch: 1,
    language: 'en-US',
    autoWelcome: true
};

// Context
const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

// Main Provider Component
export const VoiceAssistantProvider: React.FC<VoiceAssistantProviderProps> = ({
    children,
    chatbotComponent: ChatbotComponent,
    onChatbotToggle
}) => {
    const navigate = useNavigate();
    const { user } = useUser();

    // Voice settings state
    const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
        const saved = localStorage.getItem('voiceSettings');
        return saved ? JSON.parse(saved) : DEFAULT_VOICE_SETTINGS;
    });

    // Voice assistant state
    const [isVoiceEnabled, setVoiceEnabled] = useState(() => {
        const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        const userKey = `voiceAssistant_${user?.email || 'default'}`;
        const userPreference = localStorage.getItem(userKey);
        const savedPreference = localStorage.getItem('voiceAssistantEnabled');

        if (userPreference !== null) return JSON.parse(userPreference);
        if (savedPreference !== null) return JSON.parse(savedPreference);
        return isSupported;
    });

    const [isActive, setIsActive] = useState(true);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const chatbotRef = useRef<any>(null);

    // Voice settings methods
    const updateVoiceSettings = (newSettings: Partial<VoiceSettings>) => {
        const updatedSettings = { ...voiceSettings, ...newSettings };
        setVoiceSettings(updatedSettings);
        localStorage.setItem('voiceSettings', JSON.stringify(updatedSettings));
    };

    const resetVoiceSettings = () => {
        setVoiceSettings(DEFAULT_VOICE_SETTINGS);
        localStorage.setItem('voiceSettings', JSON.stringify(DEFAULT_VOICE_SETTINGS));
    };

    // Toggle voice assistant on/off
    const toggleVoiceAssistant = () => {
        const newActiveState = !isActive;
        setIsActive(newActiveState);
        setVoiceEnabled(newActiveState);

        // Save user-specific preference
        const userKey = `voiceAssistant_${user?.email || 'default'}`;
        localStorage.setItem(userKey, JSON.stringify(newActiveState));
        localStorage.setItem('voiceAssistantEnabled', JSON.stringify(newActiveState));
    };

    // Enhanced chatbot control functions
    const openChatbot = () => {
        setIsChatbotOpen(true);
        if (onChatbotToggle) {
            onChatbotToggle(true);
        }

        // Save chatbot state
        localStorage.setItem('chatbotOpen', 'true');

        // Multiple ways to open chatbot
        if (chatbotRef.current) {
            if (chatbotRef.current.open) chatbotRef.current.open();
            if (chatbotRef.current.onToggle) chatbotRef.current.onToggle();
        }

        // Dispatch events for different chatbot implementations
        const events = ['openChatbot', 'toggleChatbot', 'showChatbot'];
        events.forEach(eventName => {
            const event = new CustomEvent(eventName, {
                detail: {
                    source: 'voice',
                    timestamp: Date.now(),
                    user: user?.name || 'User'
                }
            });
            window.dispatchEvent(event);
        });

        // Try to find and trigger chatbot elements
        setTimeout(() => {
            const chatbotButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
            if (chatbotButton && !chatbotButton.disabled) {
                chatbotButton.click();
            }
        }, 100);
    };

    const closeChatbot = () => {
        setIsChatbotOpen(false);
        if (onChatbotToggle) {
            onChatbotToggle(false);
        }

        // Save chatbot state
        localStorage.setItem('chatbotOpen', 'false');

        if (chatbotRef.current) {
            if (chatbotRef.current.close) chatbotRef.current.close();
            if (chatbotRef.current.onClose) chatbotRef.current.onClose();
        }

        // Dispatch close events
        const events = ['closeChatbot', 'hideChatbot'];
        events.forEach(eventName => {
            const event = new CustomEvent(eventName, {
                detail: {
                    source: 'voice',
                    timestamp: Date.now()
                }
            });
            window.dispatchEvent(event);
        });
    };

    // Context value
    const contextValue: VoiceAssistantContextType = {
        isActive: isActive && isVoiceEnabled,
        toggleVoiceAssistant,
        isVoiceEnabled,
        setVoiceEnabled: (enabled: boolean) => {
            setVoiceEnabled(enabled);
            const userKey = `voiceAssistant_${user?.email || 'default'}`;
            localStorage.setItem(userKey, JSON.stringify(enabled));
            localStorage.setItem('voiceAssistantEnabled', JSON.stringify(enabled));
            if (!enabled) {
                setIsActive(false);
                closeChatbot(); // Close chatbot if voice is disabled
            }
        },
        openChatbot,
        closeChatbot,
        isChatbotOpen,
        voiceSettings,
        updateVoiceSettings,
        resetVoiceSettings
    };

    // Listen for external chatbot events
    React.useEffect(() => {
        const handleChatbotEvents = (event: CustomEvent) => {
            if (event.type === 'chatbotOpened') {
                setIsChatbotOpen(true);
            } else if (event.type === 'chatbotClosed') {
                setIsChatbotOpen(false);
            }
        };

        window.addEventListener('chatbotOpened' as any, handleChatbotEvents);
        window.addEventListener('chatbotClosed' as any, handleChatbotEvents);

        return () => {
            window.removeEventListener('chatbotOpened' as any, handleChatbotEvents);
            window.removeEventListener('chatbotClosed' as any, handleChatbotEvents);
        };
    }, []);

    return (
        <VoiceAssistantContext.Provider value={contextValue}>
            {children}

            {/* Render Voice Assistant only if enabled and active */}
            {isVoiceEnabled && isActive && (
                <VoiceAssistant
                    navigate={navigate}
                    user={user}
                    openChatbot={openChatbot}
                />
            )}

            {/* Render Chatbot Component if provided */}
            {ChatbotComponent && (
                <ChatbotComponent
                    ref={chatbotRef}
                    onClose={closeChatbot}
                    isOpen={isChatbotOpen}
                />
            )}
        </VoiceAssistantContext.Provider>
    );
};

// Custom hook to use Voice Assistant context
export const useVoiceAssistant = (): VoiceAssistantContextType => {
    const context = useContext(VoiceAssistantContext);
    if (context === undefined) {
        throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
    }
    return context;
};

// Voice Assistant Settings Hook (with utility functions)
export const useVoiceAssistantSettings = () => {
    const context = useVoiceAssistant();
    const { user } = useUser();

    // Check if browser supports voice features
    const getVoiceSupport = () => {
        return {
            speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
            speechSynthesis: 'speechSynthesis' in window,
            fullSupport: ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && 'speechSynthesis' in window,
            webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
            mediaDevices: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
        };
    };

    // Job search assistance methods
    const getJobFilteringHelp = () => {
        return {
            titleSearch: "You can search jobs by title - try saying 'filter by title' followed by your desired job title, then apply to suitable positions",
            locationFilter: "Filter jobs by location - say 'filter by location' and mention cities like Karachi, Lahore, Islamabad, then apply to local jobs",
            categoryFilter: "Filter by job categories - try 'IT jobs', 'Marketing jobs', 'Design jobs', etc., then apply to jobs in your field",
            experienceFilter: "Filter by experience level - say 'fresher jobs', 'experienced jobs', or 'entry level jobs', then apply accordingly",
            jobTypeFilter: "Filter by job type - try 'full time jobs', 'part time jobs', 'remote jobs', or 'freelance jobs', then apply",
            salaryFilter: "Filter by salary range - say 'filter by salary' to adjust the range and find jobs with your desired compensation"
        };
    };

    const getRecommendationHelp = () => {
        return {
            personalizedJobs: "Get job recommendations based on your profile - say 'job recommendations' or 'suitable jobs' to hear them read aloud",
            profileOptimization: "Make sure your profile is complete for better job recommendations and application success",
            skillMatching: "Jobs are recommended based on your skills and preferences in your profile",
            voiceReading: "I can read out your job recommendations - say 'read recommendations' to hear them",
            applicationGuidance: "After hearing recommendations, you can say 'apply for [job title]' or navigate to apply"
        };
    };

    const getChatbotHelp = () => {
        return {
            openChatbot: "Say 'open chatbot' or 'AI chatbot' to start chatting with our AI assistant",
            chatbotFeatures: "The AI chatbot can help with detailed job questions, application advice, and career guidance",
            voiceIntegration: "You can use voice commands to open the chatbot and then continue with text or voice",
            closeChatbot: "Close the chatbot anytime by clicking the X button or saying 'close chatbot'"
        };
    };

    const getUserSpecificHelp = () => {
        const userName = user?.name || 'User';
        const userType = user?.userType || 'job seeker';

        return {
            personalizedGreeting: `Welcome ${userName}! As a ${userType}, I can help you with job applications and recommendations`,
            profileInfo: `Your profile shows you're registered as ${userType}. Keep it updated for better job matches`,
            recommendationContext: `Based on your ${userType} profile, I'll provide relevant job recommendations and application guidance`
        };
    };

    return {
        ...context,
        voiceSupport: getVoiceSupport(),
        jobFilteringHelp: getJobFilteringHelp(),
        recommendationHelp: getRecommendationHelp(),
        chatbotHelp: getChatbotHelp(),
        userSpecificHelp: getUserSpecificHelp()
    };
};

// Chatbot Integration Hook
export const useChatbotIntegration = () => {
    const { openChatbot, closeChatbot, isChatbotOpen } = useVoiceAssistant();

    // Register chatbot component for voice control
    const registerChatbot = (chatbotRef: React.RefObject<any>) => {
        // Store reference for voice commands
        if (chatbotRef.current) {
            (window as any).voiceChatbotRef = chatbotRef.current;
        }
    };

    // Trigger chatbot opening from external components
    const triggerChatbotOpen = () => {
        openChatbot();

        // Also try direct DOM manipulation as fallback
        setTimeout(() => {
            const chatButtons = [
                '[aria-label="Open chat"]',
                '[aria-label="Open chatbot"]',
                '.chatbot-trigger',
                '#chatbot-button'
            ];

            for (const selector of chatButtons) {
                const button = document.querySelector(selector) as HTMLButtonElement;
                if (button && !button.disabled) {
                    button.click();
                    break;
                }
            }
        }, 50);
    };

    return {
        openChatbot: triggerChatbotOpen,
        closeChatbot,
        isChatbotOpen,
        registerChatbot
    };
};

// Export default as the main provider
export default VoiceAssistantProvider;
