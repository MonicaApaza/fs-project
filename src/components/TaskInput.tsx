import React from "react";
import { useState } from "react";

type TaskInputProps = {
  onAddTask: (text: string) => void;
};

export const TaskInput = (props: TaskInputProps) => {
  const [text, settext] = useState("");
  function handleSubmit(): void {
    if (!text.trim()) return;

    props.onAddTask(text);
    settext("");
  }

  return (
    <div className="task-input">
      
        <input
          type="text"
          name="task"
          placeholder="Escribe una nueva tarea"
          value={text}
          onChange={(event) => settext(event.target.value)}
        />
      

      <button onClick={handleSubmit}>Agregar</button>
    </div>
  );
};
