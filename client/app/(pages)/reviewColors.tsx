import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ReviewColors = () => {
const route = useRoute()

const {images} = route.params

console.log("review color images:", {images})

  // Stub: simulate color extraction
  const cubeString = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';

  return (
    <SafeAreaView>
      <Text className='text-red-500 text-2xl'>ReviewColors</Text>
    </SafeAreaView>
  )
}

export default ReviewColors