import express from "express";
import cors from "cors";

// Import das rotas
import routesAlunos from "./routes/aluno";
import routesInstrutores from "./routes/instrutor"
import routesTreinos from "./routes/treino";
import routesExercicios from "./routes/exercicio";
import routesAdmins from "./routes/admin";
import routesLogin from "./routes/login"; // se você já tiver login implementado

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/alunos", routesAlunos);
app.use("/instrutores", routesInstrutores);
app.use("/treinos", routesTreinos);
app.use("/exercicios", routesExercicios);
app.use("/admins", routesAdmins);
app.use("/login", routesLogin);

app.get("/", (req, res) => {
  res.send("API: Sistema de Treinos Academia ");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
