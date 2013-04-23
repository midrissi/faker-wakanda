var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/json");
editor.setReadOnly(true);
if(localStorage.result){
	editor.setValue(localStorage.result);
	editor.selection.clearSelection();
}