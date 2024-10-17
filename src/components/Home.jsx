import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBoards } from "../redux/boardsSlice";
import Column from "./Column";
import EmptyBoard from "./EmptyBoard";
import Sidebar from "./SideBar";

function Home() {
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBoards());
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [dispatch]);

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const boards = useSelector((state) => state.boards.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board ? board.columns : [];
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <div
      className={`${
        windowSize[0] >= 768 && isSideBarOpen
          ? "bg-[#f4f8f1] scrollbar-hide h-screen flex dark:bg-[#0a0e07] overflow-x-scroll gap-6 ml-[261px]"
          : "bg-[#f4f8f1] scrollbar-hide h-screen flex dark:bg-[#0a0e07] overflow-x-scroll gap-6"
      }`}
    >
      {windowSize[0] >= 768 && (
        <Sidebar
          setIsBoardModalOpen={setIsBoardModalOpen}
          isBoardModalOpen={isBoardModalOpen}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}

      {/* Columns Section */}
      {columns.length > 0 ? (
        <>
          {columns.map((col, index) => (
            <Column key={index} colIndex={index} />
          ))}
          <div
            onClick={() => setIsBoardModalOpen(true)}
            className="h-screen dark:bg-[#316359] flex justify-center items-center font-bold text-2xl hover:text-[#7aaabd] transition duration-300 cursor-pointer bg-[#9ccec4] scrollbar-hide mb-2 mx-5 pt-[90px] min-w-[280px] text-[#558191] mt-[135px] rounded-lg"
          >
            + New Column
          </div>
        </>
      ) : (
        <EmptyBoard type="edit" />
      )}

      {isBoardModalOpen && (
        <AddEditBoardModal
          type="edit"
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
}

export default Home;
