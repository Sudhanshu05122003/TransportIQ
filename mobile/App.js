import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useBackgroundTracking } from './src/hooks/useBackgroundTracking';
import { syncService } from './src/services/sync.service';
import NetInfo from '@react-native-community/netinfo';

export default function App() {
  const { startTracking } = useBackgroundTracking();

  useEffect(() => {
    // Listen for network changes to trigger sync
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncService.sync();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>TransportIQ Driver</Text>
        <Text style={styles.status}>Online & Ready</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.label}>Active Trip</Text>
        <Text style={styles.value}>TIQ-9823-XM</Text>
        <Text style={styles.route}>Mumbai → Pune</Text>
      </View>

      <Text style={styles.footer}>Background Tracking Active</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    justifyContent: 'center'
  },
  header: {
    marginBottom: 40
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: 'bold'
  },
  status: {
    color: '#10B981',
    fontSize: 16,
    marginTop: 5
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155'
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  value: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5
  },
  route: {
    color: '#6366F1',
    fontSize: 16,
    marginTop: 10
  },
  footer: {
    color: '#475569',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12
  }
});
