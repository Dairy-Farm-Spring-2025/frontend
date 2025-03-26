import { UserProfileData } from '../User';
import { CowType } from './CowType';
import { IllnessDetail } from './IllnessDetail';
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
    illnessStatus: string;
    gender: 'male' | 'female';
    cowType: CowType;

    userEntity: UserProfileData
    createdAt: string;
    updatedAt: string;
    inPen: boolean;
    cowEntity: {
        cowId: string,
        name: string,
        cowStatus: string,
        cowOrigin: string;
        gender: string,
        dateOfBirth: Date,
        cowTypeEntity: CowType;
    }
    illnessDetails: IllnessDetail[];
};
