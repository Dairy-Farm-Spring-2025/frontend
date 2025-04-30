
import { UploadOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import useFetcher from '@hooks/useFetcher';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { message, Upload } from 'antd';
import { Cow } from '@model/Cow/Cow';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface ReviewImportCowProps {
  onReviewData: (data: Cow[], errors: { source: string; message: string }[]) => void;
}

const ReviewImportCow = ({ onReviewData }: ReviewImportCowProps) => {
  const { trigger, isLoading } = useFetcher(COW_PATH.REVIEW_IMPORT_COW, 'POST', 'multipart/form-data');

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await trigger({ body: formData });
      const data = response.data || response;

      const cowResponse = data?.cowResponseCowPenBulkResponse || { successes: [], errors: [] };
      const healthResponse = data?.healthRecordEntityCowPenBulkResponse || { successes: [], errors: [] };

      const cowSuccesses = cowResponse.successes || [];
      const healthSuccesses = healthResponse.successes || [];
      const cowErrors = cowResponse.errors || [];
      const healthErrors = healthResponse.errors || [];

      const combinedSuccesses: Cow[] = [
        ...cowSuccesses.map((cow: any, index: number) => {
          // Check both healthSuccesses and healthErrors for a matching health record
          const healthRecord =
            healthSuccesses.find((health: any) => health.cowName === cow.name) ||
            healthErrors.find((health: any) => health.cowName === cow.name) ||
            null;

          return {
            cowId: '',
            name: cow.name || '',
            cowStatus: cow.cowStatus || '',
            dateOfBirth: cow.dateOfBirth || '',
            dateOfEnter: cow.dateOfEnter || '',
            dateOfOut: '',
            description: cow.description || '',
            cowOrigin: cow.cowOrigin || '',
            gender: cow.gender || '',
            cowType: { name: cow.cowTypeName || '' },
            cowTypeEntity: { name: cow.cowTypeName || '' },
            cowTypeName: cow.cowTypeName || '',
            createdAt: '',
            updatedAt: '',
            inPen: false,
            healthInfoResponses: healthRecord
              ? [
                  {
                    date: cow.dateOfBirth || dayjs().format('YYYY-MM-DD'),
                    health: {
                      status: healthRecord.status || healthRecord.healthRecordStatus || '',
                      size: healthRecord.size || null,
                      bodyTemperature: healthRecord.bodyTemperature || null,
                      heartRate: healthRecord.heartRate || null,
                      respiratoryRate: healthRecord.respiratoryRate || null,
                      ruminateActivity: healthRecord.ruminateActivity || null,
                      chestCircumference: healthRecord.chestCircumference || null,
                      bodyLength: healthRecord.bodyLength || null,
                      description: healthRecord.description || null,
                    },
                    id: index,
                    type: 'HEALTH_RECORD' as const,
                  },
                ]
              : [],
            penResponse: null,
            key: index.toString(),
            errorStrings: [],
          };
        }),
        ...cowErrors.map((err: any, index: number) => {
          const healthRecord =
            healthSuccesses.find((health: any) => health.cowName === err.name) ||
            healthErrors.find((health: any) => health.cowName === err.name) ||
            null;

          return {
            cowId: '',
            name: err.name || '',
            cowStatus: err.cowStatus || '',
            dateOfBirth: err.dateOfBirth || '',
            dateOfEnter: err.dateOfEnter || '',
            dateOfOut: '',
            description: err.description || '',
            cowOrigin: err.cowOrigin || '',
            gender: err.gender || '',
            cowType: { name: err.cowTypeName || '' },
            cowTypeEntity: { name: err.cowTypeName || '' },
            cowTypeName: err.cowTypeName || '',
            createdAt: '',
            updatedAt: '',
            inPen: false,
            healthInfoResponses: healthRecord
              ? [
                  {
                    date: err.dateOfBirth || dayjs().format('YYYY-MM-DD'),
                    health: {
                      status: healthRecord.status || healthRecord.healthRecordStatus || '',
                      size: healthRecord.size || null,
                      bodyTemperature: healthRecord.bodyTemperature || null,
                      heartRate: healthRecord.heartRate || null,
                      respiratoryRate: healthRecord.respiratoryRate || null,
                      ruminateActivity: healthRecord.ruminateActivity || null,
                      chestCircumference: healthRecord.chestCircumference || null,
                      bodyLength: healthRecord.bodyLength || null,
                      description: healthRecord.description || null,
                    },
                    id: index,
                    type: 'HEALTH_RECORD' as const,
                  },
                ]
              : [],
            penResponse: null,
            key: (cowSuccesses.length + index).toString(),
            errorStrings: err.errorStrings || [],
          };
        }),
      ];

      const combinedErrors = [
        ...cowErrors.map((err: any) => ({
          source: 'cow',
          message: `${err.name}: ${err.errorStrings?.join(', ') || 'Unknown error'}`,
        })),
        ...healthErrors.map((err: any) => ({
          source: 'health',
          message: `${err.cowName}: ${err.errorStrings?.join(', ') || 'Unknown error'}`,
        })),
      ];


      onReviewData(combinedSuccesses, combinedErrors);

      if (combinedErrors.length > 0) {
        const errorMessages = combinedErrors.map((err) => err.message).join('; ');
        message.warning(
          `Đã review ${combinedSuccesses.length} con bò, nhưng có ${combinedErrors.length} lỗi: ${errorMessages}`
        );
      } else {
        message.success(`Đã review thành công ${combinedSuccesses.length} con bò`);
      }
    } catch (error: any) {


      if (error?.code === 400 && error?.message === 'Invalid import times') {
        toast.error('Số lần import không hợp lệ. Hãy tải file Excel mới nhất!');
        onReviewData([], []);
        return;
      }

      let combinedSuccesses: Cow[] = [];
      let combinedErrors: { source: string; message: string }[] = [];
      let errorMessage = 'Có lỗi xảy ra khi xử lý file excel. Vui lòng kiểm tra lại.';

      if (error?.cowResponseCowPenBulkResponse) {
        const cowResponse = error.cowResponseCowPenBulkResponse;
        const healthResponse = error.healthRecordEntityCowPenBulkResponse || { successes: [], errors: [] };

        const cowSuccesses = Array.isArray(cowResponse.successes) ? cowResponse.successes : [];
        const healthSuccesses = Array.isArray(healthResponse.successes) ? healthResponse.successes : [];
        const cowErrors = Array.isArray(cowResponse.errors) ? cowResponse.errors : [];
        const healthErrors = Array.isArray(healthResponse.errors) ? healthResponse.errors : [];

        combinedSuccesses = [
          ...cowSuccesses.map((cow: any, index: number) => {
            const healthRecord =
              healthSuccesses.find((health: any) => health.cowName === cow.name) ||
              healthErrors.find((health: any) => health.cowName === cow.name) ||
              null;

            return {
              cowId: '',
              name: cow.name || '',
              cowStatus: cow.cowStatus || '',
              dateOfBirth: cow.dateOfBirth || '',
              dateOfEnter: cow.dateOfEnter || '',
              dateOfOut: '',
              description: cow.description || '',
              cowOrigin: cow.cowOrigin || '',
              gender: cow.gender || '',
              cowType: { name: cow.cowTypeName || '' },
              cowTypeEntity: { name: cow.cowTypeName || '' },
              cowTypeName: cow.cowTypeName || '',
              createdAt: '',
              updatedAt: '',
              inPen: false,
              healthInfoResponses: healthRecord
                ? [
                    {
                      date: cow.dateOfBirth || dayjs().format('YYYY-MM-DD'),
                      health: {
                        status: healthRecord.status || healthRecord.healthRecordStatus || '',
                        size: healthRecord.size || null,
                        bodyTemperature: healthRecord.bodyTemperature || null,
                        heartRate: healthRecord.heartRate || null,
                        respiratoryRate: healthRecord.respiratoryRate || null,
                        ruminateActivity: healthRecord.ruminateActivity || null,
                        chestCircumference: healthRecord.chestCircumference || null,
                        bodyLength: healthRecord.bodyLength || null,
                        description: healthRecord.description || null,
                      },
                      id: index,
                      type: 'HEALTH_RECORD' as const,
                    },
                  ]
                : [],
              penResponse: null,
              key: index.toString(),
              errorStrings: [],
            };
          }),
          ...cowErrors.map((err: any, index: number) => {
            const healthRecord =
              healthSuccesses.find((health: any) => health.cowName === err.name) ||
              healthErrors.find((health: any) => health.cowName === err.name) ||
              null;

            return {
              cowId: '',
              name: err.name || '',
              cowStatus: err.cowStatus || '',
              dateOfBirth: err.dateOfBirth || '',
              dateOfEnter: err.dateOfEnter || '',
              dateOfOut: '',
              description: err.description || '',
              cowOrigin: err.cowOrigin || '',
              gender: err.gender || '',
              cowType: { name: err.cowTypeName || '' },
              cowTypeEntity: { name: err.cowTypeName || '' },
              cowTypeName: err.cowTypeName || '',
              createdAt: '',
              updatedAt: '',
              inPen: false,
              healthInfoResponses: healthRecord
                ? [
                    {
                      date: err.dateOfBirth || dayjs().format('YYYY-MM-DD'),
                      health: {
                        status: healthRecord.status || healthRecord.healthRecordStatus || '',
                        size: healthRecord.size || null,
                        bodyTemperature: healthRecord.bodyTemperature || null,
                        heartRate: healthRecord.heartRate || null,
                        respiratoryRate: healthRecord.respiratoryRate || null,
                        ruminateActivity: healthRecord.ruminateActivity || null,
                        chestCircumference: healthRecord.chestCircumference || null,
                        bodyLength: healthRecord.bodyLength || null,
                        description: healthRecord.description || null,
                      },
                      id: index,
                      type: 'HEALTH_RECORD' as const,
                    },
                  ]
                : [],
              penResponse: null,
              key: (cowSuccesses.length + index).toString(),
              errorStrings: err.errorStrings || [],
            };
          }),
        ];

        combinedErrors = [
          ...cowErrors.map((err: any) => ({
            source: 'cow',
            message: `${err.name}: ${err.errorStrings?.join(', ') || 'Unknown error'}`,
          })),
          ...healthErrors.map((err: any) => ({
            source: 'health',
            message: `${err.cowName}: ${err.errorStrings?.join(', ') || 'Unknown error'}`,
          })),
        ];

        if (combinedErrors.length > 0) {
          errorMessage = combinedErrors.map((err) => err.message).join('; ');
        }
      } else {
        errorMessage = typeof error?.message === 'string' ? error.message : 'Unknown error occurred';
      }

      onReviewData(combinedSuccesses, combinedErrors.length > 0 ? combinedErrors : [{ source: 'system', message: errorMessage }]);
    }
  };

  return (
    <Upload
      beforeUpload={async (file) => {
        await handleUpload(file);
        return false;
      }}
      showUploadList={false}
    >
      <ButtonComponent icon={<UploadOutlined />} loading={isLoading} disabled={isLoading} type="primary">
        {isLoading ? 'Đang xử lý...' : 'Nhập bò'}
      </ButtonComponent>
    </Upload>
  );
};

export default ReviewImportCow;
