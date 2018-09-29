import request from "@/utils/request";

export function fetchList(params) {
  return request.post("/admin/article/list", params);
}

export function fetchArticle(id) {
  return request.post("/admin/article/detail", { id });
}

export function fetchPv(pv) {
  return request({
    url: "/article/pv",
    method: "get",
    params: { pv }
  });
}

export function createArticle(data) {
  return request({ url: "/admin/article/add", method: "post", data });
}

export function updateArticle(data) {
  return request({ url: "/admin/article/edit", method: "post", data });
}

export function del(id) {
  return request.post("/admin/article/delete", { id });
}

export function upload(params) {
  return request.post("/admin/article/upload", params);
}