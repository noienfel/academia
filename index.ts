import express from "express";
import cors from "cors";

import routesAlunos from "./routes/aluno";
import routesInstrutores from "./routes/instrutor"
import routesTreinos from "./routes/treino";
import routesExercicios from "./routes/exercicio";
import routesAdmins from "./routes/admin";  
import routesLogin from "./routes/login"; 
import routesPagamentos from "./routes/pagamento"
import routesDepositos from "./routes/deposito"

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
app.use("/pagamentos", routesPagamentos)
app.use("/depositos", routesDepositos)

app.get("/", (req, res) => {
  res.send("API: Sistema de Treinos Academia ");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
