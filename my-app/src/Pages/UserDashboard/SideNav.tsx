import {
  Box,
  Button,
  Text,
  VStack,
  Stack,
  Spinner,
  Spacer,
  Icon,
  Image,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  FiUsers,
  FiBookOpen,
  FiBarChart,
  FiHome,
  FiTarget,
  FiLogOut,
  FiBriefcase,
} from 'react-icons/fi';
import { BsFillSignRailroadFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";

import { IconType } from 'react-icons';
import Logo from "../../Images/Logo.png";

interface NavItemProps {
  icon: IconType;
  label: string;
  active: boolean;
  onClick: () => void;
}
interface SideNavProps {
  activeNav?: string;
}

const SideNav = ({ activeNav: propActiveNav }: SideNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalActiveNav, setInternalActiveNav] = useState<string>("Dashboard");
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const getActiveNavFromRoute = (pathname: string): string => {
    switch (pathname) {
      case '/user-dashboard':
        return 'Dashboard';
      case '/all-jobs':
        return 'My Jobs';
      case '/user-training-programs':
        return 'Training Programs';
      case '/ai-interview':
        return 'AI Interview';
      case '/community-forum':
        return 'Community Forum';
      default:
        return 'Dashboard';
    }
  };

  const activeNav = propActiveNav || getActiveNavFromRoute(location.pathname) || internalActiveNav;

  const handleNav = (label: string, path: string): void => {
    setInternalActiveNav(label);

    if (label === "Log Out") {
      setIsLoggingOut(true);
      setTimeout(() => {
        setIsLoggingOut(false);
        navigate("/");
      }, 2000);
    } else {
      navigate(path);
    }
  };

  const NavItem = ({ icon, label, active, onClick }: NavItemProps) => {
    return (
      <Box w="full" position="relative" px={2}>
        <Box
          position="absolute"
          left={0}
          top="50%"
          transform="translateY(-50%)"
          bg="yellow.400"
          w="6px"
          h="40px"
          borderRadius="0 4px 4px 0"
          opacity={active ? 1 : 0}
          transition="opacity 0.3s ease"
          zIndex={1}
        />
        <Box
          position="absolute"
          right={0}
          top="50%"
          transform="translateY(-50%)"
          bg="yellow.400"
          w="6px"
          h="40px"
          borderRadius="4px 0 0 4px"
          opacity={active ? 1 : 0}
          transition="opacity 0.3s ease"
          zIndex={1}
        />
        <Button
          onClick={onClick}
          variant="ghost"
          justifyContent="center"
          w="full"
          color="white"
          fontSize="11px"
          flexDirection="column"
          _hover={{ bg: "none" }}
          position="relative"
          zIndex={2}
        >
          <Icon as={icon} boxSize={5} mb={1} />
          <Text fontSize="10px" fontWeight="normal" textAlign="center" lineHeight="short">
            {label}
          </Text>
        </Button>
      </Box>
    );
  };

  return (
    <Box
      w="90px"
      h="100vh"
      bg="#1e2738"
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={1}
      color="white"
      position="fixed"
      left={0}
      top={0}
    >
      <Stack align="center">
        <Image src={Logo} alt="Logo" boxSize="90px" objectFit="contain" />
      </Stack>

      <VStack spacing="40px" mt="60px" align="center" w="full">
        <NavItem
          icon={FiHome}
          label="Dashboard"
          active={activeNav === "Dashboard"}
          onClick={() => handleNav("Dashboard", "/user-dashboard")}
        />
        <NavItem
          icon={FiBriefcase}
          label="My Jobs"
          active={activeNav === "My Jobs"}
          onClick={() => handleNav("My Jobs", "/all-jobs")}
        />
        <NavItem
          icon={FiTarget}
          label="Training Programs"
          active={activeNav === "Training Programs"}
          onClick={() => handleNav("Training Programs", "/user-training-programs")}
        />
        <NavItem
          icon={BsFillSignRailroadFill}
          label="AI Interview"
          active={activeNav === "AI Interview"}
          onClick={() => handleNav("AI Interview", "/ai-interview")}
        />
        <NavItem
          icon={IoIosPeople}
          label="Community Forum"
          active={activeNav === "Community Forum"}
          onClick={() => handleNav("Community Forum", "/community-forum")}
        />
      </VStack>
      <Spacer />
      <Box mb="5">
        {isLoggingOut ? (
          <Spinner size="md" color="yellow.400" />
        ) : (
          <NavItem
            icon={FiLogOut}
            label="Log Out"
            active={activeNav === "Log Out"}
            onClick={() => handleNav("Log Out", "/logout")}
          />
        )}
      </Box>
    </Box>
  );
};

export default SideNav;