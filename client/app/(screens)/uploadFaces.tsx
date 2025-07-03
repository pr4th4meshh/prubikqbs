import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Button, Image, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const UploadFaces = () => {
  const [images, setImages] = useState<string[]>([])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    })
    console.log("Result", result)
    if (!result.canceled && result.assets.length) {
      setImages((prev) => [...prev, result.assets[0].uri])
    }
  }

  const router = useRouter()
  return (
    <SafeAreaView>
      <Text className="text-white text-2xl">UploadFaces</Text>
      <Button
        title="Go to review colors"
        onPress={() => router.navigate("/(pages)/reviewColors")}
      />
      <Button
        title="Go to solution"
        onPress={() => router.navigate("/(pages)/solution")}
      />
      <Button
        title="Go to camera capture"
        onPress={() => router.navigate("/(pages)/cameraCapture")}
      />

      <Button
        title="Pick Face Image"
        onPress={pickImage}
        disabled={images.length >= 6}
      />
      {images.map((img, idx) => (
        <Image
          key={idx}
          source={{ uri: img }}
          style={{ width: 50, height: 50, margin: 5 }}
        />
      ))}
      {images.length === 6 && (
        <Button
          title="Next"
          onPress={() =>
            router.push({
              pathname: "/(pages)/reviewColors",
              params: { images: JSON.stringify(images) },
            })
          }
        />
      )}
    </SafeAreaView>
  )
}

export default UploadFaces
