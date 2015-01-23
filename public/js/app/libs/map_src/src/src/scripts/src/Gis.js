
/**
 * @namespace Gis
 */
var Gis = {};
window.Gis = Gis;
window.FILTER_ROTATABLE_IMAGES = window.hasOwnProperty('FILTER_ROTATABLE_IMAGES') ? window.FILTER_ROTATABLE_IMAGES : true;

Gis.version = typeof window === 'object' ? window.buildVersion : this.buildVersion;
Gis.buildDate = this.buildDate ? this.buildDate : '';
Gis.moduleKey = 'TacticMapClient';
Gis.moduleName = {
    ru: 'Клиент тактической карты'
};
