var Utilities = (function () {

    this.theme = "BLUE";

    function addThemeFieldToThemeClassObject(classObject) {
        this.theme = getThemeForHost();

        console.log(classObject);
        switch (this.theme) {
            case "BLUE":
                classObject['ms-bgColor-blue'] = true;
                break;
            case "GREEN":
                classObject['ms-bgColor-greenDark'] = true;
                break;
            case "ORANGE":
                classObject['ms-bgColor-orange'] = true;
                break;
            default:
                classObject['ms-bgColor-blue'] = true;
        }

        
        
        console.log(classObject);
    };

    function addThemeColorFontToCssClassObject(classObject) {
        this.theme = getThemeForHost();

        console.log(classObject);
        switch (this.theme) {
            case "BLUE":
                classObject['ms-fontColor-blue'] = true;
                break;
            case "GREEN":
                classObject['ms-fontColor-greenDark'] = true;
                break;
            case "ORANGE":
                classObject['ms-fontColor-orange'] = true;
                break;
            default:
                classObject['ms-fontColor-blue'] = true;
        }



        console.log(classObject);
    };

    function setTheme(theme) {
        this.theme = theme;
    }

    function getTheme() {
        return this.theme;
    }

    function getThemeForHost() {

        var host = Office.context.host;

        switch (host) {
            case "Excel":
                return "GREEN";
                break;
            case "PowerPoint":
                return "ORANGE";
                break;
            case "Word":
                return "BLUE";
                break
            default:
                return "BLUE";
        }

    }

    // 'Expose' the public members.
    return {
        addThemeFieldToThemeClassObject: addThemeFieldToThemeClassObject,
        addThemeColorFontToCssClassObject: addThemeColorFontToCssClassObject,
        setTheme: setTheme,
        getTheme: getTheme
    };

})();