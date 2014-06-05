
var Browser = {
  IEVersion: function() {
    var version = 999; 
    if (navigator.appVersion.indexOf("MSIE") != -1)
      version = parseFloat(navigator.appVersion.split("MSIE")[1]);
    return version;
   }
};

function endsWith(txt, suffix) {
    txt = txt || "";
    suffix = suffix || "";
    return txt.indexOf(suffix, txt.length - suffix.length) !== -1;
};

function generateId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

function getParameterByName(query, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(query); // window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
};

function setFonts() {
   $('input[type=button]').livequery(function () {
        $(this).button().css('font-size', '12px');
    });

    $('input[type=submit]').livequery(function () {
        $(this).button().css('font-size', '12px');
    });

    /*$('font').livequery(function () {
        var face = $(this).attr('face');
        $(this).removeAttr('face');
        $(this).removeAttr('size');
    });*/
};

function hideEmptyImages() {
    $('img').each(function () {
        var src = $(this).attr('src');
        if (!src || src == '') $(this).hide();
    });
};

function removeExistingEditors() {
    for( var editorName in CKEDITOR.instances )
    {
        //var editor = CKEDITOR.instances[editorName];
        delete CKEDITOR.instances[editorName];
    }
};

function setEditorToolsStyles() {
};

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

function correntUrl(url)
{
    // link do dropbox
    if( url.indexOf('www.dropbox.com') > 0 && !endsWith(url,'dl=1')) {
        url = url.replace('www.dropbox.com','dl.dropbox.com') + '?dl=1';
        // link.attr('href', url);
    }
    return url;
};

function setMediaItemStyles() {

    $('.media-item').each(function () {
        var me = $(this);
                
        me.find('a').each(function () {

            var link = $(this);
            var id = link.attr('id');
            var url = link.attr('href') || '';
            var nr = link.attr('nr');

            if( nr == '2' && url ){
            
                // link do dropbox
                var newUrl = correntUrl(url);

                link.parents(".databox-collection-item").find(".file-link").attr("href", newUrl);
            }
            
            if(url)
            {
                if (!id) { id = generateId(); link.attr('id', id); }

                var ifVimeo = url.indexOf("vimeo.com") >= 0;
                var ifYoutube = url.indexOf("youtube.com") >= 0 || url.indexOf("youtube.pl") >= 0;
            
                var w = "400";
                var h = "300";

                if(link.attr("media-width")) 
                    w = link.attr("media-width");

                if(link.attr("media-height")) 
                    h = link.attr("media-height");
            
                if (ifVimeo) {
                    var site = 'vimeo.com';
                    var start = url.indexOf('vimeo.com');
                    if (start >= 0) {
                        url = url.substring(start + site.length + 1);
                        var end = url.indexOf('?');
                        if (end >= 0) {
                            url = url.substring(0, end);
                        }
                        var html = '<iframe src="http://player.vimeo.com/video/' + url + '?title=1&amp;byline=1&amp;portrait=1" width="' + w + '" height="' + h + '" frameborder="0"></iframe>'
                        link.html(html);
                    }
                }
                else if (ifYoutube) {
                    // http: //www.youtube.com/watch?v=5OpvBkoEfzA
                    // http://youtube.googleapis.com/v/R5BODUzp4rQ
                    var video = getParameterByName(url, 'v');
                    url = 'http://youtube.googleapis.com/v/' + video;
                    // alert(url);
                    var html = '<object width="' + w + '" height="' + h + '"><param name="movie" value="' + url + '"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="' + url + '" type="application/x-shockwave-flash" width="' + w + '" height="' + h + '" allowscriptaccess="always" allowfullscreen="true"></embed></object>';
                    link.html(html);
                }
                else if (url != '') {
                    
                    url = url.indexOf("?") >= 0 ? url.substr(0,url.indexOf("?")) : url;

                    if (endsWith(url, '.mp3')) {
                        
                        // link do dropbox
                        url = correntUrl(url);
                        link.attr('href', url);

                        link.css("width", "400px").css("height", "25px");
                        flowplayer(
                            id,
                            "/Content/flowplayer-3.2.14.swf",
                            {
                                clip: {
                                    autoPlay: false,
                                    autoBuffering: false,
                                    onResume: function() { var t = this; $f("*").each(function(){ if( t != this) this.pause(); });  },
                                    onStart: function(){ var t = this; $f("*").each(function(){ if( t != this) this.pause(); });  }
                                },
                                plugins: {
                                    controls: {
                                        url: "/Content/flowplayer.controls-3.2.13.swf",
                                        play: true,
                                        scrubber: true,
                                        fullscreen: false,
                                        autoHide: false
                                    }
                                }
                            });
                    }
                    else if (endsWith(url, '.flv')) {
                        
                        // link do dropbox
                        url = correntUrl(url);
                        link.attr('href', url);

                        link.css("width", w + 'px').css("height", h + 'px');
                        flowplayer(
                            id,
                            "/Content/flowplayer-3.2.14.swf",
                            {
                                clip: {
                                    autoPlay: false,
                                    autoBuffering: false,
                                    onResume: function() { var t = this; $f("*").each(function(){ if( t != this) this.pause(); });  },
                                    onStart: function(){ var t = this; $f("*").each(function(){ if( t != this) this.pause(); });  }
                                },
                                plugins: {
                                    controls: {
                                        url: "/Content/flowplayer.controls-3.2.13.swf",
                                        play: true,
                                        scrubber: true,
                                        fullscreen: true,
                                        autoHide: true
                                    }
                                }
                            });
                    }
                }
                else {
                    link.css("width", "1px").css("height", "1px");
                }
            }
        });


    });
};

