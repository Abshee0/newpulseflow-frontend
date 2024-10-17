import React, { useState, useEffect } from "react";
import crossIcon from "../assets/icon-cross.svg";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { addNewBoard, editBoard } from "../redux/boardsSlice"; // Correct imports

function AddEditBoardModal({ setIsBoardModalOpen, type }) {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [name, setName] = useState("");
  const [newColumns, setNewColumns] = useState([
    { name: "Todo", tasks: [], id: uuidv4() },
    { name: "Doing", tasks: [], id: uuidv4() },
  ]);
  const [isValid, setIsValid] = useState(true);
  const boards = useSelector((state) => state.boards.boards);
  const board = boards.find((board) => board.isActive);

  useEffect(() => {
    if (type === "edit" && isFirstLoad && board) {
      setNewColumns(
        board.columns.map((col) => ({
          ...col,
          id: uuidv4(),
        }))
      );
      setName(board.name);
      setIsFirstLoad(false);
    }
  }, [type, isFirstLoad, board]);

  const validate = () => {
    let valid = true;
    if (!name.trim()) valid = false;
    newColumns.forEach((col) => {
      if (!col.name.trim()) valid = false;
    });
    setIsValid(valid);
    return valid;
  };

  const onChange = (id, newValue) => {
    setNewColumns((prevState) =>
      prevState.map((col) => (col.id === id ? { ...col, name: newValue } : col))
    );
  };

  const onDelete = (id) => {
    setNewColumns((prevState) => prevState.filter((col) => col.id !== id));
  };

  const onSubmit = () => {
    if (validate()) {
      setIsBoardModalOpen(false);
      if (type === "add") {
        dispatch(addNewBoard({ name, columns: newColumns })); // Add new board
      } else {
        dispatch(editBoard({ id: board._id, name, columns: newColumns })); // Edit existing board
      }
    }
  };

  return (
    <div
      className="fixed inset-0 px-2 py-4 overflow-scroll scrollbar-hide z-50 flex justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsBoardModalOpen(false);
        }
      }}
    >
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-[#f1faf8] dark:bg-[#081d18] text-[#12180c] dark:text-[#edf3e7] font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
        <h3 className="text-lg">{type === "edit" ? "Edit" : "Add New"} Board</h3>

        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm text-[#12180c] dark:text-[#edf3e7] text-[500]">
            Board Name
          </label>
          <input
            className="bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#427285] outline-[2px] ring-0"
            placeholder="e.g Web Design"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="board-name-input"
          />
        </div>

        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm text-[#12180c] dark:text-[#edf3e7] text-[500]">
            Board Columns
          </label>

          {newColumns.map((column) => (
            <div key={column.id} className="flex items-center w-full">
              <input
                className="bg-transparent outline-none focus:border-0 flex-grow px-4 py-2 rounded-md text-sm border-[0.5px] border-gray-600 focus:outline-[#427285] outline-[2px] ring-0"
                onChange={(e) => onChange(column.id, e.target.value)}
                type="text"
                value={column.name}
              />
              <img
                src={crossIcon}
                onClick={() => onDelete(column.id)}
                className="m-4 cursor-pointer"
                alt="delete column"
              />
            </div>
          ))}
          <div>
            <button
              className="w-full items-center hover:opacity-70 text-white bg-[#316359] py-2 rounded-full"
              onClick={() => {
                setNewColumns((state) => [
                  ...state,
                  { name: "", tasks: [], id: uuidv4() },
                ]);
              }}
            >
              + Add New Column
            </button>
            <button
              onClick={onSubmit}
              className="w-full items-center hover:opacity-70 mt-8 text-white bg-[#316359] py-2 rounded-full"
            >
              {type === "add" ? "Create New Board" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditBoardModal;
