import useSWR from 'swr';
import { Image, Spin } from 'antd';
import { getQR } from '@utils/getImage';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load QR code');
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

const CowQRImage = ({ id }: { id: string }) => {
  const { data: qrUrl, error, isLoading } = useSWR(getQR(id), fetcher);

  if (isLoading) return <Spin />;
  if (error) return <p>Error loading QR</p>;
  if (!qrUrl) return <p>No QR available</p>;

  return <Image width={200} src={qrUrl} alt="QR Code" />;
};

export default CowQRImage;
