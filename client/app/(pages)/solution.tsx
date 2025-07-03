import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Solution = () => {
  const route = useRoute()
  const { cubeString } = route.params;
  const [steps, setSteps] = useState<string[] | null>(null);

  console.log("Cube String:", cubeString)

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const res = await fetch('http://192.168.0.186:9000/solve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cube_state: cubeString }),
        });
        const data = await res.json();
        setSteps(data.solution);
      } catch (err) {
        console.error('Error solving cube:', err);
      }
    };
    fetchSolution();
  }, []);

  if (!steps) return <ActivityIndicator size="large" />;
  return (
    <SafeAreaView>
      <Text className='text-yellow-400'>Solution</Text>
      {
        steps.map((step, index) => (
          <Text key={index} className='text-yellow-400'>{step}</Text>
        ))
      }
    </SafeAreaView>
  )
}

export default Solution