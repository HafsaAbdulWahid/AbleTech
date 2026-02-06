import React, { ReactNode, useState, useEffect } from "react";
import {
  Box,
  VStack,
  Button,
  Icon,
  Text,
  Spacer,
  Image,
  Stack,
  Spinner,
} from '@chakra-ui/react';
import {
  FiHome,
  FiLogOut,
  FiUsers,
  FiFileText,
  FiBarChart,
  FiPlusCircle,
} from "react-icons/fi";
import { FaRegBell } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Logo from "../../Images/Logo.png";

interface SideNavProps {
  activeNav?: string;
}

interface NavItemProps {
  icon: any;
  label: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

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
        _hover={{ bg: "whiteAlpha.200" }}
        _active={{ bg: "whiteAlpha.300" }}
        position="relative"
        zIndex={2}
        py={4}
        h="auto"
      >
        <Icon as={icon} boxSize={5} mb={1} />
        <Text fontSize="10px" fontWeight="normal" textAlign="center" lineHeight="short">
          {label}
        </Text>
      </Button>
    </Box>
  );
};

export default function SideNav({ activeNav }: SideNavProps) {
  const [currentActiveNav, setCurrentActiveNav] = useState(activeNav || "Dashboard");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Update active nav when prop changes
  useEffect(() => {
    if (activeNav) {
      setCurrentActiveNav(activeNav);
    }
  }, [activeNav]);

  const handleNav = (label: string, path: string) => {
    if (label === "Log Out") {
      setIsLoggingOut(true);
      setCurrentActiveNav(label);
      setTimeout(() => {
        setIsLoggingOut(false);
        navigate("/");
      }, 2000);
    } else {
      setCurrentActiveNav(label);
      navigate(path);
    }
  };

  const navigationItems = [
    {
        icon: FiHome,
        label: "Dashboard",
        key: "Dashboard",
        path: "/recruiter-dashboard"
    },
    {
        icon: FiPlusCircle,
        label: "Post Job",
        key: "Post Job Listings", // Changed to match the activeNav prop from PostJob component
        path: "/post-job"
    },
    {
        icon: FiFileText,
        label: "Job Listings",
        key: "Job Listings",
        path: "/job-listings"
    },
    {
        icon: FiUsers,
        label: "Job Applications",
        key: "Job Applications",
        path: "/view-job-applications"
    },
    {
        icon: FiBarChart,
        label: (
          <>
            Application
            <br />
            Tracking
          </>
        ),
        key: "Application Tracking",
        path: "/track-job-applications"
    }
    
];
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
      zIndex={1000}
      boxShadow="2xl"
    >
      {/* Logo Section */}
      <Stack align="center" mb={2}>
        <Image src={Logo} alt="Logo" boxSize="90px" objectFit="contain" />
      </Stack>

      {/* Navigation Items */}
      <VStack spacing="20px" mt="20px" align="center" w="full" flex={1}>
        {navigationItems.map((item) => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={currentActiveNav === item.key}
            onClick={() => handleNav(item.key, item.path)}
          />
        ))}
      </VStack>

      <Spacer />

      {/* Logout Section */}
      <Box mb="5">
        {isLoggingOut ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <Spinner size="md" color="yellow.400" mb={2} />
            <Text fontSize="10px" color="white">
              Logging out...
            </Text>
          </Box>
        ) : (
          <NavItem
            icon={FiLogOut}
            label="Log Out"
            active={currentActiveNav === "Log Out"}
            onClick={() => handleNav("Log Out", "/logout")}
          />
        )}
      </Box>
    </Box>
  );
}