export const getAvatar = (imageUrl: string) => {
  return `https://api.dairyfarmfpt.website/uploads/users/${imageUrl}`;
};

export const getImage = (imageUrl: string) => {
  return `https://api.dairyfarmfpt.website/uploads/reportTasks/${imageUrl}`;
};

export const getQR = (id: string) => {
  return `https://api.dairyfarmfpt.website/api/v1/cows/qr/${id}`;
};
