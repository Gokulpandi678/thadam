import { useNavigate } from "react-router-dom";

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0]?.toUpperCase() ?? "";
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const EmptyState = ({ name }) => (

  <div className="flex flex-col items-center justify-center flex-1 gap-2 py-6 text-center">
    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 flex items-center justify-center">
      <svg
        className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a4 4 0 00-5.196-3.793M9 20H4v-2a4 4 0 015.196-3.793M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0zM3 11a3 3 0 116 0 3 3 0 01-6 0z"
        />
      </svg>
    </div>

    ```
    <p className="text-sm lg:text-base font-medium text-gray-500">No data yet</p>

    <p className="text-xs text-gray-400">
      {name === "Recent Contacts"
        ? "Contacts you interact with will appear here."
        : "Meeting engagement stats will show up here."}
    </p>
    ```

  </div>
);

const MetricsCard = ({ data = [], name }) => {
  const navigate = useNavigate();

  const MIN_ROWS = 5;
  const isEmpty = data.length === 0;
  const hasGap = !isEmpty && data.length < MIN_ROWS;

  return (<div className="flex flex-col gap-4 lg:gap-5 bg-white rounded-xl shadow-xl p-4 lg:p-6 h-full">

    {/* Title */}
    <h2 className="text-lg lg:text-xl font-semibold">{name}</h2>

    <div className="flex flex-col gap-2 lg:gap-3 flex-1">

      {isEmpty ? (
        <EmptyState name={name} />
      ) : (
        <>
          {data.map((item, i) => (
            <div className="flex justify-between items-center gap-2" key={i}>

              {/* Left Section */}
              <div className="flex items-center gap-3 min-w-0">

                {/* Avatar */}
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs lg:text-sm font-semibold shrink-0">
                  {getInitials(item?.name ?? "")}
                </div>

                {/* Name + Company */}
                <div className="flex flex-col min-w-0">

                  <span
                    className="text-sm lg:text-base text-blue-700 cursor-pointer hover:underline truncate"
                    onClick={() => navigate(`/customer/${item?.id}`)}
                  >
                    {item?.name ?? "Unknown User"}
                  </span>

                  {item?.company && item?.designation && (
                    <span className="text-[11px] lg:text-xs text-gray-500 truncate max-w-[170px] lg:max-w-none">
                      {`${item.company} · ${item.designation}`}
                    </span>
                  )}

                </div>
              </div>

              {/* Right Section */}
              <span
                className={`text-gray-500 whitespace-nowrap ${name === "Recent Contacts"
                  ? "text-[11px] lg:text-xs"
                  : "text-sm lg:text-base"
                  }`}
              >
                {name === "Recent Contacts"
                  ? item?.addedAgo
                  : item?.meetCount}
              </span>

            </div>
          ))}

          {/* Gap filler when rows < MIN_ROWS */}
          {hasGap && (
            <div className="flex flex-col items-center justify-center flex-1 gap-1 rounded-lg bg-gray-50 border border-dashed border-gray-200 mt-1 py-4 text-center">

              <p className="text-xs text-gray-400 font-medium">
                More activity coming soon
              </p>

              <p className="text-[11px] lg:text-xs text-gray-300">
                {name === "Recent Contacts"
                  ? "Add contacts to see them here."
                  : "Schedule meetings to grow this list."}
              </p>

            </div>
          )}
        </>
      )}

    </div>
  </div>

  );
};

export default MetricsCard;
