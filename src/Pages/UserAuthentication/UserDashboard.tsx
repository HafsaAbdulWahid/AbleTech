import { useLocation } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";

export default function UserDashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name");

  return (
    <Box textAlign="center" mt={20}>
      <Text fontSize="3xl" fontWeight="bold">
        Hello, {name} 👋
      </Text>
      <Text fontSize="lg" mt={4}>
        Welcome to your dashboard!
      </Text>
    </Box>
  );
}
