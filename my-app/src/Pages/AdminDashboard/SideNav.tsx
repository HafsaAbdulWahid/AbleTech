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
  FiHome,
  FiLogOut,
  FiBriefcase,
} from 'react-icons/fi';
import { MdOndemandVideo } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { IconType } from 'react-icons';
import Logo from "../../Images/Logo.png";

interface NavItemProps {
  icon: IconType;
  label: string | React.ReactNode;
  active: boolean;
  onClick: () => void;
}

interface SideNavProps {
  activeNav?: string;
}

const SideNav = ({ activeNav: propActiveNav }: SideNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const getActiveNavFromRoute = (pathname: string): string => {
    switch (pathname) {
      case '/admin-dashboard':
        return 'Dashboard';
      case '/motivational-sessions-for-admin':
        return 'Sessions';
      case '/admin-job-listings':
        return 'Jobs';
      case '/admin-notifications':
        return 'Notifications';
      default:
        return 'Dashboard';
    }
  };

  // Use route-based active state primarily, fallback to prop
  const activeNav = propActiveNav || getActiveNavFromRoute(location.pathname);

  const handleNav = (label: string, path: string): void => {
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
        {/* Left yellow indicator */}
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
          transition="opacity 0.2s ease"
          zIndex={1}
        />
        {/* Right yellow indicator */}
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
          transition="opacity 0.2s ease"
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

      <VStack spacing="40px" mt="75px" align="center" w="full">
        <NavItem
          icon={FiHome}
          label="Dashboard"
          active={activeNav === "Dashboard"}
          onClick={() => handleNav("Dashboard", "/admin-dashboard")}
        />
        
        <NavItem
          icon={MdOndemandVideo}
          label={
            <>
              Motivational
              <br />
              Sessions
            </>
          }
          active={activeNav === "Sessions"}
          onClick={() => handleNav("Sessions", "/motivational-sessions-for-admin")}
        />
       
        <NavItem
          icon={FiBriefcase}
          label="Jobs"
          active={activeNav === "Jobs"}
          onClick={() => handleNav("Jobs", "/admin-job-listings")}
        />

        <NavItem
          icon={FaRegBell}
          label="Notifications"
          active={activeNav === "Notifications"}
          onClick={() => handleNav("Notifications", "/admin-notifications")}
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