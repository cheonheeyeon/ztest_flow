const cds = require('@sap/cds');

let qrp = [];
let json = [];
let card = [];

exports.order_info = async function(mcode){
    qrp = [], json = [], card = [];

    let mtxt = '';
    
    switch(mcode.substring(1,2)){
        case('0'):          // quickReplies
        await this.order_info0(mcode);
            break;
        case('1'):          // 주문상세조회
        mtxt = mcode.split("/")
        await this.order_info1(mtxt[1]);
            break;
    }

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

exports.order_info0 = async function(mcode){
    qrp = [], json = [], card = [];
    
    if(mcode.length<=2){            // 퀵리플라이 보내기
        const srv = await cds.connect.to('test');
        const tx = srv.transaction();
        let entity = 'ZIFCV7010_DDL'
    
        let query = await tx.run(
            SELECT.from(entity)
            .where({pernr:'00000001'})
            .limit(3)
            )

        card = [
            {
                "contents": [
                    {
                        "component": "title",
                        "text": "조회할 문서의 번호를 선택하세요"
                    },
                    {
                        "component": "description",
                        "text": "상위 3개의 판매문서 번호입니다."
                    }   
                ]
            }
        ]

        for(var i=0;i<3;i++){
            qrp.push({
                    "title": query[i].vbeln,
                    "message": query[i].vbeln,
                    "messageCode": "20/"+query[i].vbeln
                })
        }
    } else {            // 최종 선택버튼 보내기
        let mtxt = mcode.split("/");

        card = [
            {
                "contents": [
                    {
                        "component": "description",
                        "text": "문서번호\t" + mtxt[1] + "의 조회하실 정보를 선택하세요."
                    },
                    {
                        "component": "buttons",
                        "text": "",
                        "buttons": [
                            {
                                "text": "주문 상세 조회",
                                "buttonEvent": "",
                                "message": "주문 상세 보여줘",
                                "messageCode": "21/" + mtxt[1]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

exports.order_info1 = async function(p_vbeln){
    const srv = await cds.connect.to('test');
    const tx = srv.transaction();
    let entity = 'ZIFCV7011_DDL'
    
    let query = await tx.run(
        SELECT.from(entity)
        .where({vbeln:p_vbeln})
        )
    
    for(i=0;i<query.length;i++){
        let str = '판매문서 : ' + query[i].vbeln 
            + '\n판매문서품목 : ' + query[i].posnr
            + '\n판매문서유형 : ' + query[i].auart
            + '\n판매문서유형내역 : ' + query[i].bezei
            + '\n출하보류 : ' + query[i].lifsk
            + '\n거부사유 : ' + query[i].abgru
            + '\n판매처 : ' + query[i].kunnr
            + '\n판매처내역 : ' + query[i].name1
            + '\n증빙일 : ' + query[i].audat
            + '\n생성일 : ' + query[i].erdat
            + '\n유통경로 : ' + query[i].vtweg
            + '\n유통경로내역 : ' + query[i].vtext
            + '\n영업사원 : ' + query[i].pernr
            + '\n영업사원내역 : ' + query[i].name_org1
            + '\n자재코드 : ' + query[i].matnr
            + '\n자재코드내역 : ' + query[i].maktx
            + '\n판매단위 : ' + query[i].vrkme
            + '\n전표통화 : ' + query[i].waerk
            + '\n단가 : ' + query[i].netpr
            + '\n주문수량 : ' + query[i].kwmeng
            + '\n주문금액 : ' + query[i].netwr
            + '\n출하지시수량 : ' + query[i].count1
            + '\n출하지시금액 : ' + query[i].amount1
            + '\n출고수량 : ' + query[i].count2
            + '\n출고금액 : ' + (query[i].amount2*query[i].netpr)
            + '\n청구수량 : ' + query[i].count3
            + '\n청구금액 : ' + (query[i].amount3*query[i].netpr)

            card.push({
                "contents" : [
                    {
                        "component": "description",
                        "text": str
                    } 
                ]
            });
        }  
}