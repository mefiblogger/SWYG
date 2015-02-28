/**
 * SimpleWYG
 *
 * @version 1.0.0
 *
 * @author Mefi
 */

requirejs.config({
    "paths": {
        "jquery": "lib/jquery-1.9.1-min"
    }
});

/**
 * Creates a WYSIWYG instance from a textarea.
 *
 * @param element {jQuery}
 * @param jq      {jQuery}
 */
var SimpleWYG = function(element, jq) {

    /**
     * The SimpleWYG instance"s id in DOM.
     *
     * @type {string|null}
     */
    this.id = null;

    /**
     * Original textarea"s jQuery element.
     *
     * @type {jQuery|null}
     */
    this.myTextarea = null;

    /**
     * SimpleWYG iframe"s jQuery element.
     *
     * @type {jQuery|null}
     */
    this.myRichTextarea = null;

    /**
     * Returns the iframe"s contentWindow.
     *
     * @returns {window}
     */
    this.getContentWindow = function() {
        return document.getElementById(this.id).contentWindow;
    }

    /**
     * Calls the given command on the selected text.
     *
     * @param cmd {string}
     * @param value {string|null}
     */
    this.exec = function(cmd, value) {
        value = value || null;
        var contentWindow = this.getContentWindow();

        contentWindow.focus();
        contentWindow.document.execCommand(cmd, false, value);
    }

    /**
     * Initializes the contentWindow, makes it editable.
     */
    this.initContentWindow = function() {
        var doc = this.getContentWindow().document,
            content = this.myTextarea.val() || "";
        doc.open();
        doc.write("<p>" + content + "</p>");
        doc.close();
        doc.body.contentEditable = true;
        doc.body.className = "simplewyg";
        doc.designMode = "on";
    }

    // Get textarea.
    this.myTextarea = element.hide();

    // iframe id
    this.id = "simplewyg-" + (element.attr("id") || Date.now());

    // Creating an iframe element
    this.myRichTextarea = jq("<iframe>")
        .css("width",  this.myTextarea.width())
        .css("height", this.myTextarea.height())
        .attr("frameborder", false)
        .attr("class", "simplewyg")
        .attr("id", this.id);

    // Append it to the textarea"s parent
    this.myTextarea.parent().append(this.myRichTextarea);

    // Magic
    this.initContentWindow();
};

var wygs = [];


define(["jquery"], function($) {
    var jq = $.noConflict(true);
    jq(function() {
        var link = jq("<link>").attr("type", "text/css").attr("rel", "stylesheet").attr("href", "css/simplewyg.css");
        jq("head").append(link);

        jq(".simplewyg").each(function (id, element) {
            var element = jq(element);
            wygs.push(new SimpleWYG(jq(element), jq));
        });
    });
});
