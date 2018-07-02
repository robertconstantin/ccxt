"use strict";

const ccxt      = require ('../../ccxt.js')
const asTable   = require ('as-table')
const log       = require ('ololog').configure ({ locate: false })

require ('ansicolor').nice

let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms))

;(async () => {

    // // instantiate the exchange
    // let gdax = new ccxt.gdax  ({ // ... or new ccxt.gdax ()
    //     'apiKey': '92560ffae9b8a01d012726c698bcb2f1', // standard
    //     'secret': '9aHjPmW+EtRRKN/OiZGjXh8OxyThnDL4mMDre4Ghvn8wjMniAr5jdEZJLN/knW6FHeQyiz3dPIL5ytnF0Y6Xwg==', 
    //     'password': '6kszf4aci8r', // GDAX requires a password!
    // })

    // // use the testnet for GDAX
    // gdax.urls['api'] = 'https://api-public.sandbox.gdax.com'

    // let hitbtc = new ccxt.hitbtc ({
    //     'apiKey': '18339694544745d9357f9e7c0f7c41bb',
    //     'secret': '8340a60fb4e9fc73a169c26c7a7926f5',
	// })
	
	let binance = new ccxt.binance ({
        'apiKey': 'dXDedfjrsa13mrC8Dz1vrs4uygbkH7NginWxmvtHMgAUxweRCZEPwrGq8Yzv79Qp',
        'secret': 'wo1rDpH3CupQEUbwIbRkLWVt8gMiHXiSGywreVoK3U6HpOHM1cBx6L32EduvCtoH',
	})
	
	let huobi = new ccxt.huobipro ({
        'apiKey': '9810bffb-2b047df2-196b4b34-2073c',
        'secret': 'ec7ba247-8f2a2f93-1582d575-9d11c',
        verbose: true
    })

    // let quadrigacx = new ccxt.quadrigacx ({
    //     'apiKey': 'jKvWkMqrOj',
    //     'secret': 'f65a2e3bf3c73171ee14e389314b2f78',
    //     'uid': '395037', // QuadrigaCX requires uid!
    // })

    try { 

        // // fetch account balance from the exchange 
        // let gdaxBalance = await gdax.fetchBalance ()

        // // output the result
        // log (gdax.name.green, 'balance', gdaxBalance)

        // // fetch another
        // let hitbtcBalance = await hitbtc.fetchBalance ()

        // // output it
		// log (hitbtc.name.green, 'balance', hitbtcBalance)
		
		// // fetch another
        let binanceBalance = await binance.fetchBalance ()
        let binanceOrders = await binance.fetchOrders ('NEO/USDT')

        // // output it
		//log (binance.name.green, 'balance', binanceOrders)
        
        await huobi.loadMarkets ()

        const symbol = 'BTC/USDT'
            , market = huobi.markets[symbol]
            , startingDate = '2017-01-01T00:00:00'
            , now = huobi.milliseconds ()
    
        log.bright.green ('\nFetching history for:', symbol, '\n')
    
        let allOrders = [];
        let since = huobi.parse8601 (startingDate)
        while (since < now) {

            try {
    
                log.bright.blue ('Fetching history for', symbol, 'since', huobi.iso8601 (since))
                const orders = await huobi.fetchClosedOrders (symbol, since)
                log.green.dim ('Fetched', orders.length, 'orders');
    
                allOrders = allOrders.concat (orders)
    
                if (orders.length) {
    
                    const lastOrder = orders[orders.length - 1];
                    since = lastOrder['timestamp'] + 1;
    
                } else {
    
                    break; // no more orders left for this symbol, move to next one
                }
    
            } catch (e) {
    
                log.red.unlimited (e)
    
            }
        }
		// fetch another
		//await huobi.loadAccounts ()
        //let huobiBalance = await huobi.fetchBalance ()
        //let huobiOrders = await huobi.fetchOrders (symbol, since)
        

        // output it
        //log (huobi.name.green, 'balance', huobiOrders)

        // // and the last one
        // let quadrigacxBalance = await quadrigacx.fetchBalance ()

        // // output it
        // log (quadrigacx.name.green, 'balance', quadrigacxBalance)

    } catch (e) {

        if (e instanceof ccxt.DDoSProtection || e.message.includes ('ECONNRESET')) {
            log.bright.yellow ('[DDoS Protection] ' + e.message)
        } else if (e instanceof ccxt.RequestTimeout) {
            log.bright.yellow ('[Request Timeout] ' + e.message)
        } else if (e instanceof ccxt.AuthenticationError) {
            log.bright.yellow ('[Authentication Error] ' + e.message)
        } else if (e instanceof ccxt.ExchangeNotAvailable) {
            log.bright.yellow ('[Exchange Not Available Error] ' + e.message)
        } else if (e instanceof ccxt.ExchangeError) {
            log.bright.yellow ('[Exchange Error] ' + e.message)
        } else if (e instanceof ccxt.NetworkError) {
            log.bright.yellow ('[Network Error] ' + e.message)
        } else {
            throw e;
        }
    }
        
}) ()