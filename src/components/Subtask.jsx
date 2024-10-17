import React from "react";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "../redux/boardsSlice";

function Subtask({ index, taskIndex, colIndex }) {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const board = boards.find((board) => board.isActive);
  const col = board.columns[colIndex];
  const task = col.tasks[taskIndex];
  const subtask = task.subtasks[index];
  const checked = subtask.isCompleted;

  const onChange = () => {
    dispatch(
      boardsSlice.actions.setSubtaskCompleted({ index, taskIndex, colIndex })
    );
  };

  return (
    <div className="w-full flex hover:bg-[#9ccec4] dark:hover:bg-[#558191] rounded-md relative items-center justify-start dark:bg-[#316359] p-3 gap-4 bg-[#9ccec4]">
      <input
        className="w-4 h-4 accent-[#427285] cursor-pointer"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <p className={checked ? "line-through opacity-30" : ""}>
        {subtask.title}
      </p>
    </div>
  );
}

export default Subtask;
