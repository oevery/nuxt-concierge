import { defineCron } from "#concierge-handlers";

export default defineCron(
  "PingServer2",
  async () => {
    console.log("Ping!");
    return "Pong2";
  },
  {
    every: 1000 * 60, // 1 minute
  }
);
