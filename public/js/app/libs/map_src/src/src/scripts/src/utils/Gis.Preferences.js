(function (G) {
    'use strict';
    var prefix = '_gis_preferences_';
    Gis.Preferences = {
        setPreferenceData: function (key, value) {
            this.setPreference(key, JSON.stringify(value));
        },
        getPreferenceData: function (key) {
            var value = this.getPreference(key);
            if (value && (value + "") !== (undefined + "") && (value + "") !== (null + "")) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    Gis.Logger.log("Не удалось распарсить данные, сохраненные в предыдущей сессии.", value);
                    return undefined;
                }
            }
            return value;
        },
        setPreference: function (key, value) {
            Gis.myLocalStorage.setItem(prefix + key, value);
        },
        getPreference: function (key) {
            return Gis.myLocalStorage.getItem(prefix + key);
        }
    };
}(Gis));