# howslow

Easy performance testing in JavaScript!

```sh
npm i howslow
```

```js
import howSlow from "howslow";

await howSlow("sum", (start, stop) => {
  start();
  let sum = 0;
  for (let i = 0; i < 1e7; i++) {
    sum += i;
  }
  stop();
});
```

To see how slow our code is, run the snippet above in node, deno or the browser. Timing statistics will be logged to the console:

```
sum

First run after start:
10.90 ms

Average of 50x after warm-up of 10x:
8.53 ± 0.12 ms
```

We have two different metrics which can both be important performance considerations: For example, "first run after start" can indicate how long something would take on page load. The warmed-up, averaged timing is relevant for code that runs often. The latter is usually much faster because it can benefit from JIT compilation.

## Multiple timings

You can also have multiple related timings and give them labels:

```js
import howSlow from "howslow";

await howSlow("json", (start, stop) => {
  let array = Array(1e6).fill(1);

  start("stringify");
  let json = JSON.stringify(array);
  stop();

  start("parse");
  array = JSON.parse(json);
  stop();
});
```

Which prints:

```
json

First run after start:
stringify:      35.13 ms
parse:          19.35 ms

Average of 50x after warm-up of 10x:
stringify:      25.30 ± 2.85 ms
parse:          14.20 ± 0.68 ms
```

## Configuration

You can specify the number of timed runs and warm-up runs in an optional third argument:

```js
howSlow("test", () => {}, {
  numberOfRuns: 200,
  numberOfWarmups: 20,
});
```

## API

```ts
function howSlow(
  name: string,
  run: (
    start: (label?: string) => void,
    stop: (label?: string) => void
  ) => void,
  options?: {
    numberOfRuns: number;
    numberOfWarmups: number;
  }
): Promise<void>;
```
