import { Hono } from "hono";
import { auth } from "./lib/better-auth";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: CloudflareBindings }>();

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:8787"],
  credentials: true,
  allowHeaders: ["Authorization", "Content-Type"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use("*", cors(corsOptions));

app.get("/", (c) => {
  return c.text("Hello world from hono");
});

// callback function: function that pass to
// another function as an argument
app.get("/health", (c) => {
  return c.json({ message: "OK", status: 200 });
});

app.on(["GET", "POST"], "/api/*", (c) => {
  return auth(c.env).handler(c.req.raw);
});

export default app;
