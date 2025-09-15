import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await AsyncStorage.getItem('analysisHistory');
        setHistory(data ? JSON.parse(data) : []);
      } catch (e) {
        setError('Failed to load history.');
        Alert.alert('Error', 'Failed to load analysis history.');
      }
      setLoading(false);
    };
    fetchHistory();
    // Ekrana her gelindiğinde güncellemek için event eklenebilir (isteğe bağlı)
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
        <Text style={styles.result}>{item.result}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 12 }}>Loading history...</Text>
        </View>
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text>No analysis history yet.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 12 },
  item: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  image: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  date: { fontSize: 12, color: '#888' },
  result: { fontSize: 14, color: '#222', marginTop: 4 },
}); 