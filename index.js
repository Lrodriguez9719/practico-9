const express = require('express');

const PORT = 3000;

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.post("/recibir", (req, res) => {
  const { name, email } = req.body;
  console.log(`Usuario: Nombre: ${name}, Email: ${email} - Correctamente Agregado`);
  res.send("Usuario Agregado");
});

app.put("/actualizar", (req, res) => {
  const { name, email } = req.body;
  console.log(`Usuario: Nombre: ${name}, Email: ${email} - Correctamente Actualizado`);
  res.send("Usuario Actualizado");
});

app.delete("/eliminar", (req, res) => {
  const { id } = req.body;
  console.log(`Usuario: ID: ${id} - Correctamente Eliminado`);
  res.send("Usuario Eliminado");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});