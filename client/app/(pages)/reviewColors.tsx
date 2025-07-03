import { useRoute } from "@react-navigation/native"
import { useNavigation, useRouter } from "expo-router"
import React from "react"
import { Button, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const ReviewColors = () => {
  const route = useRoute()

  const { images } = route.params

  console.log("review color images:", { images })

  // Stub: simulate color extraction
  const cubeString = "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
  const router = useRouter()

  return (
    <SafeAreaView>
      <Text className="text-red-500 text-2xl">ReviewColors</Text>
      <Text>Review Colors Detected (not implemented yet)</Text>
      <Button
        title="Solve Cube"
        onPress={() =>
          router.push({
            pathname: "/(pages)/solution",
            params: {
              cubeString,
            },
          })
        }
      />
    </SafeAreaView>
  )
}

export default ReviewColors
