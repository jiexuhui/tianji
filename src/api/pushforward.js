import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/pushforward/list", params);
}

export function pass(params) {
  return request.post("/admin/pushforward/pass", params);
}
