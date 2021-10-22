import howSlow from "../index.js";

await howSlow("sum", (start, stop) => {
  start();
  let sum = 0;
  for (let i = 0; i < 1e7; i++) {
    sum += i;
  }
  stop();
});
