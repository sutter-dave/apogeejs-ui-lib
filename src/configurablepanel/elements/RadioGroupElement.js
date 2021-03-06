import ConfigurableElement from "/apogeejs-ui-lib/src/configurablepanel/ConfigurableElement.js";
import uiutil from "/apogeejs-ui-lib/src/uiutil.js";

/** This is an text field element configurable element.
 * 
 * @class 
 */
export default class RadioGroupElement extends ConfigurableElement {
    constructor(form,elementInitData) {
        super(form,elementInitData);
        
        var containerElement = this.getElement();
        
        //label
        let labelElement = this.getLabelElement(elementInitData);
        if(labelElement) {
            containerElement.appendChild(labelElement);
        }

        //horizonal - defaults to true. Is false if vetical flag is set to true or horizontal is set to false
        //the prefered flag is "vertical". We keep horizontal for legacy purposes, though I doubt anyone has yet said
        //horizontal: false instead of just leaving he flag off.
        let doHorizontal = !((elementInitData.horizontal === false)||(elementInitData.vertical === true))

        //hint
        //if not horizontal, put the hint and help after the label
        if(!doHorizontal) {
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
        
        //radio buttons
        this.buttonList = [];
        this.valueMap = {};
        let focusElementSet = false;
        var groupName = elementInitData.groupName;
        if(!groupName) groupName = getRandomString();
        var addButton = (buttonInfo,index) => {
            var buttonContainer = uiutil.createElement("div");
            buttonContainer.style.display = doHorizontal ? "inline-block" : "block";
            containerElement.appendChild(buttonContainer);

            var radio = uiutil.createElement("input");
            radio.type = "radio";
            radio.name = groupName;

            if(!focusElementSet) {
                this.setFocusElement(radio);
                focusElementSet = true;
            }
            
            var label;
            var value;
            if(Array.isArray(buttonInfo)) {
                label = buttonInfo[0]
                value = buttonInfo[1];     
            }
            else {
                label = buttonInfo;
                value = buttonInfo; 
            }

            //radiobutton only holds string values. We will store the user set value externally
            let standinValue = String(index);
            this.valueMap[standinValue] = value;
            radio.value = standinValue;

            this.buttonList.push(radio);
            buttonContainer.appendChild(radio);
            let buttonLabel = document.createElement("span");
            buttonLabel.innerHTML = label;
            buttonLabel.className = "apogee_configurableElement_hideSelection";
            buttonContainer.appendChild(buttonLabel);
            
            if(doHorizontal) {
                let spacer = document.createElement("span");
                spacer.innerHTML = "\u00A0\u00A0\u00A0\u00A0";
                spacer.className = "apogee_configurableElement_hideSelection";
                buttonContainer.appendChild(spacer);
            }

            //add dom listeners
            radio.addEventListener("change",this.changeListener);
        };
        elementInitData.entries.forEach(addButton);

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
        var checkedRadio = this.buttonList.find(radio => radio.checked);
        if(checkedRadio) {
            return this.valueMap[checkedRadio.value];
        }
        else {
            return undefined;
        }
    }  
    
    //===================================
    // protectd Methods
    //==================================

    /** This method updates the list of checked entries. */
    setValueImpl(value) {
        var checkedButton = this.buttonList.find(radioButton => {
            let standinValue = radioButton.value;
            let properButtonValue = this.valueMap[standinValue];
            return (properButtonValue === value);
        });

        if(checkedButton) {
            checkedButton.checked = true;
        }
    }

    destroy() {
        super.destroy();
        
        this.buttonList.forEach(radioButton => {
            radioButton.removeEventListener("change",this.changeListener);
        })
        this.buttonList = [];
        this.changeListener = null;
    }

    //===================================
    // internal Methods
    //==================================
    
    _setDisabled(isDisabled) { 
        this.buttonList.forEach(radioButton => radioButton.disabled = isDisabled);
    }
}

RadioGroupElement.TYPE_NAME = "radioButtonGroup";

function getRandomString() {
    return Math.random().toString(36).substring(2, 15);
}

//------------------------
// Form Designer Data
//------------------------

const FORM_INFO = {
    "uniqueKey": "basicRadioGroup",
	"type": "radioButtonGroup",
	"label": "Radio Button Group",
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
		"valueStringOrJson",
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

RadioGroupElement.DESIGNER_ELEMENT_ARRAY = [DESIGNER_ELEMENT_INFO];