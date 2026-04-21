require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//you get the all the review data from reviews.json
function loadReviews() {
  const filePath = path.join(__dirname, "reviews.json");
  //fs module gets you to read the data from reviews.json
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// POST /ask  — answer a user question based on reviews
app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "question is required" });

  const reviews = loadReviews();
  const reviewText = reviews
    .map((r, i) => `[${i + 1}] 별점: ${r.rating}점 | ${r.date}\n${r.title ? r.title + "\n" : ""}${r.content}`)
    .join("\n\n");
  //This is promt for ChatGPT and you need to make sure it should answer based on actual data, not hallucination
  const prompt = `당신은 쇼핑 리뷰 분석 AI입니다. 아래는 "건조분쇄 필터 음식물 처리기 가정용" 제품의 실제 구매 후기입니다.

반드시 아래 규칙을 따르세요:
- 제공된 리뷰 데이터 안에서만 답변할 것
- 리뷰에 없는 내용은 "리뷰에서 확인되지 않았습니다"라고 답할 것
- 친절하고 따뜻한 말투로 답변할 것 (35-50세 주부가 편하게 읽을 수 있도록)
- 가능하면 몇 명이 언급했는지 수치를 포함할 것 (예: "10명 중 8명이 냄새가 없다고 했어요")
- 답변 마지막에 근거가 된 리뷰 번호를 [출처: 1번, 3번] 형식으로 표시할 것

---
리뷰 데이터:
${reviewText}
---

사용자 질문: ${question}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });

    //you need this to make sure you got the error in regards to openAI api hosting
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI 응답 중 오류가 발생했습니다." });
  }
});

// GET /summary  — positive/negative ratio + top keywords
app.get("/summary", (req, res) => {
  const reviews = loadReviews();
  const total = reviews.length;

  //calculating the count of reviews that are postivie, negative, and neutral so that you can provide users the percentage. 
  const positive = reviews.filter((r) => Number(r.rating) >= 4).length;
  const neutral = reviews.filter((r) => Number(r.rating) === 3).length;
  const negative = reviews.filter((r) => Number(r.rating) <= 2).length;

  const avgRating = (
    reviews.reduce((sum, r) => sum + Number(r.rating), 0) / total
  ).toFixed(1);

  // Simple keyword frequency count
  const keywords = [
    "냄새", "소음", "건조", "필터", "벌레", "처리 시간", "전기세",
    "가성비", "세척", "용량", "설치", "디자인",
  ];

  const keywordCounts = keywords.map((word) => ({
    word,
    count: reviews.filter((r) => r.content.includes(word)).length,
  }))
  .filter((k) => k.count > 0)
  .sort((a, b) => b.count - a.count);

  res.json({
    total,
    avgRating,
    positive: { count: positive, percent: Math.round((positive / total) * 100) },
    neutral: { count: neutral, percent: Math.round((neutral / total) * 100) },
    negative: { count: negative, percent: Math.round((negative / total) * 100) },
    topKeywords: keywordCounts.slice(0, 6),
  });
});

// GET /reviews  — return raw reviews (for displaying on frontend)
app.get("/reviews", (req, res) => {
  const reviews = loadReviews();
  res.json(reviews);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
