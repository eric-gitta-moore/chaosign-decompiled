// base64编码
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str))
}
// base64解码
function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str))
}
// 转义字符
function html_encode(str) 
{ 
    var s = ""; 
    if (str.length == 0) return ""; 
    s = str.replace(/&/g, "&amp;"); 
    s = s.replace(/</g, "&lt;"); 
    s = s.replace(/>/g, "&gt;"); 
    s = s.replace(/ /g, "&nbsp;"); 
    s = s.replace(/\'/g, "&apos;"); 
    s = s.replace(/\"/g, "&quot;"); 
    return s; 

} 

function html_decode(str) 
{ 
    var s = ""; 
    if (str.length == 0) return ""; 
    s = str.replace(/&amp;/g, "&"); 
    s = s.replace(/&lt;/g, "<"); 
    s = s.replace(/&gt;/g, ">"); 
    s = s.replace(/&nbsp;/g, " "); 
    s = s.replace(/&apos;/g, "\'"); 
    s = s.replace(/&quot;/g, "\""); 
    return s; 
} 
