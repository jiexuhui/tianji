import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/game/list", params);
}

export function add(params) {
  return request.post("/admin/game/add", params);
}

export function edit(params) {
  return request.post("/admin/game/edit", params);
}

export function del(params) {
  return request.post("/admin/game/delete", params);
}

export function upload(params) {
  return request.post("/admin/game/upload", params);
}
