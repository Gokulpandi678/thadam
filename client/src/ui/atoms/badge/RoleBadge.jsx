import React from 'react';

const ROLE_CONFIG = {
  C : { className: 'bg-emerald-50 text-emerald-500' },
  L : { className: 'bg-blue-50 text-blue-500' },
  P : { className: 'bg-fuchsia-50 text-fuchsia-500' },
  M : { className: 'bg-orange-50 text-orange-500' },
};

const RoleBadge = ({ role }) => {
  const config = ROLE_CONFIG[role[0]] ?? { className: 'bg-slate-100 text-slate-500' };

  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.75 rounded-full tracking-[0.3px] ${config.className}`}>
      {role}
    </span>
  );
};

export default RoleBadge;