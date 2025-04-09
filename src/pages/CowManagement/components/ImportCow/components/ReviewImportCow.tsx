import { UploadOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import useFetcher from '@hooks/useFetcher';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { message, Upload } from 'antd';

interface ReviewImportCowProps {
  onReviewData: (data: any[], errors: any[]) => void; // Callback to pass review data
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

      // Extract cow and health record responses
      const cowResponse = data?.cowResponseCowPenBulkResponse || {};
      const healthResponse = data?.healthRecordEntityCowPenBulkResponse || {};

      // Get successes and errors
      const cowSuccesses = cowResponse.successes || [];
      const healthSuccesses = healthResponse.successes || [];
      const cowErrors = cowResponse.errors || [];
      const healthErrors = healthResponse.errors || [];

      // Combine successes with health records
      const combinedSuccesses = cowSuccesses.map((cow: any) => {
        const healthRecord = healthSuccesses.find(
          (health: any) => health.cowName === cow.name
        );
        if (!healthRecord) {
          console.warn(`No health record found for cow: ${cow.name}`);
        }
        return {
          name: cow.name,
          cowStatus: cow.cowStatus, // Sử dụng cowStatus từ cowResponse
          dateOfBirth: cow.dateOfBirth,
          dateOfEnter: cow.dateOfEnter,
          cowOrigin: cow.cowOrigin,
          gender: cow.gender,
          cowTypeName: cow.cowTypeName,
          description: cow.description,
          healthRecord: healthRecord
            ? {
                status: healthRecord.healthRecordStatus || healthRecord.status,
                size: healthRecord.size,
                period: healthRecord.period,
                bodyTemperature: healthRecord.bodyTemperature,
                heartRate: healthRecord.heartRate,
                respiratoryRate: healthRecord.respiratoryRate,
                ruminateActivity: healthRecord.ruminateActivity,
                chestCircumference: healthRecord.chestCircumference,
                bodyLength: healthRecord.bodyLength,
                description: healthRecord.description,
              }
            : null,
        };
      });

      // Combine errors with source identification
      const combinedErrors = [
        ...cowErrors.map((err: any) => ({ source: 'cow', ...err })),
        ...healthErrors.map((err: any) => ({ source: 'health', ...err })),
      ];

      // Pass data to parent component
      onReviewData(combinedSuccesses, combinedErrors);

      // Provide feedback based on results
      if (combinedErrors.length > 0) {
        message.warning(
          `Đã review thành công ${combinedSuccesses.length} con bò, nhưng có ${combinedErrors.length} lỗi. Vui lòng kiểm tra chi tiết.`
        );
      } else {
        message.success(
          `Dữ liệu đã được review thành công! Đã xử lý ${combinedSuccesses.length} con bò.`
        );
      }

      // Log unmatched health records (if any)
      const unmatchedHealthRecords = healthSuccesses.filter(
        (health: any) =>
          !cowSuccesses.some((cow: any) => cow.name === health.cowName)
      );
      if (unmatchedHealthRecords.length > 0) {
        console.warn('Unmatched health records:', unmatchedHealthRecords);
        message.warning(
          `${unmatchedHealthRecords.length} hồ sơ sức khỏe không khớp với bất kỳ con bò nào.`
        );
      }
    } catch (error: any) {
      console.error('Lỗi khi review:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
      onReviewData([], [errorMessage]);
    }
  };

  return (
    <Upload
      beforeUpload={async (file) => {
        await handleUpload(file);
        return false; // Prevent default upload behavior of Ant Design
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
