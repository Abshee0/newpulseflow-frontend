import React, { useState } from "react";
import { useSelector } from "react-redux";
import TaskModal from "../modals/TaskModal";

function Task({ colIndex, taskIndex }) {
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board.columns;
  const col = columns[colIndex];
  const task = col.tasks[taskIndex];
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  let completed = 0;
  const subtasks = task.subtasks;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex })
    );
  };

  return (
    <div>
      <div
        onClick={() => setIsTaskModalOpen(true)}
        draggable
        onDragStart={handleOnDrag}
        className="w-[280px] first:my-5 rounded-lg bg-[#9ccec4] dark:bg-[#316359] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#558191] dark:text-white dark:hover:text-[#558191] cursor-pointer"
      >
        <p className="font-bold tracking-wide">{task.title}</p>
        <p className="font-bold text-xs tracking-tighter mt-2 text-[#558191]">
          {completed} of {subtasks.length} completed tasks
        </p>
      </div>
      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}

export default Task;
