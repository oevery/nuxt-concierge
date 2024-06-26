import { defineCron } from "#concierge-handlers";

export default defineCron(
  "PingServer",
  async () => {
    console.log("Ping!");
    return "Pong";
  },
  {
    every: 1000 * 30, // 30 seconds
  }
);
