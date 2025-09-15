import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen({ navigation }) {
  // Take photo
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission not granted! Please enable camera access in your device settings.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
      if (result.canceled) {
        Alert.alert('Cancelled', 'Photo capture was cancelled.');
        return;
      }
      if (result.assets && result.assets.length > 0) {
        navigation.navigate('Result', { image: result.assets[0].uri });
      } else {
        Alert.alert('Error', 'No image was captured.');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'An unexpected error occurred while taking a photo.');
    }
  };

  // Pick from gallery
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission not granted! Please enable gallery access in your device settings.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
      if (result.canceled) {
        Alert.alert('Cancelled', 'Image selection was cancelled.');
        return;
      }
      if (result.assets && result.assets.length > 0) {
        navigation.navigate('Result', { image: result.assets[0].uri });
      } else {
        Alert.alert('Error', 'No image was selected.');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'An unexpected error occurred while picking an image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plant Analyzer</Text>
      <Image source={require('../assets/plant.png')} style={styles.plantImage} resizeMode="contain" />
      <Text style={styles.subtitle}>Identify and learn about plants using AI</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>TAKE PHOTO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>PICK FROM GALLERY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
    letterSpacing: 1,
  },
  plantImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#43a047',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
}); 