import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import axios from 'axios'

const API = 'http://localhost:3000'

export default function RegistroScreen({ navigation }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [rol, setRol] = useState('')

  const registro = async () => {
    if (!nombre || !email || !password || !telefono || !rol) {
      Alert.alert('Error', 'Completa todos los campos')
      return
    }
    try {
      await axios.post(`${API}/auth/registro`, { nombre, email, password, telefono, rol })
      Alert.alert('¡Listo!', 'Cuenta creada. Ahora inicia sesión.')
      navigation.navigate('Login')
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || 'Error al registrarse')
    }
  }

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.titulo}>Crear cuenta</Text>

      <TextInput style={s.input} placeholder="Nombre" value={nombre} onChangeText={setNombre}/>
      <TextInput style={s.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>
      <TextInput style={s.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry/>
      <TextInput style={s.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad"/>

      <Text style={s.label}>Selecciona tu rol</Text>
      <View style={s.roles}>
        <TouchableOpacity
          style={[s.rolBtn, rol === 'musico' && s.rolActivo]}
          onPress={() => setRol('musico')}
        >
          <Text style={[s.rolText, rol === 'musico' && s.rolTextoActivo]}>🎵 Músico</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.rolBtn, rol === 'local' && s.rolActivo]}
          onPress={() => setRol('local')}
        >
          <Text style={[s.rolText, rol === 'local' && s.rolTextoActivo]}>🏠 Local</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.btn} onPress={registro}>
        <Text style={s.btnText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={s.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 32, backgroundColor: '#fff' },
  titulo: { fontSize: 28, fontWeight: '600', marginBottom: 32, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 12, color: '#333' },
  roles: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  rolBtn: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 16, alignItems: 'center' },
  rolActivo: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  rolText: { fontSize: 16, color: '#666' },
  rolTextoActivo: { color: '#4F46E5', fontWeight: '600' },
  btn: { backgroundColor: '#4F46E5', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { textAlign: 'center', color: '#4F46E5' }
})