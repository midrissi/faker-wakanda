<select id="definition">
{{#each options}}
	<option value="{{value}}">{{label}}</option>
{{/each}}
</select>
<br/>
<textarea cols="63" rows="20">{{#each defs}}
{{this}}{{/each}}</textarea>