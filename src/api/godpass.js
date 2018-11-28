import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/godpass/list", params);
}

export function pass(params) {
  return request.post("/admin/godpass/pass", params);
}
