import TaskCard from "./TaskCard";
import { Task } from "../TaskUtil";

type TaskListProps = {
  tasks: Task[];
  onRemoveTask: (id: number) => void;
};

function TaskList({ tasks, onRemoveTask }: TaskListProps) {
  return (
    <ul>
      {tasks.map((task) => {
        const { id, text, completed } = task;
        return (
          <TaskCard
            key={id}
            id={id}
            text={text}
            completed={completed}
            onRemoveTask={onRemoveTask}
          />
        );
      })}
    </ul>
  );
}

export default TaskList;
