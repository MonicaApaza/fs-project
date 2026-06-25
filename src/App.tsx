import { useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import { Task } from "./Task";

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Estudiar React", completed: false },
    { id: 2, text: "Practicar Typescript", completed: false },
    { id: 3, text: "Entender Estado", completed: true },
  ]);

  return (
    <div className="app-container">
      <Header />
      <TaskList tasks={tasks}/>
    </div>
  );
}

export default App;
