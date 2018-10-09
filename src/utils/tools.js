/**
 * 浏览器信息
 */
export const browser = () => {
  const u = navigator.userAgent;
  // 移动终端浏览器版本信息
  return {
    trident: u.indexOf("Trident") > -1, //  IE内核
    presto: u.indexOf("Presto") > -1, //  opera内核
    webKit: u.indexOf("AppleWebKit") > -1, // 苹果、谷歌内核
    gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1, //  火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //  是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, // android终端或uc浏览器
    iPhone: u.indexOf("iPhone") > -1, //  是否为iPhone或者QQHD浏览器
    iPad: u.indexOf("iPad") > -1, //  是否iPad
    webApp: u.indexOf("Safari") === -1 //  是否web应该程序，没有头部与底部
  };
};
/**
 * 窗口变化重新设置内容大小
 */
export const resize = () => {
  const windowHeight = window.innerHeight;
  const headerHeight = document.querySelector(".main-header").offsetHeight || 0;
  const footerHeight = document.querySelector(".main-footer").offsetHeight || 0;
  if (document.body.getAttribute("class").indexOf("fixed") > -1) {
    this.docHeight = windowHeight - footerHeight;
  } else {
    this.docHeight = windowHeight - headerHeight - footerHeight;
  }
  document.querySelector(".content-wrapper").style.minHeight = this.docHeight + "px";
};

/**
 * 读取sessionStorage中的菜单
 */
export const sessionMenus = () => {
  const menus = sessionStorage.getItem("menus") || null;
  if (menus && menus.length > 0) {
    return JSON.parse(menus);
  }
  return [];
};

/**
 * unix时间戳转普通时间
 * @param {*} unixNum
 */
export const unixToTime = (unixNum = 0) => {
  return new Date(unixNum * 1000).toLocaleString();
};

/**
 * 日期选择器的快速选择选项
 */
export const quickDate = () => {
  return {
    shortcuts: [{
        text: "最近一周",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "最近一个月",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit("pick", [start, end]);
        }
      },
      {
        text: "最近三个月",
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit("pick", [start, end]);
        }
      }
    ]
  };
};

/**
 * 获取当前存储在sessionStorage中的用户
 */
export const currentUser = () => {
  const userInfo = sessionStorage.getItem("user");
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return null;
};

/**
 * 状态值装换，返回Html格式
 * @param {number} status 状态值
 */
export const toggleStatus = status => {
  switch (status) {
    case 1:
      return '<i class="fa fa-check-square-o text-success text-bold" title="是"> 是</i>';
    case 0:
      return '<i class="fa fa-minus-circle text-danger text-bold" title="否"> 否</i>';
    default:
      return '<i class="fa fa-question-circle text-gray text-bold" title="未知"> 未知</i>';
  }
};

/**
 * 用户头像数据
 */
export const userAvatar = () => {
  const options = [];
  const dirPath = "../../static/img/avatar";
  options.push({
    label: "默认",
    options: [{
      value: `${dirPath}/default.png`,
      label: "默认"
    }]
  });
  const male = {
    label: "男性",
    options: []
  };
  const female = {
    label: "女性",
    options: []
  };
  for (let i = 1; i < 5; i++) {
    male.options.push({
      value: `${dirPath}/male_${i}.png`,
      label: `男性${i}`
    });
    female.options.push({
      value: `${dirPath}/female_${i}.png`,
      label: `女性${i}`
    });
  }
  options.push(male, female);
  return options;
};

/**
 * 重组组织架构数据
 * @param {*} data
 */
export const rebuildOrganization = data => {
  return null;
};
