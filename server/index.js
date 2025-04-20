const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data"); // ✅ dùng thư viện node

require("dotenv").config();
const { translateENtoVI } = require("./huggingfaceHelper");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage(); // ✅ dùng memory, không ghi file
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.post("/upload", upload.single("audio"), async (req, res) => {
  try {

    const form = new FormData();
    form.append("audio", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

    const response = await axios.post(
      `${ process.env.TRANSFORMER_API || 'http://localhost:8000'}/transcribe`,
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      }
    );

    res.json({
      success: true,
      transcript: response.data.text,
    });
  } catch (err) {
    console.error("Transcribe error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/process-transcript", async (req, res) => {
  const { transcript } = req.body;

  if (!transcript)
    return res.status(400).json({ error: "No transcript provided" });

  // Tách câu cơ bản
  const sentences = transcript.match(/[^.!?]+[.!?]/g) || [transcript];

  try {
    const results = [];

    for (const sentence of sentences) {
      const translation = await translateENtoVI(sentence.trim());

      const item = translation || {
        original: sentence.trim(),
        grammar: "Tạm thời chưa có (sẽ thêm sau)",
        vocab: [], // có thể tách bằng từ loại sau
      };

      results.push(item);
    }

    res.json({ data: results });
  } catch (err) {
    console.error("GPT error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
