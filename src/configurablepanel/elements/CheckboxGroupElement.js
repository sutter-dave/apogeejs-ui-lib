import ConfigurableElement from "/apogeejs-ui-lib/src/configurablepanel/ConfigurableElement.js";
import uiutil from "/apogeejs-ui-lib/src/uiutil.js";

/** This is an text field element configurable element.
 * 
 * @class 
 */
export default class CheckboxGroupElement extends ConfigurableElement {
    constructor(form,elementInitData) {
        super(form,elementInitData);

        //this element returns a list of selections
        this.setIsMultiselect(true)
        
        var containerElement = this.getElement();
        
        //label
        let labelElement = this.getLabelElement(elementInitData);
        if(labelElement) {
            containerElement.appendChild(labelElement);
        }

        //horizonal - defaults to true. Is false if vetical flag is set to true or horizontal is set to false
        let doHorizontal = !((elementInitData.horizontal === false)||(elementInitData.vertical === true))

        //hint
        //if not horizontal, put the hint and help after the label
        if(!doHorizontal) {
            //hint element
            let hintElement = this.getHintElement(elementInitData);
            if(hintElement) {
                containerElement.appendChild(hintElement);
            }

            //help element
            let helpElement = this.getHelpElement(elementInitData);
            if(helpElement) {
                containerElement.appendChild(helpElement);
            }
        }

        //add dom listeners for events
        this.changeListener = () => {
            this.inputDone();
            this.valueChanged();
        }
        
        //check boxes
        this.checkboxList = [];
        this.valueMap = {};
        let focusElementSet = false;
        var addCheckbox = (checkboxInfo,index) => {
            var buttonContainer = uiutil.createElement("div");
            buttonContainer.style.display = doHorizontal ? "inline-block" : "block";
            containerElement.appendChild(buttonContainer);

            var checkbox = uiutil.createElement("input");
            checkbox.type = "checkbox";

            if(!focusElementSet) {
                this.setFocusElement(checkbox);
                focusElementSet = true;
            }

            var label;
            var value;
            if(Array.isArray(checkboxInfo)) {
                label = checkboxInfo[0]
                value = checkboxInfo[1];     
            }
            else {
                label = checkboxInfo;
                value = checkboxInfo; 
            }

            //checkbox only holds string values. We will store the user set value externally
            let standinValue = String(index);
            this.valueMap[standinValue] = value;
            checkbox.value = standinValue;

            this.checkboxList.push(checkbox);
            buttonContainer.appendChild(checkbox);
            let checkboxLabel = document.createElement("span");
            checkboxLabel.innerHTML = label;
            checkboxLabel.className = "apogee_configurableElement_hideSelection";
            buttonContainer.appendChild(checkboxLabel);

            if(doHorizontal) {
                let spacer = document.createElement("span");
                spacer.innerHTML = "\u00A0\u00A0\u00A0\u00A0";
                spacer.className = "apogee_configurableElement_hideSelection";
                buttonContainer.appendChild(spacer);
            }
            
            if(elementInitData.disabled) checkbox.disabled = true;

            //add the dom listener
            checkbox.addEventListener("change",this.changeListener);
        };
        elementInitData.entries.forEach(addCheckbox);  

        //hint
        //if  horizontal, put the hint and help at the end
        if(doHorizontal) {
            let hintElement = this.getHintElement(elementInitData);
            if(hintElement) {
                containerElement.appendChild(hintElement);
            }

            //help element
            let helpElement = this.getHelpElement(elementInitData);
            if(helpElement) {
                containerElement.appendChild(helpElement);
            }
        }
        
        this._postInstantiateInit(elementInitData);
    }
    
    /** This method returns value for this given element, if applicable. If not applicable
     * this method returns undefined. */
    getValue() {
        //return the check value mapped back to the proper (potentially non-string) value for the checkbox
        return this.checkboxList.filter(checkbox => checkbox.checked).map(checkbox => this.valueMap[checkbox.value]); 
    }   

    //==================================
    // protected methods
    //==================================

    /** This method updates the UI value for a given element. */
    setValueImpl(valueList) {
        if(!Array.isArray(valueList)) {
            console.error("Value for a checkbox group should be an array. Found: " + valueList);
            return;
        }

        this.checkboxList.forEach(checkbox => {
            let standinValue = checkbox.value;
            let properValue = this.valueMap[standinValue];
            checkbox.checked = (valueList.indexOf(properValue) >= 0);
        });
    }

    destroy() {
        super.destroy();
        
        this.checkboxList.forEach(checkbox => {
            checkbox.removeEventListener("change",this.changeListener);
        })
        this.checkboxList = [];
        this.changeListener = null;
    }

    //===================================
    // internal Methods
    //==================================
    
    _setDisabled(isDisabled) { 
        this.checkboxList.forEach(checkbox => checkbox.disabled = isDisabled);
    }
}

CheckboxGroupElement.TYPE_NAME = "checkboxGroup";

//------------------------
// Form Designer Data
//------------------------

const FORM_INFO = {
    "uniqueKey": "basicCheckboxGroup",
	"type": "checkboxGroup",
	"label": "Checkbox Group",
	"customLayout": [
		{
			"type": "panel",
			"formData": [
				{
					"type": "checkbox",
					"label": "Vertical: ",
					"key": "vertical"
				}
			],
			"key": "customLayout"
		}
	],
	"designerFlags": [
		"hasLabel",
		"hasEntries",
		"valueArray",
		"hasKey",
		"hasHint",
		"hasHelp",
		"hasSelector"
	]
}

const DESIGNER_CUSTOM_PROCESSING_FUNCTION = function(formResult,elementConfig) {
    if((formResult.customLayout)&&(formResult.customLayout.vertical)) {
        elementConfig.vertical = true;
    }    
}

const DESIGNER_ELEMENT_INFO = {
    category: "element",
    orderKey: FORM_INFO.label,
    formInfo: FORM_INFO,
    designerCustomProcessing: DESIGNER_CUSTOM_PROCESSING_FUNCTION
}

CheckboxGroupElement.DESIGNER_ELEMENT_ARRAY = [DESIGNER_ELEMENT_INFO];


