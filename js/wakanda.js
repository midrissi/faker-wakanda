define(['jquery'] , function(){
	$('#cancel')
	.live({
		click: function(){
			studio.extension.quitDialog();
		}
	})
});