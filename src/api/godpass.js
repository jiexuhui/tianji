import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/godpass/list", params);
}

export function add(params) {
  return request.post("/admin/godpass/add", params);
}

export function edit(params) {
  return request.post("/admin/godpass/edit", params);
}

export function pass(params) {
  return request.post("/admin/godpass/pass", params);
}
