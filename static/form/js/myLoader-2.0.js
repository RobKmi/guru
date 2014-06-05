
var myViewManagerWindow = {

    _zIndex: 10000,

    show: function (key, options, afterAction) {

        var id = myViewManagerWindow._getID(key);
        var borderId = myViewManagerWindow._getBorderID(key);

        var border = $("#" + borderId);
        var innerDiv = $("#" + id);

        // events
        $(window).
            unbind2('resize', 'myViewManagerWindow').
            bind2('resize', 'myViewManagerWindow', function () {
                $(".myViewManagerWindow").each(function () {
                    var key0 = $(this).attr('key');
                    myViewManagerWindow._correctSize(key0);
                });
            });

        // create
        if (innerDiv.size() == 0) {

            var body = $('body');

            var zIndexBorder = myViewManagerWindow._nextZIndex();
            var zIndexBody = myViewManagerWindow._nextZIndex();

            var borderHtml = '<div id="' + borderId + '" style="z-index: ' + zIndexBorder + '; position: fixed; top: 0px; left: 0px; width: 50px; height: 50px; background: black;"></div>';
            body.append(borderHtml);
            border = $("#" + borderId);

            var innerHtml = '';
            innerHtml = innerHtml + '<div class="myViewManagerWindow" key="' + key + '" id="' + id + '" style="z-index: ' + zIndexBody + '; position: fixed; top: 10px; left: 10px; width: 800px; height: 600px; background: white; padding: 15px; border: solid 1px gray;">';
            innerHtml = innerHtml + '</div>';
            body.append(innerHtml);
            innerDiv = $('#' + id);

            console2.log('create ' + id);
        }
        else {
            border.show();
            innerDiv.show();
        }
        innerDiv.html(options.html + options.js);
        border.fadeTo(0, 0.2);

        // correct
        myViewManagerWindow._correctSize(key);

        return innerDiv;
    },

    unbindIfExists: function () {

    },

    close: function (key) {
        var id = myViewManagerWindow._getID(key);
        var borderId = myViewManagerWindow._getBorderID(key);

        var border = $("#" + borderId);
        var innerDiv = $("#" + id);

        if (innerDiv.size() > 0)
            ko.cleanNode(innerDiv.get(0));

        innerDiv.html('');
        innerDiv.hide();
        border.hide();
    },

    ////////////////////////////////////////////////

    _correctSize: function (key) {
        var id = myViewManagerWindow._getID(key);
        var borderId = myViewManagerWindow._getBorderID(key);

        var border = $("#" + borderId);
        var innerDiv = $("#" + id);
        var innerDivChild = innerDiv.children(":first");

        var w = $(window);
        var wWidth = w.width();
        var wHeight = w.height();

        border.css("width", wWidth);
        border.css("height", wHeight);

        var sizeApplied = false;
        if (innerDivChild.size() > 0) {
            var w = innerDivChild.attr('window-width');
            var h = innerDivChild.attr('window-height');

            if (w && h) {

                if (w.indexOf('%') >= 0) {
                    w = parseFloat(w.replace('%', '')) / 100.0;
                    innerDiv.css("left", wWidth * (1.0 - w) / 2.0);
                    innerDiv.css("width", wWidth * w);
                }
                else {
                    w = parseInt(w.replace('px', ''));
                    innerDiv.css("left", (wWidth - w) / 2.0);
                    innerDiv.css("width", w);
                }

                if (h.indexOf('%') >= 0) {
                    h = parseFloat(h.replace('%', '')) / 100.0;
                    innerDiv.css("top", wHeight * (1.0 - h) / 2.0);
                    innerDiv.css("height", wHeight * h);
                }
                else {
                    h = parseInt(h.replace('px', ''));
                    innerDiv.css("top", (wHeight - h) / 2.0);
                    innerDiv.css("height", h);
                }

                sizeApplied = true;
            }
        }

        if (!sizeApplied) {
            innerDiv.css("left", wWidth * 0.1);
            innerDiv.css("top", wHeight * 0.1);
            innerDiv.css("width", wWidth * 0.8);
            innerDiv.css("height", wHeight * 0.8);
        }
    },

    _nextZIndex: function () {
        myViewManagerWindow._zIndex = myViewManagerWindow._zIndex + 1;
        return myViewManagerWindow._zIndex;
    },

    _getID: function (key) {
        return 'myViewManagerWindow_' + key;
    },

    _getBorderID: function (key) {
        return 'myViewManagerWindow_border_' + key;
    }
};


var jsHelper = {

    //  preloads = "red.gif,green.gif,blue.gif".split(",")
    //var tempImg = []
    preloadImages: function (images) {
        if (images) {
            var preloads = images; // images.split(",")
            var tempImg = [];
            for (var x = 0; x < preloads.length; x++) {
                tempImg[x] = new Image()
                tempImg[x].src = preloads[x]
            }
        }
    },

    substring: function (txt, start, len) {
        var out = '';
        if (txt) {
            if (len == null) len = 99999999;
            var max = Math.min(txt.length, start + len);
            for (var i = start; i < max; i++) {
                out = out + txt.charAt(i);
            }
        }
        return out;
    },
    clone: function (object, deep) {
        if (typeof deep === "undefined") deep = true;
        if (deep) return jQuery.extend(true, {}, object); // Deep copy
        else return jQuery.extend({}, object); // Shallow copy
    },
    endsWith: function (txt, suffix) {
        return txt.indexOf(suffix, txt.length - suffix.length) !== -1;
    },
    redirect: function (url) {
        window.location.href = url;
    },
    getAttributes: function (el, condition) {
        var result = {};
        if (el && el.attributes) {
            var attrs = el.attributes;
            var len = attrs.length;
            for (var i = 0; i < len; i++) {
                var attr = attrs.item(i)
                if (condition == null || condition(attr.nodeName, attr.nodeValue)) {
                    result[attr.nodeName] = attr.nodeValue;
                }
            }
        }
        return result;
    },
    txtToHtml: function (str, correctSpaces) {
        //return str.split("\n").join("<br />");
        if (correctSpaces === true) {
            str = str.replace(/ /g, "&nbsp;");
        }
        str = str.replace(/\n/g, '<br />');
        //str = str.replace('\n', '<br />');
        return str;
    }
};

var idHelper = {
    _inner_currentId: 10000000,
    next: function () {
        idHelper._inner_currentId = idHelper._inner_currentId + 1;
        var id = idHelper._inner_currentId;
        return id;
    }
};

var arrayHelper = {
    unionArray: function (array1, array2) {
        var r = [];
        if (array1)
            for (var i = 0; i < array1.length; i++)
                r.push(array1[i]);
        if (array2)
            for (var i = 0; i < array2.length; i++)
                r.push(array2[i]);
        return r;
    },
    unionDict: function (dict1, dict2) {
        var r = [];
        if (dict1)
            for (var key in dict1)
                r[key] = dict1[key];
        if (dict2)
            for (var key in dict2)
                r[key] = dict2[key];
        return r;
    },
    moveItem: function (item, destIndex, sourceList, destList) {

        if (destIndex < 0)
            destIndex = 0;

        if (destIndex > destList.length)
            destIndex = destList.length;

        var newSource = $.grep(
            sourceList,
            function (sourceItem) { return sourceItem != item; });

        var newDest = [];
        for (var i = 0; i < destList.length + 1; i++) {
            if (destIndex == i) {
                newDest.push(item);
            } else if (destIndex > i) {
                newDest.push(destList[i]);
            } else {
                newDest.push(destList[i - 1]);
            }
        }

        //console2.log('newSource.length = ' + newSource.length + ' (' + sourceList.length + ')');
        //console2.log('newDest.length = ' + newDest.length + ' (' + destList.length + ')');

        return {
            SourceList: newSource,
            DestList: newDest
        };
    },
    insertAt: function (array, index) {
        var arrayToInsert = Array.prototype.splice.apply(arguments, [2]);
        return arrayHelper.insertArrayAt(array, index, arrayToInsert);
    },
    insertArrayAt: function (array, index, arrayToInsert) {
        Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
        return array;
    },
    getCopy: function (array) {
        var newArray = new Array();
        for (var key in array) {
            newArray[key] = array[key];
        }
        return newArray;
    },
    equals: function (arrayA, arrayB) {
        if ((arrayA == null && arrayB != null) ||
            (arrayA != null && arrayB == null)) {
            return false;
        }
        else if (arrayA == null && arrayB == null) {
            return true;
        }
        else if (arrayA.length != arrayB.length) {
            return false;
        }
        else {
            for (var i = 0, l = arrayA.length; i < l; i++) {
                if (arrayA[i] !== arrayB[i]) {
                    return false;
                }
            }
            return true;
        }
    }
};

