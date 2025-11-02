app.post("/api/generate", async (req, res) => {
  const { youtubeUrl, duration, color } = req.body;

  console.log("🎬 Novo corte recebido:", youtubeUrl, duration, color);

  // Aqui pode futuramente ter a lógica de geração de vídeo
  res.json({
    success: true,
    id: Math.floor(Math.random() * 1000000),
    message: "Corte criado com sucesso!"
  });
});
