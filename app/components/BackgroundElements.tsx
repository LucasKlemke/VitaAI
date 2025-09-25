import { View } from 'react-native';

interface BackgroundElementsProps {
  width: number;
  height: number;
}

export default function BackgroundElements({ width, height }: BackgroundElementsProps) {
  return (
    <>
      {/* Background Elements */}
      <View style={{
        position: 'absolute',
        top: 50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        opacity: 0.6
      }} />
      <View style={{
        position: 'absolute',
        bottom: 100,
        left: -30,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255, 192, 203, 0.1)',
        opacity: 0.5
      }} />
      <View style={{
        position: 'absolute',
        top: height * 0.3,
        left: width * 0.1,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(135, 206, 235, 0.1)',
        opacity: 0.4
      }} />
    </>
  );
}
