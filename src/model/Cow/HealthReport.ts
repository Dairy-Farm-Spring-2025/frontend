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
    illnessDetails: {
        illnessDetailId: string,
        date: Date,
        description: string,
        dosage: number,
        injectionSite: string,
        status: string,
        vaccine: {
            itemId: string,
            name: string,
            description: string,
            status: string,
            unit: string,
            quantity: number,
            categoryEntity: {
                categoryId: string,
                name: string,


            },
            warehouseLocationEntity: {
                warehouseLocationId: string,
                name: string,
                description: string,
                type: string
            }
        }

    }
};
