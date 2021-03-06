import ConfigurableElement from "/apogeejs-ui-lib/src/configurablepanel/ConfigurableElement.js";
import ConfigurablePanel from "/apogeejs-ui-lib/src/configurablepanel/ConfigurablePanel.js";

/** This is an text field element configurable element.
 * 
 * @class 
 */
export default class PanelElement extends ConfigurableElement {
    constructor(form,elementInitData) {
        super(form,elementInitData);
        
        var containerElement = this.getElement();
        //udpate padding and margin to 0
        containerElement.style.margin = ConfigurableElement.ELEMENT_MARGIN_NONE;
        containerElement.style.padding = ConfigurableElement.ELEMENT_PADDING_NONE;
        
        var formInitData = elementInitData.formData;
        this.panel = new ConfigurablePanel();
        this.panel.setParentForm(form);
        this.panel.createForm(formInitData);
        var panelElement = this.panel.getElement();
        containerElement.appendChild(panelElement);

        //add event listeners
        this.panel.addOnInput( () => this.inputDone() );
        this.panel.addOnChange( () => this.valueChanged() );
        
        this._postInstantiateInit(elementInitData);
    }
    
    /** This method returns value for this given element, if applicable. If not applicable
     * this method returns undefined. */
    getValue() {
        return this.panel.getValue();
    }   

    /** This overrides the get meta element to calculate it on the fly. Because of possible list elements,
     * the meta value depends on the content. */
    getMeta() {
        let fullMeta = {};
        //copy in the stored meta
        if(this.meta) {
            Object.assign(fullMeta,this.meta);
        }
        //override an parent type to be "object"
        fullMeta.parentType = "object";
        //add the child elements
        fullMeta.childMeta = this.panel.getMeta();
        return fullMeta;
    }

    /** We override the standard giveFocus method to pass it on to a child element. */
    giveFocus() {
        return this.panel.giveFocus();
    }

    //------------------
    // Entry interface
    //------------------

    /** This gets an entry from the given path, where the path is an array of keys. */
    getEntryFromPath(path,startIndex) {
        return this.panel.getEntryFromPath(path,startIndex);
    }

    populateSelectors() {
        //element selector
        super.populateSelectors();
        //panel child element selectors
        this.panel.populateSelectors();
    }

    //===================================
    // protected Methods
    //==================================

    /** This method updates the value for a given element. See the specific element
     * to see if this method is applicable. */
    setValueImpl(value) {
        this.panel.setValue(value);
    }

    /** This function is used to inherit a child value from a parent value */
    inherit(childKey,parentValue) {
        let childElement = this.panel.getEntry(childKey);
        if((childElement)&&(childElement.getValue() != parentValue)) {
            childElement.setValue(parentValue);
        }    
    }

    destroy() {
        super.destroy();
        this.panel.destroy();
        this.panel = null;
    }
    
    //===================================
    // internal Methods
    //==================================
    
    _setDisabled(isDisabled) { 
        this.panel.setDisabled(isDisabled);
    }
}

PanelElement.TYPE_NAME = "panel";

//------------------------
// Form Designer Data
//------------------------

/** This is the child layout template used by the Panel Element. This will be 
 * shared by some other elements, such as layouts and the top level panel. */
export const BASIC_CHILD_LAYOUT_TEMPLATE = {
    "type": "list",
    "key": "formData"
}

/** This is the completeChildListLayout function used by the Panel Element. This will be 
 * shared by some other elements, such as layouts and the top level panel. */
export function basicCompleteChildListLayout(childLayoutEntry,elementLayoutInfoList) {
    // let contentLayoutElement = parentLayout.find(layout => (layout.type == "showHideLayout"));
    // let contentLayout = contentLayoutElement.formData;
    // let childLayoutEntry = contentLayout.find(layout => (layout.key == "formData"))
    childLayoutEntry.entryTypes = elementLayoutInfoList.map(elementLayoutInfo => {
        return {
            label: elementLayoutInfo.designerElementInfo.formInfo.label,
            layout: {
                type: "panel",
                key: elementLayoutInfo.designerElementInfo.formInfo.uniqueKey,
                formData: elementLayoutInfo.elementLayout
            }
        }
    });
}


//internal form designer data

const FORM_INFO = {
    "uniqueKey": "basicPanel",
	"type": "panel",
	"label": "Panel",
	"designerFlags": [
		"hasKey",
        "hasSelector"
	],
    "childLayoutTemplate": BASIC_CHILD_LAYOUT_TEMPLATE
}

const DESIGNER_ELEMENT_INFO = {
    category: "collection",
    orderKey: FORM_INFO.label,
    formInfo: FORM_INFO,
    completeChildListLayout: basicCompleteChildListLayout 
}

PanelElement.DESIGNER_ELEMENT_ARRAY = [DESIGNER_ELEMENT_INFO];