(function () {
    var D = new Date('2011-06-02T09:34:29+02:00');
    if (!D || +D !== 1307000069000) {
        Date.fromISO = function (s) {
            var day, tz,
            rx = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
            p = rx.exec(s) || [];
            if (p[1]) {
                day = p[1].split(/\D/);
                for (var i = 0, L = day.length; i < L; i++) {
                    day[i] = parseInt(day[i], 10) || 0;
                };
                day[1] -= 1;
                day = new Date(Date.UTC.apply(Date, day));
                if (!day.getDate()) return NaN;
                if (p[5]) {
                    tz = (parseInt(p[5], 10) * 60);
                    if (p[6]) tz += parseInt(p[6], 10);
                    if (p[4] == '+') tz *= -1;
                    if (tz) day.setUTCMinutes(day.getUTCMinutes() + tz);
                }
                return day;
            }
            return NaN;
        }
    }
    else {
        Date.fromISO = function (s) {
            return new Date(s);
        }
    }
})();

var parseDate = function (dateStr) {

    if (dateStr == null)
        return null;

    if (Object.prototype.toString.call(dateStr) === '[object Date]') {
        return dateStr;
    } else if (Object.prototype.toString.call(dateStr) === '[object String]') {

        var parts = dateStr.split('T');
        if (parts.length >= 1) {
            return Date.parse(parts[0]);
            /* var dateParts = parts[0].split('-');
             var result = new Date(
                 parseInt(dateParts[0]),
                 parseInt(dateParts[1]) - 1,
                 parseInt(dateParts[2]));
 
             return result;*/
        }
        else {
            return null;
        }

    } else {

        var date = Date(dateStr);
        if (date == null || isNaN(date)) {

            var parts = dateStr.split('T');
            if (parts.length >= 1) {
                return Date.parse(parts[0]);
                /*var dateParts = parts[0].split('-');
              
                var result = new Date(
                    parseInt(dateParts[0]),
                    parseInt(dateParts[1]) - 1,
                    parseInt(dateParts[2]));

                return result;*/
            }
            else {
                return null;
            }

        }
        return date;
    }
};

jQuery.fn.slideLeftHide = function (speed, callback) {
    this.animate({
        width: "hide",
        paddingLeft: "hide",
        paddingRight: "hide",
        marginLeft: "hide",
        marginRight: "hide"
    }, speed, callback);
}

jQuery.fn.slideLeftShow = function (speed, callback) {
    this.animate({
        width: "show",
        paddingLeft: "show",
        paddingRight: "show",
        marginLeft: "show",
        marginRight: "show"
    }, speed, callback);
}

$.fn.hasVScrollBar = function () {
    return this.get(0).scrollHeight > this.height();
}

$.fn.hasHScrollBar = function () {
    return this.get(0).scrollWidth > this.width();
}

var dates = {
    convert: function (d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0], d[1], d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year, d.month, d.date) :
            NaN
        );
    },
    compare: function (a, b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a = this.convert(a).valueOf()) &&
            isFinite(b = this.convert(b).valueOf()) ?
            (a > b) - (a < b) :
            NaN
        );
    },
    inRange: function (d, start, end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
             isFinite(d = this.convert(d).valueOf()) &&
             isFinite(start = this.convert(start).valueOf()) &&
             isFinite(end = this.convert(end).valueOf()) ?
             start <= d && d <= end :
             NaN
         );
    }
};

var myRand = {
    randomString: function () {
        var objName = "str" + jsHelper.substring(Math.random().toString(36), 7);
        return objName;
    }
}

var idGenerator = {
    __current: 0,
    next: function () {
        this.__current = this.__current + 1;
        return "__GEN_ID_NR_" + this.__current;
    }
}

function MyPair(aKey, aValue) {
    this.key = aKey;
    this.value = aValue;
}

var internal_element_to_callbacks = new Array();
var internalBind2Ident = 1;
jQuery.fn.bind2 = function (eventName, callbackName, callback) {
    return this.each(function (i, node) {
        internalBind2($(this), 'bind', eventName, callbackName, callback);
    });
}
jQuery.fn.unbind2 = function (eventName, callbackName, callback) {
    return this.each(function (i, node) {
        internalBind2($(this), 'unbind', eventName, callbackName, callback);
    });
}
function internalBind2(element, mode, eventName, callbackName, callback) {
    var lElement = element;
    var lId = lElement.attr("id");

    callbackName = callbackName || '';
    eventName = eventName || '';

    // nadanie identyfikatora
    var lIdent = lElement.attr("internal-bind2-ident");
    if (!lIdent) {
        lIdent = internalBind2Ident;
        internalBind2Ident = internalBind2Ident + 1;
        lElement.attr("internal-bind2-ident", lIdent)
    }

    // dodanie callback'a
    var callbacks_for_element = internal_element_to_callbacks[lIdent];
    if (!callbacks_for_element) {
        callbacks_for_element = new Array();
        if (mode == 'bind') {
            internal_element_to_callbacks[lIdent] = callbacks_for_element;
        }
    }

    // dodanie callback'a
    var callbacks_for_eventName = callbacks_for_element[eventName];
    if (mode == 'bind') {
        var lIsNew = !callbacks_for_eventName;
        if (!callbacks_for_eventName) {
            callbacks_for_eventName = new Array();
            callbacks_for_element[eventName] = callbacks_for_eventName;
        }
        callbacks_for_eventName[callbackName] = callback;
    } else {
        if (callbacks_for_eventName) {
            callbacks_for_eventName[callbackName] = null;
        }
    }

    // domyślne zdarzenie
    lElement.unbind(eventName, internalBind2EventHandler);
    if (mode == 'bind') {
        lElement.bind(eventName, internalBind2EventHandler);
    }
}
function internalBind2EventHandler(e, s) {
    var lEventName1 = e.type;
    var lThis1 = $(this);
    var lIdent1 = lThis1.attr("internal-bind2-ident");
    var callbacks_for_element = internal_element_to_callbacks[lIdent1];
    if (callbacks_for_element) {
        var callbacks_for_eventName = callbacks_for_element[lEventName1];
        if (callbacks_for_eventName) {
            for (var callbackName in callbacks_for_eventName) {
                var callback = callbacks_for_eventName[callbackName];
                if (callback) {
                    callback.apply(lThis1, new Array(e, s));
                }
            }
        } else {
            alert('callbacks_for_eventName is null');
        }
    } else {
        alert('callbacks_for_element is null');
    }
}

jQuery.fn.disableInput = function (eventName, callback) {
    return this.each(function (i, node) {
        var lThis0 = $(this);
        lThis0.removeAttr('disabled');
        lThis0.attr('disabled', true);
    });
}

jQuery.fn.enableInput = function (eventName, callback) {
    return this.each(function (i, node) {
        var lThis0 = $(this);
        lThis0.removeAttr('disabled');
    });
}

