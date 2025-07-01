import { Stack } from "expo-router"
import React from "react"

export default function PagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="reviewColors"
        options={{
          title: "Review Colors",
        }}
      />
      <Stack.Screen
        name="solution"
        options={{
          title: "Solution",
        }}
      />
      <Stack.Screen
        name="cameraCapture"
        options={{
          title: "Camera Capture",
        }}
      />
    </Stack>
  )
}
