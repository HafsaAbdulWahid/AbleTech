import { useToast } from "@chakra-ui/react";

// ==================== TYPES ====================
export interface CommandResult {
    action: string;
    target?: string;
    data?: any;
    command?: string;
}

interface User {
    name?: string;
    email?: string;
    userType?: string;
}

// ==================== ALL VOICE COMMANDS ====================
export const useAllVoiceCommands = (
    navigate: (path: string) => void,
    speak: (text: string) => Promise<void>,
    user: User | null
) => {
    const toast = useToast();

    // ==================== HELPER FUNCTIONS ====================
    
    const triggerJobFilter = async (filterType: string, filterValue: string) => {
        navigate('/all-jobs');
        setTimeout(() => {
            const event = new CustomEvent('voiceJobFilter', {
                detail: { filterType, filterValue, timestamp: Date.now() }
            });
            window.dispatchEvent(event);
        }, 1000);
    };

    const triggerSessionFilter = (filterType: string, filterValue: string) => {
        toast({
            title: `Filtering sessions`,
            description: `Showing ${filterValue === 'all' ? 'all' : filterValue} sessions`,
            status: "info",
            duration: 2000,
            isClosable: true,
            position: "top"
        });
        setTimeout(() => {
            const event = new CustomEvent('voiceSessionFilter', {
                detail: { filterType, filterValue, timestamp: Date.now() }
            });
            window.dispatchEvent(event);
        }, 500);
    };

    // ==================== CHATBOT COMMANDS ====================
    
    const processChatbotCommands = async (lowerCommand: string): Promise<CommandResult | null> => {
        // Open Chatbot
        if (lowerCommand.includes('open chatbot') || lowerCommand.includes('chatbot') || 
            lowerCommand.includes('ai chat')) {
            const openChatbot = () => {
                const openEvent = new CustomEvent('openChatbot');
                window.dispatchEvent(openEvent);
                setTimeout(() => {
                    const button = document.querySelector('[data-chatbot-trigger]') as HTMLButtonElement ||
                        document.querySelector('.chatbot-trigger') as HTMLButtonElement;
                    if (button && !document.querySelector('[aria-label="Close chat"]')) {
                        button.click();
                    }
                }, 100);
            };
            openChatbot();
            await speak("Opening chatbot");
            return { action: 'chatbot', target: 'open' };
        }

        // Close Chatbot
        if (lowerCommand.includes('close chatbot') || lowerCommand.includes('hide chatbot')) {
            const closeChatbot = () => {
                const closeEvent = new CustomEvent('closeChatbot');
                window.dispatchEvent(closeEvent);
                setTimeout(() => {
                    const closeButton = document.querySelector('[aria-label="Close chat"]') as HTMLButtonElement;
                    if (closeButton) closeButton.click();
                }, 100);
            };
            closeChatbot();
            await speak("Closing chatbot");
            return { action: 'chatbot', target: 'close' };
        }

        return null;
    };

    // ==================== NAVIGATION COMMANDS ====================
    
    const processNavigationCommands = async (lowerCommand: string): Promise<CommandResult | null> => {
        // Dashboard
        if (lowerCommand.includes('dashboard') || lowerCommand.includes('home page')) {
            navigate('/user-dashboard');
            await speak("Opening dashboard");
            return { action: 'navigate', target: 'dashboard' };
        }

        // Jobs Page
        if (lowerCommand.includes('show jobs') || lowerCommand.includes('all jobs') || 
            lowerCommand.includes('find jobs')) {
            navigate('/all-jobs');
            await speak("Showing all jobs");
            return { action: 'navigate', target: 'jobs' };
        }

        // Profile
        if (lowerCommand.includes('my profile') || lowerCommand.includes('profile')) {
            navigate('/user-profile');
            await speak("Opening your profile");
            return { action: 'navigate', target: 'profile' };
        }

        // Interview Prep
        if (lowerCommand.includes('interview') || lowerCommand.includes('practice interview')) {
            navigate('/ai-interview');
            await speak("Starting interview preparation");
            return { action: 'navigate', target: 'interview' };
        }

        // Motivational Sessions
        if (lowerCommand.includes('motivational sessions') || lowerCommand.includes('sessions')) {
            navigate('/motivational-sessions');
            await speak("Opening motivational sessions");
            return { action: 'navigate', target: 'sessions' };
        }

        // About Page
        if (lowerCommand.includes('about us') || lowerCommand.includes('about')) {
            navigate('/about');
            await speak("Opening about page");
            return { action: 'navigate', target: 'about' };
        }

        // Assistive Tech
        if (lowerCommand.includes('assistive tech') || lowerCommand.includes('technology')) {
            navigate('/assistive-tech');
            await speak("Opening assistive technology hub");
            return { action: 'navigate', target: 'tech' };
        }

        // Messages
        if (lowerCommand.includes('messages') || lowerCommand.includes('inbox')) {
            navigate('/messages');
            await speak("Opening messages");
            return { action: 'navigate', target: 'messages' };
        }

        return null;
    };

    // ==================== JOB FILTERING COMMANDS ====================
    
    const processJobFilterCommands = async (lowerCommand: string): Promise<CommandResult | null> => {
        // By Category
        if (lowerCommand.includes('design jobs') || lowerCommand.includes('designing')) {
            await triggerJobFilter('category', 'Designing');
            await speak("Showing design jobs");
            return { action: 'filter', target: 'designing' };
        }

        if (lowerCommand.includes('development jobs') || lowerCommand.includes('developer jobs')) {
            await triggerJobFilter('category', 'Development');
            await speak("Showing development jobs");
            return { action: 'filter', target: 'development' };
        }

        if (lowerCommand.includes('marketing jobs')) {
            await triggerJobFilter('category', 'Marketing');
            await speak("Showing marketing jobs");
            return { action: 'filter', target: 'marketing' };
        }

        if (lowerCommand.includes('content writing') || lowerCommand.includes('writing jobs')) {
            await triggerJobFilter('category', 'Content Writing');
            await speak("Showing writing jobs");
            return { action: 'filter', target: 'writing' };
        }

        if (lowerCommand.includes('it jobs') || lowerCommand.includes('software jobs')) {
            await triggerJobFilter('category', 'IT & Software');
            await speak("Showing IT jobs");
            return { action: 'filter', target: 'it' };
        }

        // By Location
        if (lowerCommand.includes('karachi jobs') || lowerCommand.includes('jobs in karachi')) {
            await triggerJobFilter('location', 'Karachi');
            await speak("Showing jobs in Karachi");
            return { action: 'filter', target: 'karachi' };
        }

        if (lowerCommand.includes('lahore jobs') || lowerCommand.includes('jobs in lahore')) {
            await triggerJobFilter('location', 'Lahore');
            await speak("Showing jobs in Lahore");
            return { action: 'filter', target: 'lahore' };
        }

        if (lowerCommand.includes('islamabad jobs') || lowerCommand.includes('jobs in islamabad')) {
            await triggerJobFilter('location', 'Islamabad');
            await speak("Showing jobs in Islamabad");
            return { action: 'filter', target: 'islamabad' };
        }

        // By Job Type
        if (lowerCommand.includes('remote jobs') || lowerCommand.includes('work from home')) {
            await triggerJobFilter('jobType', 'Remote');
            await speak("Showing remote jobs");
            return { action: 'filter', target: 'remote' };
        }

        if (lowerCommand.includes('full time jobs') || lowerCommand.includes('full time')) {
            await triggerJobFilter('jobType', 'Full Time');
            await speak("Showing full time jobs");
            return { action: 'filter', target: 'fulltime' };
        }

        if (lowerCommand.includes('part time jobs') || lowerCommand.includes('part time')) {
            await triggerJobFilter('jobType', 'Part Time');
            await speak("Showing part time jobs");
            return { action: 'filter', target: 'parttime' };
        }

        // By Experience Level
        if (lowerCommand.includes('fresher jobs') || lowerCommand.includes('entry level')) {
            await triggerJobFilter('experience', 'Fresher');
            await speak("Showing fresher jobs");
            return { action: 'filter', target: 'fresher' };
        }

        if (lowerCommand.includes('experienced jobs') || lowerCommand.includes('senior jobs')) {
            await triggerJobFilter('experience', 'Expert');
            await speak("Showing experienced jobs");
            return { action: 'filter', target: 'experienced' };
        }

        return null;
    };

    // ==================== SESSION FILTERING COMMANDS ====================
    
    const processSessionCommands = async (lowerCommand: string): Promise<CommandResult | null> => {
        // By Category
        if (lowerCommand.includes('mental health sessions')) {
            navigate('/motivational-sessions');
            triggerSessionFilter('category', 'Mental Health');
            await speak("Showing mental health sessions");
            return { action: 'filter', target: 'mental-health' };
        }

        if (lowerCommand.includes('life coaching sessions')) {
            navigate('/motivational-sessions');
            triggerSessionFilter('category', 'Life Coaching');
            await speak("Showing life coaching sessions");
            return { action: 'filter', target: 'life-coaching' };
        }

        if (lowerCommand.includes('inspiration sessions')) {
            navigate('/motivational-sessions');
            triggerSessionFilter('category', 'Inspiration');
            await speak("Showing inspiration sessions");
            return { action: 'filter', target: 'inspiration' };
        }

        if (lowerCommand.includes('self development sessions')) {
            navigate('/motivational-sessions');
            triggerSessionFilter('category', 'Self Development');
            await speak("Showing self development sessions");
            return { action: 'filter', target: 'self-development' };
        }

        // By Status
        if (lowerCommand.includes('live sessions')) {
            navigate('/motivational-sessions');
            triggerSessionFilter('status', 'live');
            await speak("Showing live sessions");
            return { action: 'filter', target: 'live' };
        }

        if (lowerCommand.includes('upcoming sessions')) {
            navigate('/motivational-sessions');
            triggerSessionFilter('status', 'upcoming');
            await speak("Showing upcoming sessions");
            return { action: 'filter', target: 'upcoming' };
        }

        if (lowerCommand.includes('recorded sessions')) {
            navigate('/motivational-sessions');
            triggerSessionFilter('status', 'recorded');
            await speak("Showing recorded sessions");
            return { action: 'filter', target: 'recorded' };
        }

        return null;
    };

    // ==================== REGISTRATION COMMANDS ====================
    
    const processRegistrationCommands = async (lowerCommand: string): Promise<CommandResult | null> => {
        if (lowerCommand.includes('register') || lowerCommand.includes('sign up')) {
            navigate('/register');
            await speak("Opening registration page");
            return { action: 'navigate', target: 'register' };
        }

        if (lowerCommand.includes('login') || lowerCommand.includes('sign in')) {
            navigate('/login');
            await speak("Opening login page");
            return { action: 'navigate', target: 'login' };
        }

        return null;
    };

    // ==================== INFORMATION COMMANDS ====================
    
    const processInfoCommands = async (lowerCommand: string): Promise<CommandResult | null> => {
        // Help
        if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
            await speak("I can help you navigate pages, find jobs, filter sessions, open chatbot, and answer questions. Try saying: show jobs, open chatbot, dashboard, or mental health sessions");
            return { action: 'help' };
        }

        // User Info
        if (lowerCommand.includes('my name')) {
            const name = user?.name || 'User';
            await speak(`Your name is ${name}`);
            return { action: 'info', target: 'name' };
        }

        if (lowerCommand.includes('my email')) {
            const email = user?.email || 'Not set';
            await speak(`Your email is ${email}`);
            return { action: 'info', target: 'email' };
        }

        // Time and Date
        if (lowerCommand.includes('what time')) {
            const time = new Date().toLocaleTimeString();
            await speak(`The time is ${time}`);
            return { action: 'info', target: 'time' };
        }

        if (lowerCommand.includes('what day')) {
            const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            await speak(`Today is ${day}`);
            return { action: 'info', target: 'day' };
        }

        // About AbleTech
        if (lowerCommand.includes('what is abletech')) {
            await speak("AbleTech empowers individuals of all abilities with tools and opportunities to thrive in their careers");
            return { action: 'info', target: 'abletech' };
        }

        return null;
    };

    // ==================== WELCOME TOUR ====================
    
    const startWelcomeTour = async (): Promise<CommandResult> => {
        try {
            await speak("Welcome to AbleTech! Let me show you around");
            await new Promise(resolve => setTimeout(resolve, 2000));

            navigate('/');
            await speak("We help individuals find jobs, learn skills, and grow professionally");
            await new Promise(resolve => setTimeout(resolve, 3000));

            navigate('/about');
            await speak("Our mission is to create an inclusive professional world for everyone");
            await new Promise(resolve => setTimeout(resolve, 3000));

            navigate('/');
            await speak("We offer job matching, interview preparation, motivational sessions, and assistive technology");
            await new Promise(resolve => setTimeout(resolve, 3000));

            await speak("You can say: show jobs, open chatbot, dashboard, or help to get started");
            await new Promise(resolve => setTimeout(resolve, 2000));

            navigate('/register');
            await speak("Sign up to start your journey with AbleTech");

            return { action: 'tour', target: 'completed' };
        } catch (error) {
            await speak("Tour complete. Say help for available commands");
            return { action: 'tour', target: 'error' };
        }
    };

    // ==================== MAIN COMMAND PROCESSOR ====================
    
    const processCommand = async (command: string): Promise<CommandResult> => {
        const lowerCommand = command.toLowerCase().trim();

        // Try each command category in order
        let result: CommandResult | null = null;

        // 1. Chatbot Commands (Highest Priority)
        result = await processChatbotCommands(lowerCommand);
        if (result) return result;

        // 2. Navigation Commands
        result = await processNavigationCommands(lowerCommand);
        if (result) return result;

        // 3. Job Filtering Commands
        result = await processJobFilterCommands(lowerCommand);
        if (result) return result;

        // 4. Session Commands
        result = await processSessionCommands(lowerCommand);
        if (result) return result;

        // 5. Registration Commands
        result = await processRegistrationCommands(lowerCommand);
        if (result) return result;

        // 6. Information Commands
        result = await processInfoCommands(lowerCommand);
        if (result) return result;

        // 7. Tour Command
        if (lowerCommand.includes('start tour') || lowerCommand.includes('tour')) {
            return await startWelcomeTour();
        }

        // Default response
        await speak("I didn't understand. Try saying: help, show jobs, or open chatbot");
        return { action: 'unknown', command: lowerCommand };
    };

    return { processCommand, startWelcomeTour };
};