import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await API.get(`/books/user/${user.user.id}`);
        setBooks(res.data);
      } catch (err) { console.error(err); }
    })();
  }, [user]);

  if (!user) return <div>Please login</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold">{user.user.name}'s Profile</h2>
        <div className="text-sm text-gray-600">{user.user.email}</div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-3">Your Books</h3>
        {books.length === 0 ? (
          <div className="text-gray-600">You have not added any books yet.</div>
        ) : (
          <ul className="space-y-2">
            {books.map(b => (
              <li key={b._id} className="flex justify-between items-center border rounded p-3">
                <div>
                  <Link to={`/books/${b._id}`} className="font-medium text-blue-600">{b.title}</Link>
                  <div className="text-sm text-gray-600">{b.author}</div>
                </div>
                <div>
                  <Link to={`/edit/${b._id}`} className="px-3 py-1 border rounded">Edit</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
