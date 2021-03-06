import ConfigurablePanelConstants from "/apogeejs-ui-lib/src/configurablepanel/ConfigurablePanelConstants.js";
import ConfigurableElement from "/apogeejs-ui-lib/src/configurablepanel/ConfigurableElement.js";
import uiutil from "/apogeejs-ui-lib/src/uiutil.js";

/** This is an submit element configurable element.
 * 
 * @class 
 */
export default class SubmitElement extends ConfigurableElement {
    
    constructor(form,elementInitData) {
        super(form,elementInitData);
        
        var containerElement = this.getElement();

        this.submitDisabled = elementInitData.submitDisabled;
        this.cancelDisabled = elementInitData.cancelDisabled;

        let focusElementSet = false;
        
        //create the submit button
        if(elementInitData.onSubmit) {
            
            var onSubmit = () => {
                var formValue = form.getValue();
                elementInitData.onSubmit(formValue,form);
            }
            
            var submitLabel;
            if(elementInitData.submitLabel) { 
                submitLabel = elementInitData.submitLabel;
            }
            else {
                submitLabel = ConfigurablePanelConstants.DEFAULT_SUBMIT_LABEL;
            }
            
            this.submitButton = uiutil.createElement("button",{"className":"apogee_configurablePanelButton","innerHTML":submitLabel,"onclick":onSubmit});
            containerElement.appendChild(this.submitButton);

            this.setFocusElement(this.submitButton);
            focusElementSet = true;
        }
        else {
            this.submitButton = null;
        }
        
        //create the cancel button
        if(elementInitData.onCancel) {
            
            var onCancel = () => {
                elementInitData.onCancel(form);
            }
            
            var cancelLabel;
            if(elementInitData.cancelLabel) { 
                cancelLabel = elementInitData.cancelLabel;
            }
            else {
                cancelLabel = ConfigurablePanelConstants.DEFAULT_CANCEL_LABEL;
            }
            
            this.cancelButton = uiutil.createElement("button",{"className":"apogee_configurablePanelButton","innerHTML":cancelLabel,"onclick":onCancel});
            containerElement.appendChild(this.cancelButton);

            if(!focusElementSet) {
                this.setFocusElement(this.cancelButton);
                focusElementSet = true;
            }
        }
        else {
            this.cancelButton = null;
        }  

        this._setButtonState(); 
        
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
    
    submitDisable(isDisabled) {
        this.submitDisabled = isDisabled;
        this._setButtonState();
    }
    
    cancelDisable(isDisabled) {
        this.cancelDisabled = isDisabled;
        this._setButtonState();
    }

    destroy() {
        super.destroy();

        if(this.submitButton) {
            this.submitButton.onclick = null;
            this.submitButton = null;
        }

        if(this.cancelButton) {
            this.cancelButton.onclick = null;
            this.cancelButton = null;
        }
    }

    //===================================
    // internal Methods
    //==================================
    
    _setDisabled(isDisabled) { 
        this.overallDisabled = isDisabled;
        this._setButtonState();
    }

    _setButtonState() {
        if(this.submitButton) this.submitButton.disabled = this.overallDisabled || this.submitDisabled;
        if(this.cancelButton) this.cancelButton.disabled = this.overallDisabled || this.cancelDisabled;
    }
}

SubmitElement.TYPE_NAME = "submit";
