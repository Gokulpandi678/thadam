const SortIcon = ({ direction }) => {
  if (!direction) {
    return (
      <span className="ml-1 inline-flex flex-col gap-0.5 opacity-30">
        <svg width="8" height="5" viewBox="0 0 8 5" fill="currentColor">
          <path d="M4 0L8 5H0L4 0Z" />
        </svg>
        <svg
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="currentColor"
          className="rotate-180"
        >
          <path d="M4 0L8 5H0L4 0Z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="ml-1 inline-flex opacity-80">
      <svg
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="currentColor"
        className={direction === "desc" ? "" : "rotate-180"}
      >
        <path d="M4 0L8 5H0L4 0Z" />
      </svg>
    </span>
  );
};

export default SortIcon;
