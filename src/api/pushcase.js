import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/pushcase/list", params);
}

export function settlement(params) {
  return request.post("/admin/pushcase/settlement", params);
}

export function edit(params) {
  return request.post("/admin/pushcase/edit", params);
}

export function del(params) {
  return request.post("/admin/banner/delete", params);
}

export function upload(params) {
  return request.post("/admin/banner/upload", params);
}
