'use strict';
var express = require('express');
const CoinLib = require('./coin');
const Util = require('./utility').Util;
var app = express();

var coinData = [];
var bxData = {};
var bbData = {};
var kxData = {};

app.get('/ticker', function (req, res) {
    var data = CoinLib.CompareRates(coinData);
    if (req.query.profit && parseInt(req.query.profit))
        data = data.filter((f) => { return f.RoundTripProfit >= parseInt(req.query.profit) && f.RoundTripProfit < 3; });
    if (req.query.exch) {
        var exchs = req.query.exch.split(";");
        data = data.filter((f) => { return exchs.indexOf(f.PrimaryExchange) != -1 && exchs.indexOf(f.SecondaryExchange) != -1; });
    }
    if (req.query.cur) {
        var curs = req.query.cur.split(";");
        data = data.filter((f) => { return curs.indexOf(f.PrimaryCoin) != -1; });
    }
    data = data.sort(function(s1,s2){ return s1.RoundTripProfit > s2.RoundTripProfit});
    res.end(JSON.stringify(data));
});

var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("app listening at http://%s:%s", host, port)
});

setInterval(function () {
    try {
        bxData = Util.getSyncResponse("https://bx.in.th/api/");
        bbData = Util.getSyncResponse("https://bitbns.com/order/getTickerWithVolume/");
        kxData = Util.getSyncResponse("https://koinex.in/api/ticker");
        coinData = [];
        for (var prop in bxData) {
            coinData.push(new CoinLib.Coin(bxData[prop].primary_currency.substring(0, 3), bxData[prop].secondary_currency.substring(0, 3), bxData[prop].orderbook.asks.highbid, bxData[prop].orderbook.bids.highbid, bxData[prop].last_price, "BX", 0, 0.0025));
        }

        for (var prop in bbData) {
            coinData.push(new CoinLib.Coin("INR", prop.substring(0, 3), bbData[prop].lowest_sell_bid, bbData[prop].highest_buy_bid, bbData[prop].last_traded_price, "BB", 0, 0.0025));
        }

        for (var prop in kxData.stats.inr) {
            coinData.push(new CoinLib.Coin("INR", prop.substring(0, 3), kxData.stats.inr[prop].lowest_ask, kxData.stats.inr[prop].highest_bid, kxData.stats.inr[prop].last_traded_price, "KX", 0, 0.0015))
        }

        for (var prop in kxData.stats.bitcoin) {
            coinData.push(new CoinLib.Coin("BTC", prop.substring(0, 3), kxData.stats.bitcoin[prop].lowest_ask, kxData.stats.bitcoin[prop].highest_bid, kxData.stats.bitcoin[prop].last_traded_price, "KX", 0, 0))
        }

        for (var prop in kxData.stats.ether) {
            coinData.push(new CoinLib.Coin("ETH", prop.substring(0, 3), kxData.stats.ether[prop].lowest_ask, kxData.stats.ether[prop].highest_bid, kxData.stats.ether[prop].last_traded_price, "KX", 0, 0))
        }

        for (var prop in kxData.stats.ripple) {
            coinData.push(new CoinLib.Coin("XRP", prop.substring(0, 3), kxData.stats.ripple[prop].lowest_ask, kxData.stats.ripple[prop].highest_bid, kxData.stats.ripple[prop].last_traded_price, "KX", 0, 0))
        }
    } catch (e) {
        console.log(e);
    }
});