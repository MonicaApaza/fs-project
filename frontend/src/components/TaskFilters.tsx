export type TaskFilter = "all" | "pending" | "completed";

type TaskFiltersProps = {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
};

const filters: { label: string; value: TaskFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

function TaskFilters({ activeFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="task-filters" aria-label="Filter tasks">
      {filters.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          className={activeFilter === value ? "filter-btn active" : "filter-btn"}
          aria-pressed={activeFilter === value}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default TaskFilters;
