import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import axios from 'axios'

const API = 'http://localhost:3000'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos')
      return
    }
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password })
      navigation.replace('Home', { nombre: data.nombre, rol: data.rol })
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Error al iniciar sesión')
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.titulo}>Iniciar sesión</Text>
      <TextInput style={s.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>
      <TextInput style={s.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry/>
      <TouchableOpacity style={s.btn} onPress={login}>
        <Text style={s.btnText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={s.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 32, backgroundColor: '#fff' },
  titulo: { fontSize: 28, fontWeight: '600', marginBottom: 32, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16 },
  btn: { backgroundColor: '#4F46E5', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { textAlign: 'center', color: '#4F46E5' }
})