export const getInitials = (customer) => {
  const first = customer?.firstName?.[0]?.toUpperCase() ?? '';
  const last = customer?.lastName?.[0]?.toUpperCase() ?? '';
  return `${first}${last}`;
};

export const getFullName = (customer) =>
  `${customer?.firstName ?? ''} ${customer?.lastName ?? ''}`.trim();

export const getLocation = (customer) =>
  [customer?.addressCity, customer?.addressCountry].filter(Boolean).join(', ');

export const formatDate = (isoDate) => {
  if (!isoDate) return '—';
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDuration = (minutes) => {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hour${hrs > 1 ? 's' : ''}`;
};

export const calcProfileCompletion = (customer) => {
  if (!customer) return 0;
  const fields = [
    'firstName', 'lastName', 'primaryEmail', 'primaryContactNo',
    'designation', 'company', 'addressCity', 'addressCountry',
    'socialLinkedin', 'referredBy',
  ];
  const filled = fields.filter((f) => Boolean(customer[f])).length;
  return Math.round((filled / fields.length) * 100);
};

export const getLogTitle = (log) => {
  if (log?.title) return log.title;
  const map = {
    EMAIL: 'Email',
    CALL: 'Phone Call',
    MEETING: 'Meeting',
    NOTE: 'Note Added',
    TASK: 'Task',
  };
  return map[log?.type] ?? log?.type ?? 'Activity';
};