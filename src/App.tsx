import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import { maxId, Task } from "./TaskUtil";
import { TaskInput } from "./components/TaskInput";
import Footer from "./components/Footer";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const serviceUrl = "http://localhost:1234/tasks";

  useEffect(() => {
    // Fetch tasks from the backend API when the component mounts
    fetch(serviceUrl)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const addTask = async (text: string) => {
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      const data = await response.json();
      setTasks([...tasks, data.task]);
    } else {
      console.error("Error adding task:", response.statusText);
    }
  };


  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id != id));
  };

  const markCompleted = (id: number, completed: boolean) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: completed } : task,
      ),
    );
  };

  return (
    <div className="app-container">
      <Header />
      <TaskInput onAddTask={addTask} />
      <TaskList
        tasks={tasks}
        onRemoveTask={removeTask}
        onMarkCompleted={markCompleted}
      />
      <Footer
        completed={tasks.filter((task) => task.completed).length}
        total={tasks.length}
      />
    </div>
  );
}

export default App;
