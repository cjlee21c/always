const http = require("http");

const body = JSON.stringify({ question: "냄새가 많이 나나요?" });

const options = {
  hostname: "localhost",
  port: 4000,
  path: "/ask",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  },
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log("\n--- AI Response ---");
    console.log(JSON.parse(data).answer || JSON.parse(data).error);
  });
});

req.write(body);
req.end();
