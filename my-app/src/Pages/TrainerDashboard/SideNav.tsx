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
  FiPlusCircle,
} from 'react-icons/fi';

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

  // Determine active nav from route
  const getActiveNavFromRoute = (pathname: string): string => {
    switch (pathname) {
      case '/':
      case '/trainer-dashboard':
        return 'Dashboard';
      case '/create-training':
        return 'Create Program';
      case '/registered-users':
        return 'My Trainees';
      case '/manage-training':
      case '/program-management':
        return 'Program Management';
      case '/training-programs':
        return 'Training Programs';
      case '/track-training':
        return 'Progress';
      default:
        return 'Dashboard';
    }
  };

  const activeNav =
    propActiveNav ||
    getActiveNavFromRoute(location.pathname) ||
    internalActiveNav;

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
        >
          <Icon as={icon} boxSize={5} mb={1} />
          {label === "Program Management" || label === "Training Programs" || label === "Create Program" ? (
            <Text fontSize="10px" textAlign="center" lineHeight="short">
              {label.split(" ")[0]}<br />{label.split(" ")[1]}
            </Text>
          ) : (
            <Text fontSize="10px" textAlign="center" isTruncated>
              {label}
            </Text>
          )}
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
      position="fixed"
      left={0}
      top={0}
      color="white"
    >
      <Stack align="center">
        <Image src={Logo} alt="Logo" boxSize="90px" objectFit="contain" />
      </Stack>

      <VStack spacing="40px" mt="60px" w="full">
        <NavItem
          icon={FiHome}
          label="Dashboard"
          active={activeNav === "Dashboard"}
          onClick={() => handleNav("Dashboard", "/trainer-dashboard")}
        />
        <NavItem
          icon={FiPlusCircle}
          label="Create Program"
          active={activeNav === "Create Program"}
          onClick={() => handleNav("Create Program", "/create-training")}
        />
        <NavItem
          icon={FiUsers}
          label="My Trainees"
          active={activeNav === "My Trainees"}
          onClick={() => handleNav("My Trainees", "/registered-users")}
        />
        {/* <NavItem
          icon={FiTarget}
          label="Program Management"
          active={activeNav === "Program Management"}
          onClick={() => handleNav("Program Management", "/manage-training")}
        /> */}
        <NavItem
          icon={FiBookOpen}
          label="Training Programs"
          active={activeNav === "Training Programs"}
          onClick={() => handleNav("Training Programs", "/training-programs")}
        />
        <NavItem
          icon={FiBarChart}
          label="Progress"
          active={activeNav === "Progress"}
          onClick={() => handleNav("Progress", "/track-training")}
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