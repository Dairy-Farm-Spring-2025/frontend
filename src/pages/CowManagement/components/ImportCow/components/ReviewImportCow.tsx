import { UploadOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import useFetcher from '@hooks/useFetcher';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { message, Upload } from 'antd';

interface ReviewImportCowProps {
  onReviewData: (data: any[], errors: any[]) => void;
}

const ReviewImportCow = ({ onReviewData }: ReviewImportCowProps) => {
  const { trigger, isLoading } = useFetcher(
    COW_PATH.REVIEW_IMPORT_COW,
    'POST',
    'multipart/form-data'
  );
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await trigger({ body: formData });
      const data = response.data || response;
      console.log('API response:', data);

      const cowResponse = data?.cowResponseCowPenBulkResponse || { successes: [], errors: [] };
      const healthResponse = data?.healthRecordEntityCowPenBulkResponse || { successes: [], errors: [] };

      const cowSuccesses = cowResponse.successes || [];
      const healthSuccesses = healthResponse.successes || [];
      const cowErrors = cowResponse.errors || [];
      const healthErrors = healthResponse.errors || [];

      // Combine cow successes with health record data (including errors)
      const combinedSuccesses = cowSuccesses.map((cow: any) => {
        // Look for a matching health record in successes
        let healthRecord = healthSuccesses.find(
          (health: any) => health.cowName === cow.name
        );

        // If no matching success, look for a matching health record in errors
        if (!healthRecord) {
          const healthError = healthErrors.find(
            (health: any) => health.cowName === cow.name
          );
          if (healthError) {
            healthRecord = {
              status: healthError.healthRecordStatus || healthError.status,
              size: healthError.size,
              bodyTemperature: healthError.bodyTemperature,
              heartRate: healthError.heartRate,
              respiratoryRate: healthError.respiratoryRate,
              ruminateActivity: healthError.ruminateActivity,
              chestCircumference: healthError.chestCircumference,
              bodyLength: healthError.bodyLength,
              description: healthError.description,
            };
          }
        }

        return {
          name: cow.name,
          cowStatus: cow.cowStatus,
          dateOfBirth: cow.dateOfBirth,
          dateOfEnter: cow.dateOfEnter,
          cowOrigin: cow.cowOrigin,
          gender: cow.gender,
          cowTypeName: cow.cowTypeName,
          description: cow.description,
          healthRecord: healthRecord || null,
        };
      });

      // Map errors, handling errorString array for health errors
      const combinedErrors = [
        ...cowErrors.map((err: string) => ({ source: 'cow', message: err })),
        ...healthErrors.map((err: any) => ({
          source: 'health',
          message: `${err.cowName}: ${err.errorString?.join(', ') || 'Unknown error'}`
        })),
      ];
      console.log('Combined successes:', combinedSuccesses);
      console.log('Combined errors:', combinedErrors);

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
      console.error('Lỗi khi review:', error);
      console.log('Error full details:', {
        data: error,
        message: error.message,
        hasResponseData: !!error.cowResponseCowPenBulkResponse,
      });

      let combinedSuccesses: any[] = [];
      let combinedErrors: { source: string; message: string }[] = [];
      let errorMessage = 'Có lỗi xảy ra khi xử lý file excel. Vui lòng kiểm tra lại.';

      if (error?.cowResponseCowPenBulkResponse) {
        const cowResponse = error.cowResponseCowPenBulkResponse;
        const healthResponse = error.healthRecordEntityCowPenBulkResponse || { successes: [], errors: [] };

        const cowSuccesses = Array.isArray(cowResponse.successes) ? cowResponse.successes : [];
        const healthSuccesses = Array.isArray(healthResponse.successes) ? healthResponse.successes : [];
        const cowErrors = Array.isArray(cowResponse.errors) ? cowResponse.errors : [];
        const healthErrors = Array.isArray(healthResponse.errors) ? healthResponse.errors : [];

        combinedSuccesses = cowSuccesses.map((cow: any) => {
          let healthRecord = healthSuccesses.find(
            (health: any) => health.cowName === cow.name
          );

          if (!healthRecord) {
            const healthError = healthErrors.find(
              (health: any) => health.cowName === cow.name
            );
            if (healthError) {
              healthRecord = {
                status: healthError.healthRecordStatus || healthError.status,
                size: healthError.size,
                bodyTemperature: healthError.bodyTemperature,
                heartRate: healthError.heartRate,
                respiratoryRate: healthError.respiratoryRate,
                ruminateActivity: healthError.ruminateActivity,
                chestCircumference: healthError.chestCircumference,
                bodyLength: healthError.bodyLength,
                description: healthError.description,
              };
            }
          }

          return {
            name: cow.name,
            cowStatus: cow.cowStatus,
            dateOfBirth: cow.dateOfBirth,
            dateOfEnter: cow.dateOfEnter,
            cowOrigin: cow.cowOrigin,
            gender: cow.gender,
            cowTypeName: cow.cowTypeName,
            description: cow.description,
            healthRecord: healthRecord || null,
          };
        });

        combinedErrors = [
          ...cowErrors.map((err: string) => ({ source: 'cow', message: err })),
          ...healthErrors.map((err: any) => ({
            source: 'health',
            message: `${err.cowName}: ${err.errorString?.join(', ') || 'Unknown error'}`
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
      <ButtonComponent
        icon={<UploadOutlined />}
        loading={isLoading}
        disabled={isLoading}
        type="primary"
      >
        {isLoading ? 'Đang xử lý...' : 'Nhập bò'}
      </ButtonComponent>
    </Upload>
  );
};

export default ReviewImportCow;