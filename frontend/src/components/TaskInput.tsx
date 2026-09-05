import { Plus } from "lucide-react";
import React from "react";
import { useState } from "react";

type TaskInputProps = {
  onAddTask: (text: string) => void;
};

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [text, settext] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddTask(text);
    settext("");
  };

  return (
    <div className="task-input">
      <input
        type="text"
        name="task"
        placeholder="What needs to be done?"
        value={text}
        onChange={(event) => settext(event.target.value)}
        onKeyDown={(event) => (event.key === "Enter" ? handleSubmit() : "")}
      />

      <button className="task-btn" onClick={handleSubmit}>
        {" "}
        <Plus size={16} />
        Add Task
      </button>
    </div>
  );
};
