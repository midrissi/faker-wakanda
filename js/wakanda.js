define(['jquery' , 'underscore' , 'template'] , function(){
	var fsol 		= studio.currentSolution.getSolutionFile(),
		folderSol	= fsol.parent,
		$fsol		= $($.parseXML(fsol.toString())),
		$projs 		= $fsol.find('project'),
		projects 	= [];

	$projs.each(function(){
		var f 		= studio.File(folderSol , $(this).attr('path')),
			folder	= f.parent,
			$f 		= $($.parseXML(f.toString())),
			obj		= {
				name 		: f.nameNoExt,
				path		: f.path,
				dataClasses : []
			},
			$cat 	= $f.find('tag[name=catalog]'),
			fcat 	= studio.File(folder , $cat.parent().attr('path'));
		
		try{
			obj.dataClasses = JSON.parse(fcat.toString()).dataClasses;
		}catch(e){
			var $cat = $($.parseXML(fcat.toString())),
				$dcs = $cat.find('dataClasses');

			$dcs.each(function(){
				var $attrs 	= $(this).find('attributes'),
					res 	= getObjFromXML(this);

				res.attributes = [];

				$attrs.each(function(){
					res.attributes.push(getObjFromXML(this));
				})

				obj.dataClasses.push(res);
			});
		}

		projects.push(obj);
	});

	function getObjFromXML(xml){
		var res 	= {},
			attrs 	= xml.attributes;

		for(var i = 0 , attr ; attr = attrs[i] ; i++){
			res[attr.name] = attr.value;
		}

		return res;
	}

	return {
		getProjects: function(){
			return projects;
		},
		getProject: function(projectPath){
			var res;
			_.each(projects , function(proj){
				if(proj.path == projectPath){
					res = proj;
				}
			});
			return res;
		},
		getDataClasses: function(projectPath){
			var proj = this.getProject(projectPath);
			return proj ? proj.dataClasses : null;
		},
		getAttributes: function(){
			var projPath 	= $('#projects').val(),
				dcs 		= this.getDataClasses(projPath),
				dc 			= $('#dataclasses').val(),
				dcObj		= null,
				res 		= [];

			if(!projPath || !dcs || !dc){
				return res;
			}

			for(var i = 0 , item; item = dcs[i] ; i++){
				if(dc == item.className){
					dcObj = item;
					break;
				}
			}

			if(dcObj){
				for(var i = 0 , attr ; attr = dcObj.attributes[i] ; i++){
					switch(true){
						case attr.kind != "relatedEntity" && attr.kind != "relatedEntities":
							res.push(attr.name);
							break;
						default:
							break;
					}
				}
			}

			return res;
		},
		saveText: function( project , fname , content , open){
			var f,
				ts,
				folder 	= studio.File(project).parent,
				tmpFol	= studio.Folder(folder.path + $('#folderName').val());

			if(!tmpFol.exists){
				tmpFol.create();
			}

			f 	= studio.File(tmpFol , fname);
			ts 	= studio.TextStream(f , 'Overwrite');

			ts.write(content);
			ts.flush();
			ts.close();

			if(open && f.exists){
				var path = f.path;
				
				if(navigator.platform.toLowerCase().indexOf('mac') >= 0){
					path = path.substring(1).replace(/\//g , ':');
				}
				else{
					path = path.replace(/\//g , '\\');
				}
				
				if(studio.openFile(path)){
					studio.sendCommad('runEditorFile');
				}
			}
		}
	}
});