function isEmail(eMail) {
    var isValid = true;
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var emailaddressVal = eMail;
    if (emailaddressVal == '') {
        isValid = false;
    }
    else if (!emailReg.test(emailaddressVal)) {
        isValid = false;
    }
    return isValid;
}

function getKeyCode(e) {
    return (e.keyCode ? e.keyCode : e.which);
}

$.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var lAll = window.location.href.slice(window.location.href.indexOf('?') + 1);
        var lAllParts = lAll.split('#');
        if (lAllParts.length > 0) {
            var hashes = lAllParts[0].split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                var lKey = decodeURIComponent(hash[0]);
                var lValue = hash[1];
                vars.push(lKey);
                vars[lKey] = decodeURIComponent(lValue);
            }
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    }
});

jQuery.fn.moveTo = function (newParent, replaceContent) {
    var lReplaceContent = replaceContent || true;
    return this.each(function (i, node) {
        var lElement = $(node);
        if (newParent && lElement.size() > 0 && newParent.size() > 0) {
            lElement.remove();
            if (lReplaceContent) {
                newParent.html(lElement.outerHTML());
            }
            else {
                newParent.append(lElement.outerHTML());
            }
        }
    });
}

jQuery.fn.enableButton = function () {
    return this.each(function (i, node) {
        var lElement = $(node);
        lElement.removeAttr("disabled");
    });
}

jQuery.fn.disableButton = function () {
    return this.each(function (i, node) {
        var lElement = $(node);
        lElement.attr("disabled", "disabled");
    });
}

jQuery.fn.isChildOf = function (filter_string) {

    var parents = $(this).parents().get();

    for (j = 0; j < parents.length; j++) {
        if ($(parents[j]).is(filter_string)) {
            return true;
        }
    }

    return false;
};

jQuery.fn.outerHTML = function () {
    if (this.size() > 0) {
        var node = this.get(0);
        return node.outerHTML || (
          function (n) {
              var div = document.createElement('div'), h;
              div.appendChild(n.cloneNode(true));
              h = div.innerHTML;
              div = null;
              return h;
          })(node);
    }
}

jQuery.fn.getAttributes = function () {
    var lAttributes = new Array();
    if (this.size() > 0) {
        var lElement = this.get(0);
        var arr = lElement.attributes;
        for (var i = 0; i < arr.length; i++) {
            var lAttr = arr[i];
            lAttributes.push(new MyPair(lAttr.name, lAttr.value));
        }
    }
    return lAttributes;
}

jQuery.fn.uniqueSelector = function (getAttributes) {
    var lSelector = '';
    if (!getAttributes) getAttributes = false;
    if (this.size() > 0) {
        var lNodeName = this.get(0).nodeName;
        lSelector += lNodeName;
        if (this.attr("id")) {
            lSelector += "#" + this.attr("id");
        }
        else if (this.attr("class")) {
            var lClass = "." + this.attr("class");
            var regExp = /\s+/g;
            lClass = lClass.replace(regExp, ".");
            lSelector += lClass;
        }
        if (getAttributes) {
            var lAttributes = this.getAttributes();
            if (lAttributes && lAttributes.length > 0) {
                for (var i = 0; i < lAttributes.length; i++) {
                    var lAttribute = lAttributes[i];
                    var lKeyUp = lAttribute.key.toUpperCase();
                    if (lAttribute && lKeyUp != "ID" && lKeyUp != "CLASS" && lKeyUp != "STYLE") {
                        lSelector += '[' + lAttribute.key + '=' + '"' + lAttribute.value + '"' + ']';
                    }
                }
            }
        }
    }
    return lSelector;
}

var internalChangeInputLastValues = new Array();
var internalChangeInputCallbacks = new Array();
jQuery.fn.changeValue = function (callbackName, callback) {
    return this.each(function (i, node) {
        if (callback) {
            var lThis0 = $(this);
            var lId0 = lThis0.attr("id");
            if (!callbackName) callbackName = callbackName || "";
            internalChangeInputLastValues[lId0] = lThis0.val();
            internalChangeInputCallbacks[lId0] = callback;
            lThis0.bind2("keyup", "changeValue_keyup", internalChangeValueEventHandler);
            lThis0.bind2("blur", "changeValue_blur", internalChangeValueEventHandler);
            lThis0.bind2("change", "changeValue_blur", internalChangeValueEventHandler);
        }
    });
}
function internalChangeValueEventHandler(e, s) {
    var lThis1 = $(this);
    var lId1 = lThis1.attr("id");
    var lLastValue1 = internalChangeInputLastValues[lId1];
    var lCurrentValue1 = lThis1.val();
    internalChangeInputLastValues[lId1] = lCurrentValue1;
    if (lLastValue1 != lCurrentValue1) {
        internalChangeInputCallbacks[lId1].apply(this, new Array(e, s));
    }
}

var internalConInpToIdent = 1;
jQuery.fn.connectInputTo = function (selector) {
    return this.each(function (i, node) {
        if (selector) {
            var lSource0 = $(this);
            var lDest0 = $(selector);

            // pobranie identyfikatorów
            var lSourceId = lSource0.attr("internal-connection-id");
            var lDestId = lDest0.attr("internal-connection-id");

            // nadanie identyfikatorów
            if (!lSourceId) {
                lSourceId = internalConInpToIdent;
                internalConInpToIdent = internalConInpToIdent + 1;
            }
            if (!lDestId) {
                DestId = internalConInpToIdent;
                internalConInpToIdent = internalConInpToIdent + 1;
            }

            lSource0.attr("internal-connection-id", lSourceId);
            lSource0.attr("internal-connection-to", lDestId);
            lDest0.attr("internal-connection-id", lDestId);
            lDest0.attr("internal-connection-to", lSourceId);

            lSource0.changeValue("connectInputTo_", function (ee, ss) {
                var lSource1 = $(this);
                var lDestId1 = lSource1.attr("internal-connection-to");
                var lThisVal1 = lSource1.val();
                var lDest1 = $('[internal-connection-id="' + lDestId1 + '"]');
                if (lDest1.val() != lThisVal1) {
                    lDest1.val(lThisVal1);
                    lDest1.trigger('change');
                }
            });

            lDest0.changeValue("connectInputTo_", function (ee, ss) {
                var lDest1 = $(this);
                var lSourceId1 = lDest1.attr("internal-connection-to");
                var lDest1Val1 = lDest1.val();
                var lSource1 = $('[internal-connection-id="' + lSourceId1 + '"]');
                if (lSource1.val() != lDest1Val1) {
                    lSource1.val(lDest1Val1);
                    lSource1.trigger('change');
                }
            });

            // inicjalne wartości
            var lSourceVal = lSource0.val();
            var lDestVal = lDest0.val();
            if (lSourceVal != lDestVal) {
                lDest0.val(lSourceVal);
                // lDest0.trigger('change');
            }
        }
    });
};

