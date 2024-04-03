import { Filter } from '../schemas/Filter';

export const accountsEnabledFilter = { isEnabled: true };
export const splitProctorTimeZone = {
  region: {
    $arrayElemAt: [{ $split: ['$proctorTimeZone', '/'] }, 0],
  },
};
export const groupByRegion = {
  _id: '$region',
  count: {
    $sum: 1,
  },
};

export const addRegionField = {
  _id: 0,
  region: '$_id',
  count: 1,
};

export const sortByCount = {
  count: -1,
};

export const getAccountsQuery = (filter: Filter) => {
  if (!filter.byRegion.length && !filter.byStatus.length) return {};

  const filters = [];
  const filterByRegion = filter.byRegion.map((region: string) => ({
    proctorTimeZone:
    new RegExp(`^${region}`, 'g'),
  }));
  if (filterByRegion.length) filters.push({ $or: filterByRegion });

  const filterByStatus = filter.byStatus.map((status: string) => ({ isEnabled: status === 'active' }));
  if (filterByStatus.length) filters.push({ $or: filterByStatus });

  const query = {
    $and: filters,
  };

  return query;
};
