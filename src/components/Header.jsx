import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import iconDown from "../assets/icon-chevron-down.svg";
import iconUp from "../assets/icon-chevron-up.svg";
import elipsis from "../assets/icon-vertical-ellipsis.svg";
import HeaderDropDown from "./HeaderDropDown";
import ElipsisMenu from "./ElipsisMenu";
import AddEditTaskModal from "../modals/AddEditTaskModal";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../modals/DeleteModal";
import boardsSlice, { fetchBoards } from "../redux/boardsSlice";

function Header({ setIsBoardModalOpen, isBoardModalOpen }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [boardType, setBoardType] = useState("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards.boards);
  const board = boards.find((board) => board.isActive);

  // Fetch boards from the backend on page load
  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const onDropdownClick = () => {
    setOpenDropdown((prev) => !prev);
    setIsElipsisMenuOpen(false);
    setBoardType("add");
  };

  const setOpenEditModal = () => {
    setIsBoardModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const onDeleteBtnClick = (e) => {
    if (e.target.textContent === "Delete") {
      dispatch(boardsSlice.actions.deleteBoard());
      dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="p-4 fixed left-0 bg-[#f1faf8] dark:bg-[#081d18] z-50 right-0 ">
      <header className="flex justify-between dark:text-white items-center">
        {/* Left Side */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <img src={Logo} alt="Logo" className="h-12 w-12" />
          <h3 className="md:text-4xl hidden md:inline-block font-bold font-sans text-[#12180c] dark:text-[#edf3e7]">
            PulseFlow
          </h3>
          <div className="flex items-center">
            {board ? (
              <>
                <h3 className="truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans text-[#12180c] dark:text-[#edf3e7]">
                  {board.name}
                </h3>
                <img
                  src={openDropdown ? iconUp : iconDown}
                  alt="Dropdown Icon"
                  className="w-3 ml-2 md:hidden"
                  onClick={onDropdownClick}
                />
              </>
            ) : (
              <h3 className="text-xl font-bold">No Active Board</h3>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex space-x-4 items-center md:space-x-6">
          <button
            className="button hidden md:block"
            onClick={() => setIsTaskModalOpen((prev) => !prev)}
          >
            + Add New Task
          </button>
          <button
            onClick={() => setIsTaskModalOpen((prev) => !prev)}
            className="button py-1 px-3 md:hidden"
          >
            +
          </button>
          <img
            onClick={() => {
              setBoardType("edit");
              setOpenDropdown(false);
              setIsElipsisMenuOpen((prev) => !prev);
            }}
            src={elipsis}
            alt="Elipsis Menu"
            className="cursor-pointer h-6"
          />
          {isElipsisMenuOpen && (
            <ElipsisMenu
              type="Boards"
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          )}
        </div>

        {openDropdown && (
          <HeaderDropDown
            setOpenDropdown={setOpenDropdown}
            setIsBoardModalOpen={setIsBoardModalOpen}
          />
        )}
      </header>

      {isTaskModalOpen && (
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsTaskModalOpen}
          type="add"
          device="mobile"
        />
      )}

      {isBoardModalOpen && (
        <AddEditBoardModal
          setBoardType={setBoardType}
          type={boardType}
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          type="board"
          title={board ? board.name : ""}
          onDeleteBtnClick={onDeleteBtnClick}
        />
      )}
    </div>
  );
}

export default Header;
