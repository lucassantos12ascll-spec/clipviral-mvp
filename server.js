import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint principal
app.post("/api/generate", async (req, res) => {
  try {
    const { youtubeUrl, duration, color } = req.body;

    console.log("🎬 Novo corte recebido:", youtubeUrl, duration, color);

    // Simulação de geração do corte
    const fakeId = Math.floor(Math.random() * 1000000);

    res.json({
      success: true,
      id: fakeId,
      message: "Corte criado com sucesso!",
    });
  } catch (error) {
    console.error("Erro no endpoint /api/generate:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao processar o corte.",
    });
  }
});

// Porta padrão Render
const PORT = process.env.PORT || 10000;
app.listen
