import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/match/list", params);
}

export function add(params) {
  return request.post("/admin/match/add", params);
}

export function edit(params) {
  return request.post("/admin/match/edit", params);
}

export function del(params) {
  return request.post("/admin/match/delete", params);
}

export function upload(params) {
  return request.post("/admin/match/upload", params);
}
