import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView, Alert, Button } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit';
import { jsPDF } from 'jspdf'; // Generación de PDFs
import * as FileSystem from 'expo-file-system'; // Manejo de archivos
import * as Sharing from 'expo-sharing'; // Para compartir archivos

export default function GraficoReporteEnfermedades({ dataReporteEnfermedades }) {
  const screenWidth = Dimensions.get('window').width;
  const squareSize = 30;
  const numDays = 365;

  // Obtener nombre del mes según el índice
  const getMonthLabel = (monthIndex) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    return months[monthIndex];
  };

  // Manejar cuando un día es presionado
  const handleDayPress = (day) => {
    Alert.alert('Reportes', `Fecha: ${day.date}\nCantidad: ${day.count}`);
  };

  // Función para generar y compartir el PDF
  const generarPDF = async () => {
    try {
      // Crear instancia de jsPDF
      const doc = new jsPDF();

      // Agregar título
      doc.text("Reporte de Enfermedades", 10, 10);

      // Agregar datos del reporte
      dataReporteEnfermedades.forEach((day, index) => {
        doc.text(`Fecha: ${day.date} - Cantidad: ${day.count}`, 10, 20 + index * 10);
      });

      // Generar el PDF como base64
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // Guardar el archivo en el sistema de archivos del dispositivo
      const fileUri = `${FileSystem.documentDirectory}reporte_enfermedades.pdf`;
      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ContributionGraph
          values={dataReporteEnfermedades}
          endDate={new Date('2017-12-30')}
          numDays={numDays}
          width={1680}
          height={300}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#f0f0f0',
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            strokeWidth: 2,
          }}
          gutterSize={0.4}
          squareSize={squareSize}
          getMonthLabel={getMonthLabel}
          onDayPress={handleDayPress}
          style={{
            borderRadius: 10,
          }}
        />
      </ScrollView>

      {/* Botón para generar y compartir PDF */}
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
