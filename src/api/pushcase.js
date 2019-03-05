import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/pushcase/list", params);
}

export function settlement(params) {
  return request.post("/admin/pushcase/settlement", params);
}

export function add(params) {
  return request.post("/admin/createCase/add", params);
}

export function edit(params) {
  return request.post("/admin/pushcase/edit", params);
}

export function del(params) {
  return request.post("/admin/pushcase/delete", params);
}

export function upload(params) {
  return request.post("/admin/banner/upload", params);
}

export function matchList(params) {
  return request.post("/admin/createCase/matchList", params);
}
