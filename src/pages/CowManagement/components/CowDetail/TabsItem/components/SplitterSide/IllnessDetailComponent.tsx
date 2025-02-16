import { Tooltip } from 'antd';
import { AiOutlineEye } from 'react-icons/ai';
import { BsHourglassSplit } from 'react-icons/bs';
import { FaRegCheckCircle } from 'react-icons/fa';
import { GiHeartBottle } from 'react-icons/gi';
import { MdHealing } from 'react-icons/md';
import TimelineComponent, {
  TimelineItems,
} from '../../../../../../../components/Timeline/TimelineComponent';
import { IllnessDetail } from '../../../../../../../model/Cow/IllnessDetail';
import { formatToTitleCase } from '../../../../../../../utils/format';
import useModal from '../../../../../../../hooks/useModal';
import { useState } from 'react';
import IllnessDetailModal from './components/IllnessDetailModal';

interface IllnessDetailProps {
  data: IllnessDetail[];
}

const SIZE_ICON = 20;

const IllnessDetailComponent = ({ data }: IllnessDetailProps) => {
  const modal = useModal();
  const [detail, setDetail] = useState<IllnessDetail>();

  const handleOpenModal = (data: IllnessDetail) => {
    setDetail(data);
    modal.openModal();
  };

  const items: TimelineItems[] = data?.map((element: IllnessDetail) => ({
    children: (
      <div
        onClick={() => handleOpenModal(element)}
        className="ml-10 w-fit cursor-pointer hover:!opacity-55 duration-200"
      >
        <div className="flex gap-2">
          <Tooltip title="Seveiry">
            <p>{formatToTitleCase(element?.status)}</p>
          </Tooltip>
          <p>-</p>
          <Tooltip title="Veterinarian">
            <p>
              {element?.veterinarian
                ? element?.veterinarian?.name
                : 'No veterinarian'}
            </p>
          </Tooltip>
        </div>
      </div>
    ),
    dot: (
      <div className="flex flex-col justify-center items-center !w-full gap-2 !h-fit">
        {(element?.status === 'observed' && (
          <Tooltip title={'Observed'}>
            <AiOutlineEye size={SIZE_ICON} color="blue" />
          </Tooltip>
        )) ||
          (element?.status === 'treated' && (
            <Tooltip title={'Treated'}>
              <MdHealing size={SIZE_ICON} color="orange" />
            </Tooltip>
          )) ||
          (element?.status === 'cured' && (
            <Tooltip title={'Cured'}>
              <FaRegCheckCircle size={SIZE_ICON} color="green" />
            </Tooltip>
          )) ||
          (element?.status === 'ongoing' && (
            <Tooltip title={'Ongoing'}>
              <BsHourglassSplit size={SIZE_ICON} color="purple" />
            </Tooltip>
          )) ||
          (element?.status === 'deceased' && (
            <Tooltip title={'Deceased'}>
              <GiHeartBottle size={SIZE_ICON} color="red" />
            </Tooltip>
          ))}
        <p>{element.date}</p>
      </div>
    ),
  }));
  console.log(data);
  return (
    <div className="pl-2">
      <TimelineComponent className="mt-10 ml-10" items={items} reverse={true} />
      <IllnessDetailModal data={detail as IllnessDetail} modal={modal} />
    </div>
  );
};

export default IllnessDetailComponent;