jQuery.fn.tableBorder = function (mode) {
    return this.each(function (i, node) {
        var lThis0 = $(this);
        var lMode = mode || 'single';
        if (lMode == 'single') {
            var lImgLeft = $.trim(lThis0.attr('img-left'));
            var lImgCenter = $.trim(lThis0.attr('img-center'));
            var lImgRight = $.trim(lThis0.attr('img-right'));
            var lSizeLeft = $.trim((lThis0.attr('img-left-width') || '')); if (lSizeLeft != '') lSizeLeft = 'width:' + lSizeLeft + ';';
            var lSizeHeight = $.trim((lThis0.attr('img-height') || '')); if (lSizeHeight != '') lSizeHeight = 'height:' + lSizeHeight + ';';
            var lSizeRight = $.trim((lThis0.attr('img-right-width') || '')); if (lSizeRight != '') lSizeRight = 'width:' + lSizeRight + ';';
            var lHtml = '';
            var lContent = $.trim(lThis0.html());
            if (lContent == '') lContent = '&nbsp;';
            lHtml = lHtml + '<table cellspacing="0" cellpadding="0" style="width: 100%;">';
            lHtml = lHtml + '  <tr>';
            lHtml = lHtml + '    <td style="background: url(' + lImgLeft + ') no-repeat top left; font-size: 1px; ' + lSizeLeft + ' ' + lSizeHeight + ' ">';
            lHtml = lHtml + '    &nbsp;</td>';
            lHtml = lHtml + '    <td style="background: url(' + lImgCenter + ') repeat-x top left;' + lSizeHeight + '">';
            lHtml = lHtml + lContent;
            lHtml = lHtml + '    </td>';
            lHtml = lHtml + '    <td style="background: url(' + lImgRight + ') no-repeat top left; font-size: 1px;' + lSizeRight + ' ' + lSizeHeight + '">';
            lHtml = lHtml + '    &nbsp;</td>';
            lHtml = lHtml + '  </tr>';
            lHtml = lHtml + '</table>';
            lThis0.html(lHtml);
        }
    });
}

jQuery.fn.label2 = function () {
    return this.each(function (i, node) {
        var lThis0 = $(this);
        var lImageHtml = '';
        var lTextHtml = '';
        var lHtml = '';

        var lLink = $.trim(lThis0.attr('link'));
        var lImgUrl = $.trim(lThis0.attr('img'));
        var lText = $.trim(lThis0.attr('text'));
        var lTableWidth = $.trim(lThis0.attr('table-width'));

        var lIsLink = (lLink != '');

        if (lImgUrl != '' || lText != '') {
            var lImgWidth = $.trim((lThis0.attr('img-width') || '')); if (lImgWidth != '') lImgWidth = 'width:' + lImgWidth + ';';
            var lImgHeight = $.trim((lThis0.attr('img-height') || '')); if (lImgHeight != '') lImgHeight = 'height:' + lImgHeight + ';';
            var lImgAlign = $.trim((lThis0.attr('img-align') || '')); if (lImgAlign == '') lImgAlign = 'left';
            var lVerticalImgAlign = $.trim((lThis0.attr('img-vertical-align') || '')); if (lVerticalImgAlign == '') lVerticalImgAlign = 'middle';

            var lTextWidth = $.trim((lThis0.attr('text-width') || '')); if (lTextWidth != '') lTextWidth = 'width:' + lTextWidth + ';';
            var lTextHeight = $.trim((lThis0.attr('text-height') || '')); if (lTextHeight != '') lTextHeight = 'height:' + lTextHeight + ';';
            var lTextAlign = $.trim((lThis0.attr('text-align') || '')); if (lTextAlign == '') lTextAlign = 'left';

            if (lImgUrl != '') {
                lImageHtml = lImageHtml + '    <td style="vertical-align: ' + lVerticalImgAlign + '; text-align: ' + (lImgAlign == 'left' ? 'right' : 'left') + '; padding: 0px; margin: 0px;' + lImgWidth + lImgHeight + '">';
                if (lIsLink) {
                    lImageHtml = lImageHtml + '<a href="' + lLink + '" TARGET="_blank" style="color: inherit; text-decoration: inherit;">';
                }
                lImageHtml = lImageHtml + '      <img border="0" src="' + lImgUrl + '" style="vertical-align: ' + lVerticalImgAlign + ';' + lImgWidth + lImgHeight + '"/>';
                if (lIsLink) {
                    lImageHtml = lImageHtml + '</a>';
                }
                lImageHtml = lImageHtml + '    </td>';
            }

            if (lText != '') {
                lTextHtml = lTextHtml + '    <td style="vertical-align: middle; text-align: ' + (lTextAlign == 'left' ? 'right' : 'left') + '; padding: 0px; margin: 0px;' + lTextWidth + lTextHeight + '">';
                if (lIsLink) {
                    lTextHtml = lTextHtml + '<a href="' + lLink + '" TARGET="_blank" style="color: inherit; text-decoration: inherit;">';
                }
                lTextHtml = lTextHtml + lText;
                if (lIsLink) {
                    lTextHtml = lTextHtml + '</a>';
                }
                lTextHtml = lTextHtml + '    </td>';
            }

            var lContent = $.trim(lThis0.html());
            if (lContent == '') lContent = '&nbsp;';
            if (lIsLink) lContent = '<a href="' + lLink + '" TARGET="_blank" style="color: inherit; text-decoration: inherit;">' + lContent + '</a>';

            if (lTableWidth != '')
                lTableWidth = 'width: ' + lTableWidth + ';';

            lHtml = lHtml + '<table cellspacing="0" cellpadding="0" style="' + lTableWidth + '">';
            lHtml = lHtml + '  <tr>';
            if (lImgAlign == 'left') lHtml = lHtml + lImageHtml;
            if (lTextAlign == 'left') lHtml = lHtml + lTextHtml;
            lHtml = lHtml + '    <td style="vertical-align: middle; text-align: ' + (lImgAlign == 'left' ? 'left' : 'right') + '; padding: 0px 0px 0px 5px; margin: 0px;">';
            lHtml = lHtml + lContent;
            lHtml = lHtml + '    </td>';
            if (lTextAlign != 'left') lHtml = lHtml + lTextHtml;
            if (lImgAlign != 'left') lHtml = lHtml + lImageHtml;
            lHtml = lHtml + '  </tr>';
            lHtml = lHtml + '</table>';
            lThis0.html(lHtml);
        }
    });
}



var setTimeout2Array = new Array();

function setTimeout2(key, code, delay) {
    if (code && code != '') {
        var lVal = setTimeout2Array[key];
        if (!lVal) {
            lVal = 0;
        }
        var lNewVal = lVal + 1;
        setTimeout2Array[key] = lNewVal;
        var lCode = ' var lTmp234 = setTimeout2Array["' + key + '"]; if( lTmp234 == ' + lNewVal + ' ) { ' + code + ' } ';
        setTimeout(lCode, delay);
    }
}




