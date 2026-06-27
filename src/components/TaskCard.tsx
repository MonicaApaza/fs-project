import { TaskProps } from "../TaskUtil";

function TaskCard({
  id,
  text,
  completed,
  onRemoveTask,
  onMarkCompleted,
}: TaskProps) {
  const handleRemoveTask = () => {
    onRemoveTask(id);
  };

  const handleCheckChange = () => {
    onMarkCompleted(id, !completed);
  };

  return (
    <li>
      <div className="task-card">
        <input
          type="checkbox"
          placeholder="Mark task completed"
          onChange={handleCheckChange}
          checked={completed}
        />
        <p>{text}</p>
        <button onClick={handleRemoveTask}>Remove</button>
      </div>
    </li>
  );
}

export default TaskCard;
