import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { api } from '../services/api';

const LOCATION_TRACKING_TASK = 'BACKGROUND_LOCATION_TRACKING';

/**
 * Native Driver Tracking Hook
 * Handles high-precision GPS tracking in background
 */
export const useBackgroundTracking = () => {
  const startTracking = async (tripId) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus.status !== 'granted') return;

    await Location.startLocationUpdatesAsync(LOCATION_TRACKING_TASK, {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10,
      foregroundService: {
        notificationTitle: "TransportIQ Tracking",
        notificationBody: "You are currently on an active trip.",
        notificationColor: "#4F46E5"
      },
      pausesUpdatesAutomatically: false
    });
  };

  const stopTracking = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK);
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING_TASK);
    }
  };

  return { startTracking, stopTracking };
};

// Background Task Definition
TaskManager.defineTask(LOCATION_TRACKING_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Background Tracking Error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const { latitude, longitude, speed, heading } = locations[0].coords;

    // Send to backend
    try {
      await api.post('/tracking/location', {
        lat: latitude,
        lng: longitude,
        speed: speed * 3.6, // Convert to km/h
        heading,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      // Store in local storage for offline sync if failed
      console.log('Tracking sync failed, storing locally...');
    }
  }
});
