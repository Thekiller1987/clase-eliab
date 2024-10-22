import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import Graficos from './Componentes/Graficos'; // Ajusta la ruta si es necesario

export default function App() {
  return (
    <View style={styles.container}>
      {/* StatusBar para asegurar que la barra de estado no interfiere */}
      <StatusBar backgroundColor="#00aaff" barStyle="light-content" />
      {/* Renderiza el componente principal con las gráficas */}
      <Graficos />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
