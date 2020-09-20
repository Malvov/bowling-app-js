var uid = (function generateUid() {
    var getUid = function (length) {
        var i, uidValue, min, max;

        length = length || 32;
        uidValue = '';
        min = 0;
        max = 14;
        for (i = 0; i < length; i += 1) {
            uidValue += getUid.codes[Math.floor(Math.random() * (max - min + 1)) + min];
        }
        return uidValue;
    };

    getUid.codes = [0, 1, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];

    return getUid;
}());

module.exports = uid;
