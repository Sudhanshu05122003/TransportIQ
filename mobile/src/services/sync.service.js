import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { api } from './api';

const SYNC_QUEUE_KEY = '@TransportIQ:sync_queue';

class SyncService {
  /**
   * Queue an operation for offline sync
   */
  async queueOperation(operation) {
    const queue = JSON.parse(await AsyncStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    queue.push({
      ...operation,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    });
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  /**
   * Run sync process when back online
   */
  async sync() {
    const isConnected = (await NetInfo.fetch()).isConnected;
    if (!isConnected) return;

    const queue = JSON.parse(await AsyncStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    if (queue.length === 0) return;

    console.log(`📡 Syncing ${queue.length} operations...`);

    for (const op of queue) {
      try {
        await api.post(op.endpoint, op.payload);
        // Remove from queue if successful
      } catch (err) {
        console.error('Sync error:', err);
      }
    }

    // Clear queue after processing
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, '[]');
  }
}

export const syncService = new SyncService();
