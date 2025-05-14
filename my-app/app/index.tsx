import { useEffect } from "react";
import { useRootNavigationState, useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext"; // adjust the path if needed
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();
  const rootNavigation = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigation?.key) return;
    if (user === undefined) return; // still loading context
    if (user === null) {
      router.replace("/login");
    } else {
      router.replace("/(tabs)");
    }
  }, [user, rootNavigation]);

  if (!rootNavigation?.key || !user?.id) return null;
  
  return (
    <View className="flex-1 justify-center items-center bg-black">
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}
