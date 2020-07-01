import mask from "./directive";
import unmaskText from "./utils";

function install(Vue) {
  Vue.directive("mask", mask);
}

export { mask };
export { unmaskText };
export default install;
