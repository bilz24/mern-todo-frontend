import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  
  // Load todos from backend
  useEffect(() => {
    api.get('/todos')
    .then(res => setTodos(res.data))
    .catch(err => console.error("Error fetching todos:", err));
  }, []);
  
  // Add new todo (save to backend)
  const addTodo = () => {
    if (input.trim() === "") return;
    api.post('/todos', { text: input, completed: false })
    .then(res => setTodos([...todos, res.data]))
    .catch(err => console.error("Error adding todo:", err));
    setInput("");
  };
  
  // Delete todo (delete in backend)
  const deleteTodo = (id) => {
    api.delete(`/todos/${id}`)
    .then(() => setTodos(todos.filter(todo => todo._id !== id)))
    .catch(err => console.error("Error deleting todo:", err));
  };
  
  // Toggle complete (update in backend)
  const toggleComplete = (id, completed) => {
    api.put(`/todos/${id}`, { completed: !completed })
    .then(res => setTodos(todos.map(todo =>
      todo._id === res.data._id ? res.data : todo
    )))
    .catch(err => console.error("Error updating todo:", err));
  };
  
  // Editing handlers
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };
  
  const handleEditInput = (e) => {
    setEditingText(e.target.value);
  };
  
  // Save edit (update in backend)
  const saveEdit = (id) => {
    api.put(`/todos/${id}`, { text: editingText })
    .then(res => {
      setTodos(todos.map(todo => todo._id === res.data._id ? res.data : todo));
      setEditingId(null);
      setEditingText("");
    })
    .catch(err => console.error("Error editing todo:", err));
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };
  
  return (
    <div style={{ maxWidth: 500, margin: "60px auto", background: "#fff", borderRadius: 16, padding: 24 }}>
      <h1>Todo App</h1>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input
          style={{ flex: 1, padding: "10px", borderRadius: 7, border: "1px solid #eee" }}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task"
        />
        <button style={{ padding: "10px 18px", borderRadius: 7, background: "#fda085", color: "#fff", border: "none" }} onClick={addTodo}>Add</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{
            marginBottom: 10,
            background: todo.completed ? "#e4e4e4" : "#ffe3d5",
            borderRadius: 7,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ flex: 1 }}>
              {editingId === todo._id ? (
                <input
                  style={{ padding: "8px", border: "1px solid #ffd5c7", borderRadius: 5 }}
                  value={editingText}
                  onChange={handleEditInput}
                />
              ) : (
                <span
                  onClick={() => toggleComplete(todo._id, todo.completed)}
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    cursor: "pointer"
                  }}
                >{todo.text}</span>
              )}
            </div>
            <div>
              {editingId === todo._id ? (
                <>
                  <button style={{ marginRight: 4 }} onClick={() => saveEdit(todo._id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button style={{ marginRight: 4 }} onClick={() => startEditing(todo._id, todo.text)}>Edit</button>
                  <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <footer className="footer">
        © {new Date().getFullYear()} | Created by Bilal Ahmed
      </footer>
    </div>
  );
}

export default App;
