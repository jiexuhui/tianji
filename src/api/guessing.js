import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/guessing/list", params);
}

export function add(params) {
  return request.post("/admin/guessing/add", params);
}

export function edit(params) {
  return request.post("/admin/guessing/edit", params);
}

export function del(params) {
  return request.post("/admin/guessing/delete", params);
}

export function upload(params) {
  return request.post("/admin/guessing/upload", params);
}
