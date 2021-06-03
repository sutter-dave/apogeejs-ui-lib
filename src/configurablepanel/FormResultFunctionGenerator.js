/**
 * This class generates a function body from a form result, including evalutaion of
 * an expressions included in the form. The class also includes a method to check if there
 * are any expressions present in the form. If not, it is prefereble to use the form value rather
 * than the compiled for function body, since they should give the same result.
 */
export default class FormResultFunctionGenerator {

    constructor() {
        this.functionLines = [];
        this.hasExpressions = false;
    }

    setInput(formValue,formMeta) {
        this._appendLine("let output = {};");
        this._loadPanelLines("output",formValue,formMeta);
        this._appendLine("return output;");
    }

    getFunctionBody() {
        return this.functionLines.join("\n");
    }

    getHasExpressions() {
        return this.hasExpressions;
    }

    //=============================
    // Private Methods
    //=============================

    _resetFunctionBody() {
        this.hasExpressions = false;
        this.functionLines = [];
    }

    _appendLine(codeLine) {
        this.functionLines.push(codeLine);
    }


    /** This loads a value to an assignee, as part of the form result function body. */
    _loadEntry(assigneeName,value,containerValue,meta) {
        if(value === undefined) {
            return false;
        }

        //handle parent elements
        if((meta)&&(meta.parentType)) {

            if(meta.parentType == "object") {
                //this is an object containing a possible expression
                this._appendLine(assigneeName + "= {};");
                this._loadPanelLines(assigneeName,value,meta.childMeta);
                //for now we always add the base object, even if empty
                return true;
            }
            else if(meta.parentType == "array") {
                //this is an array containing a possible expression
                this._appendLine(assigneeName + "= []");
                if(meta.entryMetaArray) {
                    this._loadGenericArrayLines(assigneeName,value,meta.entryMetaArray);
                }
                else if(meta.entryMeta) {
                    this._loadCommonEntryArrayLines(assigneeName,value,meta.entryMeta);
                }
                //for now we always add the base array, even if empty
                return true;
            }
            //otherwise fall through
        }

        //get the expression type
        let expressionType;
        if((meta)&&(meta.expression)) {
            if(meta.expression == "choice") {
                expressionType = this._getExpressionChoiceType(assigneeName,containerValue,meta);
            }
            else {
                expressionType = meta.expression;
            }
        }
        else {
            expressionType = "value";
        }
            

        //get the value or expression
        switch(expressionType) {
            case "value": 
                //plain value, not an expression
                return this._loadSimpleValueEntry(assigneeName,value);

            case "simple":
                //this is an expression
                return this._loadSimpleExpressionEntry(assigneeName,value);
                
            default:
                throw new Error("Expression type not supported for " + assigneeName + ": " + expressionType);
        }
    }

    /** This gets the expression type where the type is listed as choice. */
    _getExpressionChoiceType(assigneeName,containerValue,meta) {
        if(!containerValue) throw new Expression("Error in choice expression for " + assigneeName + ". Not in a valid parent object.")
        if(!meta.expressionChoiceKey) throw new Error("Meta expressionChoiceKey entry missing for " + assigneeName);

        let expressionType = containerValue[meta.expressionChoiceKey];
        if(!expressionType) throw new Error("Expression choice not found for key for " + assigneeName + ": " + meta.expressionChoiceKey);
        
        return expressionType;
    }

    /** This loads to the function body a form element value for a simple JSON literal value. */
    _loadSimpleValueEntry(assigneeName,value) {
        let line = assigneeName + " = " + JSON.stringify(value);
        this._appendLine(line);
        return true;
    }

    /** This loads a value to the function body for a javascript expression. */
    _loadSimpleExpressionEntry(assigneeName,value) {
        //this shouldn't happen, the input should be a string
        if(value === null) return false;

        let trimmedValue = value.toString().trim();
        if(trimmedValue === "") return false;
        
        let line = assigneeName + " = " + trimmedValue;
        this._appendLine(line);
        //flag this function body as having an expression
        this.hasExpressions = true;
        return true;
    }

    /** This loads a value to an assignee fpr a panel, as part of the form result function body. */
    _loadPanelLines(parentObjectName,panelValue,panelMeta) {
        if(panelValue === null) return;

        for(let key in panelValue) {
            let meta = panelMeta[key];
            let value = panelValue[key];
            let assigneeName = parentObjectName + "[" + JSON.stringify(key) + "]";
            this._loadEntry(assigneeName,value,panelValue,meta);
        }
    }

    /** This loads a value to an assignee for a multi-typed list, as part of the form result function body. */
    _loadGenericArrayLines(assigneeName,value,entryMetaArray) {
        if(value === null) return false;
        
        let insertIndex = 0;
        let linesAdded = false;
        value.forEach( (entryValue,index) => {
            let entryMeta = entryMetaArray[index];
            let entryAssigneeName = assigneeName + "[" + insertIndex + "]";
            let lineAdded = this._loadEntry(entryAssigneeName,entryValue,null,entryMeta);
            if(lineAdded) {
                insertIndex++;
                linesAdded = true;
            }
        });
        return linesAdded;
    }

    /** This loads a value to an assignee for a single-typed list, as part of the form result function body. */
    _loadCommonEntryArrayLines(assigneeName,value,entryMeta) {
        if(value === null) return false;

        let insertIndex = 0;
        let linesAdded = false;
        value.forEach( (entryValue) => {
            let entryAssigneeName = assigneeName + "[" + insertIndex + "]";
            let lineAdded = this._loadEntry(entryAssigneeName,entryValue,null,entryMeta);
            if(lineAdded) {
                insertIndex++;
                linesAdded = true;
            }
        });
        return linesAdded;
    }

}

/** 
 * Legacy Form Converter
 * This interface matches the old, deprecated interface to get a function body from a form value.
 */
export function getFormResultFunctionBody(formValue,formMeta) {
    let functionGenerator = new FormResultFunctionGenerator();
    functionGenerator.setInput(formValue,formMeta);
    return functionGenerator.getFunctionBody();
}