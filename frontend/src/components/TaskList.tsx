import TaskCard from "./TaskCard";
import { Task } from "../TaskUtil";
import EmptyState from "./EmptyState";

type TaskListProps = {
  tasks: Task[];
  onRemoveTask: (id: number) => void;
  onMarkCompleted:(id:number, completed:boolean) =>void;
};

function TaskList({ tasks, onRemoveTask, onMarkCompleted }: TaskListProps) {
  if(tasks.length ===0){
    return <EmptyState/>
  }
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
            onMarkCompleted={onMarkCompleted}
          />
        );
      })}
    </ul>
  );
}

export default TaskList;
