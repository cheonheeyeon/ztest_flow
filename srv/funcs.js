const request = require('request')

let qrp = [];
let json = [];
let card = [];

exports.send_wait = function(req, rno, cno, uid){
    qrp = [], json = [], card = [];
    card = [
        {
            "contents": [
                {
                    "component": "description",
                    "text": "조회 중입니다. 잠시만 기다려주세요."
                }
            ]
        }
    ]

    json = {
        "quickReplies": qrp,
        "generic": [
            {
                "text": "🏁 처음으로",
                "buttonEvent": "message",
                "message": "처음으로",
                "messageCode": "0",
                "urlPC": "",
                "urlMobile": ""
            }
        ],
        "lines": [
            {
                "cards": card
            }
        ]
    }
    
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
}

exports.get_main = function(){
    qrp = [], json = [], card = [];
    card = [
        {
            "contents": [
                {
                    "component": "image",
                    "text": "",
                    "buttons": [],
                    "imageRatio": "2",
                    "altText": "웅진 로고",
                    "imageUrl": "https://www.woongjin.com/images/common/header_logo.jpg"
                },
                {
                    "component": "description",
                    "text": "안녕하세요, 웅진봇입니다. \n 원하시는 기능을 선택하세요"
                },
                {
                    "component": "buttons",
                    "text": "",
                    "buttons": [
                        {
                            "text": "거래처 관리",
                            "buttonEvent": "message",
                            "message": "거래처 관리",
                            "messageCode": "10"
                        },
                        {
                            "text": "영업 주문 관리",
                            "buttonEvent": "message",
                            "message": "영업 주문 관리",
                            "messageCode": "20"
                        },
                        {
                            "text": "판매 가용 재고",
                            "buttonEvent": "message",
                            "message": "판매 가용 재고",
                            "messageCode": "30"
                        }
                    ]
                }
            ]
        }
    ]

    json = {
        "quickReplies": qrp,
        "generic": [
            {
                "text": "🏁 처음으로",
                "buttonEvent": "message",
                "message": "처음으로",
                "messageCode": "0",
                "urlPC": "",
                "urlMobile": ""
            }
        ],
        "lines": [
            {
                "cards": card
            }
        ]
    }
    return json;
}
