import express from "express";
import cors from "cors";

import 'dotenv/config'
import routesAlunos from "./routes/aluno";
import routesTreinos from "./routes/treino";
import routesExercicios from "./routes/exercicio";
import routesAdmins from "./routes/admin";  
import routesLogin from "./routes/login"; 
import routesPagamentos from "./routes/pagamento"
import routesDepositos from "./routes/deposito"
import routesDashboard from './routes/dashboard'
import routesAdminLogin from './routes/adminLogin'
import { verificaToken } from './middlewares/verificaToken'


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/admins/login", routesAdminLogin)
app.use("/alunos/login", routesLogin)
app.use("/admins", routesAdmins)
app.use("/alunos", routesAlunos)
app.use("/treinos", routesTreinos)
app.use("/exercicios", routesExercicios)
app.use("/pagamentos", routesPagamentos)
app.use("/depositos", routesDepositos)
app.use("/dashboard", routesDashboard)


app.get("/", (req, res) => {
  res.send("API: Sistema de Treinos Academia ");
});

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
  });
}

// Exportar para Vercel
export default app;
