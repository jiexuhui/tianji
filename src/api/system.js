import request from "@/utils/request";

/**
 * 获取系统用户列表
 * @param {*} params
 */
export function adminuserlist(params) {
  return request.get("/admin/users/users", params);
}

/**
 * 添加后台用户
 * @param {*} params
 */
export const addsystemuser = params => {
  return request.post("/admin/users/addsystemuser", params);
};

/**
 * 编辑后台用户
 * @param {} params
 */
export const editsystemuser = params => {
  return request.post("/admin/users/editsystemuser", params);
};

/**
 * 获取角色列表
 */
export const rolelist = () => {
  return request.get("/admin/roles/roles");
};

/**
 * 添加角色
 * @param {*} params
 */
export const addrole = params => {
  return request.post("/admin/roles/addrole", params);
};

/**
 * 编辑角色
 * @param {*} params
 */
export const editrole = params => {
  return request.post("/admin/roles/editrole", params);
};

/**
 * 删除角色
 * @param {*} params
 */
export const delrole = params => {
  return request.post("/admin/roles/delrole", params);
};

/**
 * 操作日志
 * @param {*} params
 */
export const operatelogs = params => {
  return request.post("/admin/system/operatelogs", params);
};

/**
 * 菜单列表
 * @param {*} params
 */
export const menus = params => {
  return request.post("/admin/menus/menus", params);
};

/**
 * 添加菜单
 * @param {*} params
 */
export const addmenu = params => {
  return request.post("/admin/menus/addmenu", params);
};

/**
 * 编辑菜单
 * @param {*} params
 */
export const editmenu = params => {
  return request.post("/admin/menus/editmenu", params);
};

/**
 * 删除菜单
 * @param {*} id
 */
export const delmenu = id => {
  const params = { id };
  return request.post("/admin/menus/delmenu", params);
};

/**
 * 获取默认ID
 * @param {*} id
 */
export const defaultcheck = rolename => {
  const params = { rolename };
  return request.post("/admin/menus/defaultcheck", params);
};

/**
 * 修改角色权限
 * @param {*} id
 */
export const userpermission = params => {
  return request.post("/admin/roles/userpermission", params);
};

/**
 * 登录日志
 * @param {*} params
 */
export const loginlogs = params => {
  return request.post("/admin/system/loginlogs", params);
};
