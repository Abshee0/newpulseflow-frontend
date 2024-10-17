import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import crossIcon from "../assets/icon-cross.svg";
import boardsSlice from "../redux/boardsSlice";

function AddEditTaskModal({
  type,
  device,
  setIsTaskModalOpen,
  setIsAddTaskModalOpen,
  taskIndex,
  prevColIndex = 0,
}) {
  const dispatch = useDispatch();
  const [isValid, setIsValid] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const board = useSelector((state) => state.boards.find((board) => board.isActive));
  const columns = board?.columns || [];
  const col = columns[prevColIndex];
  const task = col ? col.tasks[taskIndex] : null;
  const [status, setStatus] = useState(col?.name || "");
  const [newColIndex, setNewColIndex] = useState(prevColIndex);
  const [subtasks, setSubtasks] = useState([
    { title: "", isCompleted: false, id: uuidv4() },
    { title: "", isCompleted: false, id: uuidv4() },
  ]);

  // UseEffect for setting initial state if type is 'edit'
  useEffect(() => {
    if (type === "edit" && task) {
      setSubtasks(
        task.subtasks.map((subtask) => ({ ...subtask, id: uuidv4() }))
      );
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [type, task]);

  const onChangeSubtasks = (id, newValue) => {
    setSubtasks((prevState) => {
      return prevState.map((subtask) =>
        subtask.id === id ? { ...subtask, title: newValue } : subtask
      );
    });
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const validate = () => {
    if (!title.trim()) {
      setIsValid(false);
      return false;
    }
    if (subtasks.some((subtask) => !subtask.title.trim())) {
      setIsValid(false);
      return false;
    }
    setIsValid(true);
    return true;
  };

  const onDelete = (id) => {
    setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
  };

  const onSubmit = () => {
    if (!validate()) return;

    const payload = {
      title,
      description,
      subtasks,
      status,
      taskIndex,
      prevColIndex,
      newColIndex,
    };

    if (type === "add") {
      dispatch(boardsSlice.actions.addTask(payload));
    } else {
      dispatch(boardsSlice.actions.editTask(payload));
    }
    setIsAddTaskModalOpen(false);
    if (type === "edit") setIsTaskModalOpen(false);
  };

  return (
    <div
      className={`py-6 px-6 pb-40 absolute overflow-y-scroll left-0 flex right-0 top-0 ${
        device === "mobile" ? "bottom-[-100vh]" : "bottom-0"
      } dropdown`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        setIsAddTaskModalOpen(false);
      }}
    >
      {/* Modal Section */}
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-[#f1faf8] dark:bg-[#081d18] text-[#12180c] dark:text-[#edf3e7] font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
        <h3 className="text-lg">{type === "edit" ? "Edit" : "Add New"} Task</h3>

        {/* Task Name */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-[#12180c] dark:text-[#edf3e7] text-[500]">
            Task Name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="task-name-input"
            type="text"
            className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border-[0.5px] border-gray-600 focus:border-none focus:outline-[#427285] outline-[2px] ring-0"
            placeholder="e.g Take coffee break"
          />
        </div>

        {/* Description */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-[#12180c] dark:text-[#edf3e7] text-[500]">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="task-description-input"
            className="bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#427285] outline-[2px]"
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          />
        </div>

        {/* Subtasks */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm text-[#12180c] dark:text-[#edf3e7] text-[500]">
            Subtasks
          </label>
          {subtasks.map((subtask, index) => (
            <div key={subtask.id} className="flex items-center w-full">
              <input
                onChange={(e) => onChangeSubtasks(subtask.id, e.target.value)}
                type="text"
                value={subtask.title}
                className="bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#427285] outline-[2px]"
                placeholder="e.g Take coffee break"
              />
              <img
                src={crossIcon}
                onClick={() => onDelete(subtask.id)}
                className="m-4 cursor-pointer"
                alt="delete"
              />
            </div>
          ))}
          <button
            className="w-full items-center text-white bg-[#316359] py-2 rounded-full"
            onClick={() =>
              setSubtasks((prevState) => [
                ...prevState,
                { title: "", isCompleted: false, id: uuidv4() },
              ])
            }
          >
            + Add New Subtask
          </button>
        </div>

        {/* Current Status */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm text-[#12180c] dark:text-[#edf3e7] text-[500]">
            Current Status
          </label>
          <select
            value={status}
            onChange={onChangeStatus}
            className="select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0 border-[1px] border-gray-300 focus:outline-[#427285] outline-none"
          >
            {columns.map((column, index) => (
              <option key={index}>{column.name}</option>
            ))}
          </select>
          <button
            onClick={onSubmit}
            className="w-full items-center text-white bg-[#316359] py-2 rounded-full"
          >
            {type === "edit" ? "Save Edit" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditTaskModal;
