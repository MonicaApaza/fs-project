export type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export type TaskProps = {
  id: number;
  text: string;
  completed: boolean;
  onRemoveTask: (id: number) => void;
  onMarkCompleted:(id:number, completed:boolean) =>void;
};

export const maxId = (tasks: Task[]) => {
  const maxId = tasks.reduce(
    (max, task) => (task.id > max ? task.id : max),
    0,
  );
  return maxId;
};
