import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";

const ReviewItem = ({ review, onDelete, onEdit, currentUserId }) => {
  return (
    <div className="border rounded p-3 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{review.user?.name || "Unknown"}</div>
          <div className="text-sm text-yellow-600">{'★'.repeat(review.rating)} {review.rating}</div>
        </div>
        {currentUserId === review.user?._id && (
          <div className="flex gap-2">
            <button onClick={() => onEdit(review)} className="text-sm text-blue-600">Edit</button>
            <button onClick={() => onDelete(review._id)} className="text-sm text-red-600">Delete</button>
          </div>
        )}
      </div>
      <p className="mt-2 text-gray-700">{review.text}</p>
    </div>
  );
};

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  const fetchBook = async () => {
    try {
      const res = await API.get(`/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.error(err);
      alert("Could not fetch book");
    }
  };

  useEffect(() => { fetchBook(); }, [id]);

  const submitReview = async () => {
    if (!user) return nav("/login");
    try {
      if (editingReview) {
        await API.put(`/reviews/${editingReview._id}`, { rating, text });
        setEditingReview(null);
      } else {
        await API.post(`/reviews/${id}`, { rating, text });
      }
      setRating(5); setText("");
      fetchBook();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving review");
    }
  };

  const startEdit = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setText(review.text || "");
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete review?")) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      fetchBook();
    } catch (err) { alert("Failed to delete"); }
  };

  const deleteBook = async () => {
    if (!window.confirm("Delete book?")) return;
    try {
      await API.delete(`/books/${id}`);
      nav("/");
    } catch (err) { alert("Failed to delete book"); }
  };

  if (!book) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <div className="text-gray-600">By {book.author} • {book.genre} • {book.year}</div>
            <div className="mt-3 text-gray-800">{book.description}</div>
            <div className="mt-3 text-sm text-yellow-600">
              Average: {Number(book.averageRating || 0).toFixed(2)} ({book.reviewsCount || 0})
            </div>
          </div>
          {user && user.user?.id === book.addedBy && (
            <div className="flex gap-2">
              <Link to={`/edit/${book._id}`} className="px-3 py-1 border rounded">Edit</Link>
              <button onClick={deleteBook} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-3">Add / Edit Review</h2>
        {user ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm">Rating</label>
              <select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="border p-2 rounded">
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm">Review</label>
              <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full border p-2 rounded" rows={4} />
            </div>
            <div className="flex gap-2">
              <button onClick={submitReview} className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingReview ? "Save Review" : "Submit Review"}
              </button>
              {editingReview && <button onClick={()=>{ setEditingReview(null); setText(""); setRating(5); }} className="px-4 py-2 border rounded">Cancel</button>}
            </div>
          </div>
        ) : (
          <div><Link to="/login" className="text-blue-600">Login</Link> to add a review.</div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reviews</h3>
        {book.reviews.length === 0 && <div className="text-gray-600">No reviews yet.</div>}
        <div className="grid gap-3">
          {book.reviews.map(r => (
            <ReviewItem
              key={r._id}
              review={r}
              onDelete={deleteReview}
              onEdit={startEdit}
              currentUserId={user?.user?.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