function collapseContent() {
    $('.aktualnosc-item').each(function () {
        collapsePart.init($(this), { destroyOnExpand: true, collapseText: '', expandText: '<img src="http://lubinmedytacje.cwanysoft.pl/images/show_more.png" style="width: 130px; height: 30px;"/>' });
    });
};

function createMenu() {
    $('.mymenu').ptMenu();
};

function mediaElements() {
    $(".aktualnosc-item").find("a").each(function (){
        var element = $(this);
        element.
            css("text-decoration", "underline").
            css("font-weight","bold").
            css("font-size","inherit").
            tipTip({content:'Kliknij aby otworzyć', delay: 1});
    });
    $('.media-link-href').each(function () {
        var element = $(this);
        element.
            css("text-decoration", "underline").
            css("font-size","inherit").
            unbind("click").
            bind("click", function () {
                
                var title = element.attr('title');
                height = 500;
                if( element.attr("href").indexOf(".mp3") > 0 ) height = 160;

                var html = "<div class='media-item'><a href='"+element.attr("href")+"' media-width='640' media-height='430'></a></div>";
                medytacjePopup.show(
                    '',
                    html,
                    {
                        backgroundColor: 'black',
                        color: 'white',
                        title: title,
                        height: height,
                        open: function(){
                            setMediaItemStyles();
                        }            
                    });                    
                return false;
            }).
            tipTip({content:'Kliknij aby wyświetlić', delay: 1});
    });
    $('.image-link-href').each(function () {
        var element = $(this);
        element.
            css("text-decoration", "inherit").
            css("font-size","inherit").
            unbind("click").
            bind("click", function () {
                var html = "<div style='text-align:center;'><img src='"+element.attr("href")+"' style='max-width: 640px; max-height: 430px' /></div>";
                medytacjePopup.show(
                    '',
                    html,
                    {
                        backgroundColor: 'black',
                        color: 'white' 
                    }); 
                return false;
            }).
            tipTip({content:'Kliknij aby wyświetlić zdjęcie', delay: 1});
    });
    $('.image-links').each(function () {
        var element = $(this);
        var image1 = element.find("a.image1");
        var image2 = element.find("a.image2");        
        if( image1.size() > 0 && image1.find('img').size() > 0 && image1.find('img').attr('src') != '' )
        {
        var imgUrl = image1.find('img').attr('src');
        image1.find('img').attr('src', imgUrl.replace('www.dropbox.com','dl.dropbox.com') );
			if(image1.is(':hidden')) image1.show();
			if(image2.is(':visible')) image2.hide();
        }
        else if( image2.size() > 0 && image2.find('img').size() > 0 && image2.find('img').attr('src') != '' )
        {
        var imgUrl = image2.find('img').attr('src');
        image2.find('img').attr('src', imgUrl.replace('www.dropbox.com','dl.dropbox.com') );
			if(image2.is(':hidden')) image2.show();
			if(image1.is(':visible')) image1.hide();
        }        
    });
    $('.media-items').each(function () {
        var element = $(this);
        var image1 = element.find(".item1");
        var image2 = element.find(".item2");        
        if( image1.size() > 0 && image1.attr('href') != '' )
        {
			if(image1.is(':hidden')) image1.show();
			if(image2.is(':visible')) image2.hide();
        }
        else if( image2.size() > 0 && image2.attr('href') != '' )
        {
			if(image2.is(':hidden')) image2.show();
			if(image1.is(':visible')) image1.hide();
        }        
    });
};

