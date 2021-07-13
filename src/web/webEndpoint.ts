import cors from 'cors';
import express from 'express';

const endpoint = express();
endpoint.use(express.json());
endpoint.use(cors());

export function initWebEndpoint() {
  test();

  init();
}
function test() {
  endpoint.post("/test", (req, res) => {
    console.log("post received");
    res.send("received");
    console.log(req.body);
  });
}

function init() {
  endpoint.listen(3000, () => console.log("web endpoint initiated"));
}
