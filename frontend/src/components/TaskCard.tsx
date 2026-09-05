import { Trash2 } from "lucide-react";
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
        <p className={completed ? "line-through" : ""}>{text}</p>
        <button onClick={handleRemoveTask}>
          <Trash2 size={13} /> Remove
        </button>
      </div>
    </li>
  );
}

export default TaskCard;
