/*global window, document, $*/

/**
 *
 *
 * @type {object}
 */
var SimpleWYG = {
    /**
     * Prefix of SWYG HTML IDs and classes.
     */
    prefix : "swyg_",

    /**
     * List of SWYG textarea IDs.
     */
    editors : [],

    /**
     * Throws a SWYG error.
     *
     * @param {string} msg
     */
    error : function (msg) {
        "use strict";
        throw "SWYG error: " + msg;
    }
};

/**
 *
 * @param {string} id
 * @param {object} options
 *
 * @constructor
 */
SimpleWYG.Frame = function (id, options) {
    "use strict";

    /**
     * The frame's HTMLIframeElement in DOM.
     *
     * @type {null|HTMLElement|HTMLIFrameElement}
     */
    var element = null,

        /**
         * The frame's HTMLDocument.
         *
         * @type {null|HTMLDocument}
         */
        doc = null;

    /**
     * Returns the document's innerHTML.
     *
     * @returns {string|*}
     */
    this.getContent = function () {
        return doc.body.innerHTML;
    };

    /**
     * Sets the doc's innerHTML.
     *
     * @param {string} content
     */
    this.setContent = function (content) {
        doc.body.innerHTML = content;
    };

    /**
     * Returns the element's visibility.
     *
     * @returns {boolean}
     */
    this.isVisible = function () {
        return ("none" !== element.style.display);
    };

    /**
     * Hides or shows the element.
     */
    this.toggleVisibility = function () {
        var d = "";

        if (this.isVisible()) {
            d = "none";
        }

        element.style.display = d;
    };

    element = document.createElement("iframe");
    element.style.height = (options.height || 300) + "px";
    element.style.width  = (options.width || 500) + "px";
    element.setAttribute("id", SimpleWYG.prefix + id);

    document.body.appendChild(element);

    doc = element.contentWindow.document;
    doc.open();
    doc.write("");
    doc.close();
    doc.execCommand("InsertParagraph", false, null);
    doc.body.contentEditable = true;
    doc.body.style.fontFamily = (options.fontFamily || "");
    doc.designMode = "on";
};

/**
 * SimpleWYG editor instance.
 *
 * @param {string} id The replaceable textarea's ID.
 *
 * @throws SWYG error
 *
 * @constructor
 */
SimpleWYG.Editor = function (id) {
    "use strict";

    /**
     * The original textarea HTMLElement.
     *
     * @type {HTMLElement}
     */
    this.textarea = document.getElementById(id);

    /**
     * The frame which replaces the textarea.
     *
     * @type {null|SimpleWYG.Frame}
     */
    this.frame = null;

    /**
     * Switches between the current SimpleWYG instance
     * and the original textarea. Also syncs the
     * necessary elements.
     */
    this.switchMode = function () {
        if (this.frame.isVisible()) {
            this.textarea.style.display = "";
            this.syncTextarea();
        } else {
            this.textarea.style.display = "none";
            this.syncFrame();
        }

        this.frame.toggleVisibility();
    };

    /**
     * Replaces the frame content with the textarea's.
     */
    this.syncFrame = function () {
        this.frame.setContent(this.textarea.value);
    };

    /**
     * Replaces the textarea's content with the frame's.
     */
    this.syncTextarea = function () {
        this.textarea.value = this.frame.getContent();
    };

    if (-1 !== SimpleWYG.editors.indexOf(id)) {
        SimpleWYG.error("#" + id + " is already swyg.");
    }
    if (!this.textarea) {
        SimpleWYG.error("#" + id + " is not found.");
    }
    if ("TEXTAREA" !== this.textarea.nodeName) {
        SimpleWYG.error("#" + id + " is not a textarea.");
    }

    SimpleWYG.editors.push('id');

    this.frame = new SimpleWYG.Frame(id, {
        height : this.textarea.offsetHeight,
        width : this.textarea.offsetWidth,
        fontFamily : this.textarea.style.fontFamily
    });

    this.textarea.style.display = "none";
    this.syncFrame();
};

$(function () {
    "use strict";
    window.s = new SimpleWYG.Editor('tegzt');
});