var myCenterGuardian = {
    inner_sizeGuardianId: 1,
    ////////////////////////////////
    refresh: function () {
        $(".ref-centerGuardian").each(function () {
            var element = $(this);
            var mainElementId = element.attr('ref-centerGuardian-id');
            var mainElement = $(".centerGuardian-id-" + mainElementId);
            myCenterGuardian.inner_correctPosition(mainElement, true);
        });
    },
    bind: function (element, mainElement, options) {
        mainElement = myCenterGuardian.inner_getMainElement(element, mainElement);
        var mainElementId = myCenterGuardian.inner_getGuardianId(mainElement);

        if (!options) options = {};
        options.async = options.async || false;

        element.attr('ref-centerGuardian-id', mainElementId);
        element.attr('ref-centerGuardian-async', (options.async ? 1 : 0));

        element.removeClass('ref-centerGuardian-id-' + mainElementId);
        element.addClass('ref-centerGuardian-id-' + mainElementId);
        element.removeClass('ref-centerGuardian');
        element.addClass('ref-centerGuardian');

        myCenterGuardian.inner_correctPosition(mainElement, true);

        mainElement.
            unbind2('resize', 'centerGuardian').
            bind2('resize', 'centerGuardian', myCenterGuardian.inner_eventHandler_mainElement);

        element.
            unbind2('resize', 'centerGuardian').
            bind2('resize', 'centerGuardian', myCenterGuardian.inner_eventHandler_element);
    },
    unbind: function (element) {
        var mainElementId = element.attr('ref-centerGuardian-id');
        var mainElement = $(".centerGuardian-id-" + mainElementId);

        element.attr('ref-centerGuardian-id', '-1');
        element.removeClass('ref-centerGuardian-id-' + mainElementId);
        element.removeClass('ref-centerGuardian');

        element.unbind2('resize', 'centerGuardian');

        var elements = $(".ref-centerGuardian-id-" + mainElementId);
        if (elements.size() == 0) {
            mainElement.unbind2('resize', 'centerGuardian');
        }
    },
    ////////////////////////////////
    inner_eventHandler_element: function (s, e) {
        var element = $(this);
        var mainElementId = element.attr('ref-centerGuardian-id');
        var mainElement = $(".centerGuardian-id-" + mainElementId);
        myCenterGuardian.inner_correctPosition(mainElement, false);
    },
    inner_eventHandler_mainElement: function (s, e) {
        myCenterGuardian.inner_correctPosition($(this), false);
    },
    ////////////////////////////////
    inner_correctPosition: function (mainElement, sync) {

        var mainElementId = myCenterGuardian.inner_getGuardianId(mainElement);
        if (sync) {
            myCenterGuardian.inner_correctPositionBase(mainElementId);
        }

        setTimeout2(
            'myCenterGruardian' + mainElementId,
            ' myCenterGuardian.inner_correctPositionBase(' + mainElementId + ') ',
            200);
    },

    inner_correctPositionBase: function (mainElementId) {
        var mainElement = $(".centerGuardian-id-" + mainElementId);
        var elements = $(".ref-centerGuardian-id-" + mainElementId);

        elements.each(
            function () {

                var thisHeight = $(this).height();
                var parentHeight = mainElement.height();
                var marginTop = parentHeight / 2 - thisHeight / 2;

                var oldMargintop = $(this).css('margin-top');
                if (oldMargintop == null || oldMargintop != marginTop) {
                    $(this).css('margin-top', marginTop);
                }
            });
    },

    inner_getMainElement: function (element, mainElement) {
        if (mainElement) {
            return mainElement;
        }
        else {
            var parentId = element.attr('vCenter-parent');
            if (parentId) {
                return element.closest(parentId);
            } else {
                return element.parent();
            }
        }
    },
    inner_getGuardianId: function (element) {
        var id = element.attr('centerGuardian-id');
        if (!id) {
            myCenterGuardian.inner_sizeGuardianId = myCenterGuardian.inner_sizeGuardianId + 1;
            id = myCenterGuardian.inner_sizeGuardianId;
            element.attr('centerGuardian-id', id);
            element.removeClass('centerGuardian-id-' + id);
            element.addClass('centerGuardian-id-' + id);
        }
        return id;
    }
};

var mySizeGuardian = {
    inner_sizeGuardianId: 1,
    ////////////////////////////////
    bind: function (element, mainElement, options) {

        if (!options) options = {};
        options.correctX = options.correctX || true;
        options.correctY = options.correctY || true;
        /*options.marginTop = options.marginTop || 0;
        options.marginBottom = options.marginBottom || 0;
        options.marginLeft = options.marginLeft || 0;
        options.marginRight = options.marginRight || 0;*/
        options.margin = options.margin || '';
        options.position = options.position || '';
        options.async = options.async || false;

        if (options.correctX || options.correctY) {

            var mainElementId = mySizeGuardian.inner_getGuardianId(mainElement);

            element.attr('ref-sizeGuardian-id', mainElementId);
            element.removeClass('ref-sizeGuardian-id-' + mainElementId);
            element.addClass('ref-sizeGuardian-id-' + mainElementId);

            element.attr('ref-sizeGuardian-x', (options.correctX || false) ? '1' : '0');
            element.attr('ref-sizeGuardian-y', (options.correctY || false) ? '1' : '0');
            element.attr('ref-sizeGuardian-async', (options.async || false) ? '1' : '0');

            /*element.attr('ref-sizeGuardian-marginTop', options.marginTop);
            element.attr('ref-sizeGuardian-marginBottom', options.marginBottom);
            element.attr('ref-sizeGuardian-marginLeft', options.marginLeft);
            element.attr('ref-sizeGuardian-marginRight', options.marginRight);*/
            element.attr('ref-sizeGuardian-margin', options.margin);
            element.attr('ref-sizeGuardian-position', options.position);

            mySizeGuardian.inner_correctSize(mainElement, true);

            mainElement.
                unbind2('resize', 'sizeGuardian').
                bind2('resize', 'sizeGuardian', mySizeGuardian.inner_eventHandler)
        }
    },
    unbind: function (element) {
        var mainElementId = element.attr('ref-sizeGuardian-id');
        element.attr('ref-sizeGuardian-id', '-1');
        element.removeClass('ref-sizeGuardian-id-' + mainElementId);

        var mainElement = $(".sizeGuardian-id-" + mainElementId);

        // usunięcie referencji
        var elements = $(".ref-sizeGuardian-id-" + mainElementId);
        if (elements.size() == 0) {
            //alert('dead ' + mainElement.get(0).nodeName + ' ' + mainElementId);
            //alert(mainElement.html());
            mainElement.unbind2('resize', 'sizeGuardian');
        }
    },
    ////////////////////////////////
    inner_eventHandler: function (s, e) {
        mySizeGuardian.inner_correctSize($(this), false);
    },
    inner_correctSize: function (mainElement, sync) {

        var mainElementId = mySizeGuardian.inner_getGuardianId(mainElement);
        if (sync) {
            mySizeGuardian.inner_correctSizeBase(mainElementId);
        }

        setTimeout2(
           'mySizeGuardian' + mainElementId,
           'mySizeGuardian.inner_correctSizeBase(' + mainElementId + ') ',
           200);
    },

    inner_correctSizeBase: function (mainElementId) {
        //console2.log('inner_correctSizeBase ' + mainElementId);
        var mainElement = $(".sizeGuardian-id-" + mainElementId);
        var elements = $(".ref-sizeGuardian-id-" + mainElementId);

        elements.each(
            function () {
                var element = $(this);

                var margin = mySizeGuardian._parseMargin(element.attr('ref-sizeGuardian-margin'));
                if (margin.txt)
                    element.css('margin', margin.txt);

                var position = mySizeGuardian._parseMargin(element.attr('ref-sizeGuardian-position'));
                if (position.txt) {
                    if (position.top != null)
                        element.css('top', position.top);
                    if (position.left != null)
                        element.css('left', position.left);
                    if (position.right != null)
                        element.css('right', margin.right);
                    if (position.bottom != null)
                        element.css('bottom', position.bottom);
                }

                if (element.attr('ref-sizeGuardian-x') == '1') {
                    var width = mainElement.width() - margin.left - margin.right - position.left - position.right;
                    if (width != element.width()) {
                        element.width(width);
                    }
                }

                if (element.attr('ref-sizeGuardian-y') == '1') {
                    var height = mainElement.height() - margin.top - margin.bottom - position.top - position.bottom;
                    if (height != element.height()) {
                        element.height(height);
                    }
                }
            });
    },

    inner_getGuardianId: function (element) {
        var id = element.attr('sizeGuardian-id');
        if (!id) {
            mySizeGuardian.inner_sizeGuardianId = mySizeGuardian.inner_sizeGuardianId + 1;
            id = mySizeGuardian.inner_sizeGuardianId;
            element.attr('sizeGuardian-id', id);
            element.removeClass('sizeGuardian-id-' + id);
            element.addClass('sizeGuardian-id-' + id);
        }
        return id;
    },

    _parseMargin: function (marginTxt) {
        var marginArray = $.trim(marginTxt).split(' ');
        if (marginArray.length == 1 && marginArray[0] != '') {
            var v = mySizeGuardian._parseMarginVal(marginArray[0]);
            return {
                txt: marginTxt,
                top: v, left: v, right: v, bottom: v
            };
        }
        else if (marginArray.length >= 4) {
            var top = mySizeGuardian._parseMarginVal(marginArray[0]);
            var right = mySizeGuardian._parseMarginVal(marginArray[1]);
            var bottom = mySizeGuardian._parseMarginVal(marginArray[2]);
            var left = mySizeGuardian._parseMarginVal(marginArray[3]);
            return {
                txt: marginTxt,
                top: top, left: left, right: right, bottom: bottom
            };
        } else {
            return {
                txt: marginTxt,
                top: 0, left: 0, right: 0, bottom: 0
            };
        }
    },

    _parseMarginVal: function (marginVal) {
        if (marginVal == 'null') return null;
        return parseInt((marginVal || '').replace('px', ''));
    }
};



