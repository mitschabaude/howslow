export { howSlow as default };

async function howSlow(
  name,
  run,
  { numberOfRuns = 50, numberOfWarmups = 10 } = {}
) {
  console.log(name + "\n");

  let lastStartKey;
  let startTime = {}; // key: startTime
  let runTimes = {}; // key: [(endTime - startTime)]
  let j = 0;
  function start(key) {
    if (key === undefined) key = j++;
    lastStartKey = key;
    startTime[key] = performance.now();
  }
  function stop(key) {
    let end = performance.now();
    if (key === undefined) key = lastStartKey;
    let start_ = startTime[key];
    startTime[key] = undefined;
    if (start_ === undefined) throw Error("running stop with no start defined");
    let times = runTimes[key];
    if (times === undefined) {
      runTimes[key] = times = [];
    }
    times.push(end - start_);
  }

  console.log("First run after start:");
  await run(start, stop);

  let labels = Object.keys(runTimes);
  let tableWidth = 1 + Math.max(14, ...labels.map((l) => l.length));
  if (Object.keys(runTimes).length === 1) {
    console.log(`${Object.values(runTimes)[0][0].toFixed(2)} ms`);
  } else {
    for (let key in runTimes) {
      console.log(
        `${(key + ":").padEnd(tableWidth)} ${runTimes[key][0].toFixed(2)} ms`
      );
    }
  }
  console.log("");

  runTimes = {};
  let noop = (_) => () => {};
  for (let i = 0; i < numberOfWarmups; i++) {
    await run(noop, noop);
  }
  for (let i = 0; i < numberOfRuns; i++) {
    j = 0;
    await run(start, stop);
  }
  console.log(
    `Average of ${numberOfRuns}x after warm-up of ${numberOfWarmups}x:`
  );
  if (Object.keys(runTimes).length === 1) {
    console.log(`${printMeanStd(Object.values(runTimes)[0])} ms`);
  } else {
    for (let key in runTimes) {
      console.log(
        `${(key + ":").padEnd(tableWidth)} ${printMeanStd(runTimes[key])} ms`
      );
    }
  }
  console.log("");
}

function meanStd(numbers) {
  let sum = 0;
  let sumSquares = 0;
  for (let i of numbers) {
    sum += i;
    sumSquares += i ** 2;
  }
  let n = numbers.length;
  let mean = sum / n;
  let std = Math.sqrt(((sumSquares / n - mean ** 2) * n) / (n - 1));
  return [mean, std];
}

function printMeanStd(numbers) {
  let [mean, std] = meanStd(numbers);
  return `${mean.toFixed(2)} ± ${std.toFixed(2)}`;
}
