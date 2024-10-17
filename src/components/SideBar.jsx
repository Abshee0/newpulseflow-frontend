import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@headlessui/react";
import boardIcon from "../assets/board-icon.svg";
import useDarkMode from "../hooks/useDarkMode";
import darkIcon from "../assets/icon-dark-theme.svg";
import lightIcon from "../assets/icon-light-theme.svg";
import showSidebarIcon from "../assets/icon-show-sidebar.svg";
import hideSidebarIcon from "../assets/icon-hide-sidebar.svg";
import { fetchBoards, setBoardActive } from "../redux/boardsSlice"; // Import thunks
import AddEditBoardModal from "../modals/AddEditBoardModal";

const Sidebar = ({ isSideBarOpen, setIsSideBarOpen }) => {
  const dispatch = useDispatch();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(colorTheme === "light");

  const toggleDarkMode = (checked) => {
    setTheme(colorTheme);
    setDarkSide(checked);
  };

  // Fetch boards on component mount
  useEffect(() => {
    dispatch(fetchBoards()); // Fetch boards from MongoDB
  }, [dispatch]);

  // Access boards from Redux store
  const boards = useSelector((state) => state.boards.boards);  // Adjust state access

  const toggleSidebar = () => {
    setIsSideBarOpen((curr) => !curr);
  };

  return (
    <div>
      <div
        className={
          isSideBarOpen
            ? `min-w-[261px] bg-[#f1faf8] dark:bg-[#081d18]  fixed top-[72px] h-screen  items-center left-0 z-20`
            : ` bg-[#9ccec4] dark:bg-[#316359] dark:hover:bg-[#9ccec4] top-auto bottom-10 justify-center items-center hover:opacity-80 cursor-pointer  p-0 transition duration-300 transform fixed felx w-[56px] h-[48px] rounded-r-full  `
        }
      >
        <div>
          {isSideBarOpen && (
            <div className="bg-[#f1faf8] dark:bg-[#081d18] w-full py-4 rounded-xl">
              <h3 className="dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8 ">
                ALL BOARDS ({boards?.length})
              </h3>

              <div className="dropdown-borad flex flex-col h-[70vh] justify-between">
                <div>
                  {boards.map((board) => (
                    <div
                    key={board._id} // Ensure MongoDB `_id` is used as a unique key
                    className={`flex items-baseline space-x-2 ...`}
                    onClick={() => {
                      dispatch(setBoardActive(board._id));  // Use MongoDB ID
                    }}
                  >
                    <img src={boardIcon} className="filter-white h-4" alt="Board icon" />
                    <p className="text-lg font-bold">{board.name}</p>
                  </div>
                  ))}

                  <div
                    className="flex items-baseline space-x-2 mr-8 rounded-r-full duration-500 ease-in-out cursor-pointer text-[#316359] px-5 py-4 hover:bg-[#9ccec4] hover:text-[#7aaabd] dark:hover:bg-[#f4f8f1]"
                    onClick={() => {
                      setIsBoardModalOpen(true);
                    }}
                  >
                    <img src={boardIcon} className="filter-white h-4" alt="Create new board icon" />
                    <p className="text-lg font-bold">Create New Board</p>
                  </div>
                </div>

                <div className="mx-2 p-4 relative space-x-2 bg-[#9ccec4] dark:bg-[#316359] flex justify-center items-center rounded-lg">
                  <img src={lightIcon} alt="sun indicating light mode" />
                  <Switch
                    checked={darkSide}
                    onChange={toggleDarkMode}
                    className={`${darkSide ? "bg-[#427285]" : "bg-[#cedbd8]"} relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${darkSide ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                  <img src={darkIcon} alt="moon indicating dark mode" />
                </div>
              </div>
            </div>
          )}

          {/* Sidebar hide/show toggle */}
          {isSideBarOpen ? (
            <div
              onClick={toggleSidebar}
              className="flex items-center mt-2 absolute bottom-16 text-lg font-bold rounded-r-full hover:text-[#316359] cursor-pointer mr-6 mb-8 px-8 py-4 hover:bg-[#9ccec4] dark:hover:bg-[#316359] dark:hover:text-[#f4f8f1] space-x-2 justify-center my-4 text-gray-500"
            >
              <img className="min-w-[20px]" src={hideSidebarIcon} alt="Hide sidebar icon" />
              <p>Hide Sidebar</p>
            </div>
          ) : (
            <div className="absolute p-5" onClick={toggleSidebar}>
              <img src={showSidebarIcon} alt="Show sidebar icon" />
            </div>
          )}
        </div>
      </div>

      {isBoardModalOpen && (
        <AddEditBoardModal
          type="add"
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
};

export default Sidebar;
