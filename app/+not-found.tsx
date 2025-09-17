import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function OnboardingScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Welcome' }} />
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.container}
      >
        <Image
          source={require('@/assets/images/icon.png')} // Replace with your own image
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Can't Find Your Page</Text>
        <Text style={styles.subtitle}>
          Explore next-gen Ethiopian recipes powered by culture, taste, and technology.
        </Text>

        <Link href="/" asChild>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>Let’s Get back to home 🍲</Text>
          </Pressable>
        </Link>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d1d1',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 32,
  },
  cta: {
    backgroundColor: '#ff9f1c',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    elevation: 3,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e1e1e',
  },
});
