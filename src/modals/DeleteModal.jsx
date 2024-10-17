import React from "react";

function DeleteModal({ type, title, onDeleteBtnClick, setIsDeleteModalOpen }) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsDeleteModalOpen(false);
        }
      }}
      className="fixed inset-0 flex justify-center items-center px-2 py-4 overflow-hidden z-50 bg-black bg-opacity-50"
    >
      <div className="bg-[#f1faf8] dark:bg-[#081d18] text-[#12180c] dark:text-[#edf3e7] font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl overflow-y-scroll max-h-[95vh]">
        <h3 className="font-bold text-red-500 text-xl">
          Delete this {type}?
        </h3>
        <p className="text-[#558191] font-[600] tracking-wide text-xs pt-6">
          {type === "task"
            ? `Are you sure you want to delete the "${title}" task and its subtasks? This action cannot be reversed.`
            : `Are you sure you want to delete the "${title}" board? This action will remove all columns and tasks and cannot be reversed.`}
        </p>
        <div className="flex w-full mt-4 items-center justify-center space-x-4">
          <button
            onClick={onDeleteBtnClick}
            className="w-full text-[#edf3e7] bg-red-500 py-2 rounded-full hover:opacity-75"
          >
            Delete
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="w-full text-[#316359] dark:bg-[#f4f8f1] bg-[#9ccec4] py-2 rounded-full hover:opacity-75"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
