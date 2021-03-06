import ConfigurableElement from "/apogeejs-ui-lib/src/configurablepanel/ConfigurableElement.js";
import uiutil from "/apogeejs-ui-lib/src/uiutil.js";

/** This is an text field element configurable element.
 * 
 * @class 
 */
export default class ColorPickerElement extends ConfigurableElement {
    constructor(form,elementInitData) {
        super(form,elementInitData);
        
        var containerElement = this.getElement();
        
        //label
        let labelElement = this.getLabelElement(elementInitData);
        if(labelElement) {
            containerElement.appendChild(labelElement);
        }
        
        //slider
        this.colorPickerElement = uiutil.createElement("input",{"type":"color"});
        containerElement.appendChild(this.colorPickerElement);
        
        this.setFocusElement(this.colorPickerElement);

        this.changeListener = () => {
            this.inputDone();
            this.valueChanged();
        }
        this.colorPickerElement.addEventListener("change",this.changeListener);

        //hint
        let hintElement = this.getHintElement(elementInitData);
        if(hintElement) {
            containerElement.appendChild(hintElement);
        }

        //help element
        let helpElement = this.getHelpElement(elementInitData);
        if(helpElement) {
            containerElement.appendChild(helpElement);
        }

        this._postInstantiateInit(elementInitData);
    }
    
    /** This method returns value for this given element, if applicable. If not applicable
     * this method returns undefined. */
    getValue() {
        return this.colorPickerElement.value;
    }  
    
    //===================================
    // protectd Methods
    //==================================

    /** This method updates the list of checked entries. */
    setValueImpl(value) {
        this.colorPickerElement.value = value;
    }

    destroy() {
        super.destroy();
        this.colorPickerElement.removeEventListener("change",this.changeListener);
        this.colorPickerElement = null;
    }

    //===================================
    // internal Methods
    //==================================
    
    _setDisabled(isDisabled) { 
        this.colorPickerElement.disabled = isDisabled;
    }
}

ColorPickerElement.TYPE_NAME = "colorPicker";

//------------------------
// Form Designer Data
//------------------------

const FORM_INFO = {
    "uniqueKey": "basicColorPicker",
	"type": "colorPicker",
	"label": "Color Picker",
	"designerFlags": [
		"hasLabel",
		"valueString",
		"hasKey",
		"hasHint",
		"hasHelp",
		"hasSelector"
	]
}

const DESIGNER_ELEMENT_INFO = {
    category: "element",
    orderKey: FORM_INFO.label,
    formInfo: FORM_INFO
}

ColorPickerElement.DESIGNER_ELEMENT_ARRAY = [DESIGNER_ELEMENT_INFO];

