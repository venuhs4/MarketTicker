const request = require('sync-request');
exports.Util = {
    distinct: function (arr, prop) {
        if (Array.isArray(arr)) {
            if (prop) {
                return arr.filter((e, i) => {

                    return arr.map((e) => { return e[prop]; }).indexOf(e[prop]) == i;
                });
            }
            else {
                return arr.filter((e, i) => {
                    return arr.filter((f) => {
                        return arr.map((m) => {
                            return JSON.stringify(m);
                        }).indexOf(JSON.stringify(e)) == i;
                    })
                });
            }
        }
    },
    prettyPrint: function (arr, colWidth) {
        colWidth = !colWidth ? 10 : colWidth;
        if (Array.isArray(arr) && arr.length > 0) {
            var tableHeader = "|";
            for (var prop in arr[0])
                tableHeader += prop.padEnd(colWidth).substr(0, colWidth) + "|";
            console.log(tableHeader);
            for (var a in arr) {
                var tableRow = "|";
                for (var prop in arr[a]) {
                    if (arr[a][prop])
                        tableRow += arr[a][prop].toString().padEnd(colWidth).substr(0, colWidth) + "|";
                    else
                        tableRow += "".toString().padEnd(colWidth).substr(0, colWidth) + "|"
                }
                console.log(tableRow);
            }
        }
    },
    getSyncResponse: function (url) {
        var res = request("GET", url, {
            headers: {
                'user-agent': 'VS',
            },
            timeout: 5000
        });
        return JSON.parse(res.getBody('utf-8'));
    }
}