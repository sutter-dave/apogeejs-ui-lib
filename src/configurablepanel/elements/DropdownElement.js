import ConfigurableElement from "/apogeejs-ui-lib/src/configurablepanel/ConfigurableElement.js";
import uiutil from "/apogeejs-ui-lib/src/uiutil.js";

/** This is an text field element configurable element.
 * 
 * @class 
 */
export default class DropdownElement extends ConfigurableElement {
    constructor(form,elementInitData) {
        super(form,elementInitData);
        
        var containerElement = this.getElement();
        
        //label
        let labelElement = this.getLabelElement(elementInitData);
        if(labelElement) {
            containerElement.appendChild(labelElement);
        }
        
        this.valueMap = {};
        this.select = uiutil.createElement("select");
        this.select.className = "apogee_configurableElement_hideSelection";
        var addEntry = (entryInfo,index) => {
            var label;
            var value;
            if(Array.isArray(entryInfo)) {
                label = entryInfo[0]
                value = entryInfo[1];
            }
            else {
                label = entryInfo;
                value = entryInfo;   
            }

            let standinValue = String(index);
            this.valueMap[standinValue] = value

            var entry = document.createElement("option");
            entry.text = label;
            entry.value = standinValue;
            this.select.appendChild(entry);
        }
        if(elementInitData.entries) {
            elementInitData.entries.forEach(addEntry);
        }
        containerElement.appendChild(this.select); 

        this.setFocusElement(this.select);

        //add dom listeners
        this.changeListener = () => {
            this.inputDone();
            this.valueChanged();
        }
        this.select.addEventListener("change",this.changeListener);

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
        return this.valueMap[this.select.value];
    }  
    
    //===================================
    // protected Methods
    //==================================

    /** This method updates the UI value for a given element. */
    setValueImpl(value) {
        let standinValue;
        for(let key in this.valueMap) {
            if(this.valueMap[key] === value) standinValue = key;
        }
        if(standinValue !== undefined) {
            this.select.value = standinValue;
        }
    }

    destroy() {
        super.destroy();
        this.select.removeEventListener("change",this.changeListener);
        this.select = null;
    }
    
    //===================================
    // internal Methods
    //==================================
    
    _setDisabled(isDisabled) { 
        this.select.disabled = isDisabled;
    }
}

DropdownElement.TYPE_NAME = "dropdown";

//------------------------
// Form Designer Data
//------------------------

const FORM_INFO = {
    "uniqueKey": "basicDropdown",
	"type": "dropdown",
	"label": "Dropdown",
	"designerFlags": [
		"hasLabel",
		"hasEntries",
		"valueStringOrJson",
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

DropdownElement.DESIGNER_ELEMENT_ARRAY = [DESIGNER_ELEMENT_INFO];


