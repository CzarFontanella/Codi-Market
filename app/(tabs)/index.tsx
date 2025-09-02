import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
});
