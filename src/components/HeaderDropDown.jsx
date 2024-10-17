import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@headlessui/react";
import boardIcon from "../assets/board-icon.svg";
import useDarkMode from "../hooks/useDarkMode";
import darkIcon from "../assets/icon-dark-theme.svg";
import lightIcon from "../assets/icon-light-theme.svg";
import boardsSlice from "../redux/boardsSlice";

function HeaderDropDown({ setOpenDropdown, setIsBoardModalOpen }) {
  const dispatch = useDispatch();
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(colorTheme === "light");

  const toggleDarkMode = (checked) => {
    setTheme(checked ? "dark" : "light");
    setDarkSide(checked);
  };

  const boards = useSelector((state) => state.boards);

  return (
    <div
      className="py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-0 pt-16 dropdown"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenDropdown(false);
      }}
    >
      {/* DropDown Modal */}
      <div className="bg-[#f1faf8] dark:bg-[#0a0e07] shadow-md shadow-[#364e7e1a] w-full py-4 rounded-xl">
        <h3 className="dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8">
          ALL BOARDS ({boards?.length})
        </h3>

        <div className="dropdown-board">
          {boards.map((board, index) => (
            <div
              className={`flex items-baseline space-x-2 px-5 py-4 ${
                board.isActive ? "bg-[#9ccec4] rounded-r-full text-[#316359] mr-8" : ""
              }`}
              key={index}
              onClick={() => dispatch(boardsSlice.actions.setBoardActive({ index }))}
            >
              <img src={boardIcon} className="filter-white h-4" alt="board icon" />
              <p className="text-lg font-bold cursor-pointer">{board.name}</p>
            </div>
          ))}

          <div
            onClick={() => {
              setIsBoardModalOpen(true);
              setOpenDropdown(false);
            }}
            className="flex items-baseline space-x-2 text-[#316359] px-5 py-4"
          >
            <img src={boardIcon} className="filter-white h-4" alt="board icon" />
            <p className="text-lg font-bold cursor-pointer">Create New Board</p>
          </div>

          <div className="mx-2 p-4 space-x-2 bg-[#9ccec4] dark:bg-[#316359] flex justify-center items-center rounded-lg">
            <img src={lightIcon} alt="sun indicating light mode" />

            <Switch
              checked={darkSide}
              onChange={toggleDarkMode}
              className={`${darkSide ? "bg-[#427285]" : "bg-[#cedbd8]"} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable dark mode</span>
              <span
                className={`${darkSide ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>

            <img src={darkIcon} alt="moon indicating dark mode" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderDropDown;
