var obj = {
    first: "2",
    terceiro: 4,
    last: "3"
};

//
//	Visit non-inherited enumerable keys
//
Object.keys(obj).forEach(function (key) {

    console.log(key, obj[key]);

});