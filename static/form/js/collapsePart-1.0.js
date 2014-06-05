
var collapsePart = {
    inner_getContent: function (qElement) {
        return qElement.find(".collapsePart-content");
    },
    inner_getBar: function (qElement) {
        var bar = qElement.find(".collapsePart-bar");
        if (bar.size() == 0) {
            qElement.append("<div class='collapsePart-bar'>&nbsp;</div>");
            bar = qElement.find(".collapsePart-bar");
        }
        return bar;
    },
    inner_getBarText: function (qElement) {
        var bar = qElement.find(".collapsePart-barText");
        if (bar.size() == 0) {
            qElement.append("<div class='collapsePart-barText'>&nbsp;</div>");
            bar = qElement.find(".collapsePart-barText");
        }
        return bar;
    },
    inner_generateMoreButtonContent: function (text) {
        // return "<span style='font-family: arial; font-size: 13px; color: white; padding: 4px; background-color: black;'>" + text + "</span>";
        return "<span style='font-family: arial; font-size: 13px; padding: 4px 0px 4px 4px;'>" + text + "</span>";
    },

    isExpanded: function (qElement) {
        return qElement.attr("collapsePart-isExpanded");
    },
    setIsExpanded: function (qElement, value) {
        qElement.attr("collapsePart-isExpanded", value);
    },


    isElementValid: function (qElement) {
        var content = collapsePart.inner_getContent(qElement);
        var maxHeight = qElement.attr('content-height');
        var maxHeightInt = parseInt(maxHeight.replace('px', ''));
        return content.height() > maxHeightInt;
    },

    collapse: function (qElement) {

        var settings = qElement.data('settings');
        var content = collapsePart.inner_getContent(qElement);
        var bar = collapsePart.inner_getBar(qElement);
        var barText = collapsePart.inner_getBarText(qElement);

        var maxHeight = qElement.attr('content-height');
        var gradientImage = qElement.attr('content-image');

        qElement.css("position", "relative");
        bar.css("position", "absolute").css("bottom", "-5px").css("width", "100%").css("min-height","50px"); //.css("background","green");
        barText.css("position", "absolute").css("bottom", "0px").css("right","0px").css("width", "100%").css("text-align", "right");

        if (gradientImage) {
            bar.css("background-image", "url(" + gradientImage + ")").css("background-repeat", "repeat-x").css("background-position", "bottom | left");
        }

        var text = (settings ? settings.expandText : null) || "POKA¯ WIÊCEJ";
        barText.html(this.inner_generateMoreButtonContent(text));
        //bar.html(this.inner_generateMoreButtonContent(text));

        content.css("height", maxHeight).css("overflow", "hidden");
        collapsePart.setIsExpanded(qElement, 0);
    },
    expand: function (qElement) {

        var settings = qElement.data('settings');
        var content = collapsePart.inner_getContent(qElement);
        var bar = collapsePart.inner_getBar(qElement);
        var barText = collapsePart.inner_getBarText(qElement);

        content.css("height", "auto");
        collapsePart.setIsExpanded(qElement, 1);

        if (settings && settings.destroyOnExpand) {
            bar.remove();
            barText.remove();
        }
        else {
            var text = (settings ? settings.collapseText : null) || "POKA¯ MNIEJ";
            barText.html(this.inner_generateMoreButtonContent(text));
            //bar.html(this.inner_generateMoreButtonContent(text));
        }
    },
    init: function (qElement, settings) {
        if (this.isElementValid(qElement)) {
            qElement.data('settings', settings);
            var content = collapsePart.inner_getContent(qElement);
            var bar = collapsePart.inner_getBar(qElement);
            var barText = collapsePart.inner_getBarText(qElement);

            var onBarClick = function () {
                var clickedElement = $(this).parent();
                var isExpanded = collapsePart.isExpanded(clickedElement);
                if (isExpanded > 0) {
                    collapsePart.collapse(clickedElement);
                } else {
                    collapsePart.expand(clickedElement);
                }
            };

            var onBarEnter = function () { $(this).css('cursor', 'pointer'); };
            var onBarLeave = function () { $(this).css('cursor', 'pointer'); };

            bar.click(onBarClick);
            barText.click(onBarClick);

            bar.hover(onBarEnter, onBarLeave);
            barText.hover(onBarEnter, onBarLeave);

            collapsePart.collapse(qElement);
        }
    }
};