import express from "express";
import cors from "cors";

const app = express();

// Permite receber JSON
app.use(express.json());

// Configura o CORS (libera acesso do Lovable e outros domínios)
app.use(
  cors({
    origin: "*", // se quiser restringir, coloque o domínio do seu app Lovable
    methods: ["GET", "POST"],
  })
);

// Rota de teste (GET)
app.get("/", (req, res) => {
  res.send("🚀 Servidor ClipViral-MVP rodando com sucesso!");
});

// Endpoint principal /api/generate
app.post("/api/generate", async (req, res) => {
  try {
    const { youtubeUrl, duration, color } = req.body;

    console.log("🎬 Novo corte recebido:");
    console.log("YouTube:", youtubeUrl);
    console.log("Duração:", duration);
    console.log("Cor:", color);

    // Aqui futuramente vai o código para gerar o vídeo
    // Por enquanto, só retorna sucesso
    res.json({
      success: true,
      id: Math.floor(Math.random() * 1000000),
      message: "Corte criado com sucesso!",
    });
  } catch (error) {
    console.error("❌ Erro no /api/generate:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao gerar o corte",
      error: error.message,
    });
  }
});

// Define a porta do Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
