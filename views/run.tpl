var content = loadText(getFolder('path') + '{{folder}}/{{file}}'),
	list	= JSON.parse(content);

for(var i = 0 , obj ; obj = list[i] ; i++){
	new ds.{{dataClass}}(obj).save();
}