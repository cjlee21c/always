const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const fs = require("fs");

const PRODUCT_URL = "https://www.11st.co.kr/products/7976000961";
const FOOD_WASTE_KEYWORDS = ["음식물", "분쇄", "건조", "처리기", "냄새", "벌레", "필터", "음쓰", "분쇄기"];

async function crawlReviews() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=ko-KR"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({ "Accept-Language": "ko-KR,ko;q=0.9" });
  await page.setViewport({ width: 1280, height: 900 });

  console.log("Loading product page...");
  await page.goto(PRODUCT_URL, { waitUntil: "networkidle2", timeout: 60000 });
  await delay(4000);

  // Scroll slowly all the way to the bottom
  console.log("Scrolling to bottom...");
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await delay(300);
  }
  await delay(4000);

  // Wait for review boxes to appear
  try {
    await page.waitForSelector(".c-review-box", { timeout: 8000 });
    console.log(".c-review-box found!");
  } catch {
    console.log("Timeout — trying to scrape anyway");
  }

  const reviews = await page.evaluate(() => {
    const items = document.querySelectorAll(".c-review-box");
    return Array.from(items).map((el) => {
      const content = el.querySelector(".c-review-box__quotation")?.textContent.trim().replace(/\s+/g, " ") || "";
      const author = el.querySelector(".c-review-box__id")?.textContent.trim() || "익명";
      const infoText = el.querySelector(".c-review-box__information")?.textContent.trim() || "";
      const dateMatch = infoText.match(/20\d{2}[.\-\/]\d{2}[.\-\/]\d{2}/);
      const starEls = el.querySelectorAll("[class*='star--on'], [class*='star_on']");
      const rating = starEls.length > 0 && starEls.length <= 5 ? String(starEls.length) : "5";
      return { author, rating, date: dateMatch ? dateMatch[0] : "", title: "", content };
    }).filter((r) => r.content.length > 10);
  });

  await browser.close();

  console.log(`\nFound ${reviews.length} reviews`);

  const filtered = reviews.filter((r) =>
    FOOD_WASTE_KEYWORDS.some((kw) => r.content.includes(kw))
  );
  console.log(`Food waste disposer reviews: ${filtered.length}`);

  const toSave = filtered.length >= 5 ? filtered : reviews;
  fs.writeFileSync("reviews.json", JSON.stringify(toSave, null, 2), "utf-8");
  console.log(`Saved ${toSave.length} reviews to reviews.json`);
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

crawlReviews().catch(console.error);
