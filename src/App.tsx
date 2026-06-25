import { useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import { Task } from "./Task";
import { TaskInput } from "./components/TaskInput";

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Estudiar React", completed: false },
    { id: 2, text: "Practicar Typescript", completed: false },
    { id: 3, text: "Entender Estado", completed: true },
  ]);

  const addTask = (text:string)=>{
   setTasks([...tasks, { id: tasks.length+1, text, completed: false }]);
  };

  return (
    <div className="app-container">
      <Header />
      <TaskInput onAddTask={addTask} />
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;
