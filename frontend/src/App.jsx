import { useEffect, useState } from "react";

const API = "http://localhost:8080/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);

  // READ
  const loadProducts = async () => {
    const res = await fetch(API);
    setProducts(await res.json());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // CREATE + UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = JSON.stringify({ name, price: parseFloat(price) });
    const options = {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body,
    };
    await fetch(editingId ? `${API}/${editingId}` : API, options);
    resetForm();
    loadProducts();
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadProducts();
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Proizvodi</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="Naziv"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />{" "}
        <input
          placeholder="Cijena"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />{" "}
        <button type="submit">{editingId ? "Spremi" : "Dodaj"}</button>
        {editingId && <button type="button" onClick={resetForm}>Odustani</button>}
      </form>

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr><th>ID</th><th>Naziv</th><th>Cijena</th><th>Akcije</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Uredi</button>{" "}
                <button onClick={() => handleDelete(p.id)}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;