import { TaskProps } from "../TaskUtil";

function TaskCard({ id, text, completed, onRemoveTask }: TaskProps) {
  const handleRemoveTask = () => {
    onRemoveTask(id);
  };

  return (
    <li>
      <div className="task-card">
        <p>{text}</p>
        <button onClick={handleRemoveTask}>Remove</button>
      </div>
    </li>
  );
}

export default TaskCard;
