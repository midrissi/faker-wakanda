define(['handlebars' , 'underscore'], function(Mustache) {
    var cache = {},
        M = Mustache,
        fetch = function(views, fn) {
            var fetched = 0;
            $.each(views, function() {
                var view = this;
                if(this in cache) {
                    if(++fetched == views.length) {
                        fn();
                    }
                } else {
                    $.get('views/' + view + '.tpl', function(tpl) {
                        cache[view] = tpl;
                        if(++fetched == views.length) {
                            fn();
                        }
                    }, 'text');
                }
            });
        };
        
    var Template = function(view, data, fn, partials , helpers) {
        partials    = partials || [];
        helpers     = helpers || [];
        var views   = partials.slice(0);
        views.push(view);

        _.each(helpers , function(value , key , obj){
            Handlebars.registerHelper(key , value);
        });

        fetch(views, function() {
            $.each(partials, function() {
                Handlebars.registerPartial(this, cache[this]);
            });
            var res = Handlebars.compile(cache[view]);
            fn(res(data));
        });
    };
    
    window.Template = Template;
});