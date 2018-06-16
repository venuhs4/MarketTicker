'use strict';
const Util = require('./utility').Util;

module.exports.Coin = class Coin {
    constructor(PrimaryCoinName, SecondaryCoinName, LowestSellBid, HighestBuyBid, LastTradedPrice, Exchange, WithdrawalCharge, tradeFee) {
        this.PrimaryCoinName = PrimaryCoinName.toUpperCase();
        this.SecondaryCoinName = SecondaryCoinName.toUpperCase();
        this.LowestSellBid = parseFloat(LowestSellBid);
        this.HighestBuyBid = parseFloat(HighestBuyBid);
        this.LastTradedPrice = parseFloat(LastTradedPrice);
        this.Exchange = Exchange;
        this.WithdrawalCharge = parseFloat(WithdrawalCharge);
        this.TradeFee = parseFloat(tradeFee);
    }
}

module.exports.CompareRates = function (coinData) {
    var resultData = [];
    var index = 1;

    for (var i = 0; i < coinData.length; i++) {
        var firstBuyCoin = coinData[i];
        var firstSellCoins = coinData.filter((f) => { return f.SecondaryCoinName == firstBuyCoin.SecondaryCoinName && f.Exchange != firstBuyCoin.Exchange; });
        for (var j = 0; j < firstSellCoins.length; j++) {
            var firstSellCoin = firstSellCoins[j];
            var secondBuyCoins = coinData.filter((f) => { return f.PrimaryCoinName == firstSellCoin.PrimaryCoinName && f.Exchange == firstSellCoin.Exchange; });
            for (var k = 0; k < secondBuyCoins.length; k++) {
                var secondBuyCoin = secondBuyCoins[k];
                var secondSellCoins = coinData.filter((f) => { return f.SecondaryCoinName == secondBuyCoin.SecondaryCoinName && f.Exchange != secondBuyCoin.Exchange && f.PrimaryCoinName == firstBuyCoin.PrimaryCoinName; });
                for (var l = 0; l < secondSellCoins.length; l++) {
                    var secondSellCoin = secondSellCoins[l];
                    var FromRate = ((1 / firstBuyCoin.LowestSellBid) * (1 + firstBuyCoin.TradeFee)) * firstSellCoin.HighestBuyBid * (1 - firstSellCoin.TradeFee) / 1;
                    var F_FromRate = ((1 / firstBuyCoin.HighestBuyBid) * (1 + firstBuyCoin.TradeFee)) * firstSellCoin.HighestBuyBid * (1 - firstSellCoin.TradeFee) / 1;
                    var S_FromRate = ((1 / firstBuyCoin.LowestSellBid) * (1 + firstBuyCoin.TradeFee)) * firstSellCoin.LowestSellBid * (1 - firstSellCoin.TradeFee) / 1;
                    var B_FromRate = ((1 / firstBuyCoin.HighestBuyBid) * (1 + firstBuyCoin.TradeFee)) * firstSellCoin.LowestSellBid * (1 - firstSellCoin.TradeFee) / 1;

                    var ToRate = ((1 / secondBuyCoin.LowestSellBid) * (1 + secondBuyCoin.TradeFee)) * secondSellCoin.HighestBuyBid * (1 - secondSellCoin.TradeFee) / 1;
                    var F_ToRate = ((1 / secondBuyCoin.HighestBuyBid) * (1 + secondBuyCoin.TradeFee)) * secondSellCoin.HighestBuyBid * (1 - secondSellCoin.TradeFee) / 1;
                    var S_ToRate = ((1 / secondBuyCoin.LowestSellBid) * (1 + secondBuyCoin.TradeFee)) * secondSellCoin.LowestSellBid * (1 - secondSellCoin.TradeFee) / 1;
                    var B_ToRate = ((1 / secondBuyCoin.HighestBuyBid) * (1 + secondBuyCoin.TradeFee)) * secondSellCoin.LowestSellBid * (1 - secondSellCoin.TradeFee) / 1;

                    resultData.push({
                        PrimaryCoin: firstBuyCoin.PrimaryCoinName,
                        FirstCoin: firstBuyCoin.SecondaryCoinName,
                        SecondCoin: secondBuyCoin.SecondaryCoinName,
                        PrimaryExchange: firstBuyCoin.Exchange,
                        SecondaryExchange: firstSellCoin.Exchange,
                        FromRate: FromRate,
                        F_FromRate: F_FromRate,
                        S_FromRate: S_FromRate,
                        B_FromRate: B_FromRate,
                        ToRate: ToRate,
                        F_ToRate: F_ToRate,
                        S_ToRate: S_ToRate,
                        B_ToRate: B_ToRate,
                        RoundTripProfit: FromRate * ToRate,
                        NF_RoundTripProfit: FromRate * F_ToRate,
                        FN_RoundTripProfit: F_FromRate * ToRate,
                        FF_RoundTripProfit: F_FromRate * F_ToRate,
                        SS_RoundTripProfit: S_FromRate * S_ToRate,
                        NS_RoundTripProfit: FromRate * S_ToRate,
                        SN_RoundTripProfit: S_FromRate * ToRate,
                        FS_RoundTripProfit: F_FromRate * S_ToRate,
                        SF_RoundTripProfit: S_FromRate * F_ToRate,
                        FB_BuyPrice: firstBuyCoin.LowestSellBid,
                        FB_SellPrice: firstBuyCoin.HighestBuyBid,
                        FS_BuyPrice: firstSellCoin.LowestSellBid,
                        FS_SellPrice: firstSellCoin.HighestBuyBid,
                        SB_BuyPrice: secondBuyCoin.LowestSellBid,
                        SB_SellPrice: secondBuyCoin.HighestBuyBid,
                        SS_BuyPrice: secondSellCoin.LowestSellBid,
                        SS_SellPrice: secondSellCoin.HighestBuyBid
                    });
                }
            }
        }
    }
    return resultData;
}