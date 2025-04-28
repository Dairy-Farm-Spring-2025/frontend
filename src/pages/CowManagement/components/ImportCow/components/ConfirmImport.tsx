import { Cow } from '@model/Cow/Cow';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { cowOrigin } from '@service/data/cowOrigin';
import { CowType } from '@model/Cow/CowType';
import { cowStatus } from '@service/data/cowStatus';
import useFetcher from '@hooks/useFetcher';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface ConfirmImportProps {
    reviewData: Cow[];
    dataCowType: CowType[] | undefined;
    onImportSuccess: (cowIds: number[], importSuccess: boolean) => void;
    onFetchImportTimes: () => Promise<void>;
}

const ConfirmImport = ({ reviewData, dataCowType, onImportSuccess, onFetchImportTimes }: ConfirmImportProps) => {
    const { t } = useTranslation();
    const { trigger: importTrigger, isLoading: isImporting } = useFetcher(COW_PATH.CREATE_BULK, 'POST', 'application/json');

    const handleConfirmImport = async () => {
        if (reviewData.length === 0) {
            toast.error(t('Không có dữ liệu để import!'));
            return;
        }

        try {
            const validCowOrigins = cowOrigin().map((origin: any) => origin.value);
            const validCowStatuses = cowStatus().map((status: any) => status.value);
            const validCowTypes = dataCowType?.map((type: any) => type.name) || [];

            const invalidCows = reviewData.filter((cow) => {
                return (
                    !cow.name?.trim() ||
                    !cow.cowStatus ||
                    !validCowStatuses.includes(cow.cowStatus) ||
                    !cow.gender ||
                    !['male', 'female'].includes(cow.gender) ||
                    !cow.cowOrigin ||
                    !validCowOrigins.includes(cow.cowOrigin) ||
                    !cow.cowTypeName ||
                    !validCowTypes.includes(cow.cowTypeName)
                );
            });

            if (invalidCows.length > 0) {
                toast.error(t('Một số con bò có thông tin không hợp lệ (name, cowStatus, gender, cowOrigin, cowTypeName)!'));
                return;
            }

            const invalidHealthRecords = reviewData.filter((cow) => {
                return (
                    !cow.healthInfoResponses[0]?.health?.status ||
                    !['good', 'poor', 'critical', 'fair', 'recovering'].includes(cow.healthInfoResponses[0]?.health?.status)
                );
            });

            if (invalidHealthRecords.length > 0) {
             
                toast.error(t('Một số hồ sơ sức khỏe có thông tin không hợp lệ (status)!'));
                return;
            }

            const mapCowOrigin = (origin: string) => origin;

            const cows = reviewData.map((cow) => ({
                name: cow.name || '',
                cowStatusStr: cow.cowStatus || '',
                dateOfBirth: cow.dateOfBirth || '',
                dateOfEnter: cow.dateOfEnter || '',
                cowOriginStr: mapCowOrigin(cow.cowOrigin || ''),
                genderStr: cow.gender || '',
                cowTypeName: cow.cowTypeName || '',
                description: cow.description || 'No description',
            }));

            const healthRecords = reviewData.map((cow) => ({
                cowName: cow.name || '',
                status: cow.healthInfoResponses[0]?.health?.status || '',
                size: Math.round(cow.healthInfoResponses[0]?.health?.size || 0),
                bodyTemperature: Math.round(cow.healthInfoResponses[0]?.health?.bodyTemperature || 0),
                heartRate: Math.round(cow.healthInfoResponses[0]?.health?.heartRate || 0),
                respiratoryRate: Math.round(cow.healthInfoResponses[0]?.health?.respiratoryRate || 0),
                ruminateActivity: Math.round(cow.healthInfoResponses[0]?.health?.ruminateActivity || 0),
                chestCircumference: Math.round(cow.healthInfoResponses[0]?.health?.chestCircumference || 0),
                bodyLength: Math.round(cow.healthInfoResponses[0]?.health?.bodyLength || 0),
                description: cow.healthInfoResponses[0]?.health?.description || 'No description',
            }));

            const payload = { cows, healthRecords };
            const response = await importTrigger({ body: JSON.stringify(payload) });

            if (response?.data?.cowsResponse?.successes?.length > 0) {
                toast.success(t(`Đã nhập thành công ${response.data.cowsResponse.successes.length} con bò!`));
                const importedCowIds = response.data.cowsResponse.successes.map((cow: { cowId: number }) => cow.cowId);
                onImportSuccess(importedCowIds, true);
                await onFetchImportTimes();
            } else {
                toast.error(t('Import thất bại! Không có dữ liệu nào được nhập.'));
            }

            const cowErrors = response?.data?.cowsResponse?.errors || [];
            const healthRecordErrors = response?.data?.healthRecordsResponse?.errors || [];
            const allErrors = [...cowErrors, ...healthRecordErrors];

            if (allErrors.length > 0) {
              
                toast.error(t(`Có ${allErrors.length} lỗi xảy ra. Kiểm tra console để biết thêm chi tiết.`));
            }
        } catch (error: any) {

            // Check for 400 "Invalid import times" error
            if (error.response?.data?.code === 400 && error.response?.data?.message === 'Invalid import times') {
                toast.error(error.response.data.message); // Use raw message to avoid translation issues
                return; // Stop further error handling
            }

            // Handle other errors
            toast.error(
                t(`Lỗi khi import: ${error.response?.data?.message || error.message || 'Có lỗi xảy ra!'}`)
            );
        }
    };

    return { handleConfirmImport, isImporting };
};

export default ConfirmImport;