export type IllnessDetail = {
  illnessDetailId: string;
  date: string;
  description: string;
  dosage: number;
  injectionSite: string;
  status: string;
  vaccine: {
    itemId: string;
    name: string;
    description: string | null;
    status: string;
    unit: string;
    quantity: number;
    categoryEntity: {
      categoryId: string;
      name: string;
    };
    warehouseLocationEntity: {
      warehouseLocationId: string;
      name: string;
      description: string;
      type: string | null;
    };
  };
  veterinarian: {
    id: number;
    name: string;
    phoneNumber: string | null;
    employeeNumber: string;
    email: string;
    gender: string | null;
    address: string | null;
    profilePhoto: string;
    dob: string | null;
    status: string;
    roleId: {
      id: number;
      name: string;
    };
  };
};

export type StatusIllnessDetail =
  | 'observed'
  | 'treated'
  | 'cured'
  | 'ongoing'
  | 'deceased';
