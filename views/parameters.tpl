<tr>
	<td><button class="removeBtn"></button></td>
	<td>
		<select type="text" value="{{attrName}}" class="input-name" style="width:100px;">
			{{#each attributes}}
				<option value="{{this}}">{{this}}</option>
			{{/each}}
		</select>
	</td>
	<td>
		<select class="select-type">
		{{#each types}}
			<option value="{{value}}">{{label}}</option>
		{{/each}}
		</select>
	</td>
	<td>
		<select class="select-subType">
		{{#each subTypes}}
			<option value="{{value}}">{{label}}</option>
		{{/each}}
		</select>
	</td>
</tr>