import "./Pagination.css";

export default function Pagination({ totalItems, pageItems, currentPage, onPageChange }) {
  const totalBtns = Math.ceil(totalItems / pageItems);

  function handlePageChange(value) {
    onPageChange(value);
  }

  function renderButtons() {
    const buttons = [];
    for (let i = 0; i < totalBtns; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-item ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  }

  return <div className="pagination-list">{renderButtons()}</div>;
}