import { View, TextInput, Button, Alert, Text } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { URL_CONFIG } from '@/services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    console.log('working')
    const endpoint = `${URL_CONFIG.BASE_URL}/auth/login`
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    console.log('working response')

    const data = await res.json();
    if (res.ok) {
      console.log('ok')
      await SecureStore.setItemAsync('token', data.token);
      router.replace('(tabs)' as any);
    } else {
      console.log('error')
      Alert.alert('Login failed', data.error || 'Invalid credentials');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      <Text>you don't have an account? <Text className='text-blue-500 text-[14px] italic' onPress={() => router.replace('(auth)/signup' as any)}>signup</Text></Text>
    </View>
  );
}
