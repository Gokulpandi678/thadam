import { useMemo } from 'react';

export const useDashboardViewModel = (raw) => {
    console.log(raw)
  return useMemo(() => {
    if (!raw) return null;

    const validRoles = (raw.contactsByRole || []).filter((r) => r.type);
    const validCities = (raw.contactsByCity || []).filter((c) => c.type);
    const validStates = (raw.contactsByState || []).filter((s) => s.type);

    return {
      stats: {
        totalContacts: raw.totalContacts ?? 0,
        meetingsThisMonth: raw.meetingsThisMonth ?? 0,
        differentCompanies: raw.differentCompanies ?? 0,
        totalLogs: raw.totalLogs ?? 0,
      },
      contactsByRole: validRoles,
      contactsByCity: validCities,
      contactsByState: validStates,
      recentContacts: (raw.recentContacts || []).slice(0, 5),
      mostMetContacts: (raw.mostMetContacts || []).slice(0, 5),
    };
  }, [raw]);
};