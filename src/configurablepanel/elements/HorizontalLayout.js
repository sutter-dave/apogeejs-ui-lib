import ConfigurableElement from "/apogeejs-ui-lib/src/configurablepanel/ConfigurableElement.js";
import ConfigurableLayoutContainer from "/apogeejs-ui-lib/src/configurablepanel/ConfigurableLayoutContainer.js";
import {BASIC_CHILD_LAYOUT_TEMPLATE,basicCompleteChildListLayout} from "./PanelElement.js"; 

/** This is a item that can be placed inside a panel container. In the initialization config it has child
 * configurable elements (and configurable layout containers), however any child configurable element is included as a
 * value in the parent panel. The configurable layout containers just holds to organize the DOM elements from its 
 * children.
 * 
 * @class 
 */
export default class HoriontalLayout extends ConfigurableLayoutContainer {
    constructor(form,containerInitData) {
        super(form);

        this._initializeContainer(containerInitData);
    }


    //==================================
    //protected methods
    //==================================

    /** This method adds the element to the container. */
    insertElement(elementObject,elementInitData) {
        //explicitly set child to display multiple on a line.
        elementObject.setVisibleDisplayStyle(ConfigurableElement.ELEMENT_DISPLAY_PARTIAL_LINE);

        //add the dom element
        let domElement = this.getElement();
        domElement.appendChild(elementObject.getElement());
    }

    //nothing to destroy
    
    //===================================
    // internal Methods
    //==================================

    /** This method intializes the container */
    _initializeContainer(containerInitData) {
        if(!Array.isArray(containerInitData.formData)) {
            throw new Error("Improper format for Horizontal layout config. It should have a array named 'formData'");
        }
        //add each child to the layout
        containerInitData.formData.forEach(elementInitData => this.addToContainer(elementInitData));
    }
 
}

HoriontalLayout.TYPE_NAME = "horizontalLayout";

//------------------------
// Form Designer Data
//------------------------

const FORM_INFO = {
    "uniqueKey": "basicHorizontalLayout",
	"type": "horizontalLayout",
	"label": "Horizontal Layout",
    "childLayoutTemplate": BASIC_CHILD_LAYOUT_TEMPLATE,
	"designerFlags": []
}

const DESIGNER_ELEMENT_INFO = {
    category: "layout",
    orderKey: FORM_INFO.label,
    formInfo: FORM_INFO,
    completeChildListLayout: basicCompleteChildListLayout 
}



HoriontalLayout.DESIGNER_ELEMENT_ARRAY = [DESIGNER_ELEMENT_INFO];


