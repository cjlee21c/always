[Project] Always AI Review Agent: "Smart Shopping Buddy"

1. Executive Summary

Product Focus: Home Food Waste Disposer (건조분쇄 필터 음식물 처리기 가정용)

Target: Korean women aged 35-50 — the primary household purchase decision-makers

Problem: When buying a home appliance like a food waste disposer, women want specific, practical answers — "Does it smell during operation?", "How loud is it at night?", "Is it safe to use around kids?" — but sorting through hundreds of reviews to find those answers takes 10-20 minutes and often leaves buyers still uncertain.

Solution: An LLM-based AI agent embedded on the product page that analyzes review data in real time, answers user questions, and surfaces key summary insights — so buyers get the right answer in seconds.

2. Problem Definition & Persona

2.1 Problem Statement

Women aged 35-50 manage household purchasing decisions with high standards — especially for appliances that affect daily hygiene, family health, and kitchen environment.

A simple star rating or sorted-by-date review list cannot answer personalized questions like:
- "Will this smell while it's running?"
- "Is the noise okay at night when kids are sleeping?"
- "How often do I need to replace the filter, and how much does it cost?"
- "Can it handle kimchi or watery food waste?"

Reading through 100+ reviews to find these answers takes an average of 10-20 minutes and is the core pain point.

2.2 Target Persona: "Detail-Oriented Working Mom, Kim Ji-eun (42)"

Background: Married with two kids, working full-time, manages all household purchases.

Characteristics: Values real user experiences over brand claims. Willing to spend more if the product genuinely solves a problem.

Needs: Wants immediate, trustworthy answers to practical questions about the food waste disposer — odor control, noise level, maintenance cost, safety around children — without reading every single review herself.

3. MVP Core Functions (Scope)

[Core] AI Review Q&A: User types a question in the chat window. The AI answers based only on the crawled review data for that product.

[Core] Data Visualization: Summary of positive/negative ratio and top keywords across all reviews (e.g., "82% of reviewers praised odor control").

[Core] Source Citing: Each AI answer includes excerpts from actual reviews it used, so users can trust the response.

4. Technical Architecture

Layer        | Technology           | Role
-------------|----------------------|---------------------------------------------
Frontend     | React (JS)           | UI/UX, AI chat interface, data visualization
Backend      | Node.js (Express)    | API server, OpenAI API integration, data preprocessing
AI           | OpenAI API (GPT-4o)  | Review text analysis and Q&A
Crawler      | Puppeteer            | Collect review data from Coupang product page
Hosting      | Vercel / Render      | Public deployment and web hosting

5. Development Roadmap

Step 1: Data Acquisition
- Use dummy review data (reviews.json) with 50 realistic reviews for the food waste disposer.
- Structure: author, rating, date, title, content.
- Real Puppeteer crawling to be added after core AI features are working.

Step 2: Backend Logic & Prompt Engineering
- Install OpenAI SDK in Node.js and connect to GPT-4o.
- Prompt design rules:
  - "Answer only based on the provided review data."
  - "Use a warm, detailed tone that a 35-50 year old woman would find helpful."
  - "Include percentage statistics where possible (e.g., 8 out of 10 reviewers mentioned...)."

Step 3: Frontend Integration
- Build a clean chat UI using Tailwind CSS.
- Place a floating AI Agent button at the bottom-right of the product detail page.

Step 4: Deployment
- Connect Vercel with GitHub for CI/CD.
- Store API keys securely as environment variables.

6. Expected Impact

Higher purchase conversion: Resolving information uncertainty leads to faster, more confident buying decisions.

Better time-on-page quality: Users spend time getting real answers instead of scrolling through irrelevant reviews.

Differentiated UX: Delivers the feeling of a personal shopping assistant — something no standard e-commerce review section offers.
