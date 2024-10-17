import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Home from "./components/Home";
import EmptyBoard from './components/EmptyBoard';
import boardsSlice, { fetchBoards, setBoardActive } from "./redux/boardsSlice";

function App() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards.boards);
  const activeBoard = boards.find((board) => board.isActive);
  const status = useSelector((state) => state.boards.status);
  const error = useSelector((state) => state.boards.error);

  useEffect(() => {
    // Fetch boards when the component mounts
    dispatch(fetchBoards());
  }, [dispatch]);

  useEffect(() => {
    if (!activeBoard && boards.length > 0) {
      dispatch(setBoardActive({ index: 0 }));
    }
  }, [activeBoard, boards.length, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      console.log('Fetching boards...');
      dispatch(fetchBoards());
    }
  }, [status, dispatch]);

  // Handling loading and error states
  if (status === 'loading') {
    return <div className="text-center">Loading boards...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="overflow-hidden overflow-x-scroll">
      {boards.length > 0 ? (
        <>
          <Header
            setIsBoardModalOpen={setIsBoardModalOpen}
            isBoardModalOpen={isBoardModalOpen}
          />
          <Home
            setIsBoardModalOpen={setIsBoardModalOpen}
            isBoardModalOpen={isBoardModalOpen}
          />
        </>
      ) : (
        <EmptyBoard type='add'/>
      )}
    </div>
  )
}

export default App;
