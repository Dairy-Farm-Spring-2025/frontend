import { PenStatus } from '@model/Pen';

export const getPenColor = (status: PenStatus): string => {
  const statusColors: Record<PenStatus, string> = {
    occupied: 'green',
    empty: 'gray',
    reserved: 'blue',
    underMaintenance: 'orange',
    decommissioned: 'red',
    inPlaning: 'gray',
  };
  return statusColors[status] || 'black';
};