var myLoader = {
    defaultHtmlContent: '<div style="text-align: center; margin-left: auto; margin-right: auto;"><!--<img border="0" alt="" src="http://lubinmedytacje.cwanysoft.pl/content/76.gif"/><br/>-->Trwa ładowanie, proszę czekać..</div>',
    ////////////////////////////////
    inner_loaderCountForElements: new Array(),
    inner_myLoaderId: 1,
    inner_currentZIndex: 999999,
    ////////////////////////////////
    show: function (element, htmlContent) {
        element = myLoader.inner_getElement(element);
        myLoader.inner_showBackground(element, htmlContent, true);
    },
    hide: function (element, htmlContent) {
        element = myLoader.inner_getElement(element);
        myLoader.inner_showBackground(element, htmlContent, false);
    },
    isVisible: function (element) {
        element = myLoader.inner_getElement(element);
        var loader = myLoader.inner_getLoaderForElement(element);
        return loader.size() > 0;
    },
    getNextZindex: function () {
        var zIndex = myLoader.inner_currentZIndex;
        myLoader.inner_currentZIndex = myLoader.inner_currentZIndex + 1;
        return zIndex;
    },
    ////////////////////////////////
    inner_showBackground: function (element, htmlContent, show) {
        var elementId = myLoader.inner_getElementId(element);

        // ilość loader'ów dla elementu
        var loaderCount = element.attr('myLoader-count');
        if (!loaderCount) loaderCount = 0;
        
        if (show) {
            if (loaderCount == 0) {
           
                // inkrementacja ilości loader'ów
                element.attr('myLoader-count', loaderCount + 1);

                var zIndex = myLoader.getNextZindex();

                if (!htmlContent) htmlContent = myLoader.defaultHtmlContent;

                // dodanie loader'a
                var loaderHtml = '<div class="myLoader-refId-' + elementId + '" style=" left: 0px; top: 0px; position: absolute; background-color: black; z-index: ' + zIndex + '; color: white;"><div class="loaderInner">' + htmlContent + '</div></div>';
                element.append(loaderHtml);

                // odszukanie loader'a
                var loader = myLoader.inner_getLoaderForElement(element);
                var loaderInner = loader.find(".loaderInner");

                loader.hide();
                loader.fadeTo(0, 0.1);

                // zmiana rozmiaru rodzica
                mySizeGuardian.bind(loader, element);
                myCenterGuardian.bind(loaderInner, loader);

                loader.fadeTo(500, 0.8);

                myLoader.inner_disableControls(element);
            }
        }
        else {
            if (loaderCount > 0) {
                element.attr('myLoader-count', loaderCount - 1);

                var loader = element.find('.myLoader-refId-' + elementId);
                var loaderInner = loader.find(".loaderInner");

                // loader.removeClass('myLoader-refId-' + elementId);                                
                /*loader.fadeTo(500, 0.1, function () {
                    mySizeGuardian.unbind(loader);
                    myCenterGuardian.unbind(loaderInner, loader);

                    loader.remove();
                });*/

                mySizeGuardian.unbind(loader);
                myCenterGuardian.unbind(loaderInner, loader);

                loader.remove();

                myLoader.inner_enableControls(element);
            }
        }
    },
    ////////////////////////////////
    inner_disableControls: function (element) {
        element.find(".uiBusy").each(function () {
            var elem = $(this);
            if (elem.hasClass('uiButton') && elem.hasClass('ui-button')) {
                //try { elem.button("disable"); } catch (e) { }
                elem.button("disable");
            }
            else if (elem.hasClass('uiCombobox')) {
                var combobox = myComboBoxHelper.get(elem);
                //if (combobox) try { combobox.disable();} catch (e) { }
                if (combobox) combobox.disable(); 
            }
            else if (elem.hasClass('uiCheckCombobox')) {
                var Checkcombobox = myCheckComboBoxHelper.get(elem);
                //if (Checkcombobox) try { Checkcombobox.disable(); } catch (e) { }
                if (Checkcombobox) Checkcombobox.disable(); 
            }
            else {
                elem.prop('disabled', true);
            }
        });
    },
    inner_enableControls: function (element) {
        element.find(".uiBusy").each(function () {
            var elem = $(this);
            if (elem.hasClass('uiButton') && elem.hasClass('ui-button')) {
                //try{elem.button("enable");} catch (e) { }
                elem.button("enable");
            }
            else if (elem.hasClass('uiCombobox')) {
                var combobox = myComboBoxHelper.get(elem);
                //if (combobox) try{combobox.enable();} catch (e) { }
                if (combobox) combobox.enable(); 
            }
            else if (elem.hasClass('uiCheckCombobox')) {
                var Checkcombobox = myCheckComboBoxHelper.get(elem);
                //if (Checkcombobox) try { Checkcombobox.enable(); } catch (e) { }
                if (Checkcombobox) Checkcombobox.enable();
            }
            else {
                elem.prop('disabled', false);
            }
        });
    },
    ////////////////////////////////
    inner_getLoaderForElement: function (element) {
        var elementId = myLoader.inner_getElementId(element);
        return element.find('.myLoader-refId-' + elementId);
    },
    inner_getElement: function (element) {
        var elem = element;
        if (!elem) elem = $('body');
        return elem;
    },
    inner_getElementId: function (element) {
        // nadanie id loader'owi
        var id = element.attr('id');
        if (id) {
            return 'elementId_eq_' + id;
        }
        else {
            id = element.attr('myLoader-id');
            if (!id) {
                myLoader.inner_myLoaderId = myLoader.inner_myLoaderId + 1;
                id = 'myLoaderIdEq' + myLoader.inner_myLoaderId;
                element.attr('myLoader-id', id);
            }
            return id;
        }
    }
};


var myComboBoxInstances = {

};

var myComboBoxHelper = {
    exists: function (qControl) {
        var ID = qControl.attr('id');
        if (!ID) { ID = myRand.randomString(); qControl.attr('id', ID); }
        return myComboBoxInstances[ID] != null;
    },
    destroy: function (qControl) {
        var ID = qControl.attr('id');
        if (!ID) { ID = myRand.randomString(); qControl.attr('id', ID); }
        if (myComboBoxInstances[ID]) {
            myComboBoxInstances[ID].destroy();
            myComboBoxInstances[ID] = null;
        }
    },
    get: function (qControl) {
        var ID = qControl.attr('id');
        if (!ID) { ID = myRand.randomString(); qControl.attr('id', ID); }
        return myComboBoxInstances[ID];
    }
};

