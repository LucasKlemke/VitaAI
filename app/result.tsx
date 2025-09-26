import { useAtomValue } from 'jotai';
import { analysisAtom } from '@/atoms/analysis';
import { useLocalSearchParams } from 'expo-router';
import ResultData from './components/ResultData';

const Page = () => {
  const { imageUri, fromEntry } = useLocalSearchParams();
  const analysis = useAtomValue(analysisAtom);

  // If coming from an entry, don't show image if there's no imageUri
  const showImage = fromEntry === 'true' ? !!imageUri : true;

  return (
    <ResultData 
      analysis={analysis!} 
      imageUri={imageUri as string}
      showImage={showImage}
    />
  );
};

export default Page;
