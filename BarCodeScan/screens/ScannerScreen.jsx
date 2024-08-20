import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import { Camera } from 'expo-camera';

const API_URL = 'http://localhost:3000/verify-product';

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

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setBarcodeData(data);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ barcode: data }),
            });

            if (response.ok) {
                const product = await response.json();
                setCart((prevCart) => [...prevCart, product]);
                Alert.alert(`Producto ${product.name} agregado al carrito`);
            } else {
                Alert.alert('Producto no encontrado');
            }
        } catch (error) {
            Alert.alert('Error al verificar el producto');
        }
    };

    if (hasPermission === null) {
        return <Text>Solicitando permiso para usar la cámara</Text>;
    }
    if (hasPermission === false) {
        return <Text>No se tiene acceso a la cámara</Text>;
    }

    return (
        <View style={styles.container}>
            {!scanned && (
                <Camera
                    style={StyleSheet.absoluteFillObject}
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
            )}
            {scanned && (
                <Pressable
                    style={styles.button}
                    onPress={() => setScanned(false)}
                >
                    <Text style={styles.buttonText}>Escanear Otro Código QR</Text>
                </Pressable>
            )}
            <Text style={styles.barcodeText}>Datos del código escaneado: {barcodeData}</Text>
            <View style={styles.cart}>
                <Text>Productos en el carrito:</Text>
                {cart.map((item, index) => (
                    <Text key={index}>{item.name} - ${item.price}</Text>
                ))}
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
    button: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 200,
        paddingHorizontal: 60,
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
    },
    barcodeText: {
        marginTop: 20,
        fontSize: 16,
    },
    cart: {
        marginTop: 20,
        alignItems: 'center',
    },
});
