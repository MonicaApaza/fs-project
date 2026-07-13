import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import { Task } from "./TaskUtil";
import { TaskInput } from "./components/TaskInput";
import Footer from "./components/Footer";
import Login from "./components/Login";
import { apiFetch } from "./apiFetch";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const serviceUrl = `${import.meta.env.VITE_API_URL}/tasks`;

  useEffect(() => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }

    apiFetch(serviceUrl, {
      method:"GET",
    })
      .then((response) => {
        if (response.status === 401) {
          handleLogout();
          return null;
        }
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) setTasks(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      });
  }, [isAuthenticated]);

  const handleLoginSuccess = (isAuthenticated: boolean) => {
    setIsAuthenticated(isAuthenticated);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setTasks([]);
  };

  const addTask = async (text: string) => {
    const response = await apiFetch(serviceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isAuthenticated}`,
      },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      const data = await response.json();
      setTasks((prevTasks) => [...prevTasks, data.task]);
    } else {
      console.error("Error adding task:", response.statusText);
    }
  };

  const removeTask = async (id: number) => {
    const response = await apiFetch(`${serviceUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${isAuthenticated}`,
      },
    });

    if (response.ok) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } else {
      console.error("Error removing task:", response.statusText);
    }
  };

  const markCompleted = async (id: number, completed: boolean) => {
    const response = await apiFetch(`${serviceUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${isAuthenticated}`,
      },
      body: JSON.stringify({ completed }),
    });

    if (response.ok) {
      const data = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: data.task.completed } : task,
        ),
      );
    } else {
      console.error("Error updating task:", response.statusText);
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
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
