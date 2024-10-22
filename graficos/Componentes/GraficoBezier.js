import React from 'react';
import { StyleSheet, View, Dimensions, Button, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { jsPDF } from 'jspdf'; // Para generar PDFs
import * as FileSystem from 'expo-file-system'; // Para manejar archivos
import * as Sharing from 'expo-sharing'; // Para compartir archivos

export default function GraficoBezier({ dataSalarios }) {
  let screenWidth = Dimensions.get('window').width;

  // Función para generar y compartir el PDF
  const generarPDF = async () => {
    try {
      // Crear una instancia de jsPDF
      const doc = new jsPDF();

      // Agregar título al PDF
      doc.text("Reporte de Salarios", 10, 10);

      // Añadir datos de salarios en el PDF
      dataSalarios.labels.forEach((label, index) => {
        doc.text(`Mes: ${label} - Salario: $${dataSalarios.datasets[0].data[index]}`, 10, 20 + index * 10);
      });

      // Generar el archivo PDF como base64
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // Guardar el archivo en el sistema de archivos del dispositivo
      const fileUri = `${FileSystem.documentDirectory}reporte_salarios.pdf`;
      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Compartir el archivo PDF
      await Sharing.shareAsync(fileUri);

    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={dataSalarios}
        width={screenWidth - screenWidth * 0.1}
        height={300}
        chartConfig={{
          backgroundGradientFrom: '#00FFFF',
          backgroundGradientFromOpacity: 0.1,
          backgroundGradientTo: '#FFFFFF',
          backgroundGradientToOpacity: 1,
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          strokeWidth: 1,
          barPercentage: 0.5,
        }}
        style={{
          borderRadius: 10,
        }}
        bezier
      />

      {/* Botón para generar y compartir el PDF */}
      <Button title="Generar y Compartir PDF" onPress={generarPDF} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});
 