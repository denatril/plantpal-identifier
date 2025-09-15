import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants.expoConfig.extra.openaiApiKey;

console.log('OPENAI_API_KEY:', OPENAI_API_KEY);

export default function ResultScreen({ route }) {
  const { image } = route.params || {};
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (image) {
      handleAnalyze(image);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [image]);

  const handleAnalyze = (img) => {
    setError('');
    setResult('');
    analyzeImage(img);
  };

  const saveToHistory = async (image, result) => {
    try {
      const timestamp = new Date().toISOString();
      const newItem = { image, result, timestamp };
      const history = await AsyncStorage.getItem('analysisHistory');
      let historyArr = history ? JSON.parse(history) : [];
      historyArr.unshift(newItem); // newest first
      await AsyncStorage.setItem('analysisHistory', JSON.stringify(historyArr));
    } catch (e) {
      Alert.alert('Error', 'Failed to save analysis history.');
    }
  };

  const analyzeImage = async (imageUri) => {
    if (!OPENAI_API_KEY) {
      setError('API key is missing. Please contact the developer.');
      return;
    }
    setLoading(true);
    setError('');
    // Timeout: 30 saniye sonra iptal
    const tId = setTimeout(() => {
      setLoading(false);
      setError('The request timed out. Please try again.');
    }, 30000);
    setTimeoutId(tId);
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'Act as a plant expert.' },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Please analyze the plant in this photo and provide information about it.' },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } },
              ],
            },
          ],
          max_tokens: 300,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setError('OpenAI API error: ' + (data.error.message || JSON.stringify(data.error)));
      } else {
        const answer = data.choices?.[0]?.message?.content || 'No response received.';
        setResult(answer);
        await saveToHistory(imageUri, answer);
      }
    } catch (e) {
      setError('API error: ' + e.message);
    }
    setLoading(false);
    clearTimeout(tId);
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 16 }} />}
      {loading ? (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 12 }}>Analyzing the plant, please wait...</Text>
        </View>
      ) : error ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>{error}</Text>
          <Button title="Try Again" onPress={() => handleAnalyze(image)} />
        </View>
      ) : (
        <Text style={{ textAlign: 'center' }}>{result}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
}); 