export function addClass(el, className) {
  // 添加 class 名
  if (hasClass(el, className)) {
    return;
  }
  let newClass = el.className.split(" ");
  newClass.push(className);
  el.className = newClass.join(" ");
}
export function hasClass(el, className) {
  // 判断是否有当前 class 名
  let reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
  return reg.test(el.className);
}
export function getData(el, name, val) {
  // 无 val 值时，获取 dom 元素的 name 属性，
  // 有 val 值时，设置 dom 元素的 name 属性，
  let prefix = "data-";
  name = prefix + name;
  if (val) {
    return el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}
