// Create guid
function TZ4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid(){
    return TZ4() + TZ4() + '-' + TZ4();
}
function uniqid(){
    return TZ4() + TZ4() + TZ4();
}

function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
}
function stripslashes(string) {
    return string.replace(/\\\\/g, '\\').
        replace(/\\b/g, '\u0008').
        replace(/\\t/g, '\t').
        replace(/\\n/g, '\n').
        replace(/\\f/g, '\f').
        replace(/\\r/g, '\r').
        replace(/\\\'/g, '\'').
        replace(/\\"/g, '"');
}
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,'&gt;')
        .replace(/"/g, '&quot;');
}
function html_entity_decode(str){
    return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g,'>')
        .replace(/&quot;/g, '"');
}
function tzaddslashes(string) {
    return addslashes(string).replace(/\[/g,'\\[')
        .replace(/\]/g,'\\]')
        .replace(/\//g,'\\/');
}