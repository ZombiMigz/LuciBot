import express from 'express';

const port = 3000;
const endpoint = express();

export function initWebEndpoint() {
  test();

  init();
}

function test() {
  endpoint.post("/test", (req, res) => {
    console.log(req.body);
  });
}

function init() {
  endpoint.listen(port, () => console.log("web endpoint initiated"));
}
