import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Disable header for login */}
      <Stack.Screen
        name="login"
        options={{ title: "Login", headerShown: false }}  
      />
      {/* Disable header for signup */}
      <Stack.Screen
        name="signup"
        options={{ title: "Signup", headerShown: false }}
      />
    </Stack>
  );
}
