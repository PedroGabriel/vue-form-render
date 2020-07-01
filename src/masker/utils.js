const defaultDelimiters = /[-!$%^&*()_+|~=`{}[\]:";'<>?,.\\ ]/g;
const re = new RegExp(defaultDelimiters);
function unmaskText(text) {
  return text ? String(text).replace(re, "") : text;
}
export default unmaskText;
