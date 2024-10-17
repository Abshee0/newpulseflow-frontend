import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ElipsisMenu from "../components/ElipsisMenu";
import elipsis from "../assets/icon-vertical-ellipsis.svg";
import boardsSlice from "../redux/boardsSlice";
import Subtask from "../components/Subtask";
import AddEditTaskModal from "./AddEditTaskModal";
import DeleteModal from "./DeleteModal";

function TaskModal({ taskIndex, colIndex, setIsTaskModalOpen }) {
  const dispatch = useDispatch();
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  
  const boards = useSelector((state) => state.boards.boards);
  const board = boards.find((board) => board.isActive);
  const columns = board.columns;
  const col = columns[colIndex];
  const task = col.tasks[taskIndex];
  const subtasks = task.subtasks;

  const completedSubtasks = subtasks.filter(subtask => subtask.isCompleted).length;

  const [status, setStatus] = useState(task.status);
  const [newColIndex, setNewColIndex] = useState(colIndex);

  const onChange = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onClose = (e) => {
    if (e.target !== e.currentTarget) return;
    dispatch(
      boardsSlice.actions.setTaskStatus({
        taskIndex,
        colIndex,
        newColIndex,
        status,
      })
    );
    setIsTaskModalOpen(false);
  };

  const onDeleteBtnClick = () => {
    dispatch(boardsSlice.actions.deleteTask({ taskIndex, colIndex }));
    setIsTaskModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center px-2 py-4 bg-black bg-opacity-50 overflow-hidden z-50"
    >
      <div className="bg-[#f1faf8] dark:bg-[#081d18] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl overflow-y-scroll max-h-[95vh]">
        <div className="relative flex justify-between items-center">
          <h1 className="text-lg">{task.title}</h1>
          <img
            onClick={() => setIsElipsisMenuOpen(prevState => !prevState)}
            src={elipsis}
            alt="ellipsis"
            className="cursor-pointer h-6"
          />
          {isElipsisMenuOpen && (
            <ElipsisMenu
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
              type="Task"
            />
          )}
        </div>
        <p className="text-[#558191] font-[600] tracking-wide text-xs pt-6">
          {task.description}
        </p>
        <p className="pt-6 text-[#558191] tracking-widest text-sm">
          Subtasks ({completedSubtasks} of {subtasks.length})
        </p>
        <div className="mt-3 space-y-2">
          {subtasks.map((subtask, index) => (
            <Subtask
              key={index}
              index={index}
              taskIndex={taskIndex}
              colIndex={colIndex}
            />
          ))}
        </div>
        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm dark:text-white text-gray-500">
            Current Status
          </label>
          <select
            className="select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent border-[1px] border-gray-300 focus:outline-[#427285] outline-none"
            value={status}
            onChange={onChange}
          >
            {columns.map((col, index) => (
              <option key={index} value={col.name}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteModal
          onDeleteBtnClick={onDeleteBtnClick}
          type="task"
          title={task.title}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      )}
      {isAddTaskModalOpen && (
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsAddTaskModalOpen}
          setIsTaskModalOpen={setIsTaskModalOpen}
          type="edit"
          taskIndex={taskIndex}
          prevColIndex={colIndex}
        />
      )}
    </div>
  );
}

export default TaskModal;
