import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/serise/list", params);
}

export function add(params) {
  return request.post("/admin/serise/add", params);
}

export function edit(params) {
  return request.post("/admin/serise/edit", params);
}

export function del(params) {
  return request.post("/admin/serise/delete", params);
}

export function upload(params) {
  return request.post("/admin/serise/upload", params);
}
