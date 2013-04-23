<tr>
	<td><button class="removeBtn"></button></td>
	<td><input type="text" value="{{attrName}}" class="input-name"/></td>
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