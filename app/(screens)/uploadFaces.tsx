import { useRouter } from 'expo-router'
import React from 'react'
import { Button, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const UploadFaces = () => {
  const router = useRouter()
  return (
    <SafeAreaView>
      <Text className='text-white text-2xl'>UploadFaces</Text>
      <Button title="Go to review colors" onPress={() => router.navigate("/(pages)/reviewColors")} />
      <Button title="Go to solution" onPress={() => router.navigate("/(pages)/solution")} />
      <Button title="Go to camera capture" onPress={() => router.navigate("/(pages)/cameraCapture")} />
    </SafeAreaView>
  )
}

export default UploadFaces