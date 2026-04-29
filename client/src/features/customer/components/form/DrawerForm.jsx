import { useEffect, useState } from "react";
import DrawerSection from "./DrawerSection";

/**
 * DrawerForm — config-driven tabbed form engine.
 * All state lives outside (form, onChange, errors) — this component is pure UI.
 */
const DrawerForm = ({ tabs, form, errors = {}, onChange }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (activeTab >= tabs.length) {
      setActiveTab(0);
    }
  }, [activeTab, tabs]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Tab strip */}
      <div className="flex border-b border-slate-100 shrink-0">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2.5 text-[12px] font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
              activeTab === i
                ? "text-blue-600 border-blue-600"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        {tabs[activeTab].sections.map((section, i) => (
          <div key={i}>
            {i > 0 && <div className="border-t border-slate-100 mb-5" />}
            <DrawerSection
              section={section}
              form={form}
              errors={errors}
              onChange={onChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawerForm;
