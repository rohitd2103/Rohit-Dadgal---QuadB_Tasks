import { useState, useEffect } from "react";
import { todo_list_backend } from "declarations/todo_list_backend";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch To-Do list from the backend
  useEffect(() => {
    async function fetchTodos() {
      const fetchedTodos = await todo_list_backend.get_todos();
      setTodos(fetchedTodos);
    }
    fetchTodos();
  }, []);

  // Add a new To-Do
  async function addTodo(event) {
    event.preventDefault();
    if (title.trim() === "") return;

    const id = await todo_list_backend.add_todo(title);
    setTodos([...todos, { id, title, completed: false }]);
    setTitle("");
  }

  // Toggle To-Do completion status
  async function toggleTodo(id) {
    const success = await todo_list_backend.toggle_todo(id);
    if (success) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  }

  // Delete a To-Do item
  async function deleteTodo(id) {
    const success = await todo_list_backend.delete_todo(id);
    if (success) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  }

  return (
    <main>
      <h1>To-Do List</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.title}</span>
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
