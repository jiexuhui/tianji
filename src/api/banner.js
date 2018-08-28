import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/banner/list", params);
}

export function add(params) {
  return request.post("/admin/banner/add", params);
}

export function edit(params) {
  return request.post("/admin/banner/edit", params);
}

export function del(params) {
  return request.post("/admin/banner/delete", params);
}

export function upload(params) {
  return request.post("/admin/banner/upload", params);
}
