import { Cow, CowStatus } from '@model/Cow/Cow';
import { Pen } from '@model/Pen';
import TableComponent, { Column } from '@components/Table/TableComponent';
import { Divider, Form, Alert, Badge, Tooltip, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import Title from '@components/UI/Title';
import { formatDateHour, formatStatusWithCamel, formatSTT } from '@utils/format';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import ButtonComponent from '@components/Button/ButtonComponent';
import useFetcher from '@hooks/useFetcher';
import { message } from 'antd';
import EmptyComponent from '@components/Error/EmptyComponent';
import FormComponent from '@components/Form/FormComponent';
import ModalComponent from '@components/Modal/ModalComponent';
import { CowType } from '@model/Cow/CowType';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';

interface CreateBulkAfterImportCowProps {
  availableCows: Cow[];
  mutateCows: () => void;
  modal: {
    open: boolean;
    closeModal: () => void;
  };
}

const cowTypes = [
  { value: 'Ayrshire', label: 'Ayrshire' },
  { value: 'Guernsey', label: 'Guernsey' },
  { value: 'Jersey', label: 'Jersey' },
  { value: 'Holstein Friesian', label: 'Holstein Friesian' },
  { value: 'Brown Swiss', label: 'Brown Swiss' },
];

// Factory function to create cow columns with groupKey
const createCowColumns = (
  groupKey: string,
  selections: any,
  dataPenInArea: any,
  handleCowSelection: (groupKey: string, cowId: number) => void,
  t: (key: string) => string
): Column[] => [
  {
    title: t('Select'),
    dataIndex: 'cowId',
    key: 'select',
    align: 'center',
    width: 80,
    render: (cowId: number) => (
      <Tooltip title={selections[groupKey]?.selectedCows?.includes(cowId) ? t('Deselect') : t('Select')}>
        <input
          type="checkbox"
          checked={selections[groupKey]?.selectedCows?.includes(cowId) || false}
          onChange={() => handleCowSelection(groupKey, cowId)}
          disabled={!(dataPenInArea[groupKey]?.length || 0)}
        />
      </Tooltip>
    ),
  },
  {
    title: t('Cow Name'),
    dataIndex: 'name',
    key: 'name',
    sorter: (a: Cow, b: Cow) => a.name.localeCompare(b.name),
  },
  {
    title: t('Cow Type'),
    dataIndex: 'cowType',
    key: 'cowType',
    render: (cowType: any) => cowType?.name || t(cowType?.name || 'Unknown'),
  },
  {
    title: t('Status'),
    dataIndex: 'cowStatus',
    key: 'cowStatus',
    render: (status: string) => (
      <Badge
        status={status === 'active' ? 'success' : 'default'}
        text={t(formatStatusWithCamel(status))}
      />
    ),
  },
  {
    title: t('Date Of Birth'),
    dataIndex: 'dateOfBirth',
    key: 'dateOfBirth',
    render: (data) => formatDateHour(data) || '-',
  },
  {
    title: t('Gender'),
    dataIndex: 'gender',
    key: 'gender',
    render: (data) =>
      data === 'male' ? (
        <IoMdMale className="text-blue-600" size={20} />
      ) : (
        <IoMdFemale className="text-pink-600" size={20} />
      ),
  },
];

// Factory function to create pen columns with groupKey
const createPenColumns = (
  groupKey: string,
  selections: any,
  dataPenInArea: any,
  handlePenSelection: (groupKey: string, penId: string) => void,
  t: (key: string) => string
): Column[] => [
  {
    title: t('Select'),
    dataIndex: 'penId',
    key: 'select',
    align: 'center',
    width: 80,
    render: (penId: string) => {
      if (!groupKey) {
        console.error('groupKey is undefined in penColumns render');
        return null;
      }
      return (
        <Tooltip title={selections[groupKey]?.selectedPens?.includes(penId) ? t('Deselect') : t('Select')}>
          <input
            type="checkbox"
            checked={selections[groupKey]?.selectedPens?.includes(penId) || false}
            onChange={() => handlePenSelection(groupKey, penId)}
            disabled={!(dataPenInArea[groupKey]?.length || 0)}
          />
        </Tooltip>
      );
    },
  },
  {
    title: t('Pen Name'),
    dataIndex: 'name',
    key: 'name',
    sorter: (a: Pen, b: Pen) => a.name.localeCompare(b.name),
  },
  {
    title: t('Status'),
    dataIndex: 'penStatus',
    key: 'penStatus',
    render: (status: string) => (
      <Badge
        status={status === 'empty' ? 'success' : 'default'}
        text={t(formatStatusWithCamel(status))}
      />
    ),
  },
];

const CreateBulkAfterImportCow = ({ availableCows, mutateCows, modal }: CreateBulkAfterImportCowProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { trigger, isLoading } = useFetcher('cow-pens/create-bulk', 'POST');
  const [selections, setSelections] = useState<{
    [key: string]: { selectedCows: number[]; selectedPens: string[] };
  }>({});
  const { data: cowTypesData } = useFetcher<CowType[]>(COW_TYPE_PATH.COW_TYPES, 'GET');

  // Group cows by cowType and cowStatus
  const groupedCows = useMemo(() => {
    const groups: {
      [cowTypeValue: string]: {
        [cowStatus: string]: Cow[];
      };
    } = {};

    availableCows.forEach((cow) => {
      const cowTypeValue = cow.cowTypeName || cow.cowType?.name || 'unknown';
      const cowStatus = cow.cowStatus;

      if (!groups[cowTypeValue]) {
        groups[cowTypeValue] = {};
      }
      if (!groups[cowTypeValue][cowStatus]) {
        groups[cowTypeValue][cowStatus] = [];
      }
      groups[cowTypeValue][cowStatus].push(cow);
    });

    return groups;
  }, [availableCows]);

  // Handle cow selection for a specific group
  const handleCowSelection = (groupKey: string, cowId: number) => {
    setSelections((prev) => {
      const groupSelections = prev[groupKey] || { selectedCows: [], selectedPens: [] };
      return {
        ...prev,
        [groupKey]: {
          ...groupSelections,
          selectedCows: groupSelections.selectedCows?.includes(cowId)
            ? groupSelections.selectedCows.filter((id) => id !== cowId)
            : [...groupSelections.selectedCows, cowId],
        },
      };
    });
  };

  // Handle pen selection for a specific group
  const handlePenSelection = (groupKey: string, penId: string) => {
    setSelections((prev) => {
      const groupSelections = prev[groupKey] || { selectedCows: [], selectedPens: [] };
      return {
        ...prev,
        [groupKey]: {
          ...groupSelections,
          selectedPens: groupSelections.selectedPens?.includes(penId)
            ? groupSelections.selectedPens.filter((id) => id !== penId)
            : [...groupSelections.selectedPens, penId],
        },
      };
    });
  };

  // Handle select all cows and pens for a specific group
  const handleSelectAll = (groupKey: string, cowTypeValue: string, cowStatus: string) => {
    const cows = groupedCows[cowTypeValue][cowStatus];
    const pens = dataPenInArea[groupKey] || [];
    const numPens = pens.length;

    setSelections((prev) => {
      const groupSelections = prev[groupKey] || { selectedCows: [], selectedPens: [] };
      if (groupSelections.selectedCows.length > 0) {
        return { ...prev, [groupKey]: { selectedCows: [], selectedPens: [] } };
      } else {
        const selectedCowIds = cows
          .slice(0, numPens)
          .map((cow) => Number(cow.cowId))
          .filter((id) => !isNaN(id));
        const selectedPenIds = pens.slice(0, selectedCowIds.length).map((pen) => pen.penId);
        return {
          ...prev,
          [groupKey]: { selectedCows: selectedCowIds, selectedPens: selectedPenIds },
        };
      }
    });
  };

  // Handle confirm button click to submit all selections
  const handleConfirm = async () => {
    // Validate all selections
    const validationErrors: string[] = [];
    Object.keys(selections).forEach((groupKey) => {
      const groupSelections = selections[groupKey] || { selectedCows: [], selectedPens: [] };
      if (groupSelections.selectedCows.length !== groupSelections.selectedPens.length) {
        validationErrors.push(
          t('Selected cows must match selected pens for group', {
            group: groupKey,
            count0: groupSelections.selectedCows.length,
            count1: groupSelections.selectedPens.length,
          })
        );
      }
      if (groupSelections.selectedCows.length === 0 && groupSelections.selectedPens.length === 0) {
        delete selections[groupKey]; // Remove empty selections
      }
    });

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => message.error(error));
      return;
    }

    if (Object.keys(selections).length === 0) {
      message.warning(t('No selections made'));
      return;
    }

    // Submit all selections
    try {
      const promises = Object.keys(selections).map(async (groupKey) => {
        const groupSelections = selections[groupKey];
        const payload = {
          cowEntities: groupSelections.selectedCows,
          penEntities: groupSelections.selectedPens,
        };
        await trigger({ body: payload });
      });

      await Promise.all(promises);
      message.success(t('Moved cows successfully'));
      setSelections({});
      mutateCows();
      modal.closeModal();
    } catch (error) {
      message.error(t('Failed to move cows'));
      console.error(error);
    }
  };

  // Store pens for each group
  const dataPenInArea: { [key: string]: Pen[] } = {};

  // Render tables for each cowType and cowStatus
  const renderTables = () => {
    return cowTypes.map((cowType) => {
      const cowTypeValue = cowType.value;
      const statuses = groupedCows[cowTypeValue] || {};
      if (Object.keys(statuses).length === 0) return null; // Skip if no cows for this type

      return (
        <div key={cowTypeValue} className="mb-8">
          <Title className="my-4 text-xl">{t('Cow Type')}: {t(cowType.label)}</Title>
          {Object.entries(statuses).map(([cowStatus, cows]) => {
            const groupKey = `${cowTypeValue}-${cowStatus}`;

            // Map cowTypeValue to numeric cowTypeId
            const cowTypeId = cowTypesData?.find((ct) => ct.name === cowTypeValue)?.cowTypeId || 0;

            // Fetch pens for this group using numeric cowTypeId
            const { data: availablePens } = useFetcher<Pen[]>(
              cowTypeId !== 0
                ? `https://api.dairyfarmfpt.website/api/v1/pens/available/cow?areaType=cowHousing&cowTypeId=${cowTypeId}&cowStatus=${cowStatus}`
                : '',
              'GET'
            );

            dataPenInArea[groupKey] = availablePens?.filter((pen) => pen.penStatus === 'empty') || [];

            // Debugging logs
            console.log(`groupKey: ${groupKey}, cowTypeId: ${cowTypeId}`);
            console.log(`availablePens for ${groupKey}:`, availablePens);
            console.log(`dataPenInArea[${groupKey}]:`, dataPenInArea[groupKey]);
            console.log(`selections[${groupKey}]:`, selections[groupKey]);

            return (
              <div key={groupKey} className="mb-6">
                <Title className="my-2 text-lg">{t('Cow Status')}: {t(formatStatusWithCamel(cowStatus))}</Title>
                <FormComponent form={form} layout="vertical">
                  <Row gutter={[24, 24]} align="stretch">
                    <Col xs={24} lg={12}>
                      <Title className="text-lg font-semibold">
                        {t('Cows')}{' '}
                        <Badge
                          count={selections[groupKey]?.selectedCows?.length || 0}
                          style={{ backgroundColor: '#1890ff' }}
                        />
                      </Title>
                      <TableComponent
                        loading={false}
                        columns={createCowColumns(groupKey, selections, dataPenInArea, handleCowSelection, t)}
                        dataSource={formatSTT(cows)}
                        pagination={{ pageSize: 7 }}
                        scroll={{ x: 'max-content' }}
                        locale={{ emptyText: <EmptyComponent /> }}
                      />
                    </Col>
                    <Col xs={24} lg={12}>
                      <Title className="text-lg font-semibold">
                        {t('Pens')}{' '}
                        <Badge
                          count={selections[groupKey]?.selectedPens?.length || 0}
                          style={{ backgroundColor: '#1890ff' }}
                        />
                      </Title>
                      <TableComponent
                        loading={false}
                        columns={createPenColumns(groupKey, selections, dataPenInArea, handlePenSelection, t)}
                        dataSource={dataPenInArea[groupKey]}
                        pagination={{ pageSize: 7 }}
                        scroll={{ x: 'max-content' }}
                        locale={{ emptyText: <EmptyComponent /> }}
                      />
                    </Col>
                  </Row>
                  {selections[groupKey]?.selectedCows?.length !==
                    selections[groupKey]?.selectedPens?.length &&
                    selections[groupKey]?.selectedCows?.length > 0 && (
                      <Alert
                        message={t('Selected cows must match selected pens', {
                          count0: selections[groupKey]?.selectedCows?.length || 0,
                          count1: selections[groupKey]?.selectedPens?.length || 0,
                        })}
                        type="warning"
                        showIcon
                        className="mt-4 rounded-lg text-center"
                      />
                    )}
                  {!dataPenInArea[groupKey]?.length && (
                    <Alert
                      message={t('No empty pens available for the selected criteria')}
                      type="error"
                      showIcon
                      className="mt-4 rounded-lg"
                    />
                  )}
                  {cowTypeId === 0 && (
                    <Alert
                      message={t('Invalid cow type: Unable to fetch pens for this cow type')}
                      type="error"
                      showIcon
                      className="mt-4 rounded-lg"
                    />
                  )}
                  <Divider className="my-6 border-gray-300" />
                  <div className="flex justify-start">
                    <ButtonComponent
                      onClick={() => handleSelectAll(groupKey, cowTypeValue, cowStatus)}
                      type="primary"
                      size="large"
                      disabled={!dataPenInArea[groupKey]?.length || !cows.length || cowTypeId === 0}
                      className="hover:bg-blue-600 transition-colors"
                    >
                      {selections[groupKey]?.selectedCows?.length > 0 ? t('Deselect All') : t('Select All Cows')} (
                      {selections[groupKey]?.selectedCows?.length || 0}/{dataPenInArea[groupKey]?.length || 0})
                    </ButtonComponent>
                  </div>
                </FormComponent>
                <Divider />
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <ModalComponent
      open={modal.open}
      onCancel={() => {
        modal.closeModal();
        mutateCows();
        setSelections({});
      }}
      footer={[
        <ButtonComponent key="cancel" onClick={() => modal.closeModal()} size="large">
          {t('Cancel')}
        </ButtonComponent>,
        <ButtonComponent
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          loading={isLoading}
          size="large"
        >
          {t('Confirm')}
        </ButtonComponent>,
      ]}
      width={1800}
      title={t('Assign Cows to Pens')}
    >
      <div>{renderTables()}</div>
    </ModalComponent>
  );
};

export default CreateBulkAfterImportCow;