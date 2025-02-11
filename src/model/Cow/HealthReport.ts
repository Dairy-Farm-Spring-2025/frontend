import { UserProfileData } from '../User';
import { CowType } from './CowType';
export type Health = {
    illnessId: number;
    symptoms: string;
    severity:
    | 'mild'
    | 'moderate'
    | 'severe'
    | 'critical';
    startDate: string;
    endDate: string;
    dateOfOut: string;
    prognosis: string;
    cowOrigin: string;
    gender: 'male' | 'female';
    cowType: CowType;
    cowTypeEntity: CowType;
    userEntity: UserProfileData
    createdAt: string;
    updatedAt: string;
    inPen: boolean;
};
