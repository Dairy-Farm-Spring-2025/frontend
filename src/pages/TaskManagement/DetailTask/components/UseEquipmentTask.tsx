import DescriptionComponent from '@components/Description/DescriptionComponent';
import EmptyComponent from '@components/Error/EmptyComponent';
import TagComponents from '@components/UI/TagComponents';
import Title from '@components/UI/Title';
import { UseEquipmentType } from '@model/UseEquipment/UseEquipment';
import { formatStatusWithCamel } from '@utils/format';
import { getEquipmentStatusTag } from '@utils/statusRender/equipmentStatusRender';
import { Divider } from 'antd';
import { t } from 'i18next';

interface UseEquipmentTaskProps {
  equipmentTask: UseEquipmentType[];
}
const UseEquipmentTask = ({ equipmentTask }: UseEquipmentTaskProps) => {
  return (
    <div>
      {equipmentTask.length > 0 ? (
        equipmentTask.map((element, index) => (
          <div className="flex flex-col gap-2">
            <Title>
              {t('Equipment')} {index + 1}
            </Title>
            <DescriptionComponent
              items={[
                {
                  label: t('Equipment name'),
                  children: element?.equipment?.name,
                  span: 1.5,
                },
                {
                  label: t('Equipment status'),
                  children: (
                    <TagComponents
                      color={getEquipmentStatusTag(element?.equipment?.status)}
                    >
                      {t(formatStatusWithCamel(element?.equipment?.status))}
                    </TagComponents>
                  ),
                  span: 1.5,
                },
                {
                  label: t('Equipment type'),
                  children: t(formatStatusWithCamel(element?.equipment?.type)),
                  span: 1.5,
                },
                {
                  label: t('Required quantity'),
                  children: element?.requiredQuantity,
                  span: 1.5,
                },
                {
                  label: t('Note'),
                  children: element?.note,
                  span: 3,
                },
              ]}
            />
            <Divider className="!my-2" />
          </div>
        ))
      ) : (
        <EmptyComponent />
      )}
    </div>
  );
};

export default UseEquipmentTask;
