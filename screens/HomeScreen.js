import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default function HomeScreen({ route, navigation }) {
  const { nombre, rol } = route.params

  return (
    <View style={s.container}>
      <Text style={s.bienvenida}>¡Bienvenido, {nombre}!</Text>
      <Text style={s.rol}>{rol === 'musico' ? '🎵 Músico' : '🏠 Local'}</Text>
      <TouchableOpacity style={s.btn} onPress={() => navigation.replace('Login')}>
        <Text style={s.btnText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  )
  
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 32 },
  bienvenida: { fontSize: 26, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  rol: { fontSize: 18, color: '#4F46E5', marginBottom: 48 },
  btn: { backgroundColor: '#EF4444', borderRadius: 8, padding: 16, paddingHorizontal: 32 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 }
})