function createControls(){
    $(".datepicker").datepicker();
};

function createControls(){
    $(".datepicker").datepicker();
};

$(function () {
    createMenu();
    createControls();
    collapseContent();
    hideEmptyImages();
    setEditorToolsStyles();
    setFonts();
    setMediaItemStyles();
    mediaElements();

    databox.onInit.add(
        function() {
            $("a").each(function(){ var href = $(this).attr("href"); if( href && href.indexOf("www") == 0 ) $(this).attr("href", "http://"+href); });
            var hash = $.trim((location.hash||'').replace('#',''));
            if( hash != ''){
                var parts = hash.split(':');
                if( parts.length == 2 ){
                  if( parts[0] == 'jt'){
                    var jumpTo = $('[name='+parts[1]+']');
                    if( jumpTo.size() > 0 ){
                      setTimeout(function(){ $.scrollTo('[name='+parts[1]+']') }, 250);
                    }
                  }
                }
            }
        });

    databox.onShowEditor.add(
        function(panel) {            
            // alert($(panel).find("textarea").size());
        });    

    databox.onSave.add(
        function(panel) {
            
            /*$(panel).find("textarea").each(function(){

                // usuniecie tla z treści
                var v = $(this).val() || "";

                var tmpId = "tmp-textarea-3124214";
                var tmpDiv = $("#"+tmpId);
                if( tmpDiv.size() == 0 ) {
                     $("body").append('<div style="display: none;" id="'+tmpId+'"></div>');
                     tmpDiv = $("#"+tmpId);
                }
                
                tmpDiv.html(v);
                tmpDiv.find("*").css("background","").css("background-color","");

                $(this).val(tmpDiv.html());
                tmpDiv.html('');

            });*/
        });       
});

var medytacjePopup = {    
    content : function(popupId){
        return this.inner_getPopup(popupId);
    },
    inner_getPopup : function(popupId){
        return $('body').find('#medytacje-popup-'+(popupId||''));
    },
    inner_getPopupContent : function(popupId){
        return $('body').find('#medytacje-popup-content-'+(popupId||''));
    },
    inner_createPopup : function(popupId){
        if(medytacjePopup.inner_getPopup(popupId).size()==0) {
            var body = '';
            body = body + '<div id="medytacje-popup-'+(popupId||'')+'" style="background-color: white; overflow: auto; color: black; padding: 7px; font-size: 16px;">';
            body = body + '  <div id="medytacje-popup-content-'+(popupId||'')+'" style="padding: 0px; " >';
            body = body + '  </div>';
            body = body + '</div>';
            $('body').append(body);
        }
    },
    show : function(popupId, html, settings){    

        var title = '';
        var width = 680;
        var height = 500;
        
        medytacjePopup.inner_createPopup(popupId);        
        var popup = medytacjePopup.inner_getPopup(popupId);        
        var popupContent = medytacjePopup.inner_getPopupContent(popupId);
                
        if(settings && settings.width){
            width = settings.width;
        }
        if(settings && settings.height){
            height = settings.height;
        }
        if(settings && settings.backgroundColor){
            medytacjePopup.inner_getPopup(popupId).css("background-color",settings.backgroundColor);     
        }
        if(settings && settings.backgroundColor){
            medytacjePopup.inner_getPopup(popupId).css("color",settings.color);     
        }
        if(settings && settings.title){
            title = settings.title;
        }

        popupContent.html(html || '');           
        popup.dialog({ 
            modal: true, 
            width: width,
            height: height,
            position: 'center',
            resizable: false,
            title: title,
            close: function(event, ui) { popupContent.empty(); },
            open: function(event, ui) { if( settings && settings.open ) settings.open(); }
        });
    },
    hide : function(popupId){
        var popup = medytacjePopup.inner_getPopup(popupId);    
        popup.dialog('close');
    },
};