function myComboBox(qControl) {

    var self = this;

    //////////////////////////////

    self.ID = qControl.attr('id');

    self.isCreated = false;

    if (myComboBoxInstances[self.ID]) {
        myComboBoxInstances[self.ID].destroy();
    }
    myComboBoxInstances[self.ID] = self;

    //////////////////////////////

    self.mainCtrl = qControl;

    self.i_text = null;

    self.i_button = null;

    self.i_list = null;

    self.i_list_content = null;

    self.options = {};

    self.source = {};

    self.listElements = [];

    //////////////////////////////

    self.isListShown = false;

    self.isListFocused = false;

    //////////////////////////////

    self.destroy = function () {
        self.removeEvents();

        self.isCreated = false;

        if (self.i_text) {
            self.i_text.remove();
        }

        if (self.i_button) {
            self.i_button.remove();
        }

        if (self.i_list) {
            self.cleanList();
            self.i_list.remove();
        }

        self.i_text = null;
        self.i_button = null;
        self.i_list = null;
        self.i_list_content = null;
        self.mainCtrl = null;
    };

    self.create = function () {
        self.removeEvents();

        self.i_text = $('<input type="text" class="i_text" style=""/>');

        self.i_button = $('<input type="button" class="i_button" style=""/>');

        self.i_list_content = $("<div class='i_list_content'></div>");

        self.i_list = $("<div class='i_list' tabindex='1' myComboBox-ref='" + self.ID + "' style='display: none;'></div>");
        self.i_list.append(self.i_list_content);

        $('body').append(self.i_list);
        self.mainCtrl.append(self.i_text);
        self.mainCtrl.append(self.i_button);

        var mainWidth = self.mainCtrl.css('width');
        if (!mainWidth) mainWidth.css('width', '200px');

        var mainHeight = self.mainCtrl.css('height');
        if (!mainHeight) mainHeight.css('height', '25px');

        self.addEvents();

        self.isCreated = true;
    };

    //////////////////////////////

    self.removeEvents = function () {

        if (self.i_list) {
            self.i_list.unbind('mousedown');
            self.i_list.unbind('mouseup');
        }

        if (self.i_text) {
            self.i_text.unbind('change');
            self.i_text.unbind('keydown');
            self.i_text.unbind('blur');
        }

        if (self.i_button) {
            self.i_button.unbind('click');
        }

        $(document).unbind('scroll', self.onDocumentScroll);
        self.mainCtrl.unbind('resize');
    };

    self.addEvents = function () {
        self.removeEvents();

        if (self.i_list) {
            self.i_list.bind('mousedown', self.OnListMouseDown);
            self.i_list.bind('mouseup', self.OnListMouseUp);
        }

        if (self.i_text) {
            self.i_text.bind('change', self.onChange);
            self.i_text.bind('keydown', self.onKeyPress);
            self.i_text.bind('blur', self.onLostFocus);
        }

        if (self.i_button) {
            self.i_button.bind('click', self.onButtonClick);
        }

        $(document).bind('scroll', self.onDocumentScroll);
        self.mainCtrl.bind('resize', self.onSizeChanged);
    };

    //////////////////////////////

    self.onChange = function (s, e) {
        var val = self.i_text.val();
        if (self.i_text.is(":focus")) {
            self.showList(val);
        }
        // console.log('onChange ' + val);
    };

    self.onKeyPress = function (e) {
        var key = e.which;

        setTimeout(
            function () {
                if (self.i_text.is(":focus")) {

                    if (key == 13) { // enter
                        var selectedItem = self.getSelectedItemFromList();
                        if (selectedItem) {
                            self.selectItemByItem(selectedItem);
                            self.hideList();
                            self.correctText();
                            self.i_text.blur();
                        }
                    }
                    else if (key == 27) { // esc
                        self.hideList();
                        self.correctText();
                        self.i_text.blur();
                    }
                    else if (key == 38) { // up
                        self.moveSelectionOnListUp();
                    }
                    else if (key == 40) { // down
                        self.moveSelectionOnListDown();
                    }
                    else {
                        var val = self.i_text.val();
                        self.showList(val);
                        // console.log('keypress ' + val);
                    }

                }
            },
            100);

        if (key == 38 || key == 27 || key == 13 || key == 40) {
            return false;
        }
    };

    self.onButtonClick = function (s, e) {
        var val = self.i_text.val();
        self.i_text.focus();
        self.showList('');
    };

    self.onSizeChanged = function (s, e) {
        self.applyStyle();
    };

    self.onDocumentScroll = function (s, e) {
        self.correctListPosition();
    };

    self.onLostFocus = function (s, e) {
        // console.log('onLostFocus ' + self.isListFocused);
        if (!(self.i_text.is(":focus") || self.isListFocused)) {
            self.hideList();

            /*var val = self.i_text.val();
            var item = self.findItemByText(val);
            // console.log(JSON.stringify(item));
            if (item != null)
                self.selectItemByItem(item);*/

            self.correctText();
        }
    };

    self.OnListMouseDown = function (s, e) {
        if (self.isListShown) {
            self.isListFocused = true;
            // console.log('OnListMouseDown');
        }
    };

    self.OnListMouseUp = function (s, e) {
        self.isListFocused = false;
        if (self.isListShown) {
            // console.log('OnListMouseUp');
        }
        self.i_text.focus();
    };

    self.onItemMouseDown = function () {
        // console.log('onItemMouseDown');
        self.isListFocused = false;
        var index = parseInt($(this).attr('item-index'));
        self.selectItemByIndex(index);
        self.correctText();
        self.hideList();
    };

    //////////////////////////////

    self.hideList = function () {
        self.cleanList();
        if (self.i_list) {
            self.i_list.hide();
        }

        self.isListFocused = false;
        self.isListShown = false;
    };

    self.showList = function (filter) {
        
        var selectedIndex = self.getSelectedIndex();
        var zIndex = myViewManagerWindow._nextZIndex();

        self.fillList(filter, selectedIndex);
        self.correctListPosition();
        self.i_list.show();
        self.i_list.css('z-index', zIndex);
        self.correctListPosition();
        self.correctListSelection();

        self.isListShown = true;
    };

    self.correctListPosition = function () {
        var innerHeight = self.i_list_content.height();
        if (innerHeight < 20) innerHeight = 20;
        var listHeight = self.options.listHeight;

        var height = self.mainCtrl.height();
        var pos = self.mainCtrl.offset();
        var scroll = $(document).scrollTop();
        // console.log(pos);
        // console.log(scroll);
        self.i_list.css('top', pos.top + height - scroll + 'px');
        self.i_list.css('left', pos.left + 'px');
        self.i_list.height(innerHeight < listHeight ? innerHeight : listHeight);
    };

    self.correctListSelection = function () {
        self.i_list.find('.i_list_item').css('background', self.options.listBackground);
        var selected = self.i_list.find('.i_list_item[is-item-selected="1"]');

        if (selected.size() > 0) {
            selected.css('background', self.options.selectionBackground);
            self.i_list.scrollTop(0);
            var pos = selected.position();

            // console.log('pos=' + JSON.stringify(pos));
            self.i_list.scrollTop(pos.top);
        }
    };

    //////////////////////////////

    self.cleanList = function () {
        if (self.i_list) {
            self.i_list.find('.i_list_item').unbind('mouseenter mouseleave mousedown');
            self.i_list.find('.i_list_item').remove();
        }
    };

    self.fillList = function (filter, selectedIndex) {
        self.cleanList();
        var fontSize = self.mainCtrl.css('font-size') || '16px';

        filter = $.trim((filter || '').toLowerCase());
        var filterTexts = Enumerable.
            From(filter.split(' ')).
            Select(function (i) { return $.trim(i); }).
            Where(function (i) { return i != ''; }).
            ToArray();
        
        self.listElements = [];
        if (self.source) {
            for (var i = 0; i < self.source.items.length; i++) {
                var item = self.source.items[i];
                var text = self.getValue(item, self.options.textProperty2).toLowerCase();
                var isVisible = true;
                
                for (var j = 0; j < filterTexts.length; j++) {
                    var filterText = filterTexts[j];
                    if (text.indexOf(filterText) < 0) {
                        isVisible = false;
                        break;
                    }
                }

                if (filter == '' || isVisible) { // text.indexOf(filter) >= 0) {
                    self.listElements.push(i);
                    self.i_list_content.append(
                        '<div class="i_list_item" item-index="' + i + '" ' + (selectedIndex == i ? 'is-item-selected="1"' : '') + ' style="white-space:nowrap; font-size: ' + fontSize + ';">' +
                        text +
                        '</div>');
                }
            }
        }
        
        self.i_list.find('.i_list_item').hover(
            function () {
                $(this).css('background', self.options.hoverBackground);
            },
            function () {
                if ($(this).attr('is-item-selected') == '1') {
                    $(this).css('background', self.options.selectionBackground);
                }
                else {
                    $(this).css('background', self.options.listBackground);
                }
            });

        self.i_list.find('.i_list_item').bind(
            'mousedown',
            self.onItemMouseDown);

        self.removeEvents();
        self.addEvents();
    };

    //////////////////////////////

    self.correctText = function () {
        var selectedItem = self.source.selectedItem;

        if (self.i_text) {
            if (selectedItem) {
                self.i_text.val(
                    self.getValue(selectedItem, self.options.textProperty));
            }
            else {
                self.i_text.val('');
            }
        }
    };

    self.selectItemByIndex = function (index) {
        if (self.source) {
            if (index >= 0 && index < self.source.items.length) {
                var selectedItem = self.source.items[index];

                self.source.selectedItem = selectedItem;
                if (self.source.selectionChanged)
                    self.source.selectionChanged(selectedItem);
            }
        }
    };

    self.selectItemByItem = function (item) {
        self.source.selectedItem = item;
        if (self.source.selectionChanged)
            self.source.selectionChanged(item);
    };

    self.getSelectedItemFromList = function () {
        if (self.source) {
            var selected = self.i_list.find('.i_list_item[is-item-selected="1"]');
            if (selected.size() > 0) {
                var index = parseInt(selected.attr('item-index'));
                return self.source.items[index];
            }
        }
        return null;
    };

    self.getSelectedIndex = function () {
        if (self.source) {
            if (self.source.selectedItem) {
                var seekId = self.getValue(self.source.selectedItem, self.options.idProperty);
                for (var i = 0; i < self.source.items.length; i++) {
                    if (seekId == self.getValue(self.source.items[i], self.options.idProperty)) {
                        return i;
                    }
                }
            }
        }
        return -1;
    };

    self.findItemByText = function (text) {
        text = (text || '').toLowerCase();
        var foundItem = null;
        var foundCount = 0;
        if (self.source) {
            for (var i = 0; i < self.source.items.length; i++) {
                if (text == self.getValue(self.source.items[i], self.options.textProperty2).toLowerCase()) {
                    foundItem = self.source.items[i];
                    foundCount = foundCount + 1;
                }
            }
        }
        return foundCount == 1 ? foundItem : null;
    };

    //////////////////////////////

    self.moveSelectionOnListUp = function () {
        var currentItem = self.i_list.find('.i_list_item[is-item-selected="1"]');
        if (currentItem.size() > 0) {
            var index = parseInt(currentItem.attr('item-index'));
            if (index > 0) {
                var prevIndex = -1;

                for (var i = 0; i < self.listElements.length - 1; i++) {
                    if (self.listElements[i + 1] == index) {
                        prevIndex = self.listElements[i];
                        break;
                    }
                }

                if (prevIndex >= 0) {
                    var prevItem = self.i_list.find('.i_list_item[item-index="' + prevIndex + '"]');
                    if (prevItem.size()) {
                        currentItem.attr('is-item-selected', '0');
                        prevItem.attr('is-item-selected', '1');
                        self.correctListSelection();
                    }
                }
            }
        }
        else {
            var nextItem = self.i_list.find('.i_list_item').first();
            if (nextItem.size()) {
                self.i_list.find('.i_list_item').attr('is-item-selected', '0');
                nextItem.attr('is-item-selected', '1');
                self.correctListSelection();
            }
        }
    };

    self.moveSelectionOnListDown = function () {
        var currentItem = self.i_list.find('.i_list_item[is-item-selected="1"]');
        if (currentItem.size() > 0) {
            var index = parseInt(currentItem.attr('item-index'));
            var nextIndex = -1;

            for (var i = 1; i < self.listElements.length; i++) {
                if (self.listElements[i - 1] == index) {
                    nextIndex = self.listElements[i];
                    break;
                }
            }

            if (nextIndex > 0) {
                var nextItem = self.i_list.find('.i_list_item[item-index="' + nextIndex + '"]');
                if (nextItem.size()) {
                    currentItem.attr('is-item-selected', '0');
                    nextItem.attr('is-item-selected', '1');
                    self.correctListSelection();
                }
            }
        }
        else {
            var nextItem = self.i_list.find('.i_list_item').first();
            if (nextItem.size()) {
                self.i_list.find('.i_list_item').attr('is-item-selected', '0');
                nextItem.attr('is-item-selected', '1');
                self.correctListSelection();
            }
        }
    };

    //////////////////////////////

    self.applyStyle = function () {
        if (self.isCreated) {

            var width = self.mainCtrl.width();
            var height = self.mainCtrl.height();

            // console.log('applyStyle');
            // console.log(height);

            var isExStyle = false;
            var inputWidth = width - self.options.buttonWidth - 2 - (isExStyle ? 13 : 0);

            // self.mainCtrl.css('background', 'yellow');
            self.mainCtrl.css('padding', '0px');
            self.mainCtrl.css('position', 'relative');
            //self.mainCtrl.css('width', width + 'px');
            //self.mainCtrl.css('height', height + 'px');

            self.i_text.css('padding', '0px 3px 0px 3px');
            self.i_text.css('margin', '0px');
            self.i_text.css('border-width', '1px');
            self.i_text.css('position', 'absolute');
            self.i_text.css('top', '0px');
            self.i_text.css('left', '0px');
            self.i_text.css('width', inputWidth + 'px');
            self.i_text.css('height', height + 'px');

            self.i_button.css('position', 'absolute');
            self.i_button.css('top', '-1px');
            self.i_button.css('left', (width - self.options.buttonWidth - 2) + 'px');
            self.i_button.css('width', self.options.buttonWidth + 'px');
            self.i_button.css('height', (height + 4) + 'px');

            self.i_list.css('border', self.options.listBorder);
            self.i_list.css('background', self.options.listBackground);
            self.i_list.css('position', 'fixed');
            self.i_list.css('overflow', 'auto');
            self.i_list.css('width', (width - 5) + 'px');
            // self.i_list.css('height', self.options.listHeight + 'px');
        }
    };

    self.getValue = function (item, property) {
        return eval('item.' + property);
    };

    //////////////////////////////

    self.setOptions = function (newOptions) {
        self.options.textProperty = newOptions.textProperty || 'Label';
        self.options.textProperty2 = newOptions.textProperty2 || 'Label';
        self.options.idProperty = newOptions.idProperty || 'ID';
        self.options.buttonWidth = newOptions.buttonWidth || 30;
        self.options.listHeight = newOptions.listHeight || 150;
        self.options.listBackground = newOptions.listBackground || '#ffffff';
        self.options.hoverBackground = newOptions.hoverBackground || '#eeeeee';
        self.options.selectionBackground = newOptions.selectionBackground || '#cccccc';
        self.options.listBorder = newOptions.listBorder || '1px solid #555555';
        //self.options.width = newOptions.width || 100;
        //self.options.height = newOptions.height || 30;
        self.applyStyle();
        self.correctText();
    };

    self.setSource = function (newSource) {
        if (newSource.keyProperty) {
            self.options.idProperty = newSource.keyProperty;
        }
        self.source.items = newSource.items || [];
        self.source.selectedItem = newSource.selectedItem || [];
        self.source.selectionChanged = newSource.selectionChanged || [];
        
        self.hideList();
        self.correctText();
    };

    self.disable = function () {

    };

    self.enable = function () {

    };

    //////////////////////////////

    self.create();
    self.setOptions({});
};