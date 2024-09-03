// App.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1)); // Animação de pulso

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();

    // Iniciar animação de pulso
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setScannedData(data);
    alert(`QR code com o tipo ${type} e dados ${data} foi escaneado!`);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para usar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera. Por favor, conceda permissão nas configurações.</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Overlay com o guia de centralização do QR Code */}
      <View style={styles.overlay}>
        <Animated.View style={[styles.cornerTopLeft, { transform: [{ scale: pulseAnim }] }]} />
        <Animated.View style={[styles.cornerTopRight, { transform: [{ scale: pulseAnim }] }]} />
        <Animated.View style={[styles.cornerBottomLeft, { transform: [{ scale: pulseAnim }] }]} />
        <Animated.View style={[styles.cornerBottomRight, { transform: [{ scale: pulseAnim }] }]} />
      </View>

      {scanned && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(false)}>
            <Text style={styles.scanButtonText}>Escanear novamente</Text>
          </TouchableOpacity>
          {scannedData && <Text style={styles.dataText}>Dados: {scannedData}</Text>}
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');
const boxSize = width * 0.7;
const cornerSize = 40; // Tamanho das bordas dos cantos (Ajustável)
const cornerThickness = 6; // Espessura das bordas dos cantos (Ajustável)
const cornerRadius = 12; // Raio de borda arredondada para os cantos

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: (Dimensions.get('window').height - boxSize) / 2,
    left: (Dimensions.get('window').width - boxSize) / 2,
    width: cornerSize,
    height: cornerSize,
    borderTopWidth: cornerThickness,
    borderLeftWidth: cornerThickness,
    borderColor: 'red',
    borderTopLeftRadius: cornerRadius, // Bordas arredondadas
  },
  cornerTopRight: {
    position: 'absolute',
    top: (Dimensions.get('window').height - boxSize) / 2,
    right: (Dimensions.get('window').width - boxSize) / 2,
    width: cornerSize,
    height: cornerSize,
    borderTopWidth: cornerThickness,
    borderRightWidth: cornerThickness,
    borderColor: 'red',
    borderTopRightRadius: cornerRadius, // Bordas arredondadas
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: (Dimensions.get('window').height - boxSize) / 2,
    left: (Dimensions.get('window').width - boxSize) / 2,
    width: cornerSize,
    height: cornerSize,
    borderBottomWidth: cornerThickness,
    borderLeftWidth: cornerThickness,
    borderColor: 'red',
    borderBottomLeftRadius: cornerRadius, // Bordas arredondadas
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: (Dimensions.get('window').height - boxSize) / 2,
    right: (Dimensions.get('window').width - boxSize) / 2,
    width: cornerSize,
    height: cornerSize,
    borderBottomWidth: cornerThickness,
    borderRightWidth: cornerThickness,
    borderColor: 'red',
    borderBottomRightRadius: cornerRadius, // Bordas arredondadas
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
  },
  scanButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10, // Botão com bordas arredondadas
    alignItems: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dataText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});
