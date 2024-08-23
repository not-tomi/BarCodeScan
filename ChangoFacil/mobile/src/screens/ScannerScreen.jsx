import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';

export default function ScannerScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcodeData, setBarcodeData] = useState('');
    const [cart, setCart] = useState([]);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        if (scanned) {
            return; // Avoid multiple scans
        }

        setScanned(true);
        setBarcodeData(data);
        Alert.alert('Barcode Scanned', `Type: ${type}\nData: ${data}`, [
            {
                text: 'Close',
                onPress: () => setScanned(false) // Reset scanned state
            },
            {
                text: 'Copy value',
                onPress: async () => {
                    await Clipboard.setStringAsync(data);
                    Alert.alert('Copied!', 'The barcode data has been copied to clipboard.');
                }
            }
        ]);
        setCart([...cart, data]);
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission</Text>
            </View>
        );
    }

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text>No access to camera</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                barCodeScannerSettings={{
                    barCodeTypes: [
                        'aztec', 'ean13', 'ean8', 'qr', 'pdf417',
                        'upc_e', 'datamatrix', 'code39', 'code93',
                        'itf14', 'codabar', 'code128', 'upc_a'
                    ]
                }}
            />
            <View style={styles.overlay}>
                <Text style={styles.barcodeText}>Scanned Barcode: {barcodeData}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
        width: '100%',
    },
    barcodeText: {
        fontSize: 16,
        color: 'black',
        backgroundColor: 'white',
        padding: 10,
    },
});
