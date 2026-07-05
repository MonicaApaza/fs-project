import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import { Task } from "./TaskUtil";
import { TaskInput } from "./components/TaskInput";
import Footer from "./components/Footer";
import Login from "./components/Login";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const serviceUrl = "http://localhost:1234/tasks";
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  if (!token) {
    return <Login />;
  }

  useEffect(() => {
    // Fetch tasks from the backend API when the component mounts
    fetch(serviceUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const addTask = async (text: string) => {
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

  const removeTask = async (id: number) => {
    const response = await fetch(`${serviceUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setTasks(tasks.filter((task) => task.id !== id));
    } else {
      console.error("Error removing task:", response.statusText);
    }
  };

  const markCompleted = async (id: number, completed: boolean) => {
    const response = await fetch(`${serviceUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed }),
    });

    if (response.ok) {
      const data = await response.json();
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: data.task.completed } : task,
        ),
      );
    } else {
      console.error("Error updating task:", response.statusText);
    }
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
