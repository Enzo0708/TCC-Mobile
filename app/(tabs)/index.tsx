// App.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Clipboard from 'expo-clipboard';
import { Vibration } from 'react-native';

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
    Vibration.vibrate();
    Alert.alert('QR code Escaneado', `Tipo: ${type}\nDados: ${data}`);
  };

  const handleCopyToClipboard = async () => {
    if (scannedData) {
      await Clipboard.setStringAsync(scannedData);
      Alert.alert('Dados copiados!', 'Os dados foram copiados para a área de transferência.');
    }
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
        style={styles.camera}
      />

      {/* Overlay para escurecer a área fora do quadrado de foco */}
      <View style={styles.overlay}>
        {/* Título centralizado */}
        <Text style={styles.title}>Escanear QR-Code</Text>

        {/* Área escurecida */}
        <View style={styles.darkAreaTop} />
        <View style={styles.darkAreaBottom} />
        <View style={styles.darkAreaLeft} />
        <View style={styles.darkAreaRight} />

        {/* Quadrado de centralização do QR Code */}
        <View style={styles.scanArea}>
          <Animated.View style={[styles.cornerTopLeft, { transform: [{ scale: pulseAnim }] }]} />
          <Animated.View style={[styles.cornerTopRight, { transform: [{ scale: pulseAnim }] }]} />
          <Animated.View style={[styles.cornerBottomLeft, { transform: [{ scale: pulseAnim }] }]} />
          <Animated.View style={[styles.cornerBottomRight, { transform: [{ scale: pulseAnim }] }]} />
        </View>
      </View>

      {/* Botões e dados escaneados */}
      {scanned && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(false)}>
            <Text style={styles.scanButtonText}>Escanear novamente</Text>
          </TouchableOpacity>
          {scannedData && <Text style={styles.dataText}>Dados: {scannedData}</Text>}
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyToClipboard}>
            <Text style={styles.scanButtonText}>Copiar Dados</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const boxSize = width * 0.7; // Tamanho do quadrado de escaneamento
const cornerSize = 40; // Tamanho das bordas dos cantos (Ajustável)
const cornerThickness = 6; // Espessura das bordas dos cantos (Ajustável)
const cornerRadius = 12; // Raio de borda arredondada para os cantos

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Para garantir que o overlay fique acima da câmera
  },
  darkAreaTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: (height - boxSize) / 2, // Parte superior escurecida
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Escurecido
  },
  darkAreaBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: (height - boxSize) / 2, // Parte inferior escurecida
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Escurecido
  },
  darkAreaLeft: {
    position: 'absolute',
    top: (height - boxSize) / 2,
    left: 0,
    width: (width - boxSize) / 2, // Lado esquerdo escurecido
    height: boxSize,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Escurecido
  },
  darkAreaRight: {
    position: 'absolute',
    top: (height - boxSize) / 2,
    right: 0,
    width: (width - boxSize) / 2, // Lado direito escurecido
    height: boxSize,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Escurecido
  },
  scanArea: {
    width: boxSize,
    height: boxSize,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Para garantir que o quadrado de escaneamento fique por cima da parte preta
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: cornerSize,
    height: cornerSize,
    borderTopWidth: cornerThickness,
    borderLeftWidth: cornerThickness,
    borderColor: 'red',
    borderTopLeftRadius: cornerRadius,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: cornerSize,
    height: cornerSize,
    borderTopWidth: cornerThickness,
    borderRightWidth: cornerThickness,
    borderColor: 'red',
    borderTopRightRadius: cornerRadius,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: cornerSize,
    height: cornerSize,
    borderBottomWidth: cornerThickness,
    borderLeftWidth: cornerThickness,
    borderColor: 'red',
    borderBottomLeftRadius: cornerRadius,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: cornerSize,
    height: cornerSize,
    borderBottomWidth: cornerThickness,
    borderRightWidth: cornerThickness,
    borderColor: 'red',
    borderBottomRightRadius: cornerRadius,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '100%',
    zIndex: 3, // Para garantir que os botões fiquem por cima da parte preta
  },
  scanButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
  },
  copyButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
    marginTop: 10,
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
    zIndex: 3, // Para garantir que os dados fiquem por cima da parte preta
  },
  title: {
    position: 'absolute',
    top: (height - boxSize) / 2 - 110, // Ajuste para mover o título mais para cima
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 3, // Para garantir que o título fique por cima da parte preta
  },
});
