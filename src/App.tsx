import { useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import { maxId, Task } from "./TaskUtil";
import { TaskInput } from "./components/TaskInput";

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Estudiar React", completed: false },
    { id: 2, text: "Practicar Typescript", completed: false },
    { id: 3, text: "Entender Estado", completed: true },
  ]);

  const addTask = (text:string)=>{
    const nextId = maxId(tasks)+1;
    setTasks([...tasks, { id: nextId, text, completed: false }]);
  };

  const removeTask = (id:number) =>{
    setTasks(tasks.filter(task=> task.id != id));
  }

  return (
    <div className="app-container">
      <Header />
      <TaskInput onAddTask={addTask} />
      <TaskList tasks={tasks} onRemoveTask={removeTask}/>
    </div>
  );
}

export default App;
