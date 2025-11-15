import { Hono } from "hono";
import { auth } from "./lib/better-auth";

const app = new Hono<{ Bindings: CloudflareBindings }>();

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
