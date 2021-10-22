import howSlow from "../index.js";

await howSlow("json", (start, stop) => {
  let array = Array(1e6).fill(1);

  start("stringify");
  let json = JSON.stringify(array);
  stop();

  start("parse");
  array = JSON.parse(json);
  stop();
});
