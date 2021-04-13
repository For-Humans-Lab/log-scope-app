import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { registerLog } from '@for-humans-lab/log-scope'

const log1 = registerLog(["App", "Main page", "Maybe interesting"])
const log2 = registerLog(["App", "Main page"])
const log3 = registerLog(["App", "Cart"])

export default function App() {
  useEffect(() => {
    log2("Initialized")
    
    log1("Initialized", {
      users: [{
        id: 0,
        nickname: "User 1"
      }],
      goods: [
        {
          id: 0,
          name: "Laptop"
        },
        {
          id: 1,
          name: "Washing machine"
        }
      ]
    })

    log1("Good clicked")

    log3("Cart updated", {
      cart: [
        {
          id: 0,
          name: "Laptop",
          count: 2
        },
      ]
    })
  })

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
