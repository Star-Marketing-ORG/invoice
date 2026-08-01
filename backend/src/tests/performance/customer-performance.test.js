import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 1,
  iterations: 20,
};

export default function () {
  const res = http.get("http://localhost:4000/api/v1/customer");

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}