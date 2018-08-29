import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/team/list", params);
}

export function add(params) {
  return request.post("/admin/team/add", params);
}

export function edit(params) {
  return request.post("/admin/team/edit", params);
}

export function del(params) {
  return request.post("/admin/team/delete", params);
}

export function upload(params) {
  return request.post("/admin/team/upload", params);
}
