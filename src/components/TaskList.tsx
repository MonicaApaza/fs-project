import TaskCard from "./TaskCard";
import { Task } from "../Task";

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.map((task, index) => (
        <TaskCard key={index} text={task.text}></TaskCard>
      ))}
    </ul>
  );
}

export default TaskList;
