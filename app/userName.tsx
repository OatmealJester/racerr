import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import Next from "../assets/ui/next.svg";
import IconButton from '../components/IconButton';

const router = useRouter();

export var userName

export default function UserName() {

  const [name, setName] = useState('')

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Enter a name (Others will see this)</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          autoCapitalize="none"
          keyboardType="default"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <View style={styles.nextButtonContainer}>
          <View style={styles.nextButton}>
            <IconButton
              IconComponent={Next}
              size={40}
              onPress={() => {
                userName = name
                router.push('./home')
              }
              } />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 44,
    borderWidth: 2,
    borderColor: '#3b88c3',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  nextButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  nextButton: {
    alignItems: "center",
    backgroundColor: '#3b88c3',
    padding: 14,
    borderRadius: 50,
    width: 120,
  },
});
