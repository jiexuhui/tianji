import request from "@/utils/request";

export function list(params) {
  return request.post("/admin/draws/list", params);
}

export function add(params) {
  return request.post("/admin/draws/add", params);
}

export function edit(params) {
  return request.post("/admin/draws/edit", params);
}

export function del(params) {
  return request.post("/admin/draws/delete", params);
}

export function upload(params) {
  return request.post("/admin/draws/upload", params);
}

export function uploadPic(params) {
  return request.post("/admin/draws/uploadPic", params);
}

export function codelist(params) {
  return request.get("/admin/draws/codelist", { params });
}

export function lottery(params) {
  return request.get("/admin/draws/lottery", { params });
}
