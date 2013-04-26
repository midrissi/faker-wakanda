{{#if remove}}ds.{{dataClass}}.remove();

{{/if}}var content = loadText(getFolder('path') + '{{folder}}{{#if folder}}/{{/if}}{{file}}'),
	list	= JSON.parse(content);

for(var i = 0 , obj ; obj = list[i] ; i++){
	try{
		new ds.{{dataClass}}(obj).save();
	}catch(e){

	}
}