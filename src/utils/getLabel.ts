export const getLabelByValue = (value: string, listing: any[]) => {
  const item = listing.find((option) => option.value === value);
  return item ? item.label : 'Unknown'; // Return "Unknown" if no match is found
};
