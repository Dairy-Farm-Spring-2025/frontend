export const getAvatar = (imageUrl: string) => {
  return `https://api.dairyfarmfpt.website/uploads/users/${imageUrl}`;
};

export const getImage = (imageUrl: string) => {
  return `https://api.dairyfarmfpt.website/uploads/reportTasks/${imageUrl}`;
};
