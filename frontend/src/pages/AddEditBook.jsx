import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";

export default function AddEditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    year: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setForm({
          title: res.data.title || "",
          author: res.data.author || "",
          description: res.data.description || "",
          genre: res.data.genre || "",
          year: res.data.year || ""
        });
      } catch (err) { alert("Could not load book"); }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setLoading(true);
    try {
      if (id) await API.put(`/books/${id}`, form);
      else await API.post(`/books`, form);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">{id ? "Edit Book" : "Add Book"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Title</label>
          <input required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Author</label>
          <input required value={form.author} onChange={(e)=>setForm({...form, author:e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Genre</label>
          <input value={form.genre} onChange={(e)=>setForm({...form, genre:e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Published Year</label>
          <input type="number" value={form.year} onChange={(e)=>setForm({...form, year:e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className="w-full border p-2 rounded" rows={5} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
