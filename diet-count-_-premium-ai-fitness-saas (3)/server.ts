import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

// Helper to get Razorpay client
function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys are missing. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  
  return new Razorpay({
    key_id,
    key_secret,
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { name, email, phone, age, gender, height, weight, goal, diet, filters, otherAllergy, workoutDays } = req.body;

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey || apiKey === "MY_OPENAI_API_KEY") {
        return res.status(500).json({ 
          error: "OpenAI API key is missing. Please add OPENAI_API_KEY to your environment variables or Secrets panel." 
        });
      }

      // Initialize inside route to handle dynamic env changes
      const openai = new OpenAI({ apiKey });

      const systemPrompt = "You are a professional Indian dietician and fitness coach. Generate accurate, realistic, and practical diet plans using Indian foods.";
      
      const userPrompt = `Create a premium personalized Indian diet plan:

Name: ${name}
Age: ${age}
Gender: ${gender}
Height: ${height}
Weight: ${weight}
Goal: ${goal}
Diet Type: ${diet}
Food Restrictions: ${filters}${otherAllergy ? ', ' + otherAllergy : ''}
Workout Plan Days: ${workoutDays}

Include:
- Calories per day
- Food in grams/ml
- Calories per meal
- Veg + Non-veg options

STRUCTURE:
1. Calories Range
2. Morning (empty stomach)
3. Breakfast
4. Mid-Morning Meal (NEW)
5. Lunch
6. Evening Snack
7. Dinner
8. Before Bed
9. Workout Plan (if selected)
10. Tips

Keep format clean for PDF generation.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      });

      const plan = response.choices[0].message.content;
      res.json({ plan });
    } catch (error: any) {
      console.error("Error generating plan:", error);
      res.status(500).json({ error: error.message || "Failed to generate plan" });
    }
  });

  app.post("/api/create-order", async (req, res) => {
    try {
      const razorpay = getRazorpay();
      const options = {
        amount: 4900, // amount in the smallest currency unit (49 INR = 4900 paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error: any) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: error.message || "Failed to create order" });
    }
  });

  app.post("/api/verify-payment", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        res.json({ status: "ok" });
      } else {
        res.status(400).json({ error: "Invalid signature" });
      }
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: error.message || "Failed to verify payment" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
