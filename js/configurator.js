define(['ext_faker' , 'jquery', 'wakanda' , 'underscore' , 'template'] , function(faker , $ , wak ){
	function Row(row){
		this.config = Configurator.getInstance();
		
		if(typeof row == 'number'){
			this.$dom 	= this.config.get$Row(row);
		}
		else{
			this.$dom 	= row;
		}
		
		this.$type 		= this.$dom.find('.select-type');
		this.$subType 	= this.$dom.find('.select-subType');
		this.$name 		= this.$dom.find('.input-name');
	}

	Row.prototype.getType = function() {
		return this.$type.val();
	};

	Row.prototype.getSubType = function() {
		return this.$subType.val();
	};

	Row.prototype.getName = function() {
		return this.$name.val();
	};

	Row.prototype.setType = function(type , subType) {
		this.$type.val(type);
		this.refreshSubTypes(subType);
	};

	Row.prototype.setSubType = function(subType) {
		this.$subType.val(subType);
	};

	Row.prototype.setName = function(name) {
		this.$name.val(name);
	};

	Row.prototype.refreshSubTypes = function(subType) {
		var that 		= this,
			attributes	= this.config.getAPIs(that.getType());

		Template('options', {attributes : attributes}, function(html) {
			that
			.$subType
			.empty()
			.append($(html))
			.val(subType);
        });
	};

	function Configurator(){
		if ( Configurator.caller != Configurator.getInstance ) {  
			throw new Error("This object cannot be instanciated");  
		}

		this.faker 	= [];
		this.columns= [];
	}
	
	Configurator.instance = null;
	
	Configurator.getInstance = function() {  
		if (this.instance == null) {
			this.instance = new Configurator();
			this.instance._init();
		}  

		return this.instance;
	}

	Configurator.prototype._init 	= function() {

		this.faker 			= faker._meta.apisToExpose;
		this.definitions 	= faker._meta.definitionsToExpose;
		
		this.initTags();

		this.loadView('home' , function(){
			this.loadConfig();
			this.loadProjects();
		});
	};

	Configurator.prototype.addRow = function(options){
		var types 		= this.faker,
			subTypes	= types[0].attributes,
			rows 		= $('#options tbody tr');

		Template('parameters', {attributes: [
				'attr1',
				'attr2',
				'attr3',
			] , types : types , subTypes : subTypes , attrName : 'attr' + rows.length}, function(html) {
			var $row = $(html);

			$row
			.appendTo($('#options tbody'))
			.find('input[type=text]')
			.focus();

			if(options && typeof options.onSuccess == 'function'){
				options.onSuccess( options.data , $row);
			}
	    });
	}

	Configurator.prototype.getLength = function(){
		return $('#length').val();
	}

	Configurator.prototype.setLength = function(){
		return $('#length').val();
	}

	Configurator.prototype.get$Row = function(index){
		return $($('#options tbody tr').get(index));
	}

	Configurator.prototype.removeRow = function(index){
		var rows = $('#options tbody tr');

		if(rows.length < 2){
			// Do nothing !
		}
		else{
			var row = this.get$Row(index);
			row.remove();
		}
	}

	Configurator.prototype.getAPIs = function(type){
		for (var i = this.faker.length - 1; i >= 0; i--) {
			if(this.faker[i].value == type){
				return this.faker[i].attributes;
			}
		};
	}

	Configurator.prototype.updateAPIs = function(index){
		var row = new Row(index);
		row.refreshSubTypes();
	}

	Configurator.prototype.loadProjects = function(){
		var attrs = [],
			that  = this,
			projs = wak.getProjects();

		_.each( projs , function(proj){
			attrs.push({
				label : proj.name,
				value : proj.path
			});
		});

		Template('options', {attributes : attrs}, function(html) {
			$('#projects')
			.html(html)
			.trigger('change');
	    });
	}

	Configurator.prototype.updateDataClasses = function(){
		var attrs 	= [],
			dcs 	= wak.getDataClasses($('#projects').val());

		_.each( dcs , function(dc){
			attrs.push({
				label : dc.className,
				value : dc.className
			});
		});

		Template('options', {attributes : attrs}, function(html) {
			$('#dataclasses')
			.html(html);
	    });
	}

	Configurator.prototype.getConfig = function(){
		var rows 	= $('#options tbody tr'),
			result	= {
				length 	: this.getLength(),
				columns	: {}
			};

		for (var i = 0; i < rows.length; i++) {
			var row 	= rows.get(i),
				rowObj	= new Row($(row));

			result.columns[rowObj.getName()] = {
				attrSubType : rowObj.getSubType(),
				attrType 	: rowObj.getType()
			};
		};

		return result;
	}

	Configurator.prototype.init = function(){
		var body	= $('#options tbody');
		body.empty();
		this.addRow();
	}

	Configurator.prototype.refreshTags = function(){
		var $t = $('#content.definitions textarea');
		if($t.length){
			var value 	= '',
				def 	= $('#definition').val(),
				arr 	= [];

			for(var i = 0 , item ; item = faker.definitions[def][i] ; i++){
				if(i>0)
					value += '\n';

				value += item;
			}

			$t.val(value);
		}
	}

	Configurator.prototype.saveConfig = function(){
		studio.extension.setPref("config" , JSON.stringify(this.getConfig()));
	}

	Configurator.prototype.initConfig = function(){
		studio.extension.deletePrefFile();
		require(['faker'] , function(f){
			faker = f;
		})
		this.loadConfig();
	}

	Configurator.prototype.loadConfig = function(){
		var conf = studio.extension.getPref("config");

		if(conf){
			try{
				this.setConfig(JSON.parse(conf));
			}catch(e){
				this.init();
			}
		}
		else{
			this.init();
		}
	}

	Configurator.prototype.saveTags = function(){
		var $t 	= $('#content.definitions textarea'),
			defs= studio.extension.getPref("definitions");
		if($t.length){
			var def 	= $('#definition').val(),
				arr 	= $t.val().split('\n'),
				lsJSON	= JSON.parse(defs ? defs : "{}");

			faker.definitions[def] = arr;

			if(this.definitions[def] && this.definitions[def].onchange){
				this.definitions[def].onchange.call( this.definitions[def] , arr);
			}

			lsJSON[def] = arr;

			studio.extension.setPref("config" , JSON.stringify(lsJSON));
		}
	}

	Configurator.prototype.initTags = function(){
		var defs 	= studio.extension.getPref("definitions"),
			lsJSON 	= JSON.parse(defs ? defs : "{}");

		for(var attr in lsJSON){
			faker.definitions[attr] = lsJSON[attr];
			if(this.definitions[attr] && this.definitions[attr].onchange){
				this.definitions[attr].onchange.call(this.definitions[attr] , lsJSON[attr]);
			}
		}
	}

	Configurator.prototype.loadView = function(view , func){
		var obj;

		switch(view){
			case 'home':
				obj = {};
				break;
			case 'definitions':
				obj = {
					options : [],
					defs: []
				}

				var first 	= true,
					defs 	= this.definitions;

				for(var attr in defs){
					obj.options.push({
						label: defs[attr].label ? defs[attr].label : attr,
						value: defs[attr].value ? defs[attr].value : attr
					});

					if(first){
						obj.defs = faker.definitions[attr];
						first = false;
					}
				}

				break;
			default:
				console.log('Unknown view');
				return;
		}

		Template(view, obj, function(html) {
			var allBtns = [
				{
					id 		: 'add',
					views 	: ['home']
				},
				{
					id 		: 'save',
					views 	: ['home']
				},
				{
					id 		: 'load',
					views 	: ['home']
				},
				{
					id 		: 'init',
					views 	: ['home']
				},
				{
					id 		: 'saveDefs',
					views 	: ['definitions']
				},
				{
					id 		: 'navigator',
					views 	: ['home' , 'definitions']
				}
			]
			
			for(var i = 0 , btn ; btn = allBtns[i] ; i++){
				if(btn.views.indexOf(view) >= 0){
					$('#' + btn.id).show();
				}
				else{
					$('#' + btn.id).hide();
				}
			}

			$('#content')
			.html(html);

			if(typeof func == 'function'){
				func.call(Configurator.getInstance());
			}
        });
	}

	Configurator.prototype.setConfig = function(config){
		var body	= $('#options tbody'),
			index 	= 0;

		config = $.extend(true , {
			length : 100,
			columns : {}
		} , config);

		body.empty();
		this.setLength(config.length);

		for (var attr in config.columns) {
			this.addRow({
				data : {
					attr 	: attr
				},
				onSuccess: function(data , $obj){
					var attr= data.attr,
						col = config.columns[attr],
						row = new Row($obj);

					row.setName(attr);
					row.setType(col.attrType , col.attrSubType);
				}
			});

			index++;
		};

		if(index == 0){
			this.addRow();
		}
	}

	Configurator.prototype.generateFakeData = function(){
		var config 	= this.getConfig(),
			res 	= [];

		for (var i = 0; i < config.length ; i++) {
			var obj = {};

			for(var attr in config.columns){
				var col = config.columns[attr],
					func= faker[col.attrType] ? (faker[col.attrType][col.attrSubType] ? faker[col.attrType][col.attrSubType] : null) : null;

				if(typeof func == 'function'){
					obj[attr] = func.call(faker[col.attrType]);
				}
			}

			res.push(obj);
		};

		return res;
	}

	return Configurator;
});