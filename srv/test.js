const cds = require('@sap/cds');
const funcs = require('./funcs.js')
const cust = require('./cust.js')
const order = require('./order.js')
const stock = require('./stock.js')
const request = require('request')
 
//here is the service implementation
//here are the service handlers
module.exports = cds.service.impl(async function() {

    let mcode, uid, rno, cno = '';
    
    this.on(['READ', 'CREATE', 'UDDATE', 'DELETE'], '', async(req) => {
                
        uid = req.data.userId;
        rno = req.data.roomSrno ;
        cno = req.data.roomChatSrno;
        mcode = req.data.messageCode;

        let json = [];

        // 기다려주세요 메세지 먼저 보내기
        switch(mcode.substring(0,1)){
            case('1'||'2'||'3'):
                funcs.send_wait(req, rno, cno, uid);
            case('1'):            // 거래처관리
                json = await cust.customer_info(mcode);
                break;
            case('2'):            // 영업주문관리
                json = await order.order_info(mcode);
                break;
            case('3'):            // 판매가용재고
                json = await stock.stock_info(mcode);
                break;
            default:              // main
                json = funcs.get_main();
        }

        // request body 만들기
        let data = {
            "JSONData": {
                "API_KEY":"FLOW_CHATBOT_RESPONSE_API",
                "CNTS_CRTC_KEY":"20210721-50ed1591-9dfc-47d1-99b1-45171c467336",
                "REQ_DATA":{
                    "CHATBOT_ID": "woongjinbot",
                    "ROOM_SRNO": rno,
                    "ROOM_CHAT_SRNO": cno,
                    "USER_ID": uid,
                    "MSG_JSON": json
                }    
            }
        }

        // console.log('this is full request body\n' + JSON.stringify(data));
        
        // request 보내기
        try {
            request.post({
                headers: {'Content-Type': 'application/json'},
                url: 'https://flowtest.info/OpenGate',
                body: data,
                json: true
            }, function(error, response, body){
                // res.json(body);
                console.log(response.body);
            });
            
        } catch (err) {
            req.reject(err);
        }

    })
});