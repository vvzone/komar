/**
 * Created by Victor on 16.04.15.
 */
var json = {
    id: null,
        name: null,
    short_name: null,
    code: null,
    is_service: false,
    secrecy_type: null,
    urgency_type: null,
    presentation: null,
    description: null,
    document_type: 1,
    dac: null, //from DT
    route: null
};

/*


{
    "name": "test",
    "document_type": 1
}



 [
 {"id":1,"name":"TEST","shortName":"tiny_test","description":"\u0411\u0435\u0437 \u043e\u043f\u0438\u0441
 \u0430\u043d\u0438\u044f","isOfficer":false}
 ]


 {
    "id":null,
    "name":"TEST2222","short_name":"tiny_test","is_officer":false,"description":"Без описания"}



 {
 "id": null,
 "author": 5
 }

*/