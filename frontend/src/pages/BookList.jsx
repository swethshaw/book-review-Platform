import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Pagination from "../components/Pagination";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async () => {
    const res = await API.get(`/books?page=${page}`);
    setBooks(res.data.books);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book._id} className="border rounded p-4 shadow">
            <h3 className="text-xl font-semibold">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
            <Link to={`/books/${book._id}`} className="text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};
export default BookList;
