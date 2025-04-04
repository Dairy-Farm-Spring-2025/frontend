export type RoleRender = 'Veterinarians' | 'Worker';
const STATUS_COLORS: Record<RoleRender, string> = {
  Veterinarians: 'purple-inverse', // Bác sĩ thú y - tím
  Worker: 'green-inverse', // Công nhân - nâu
};

export const getColorByRole = (status: RoleRender): string =>
  STATUS_COLORS[status] || 'default';
