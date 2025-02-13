import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import useFetcher from '../../../../../../../hooks/useFetcher';
import AnimationAppear from '../../../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../../../components/UI/WhiteBackground';
import ExportInformation from './components/ExportInfomation';

const DetailExport = () => {
  const { id } = useParams(); // Get exportItemId from the URL
  const { data, isLoading } = useFetcher(`export_items/${id}`, 'GET'); // Fetch export details

  if (isLoading) return <Spin />; // Show loading spinner while fetching data

  return (
    <AnimationAppear>
      <WhiteBackground>
        <ExportInformation data={data} /> {/* Pass data to the ExportInformation component */}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DetailExport;
