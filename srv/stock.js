const cds = require('@sap/cds');

let qrp = [];
let json = [];
let card = [];

exports.stock_info = async function(mcode){
    qrp = [], json = [], card = [];

    let mtxt = '';
    
    switch(mcode.substring(1,2)){
        case('0'):          // quickReplies
        await this.stock_info0(mcode);
            break;
        case('1'):          // 가용재고조회
        mtxt = mcode.split("/")
        await this.stock_info1(mtxt[1]);
            break;
        case('2'):          // 자재정보조회
        mtxt = mcode.split("/")
        await this.stock_info2(mtxt[1]);
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

exports.stock_info0 = async function(mcode){
    qrp = [], json = [], card = [];
    
    if(mcode.length<=2){            // 퀵리플라이 보내기
        const srv = await cds.connect.to('test');
        const tx = srv.transaction();
        let entity = 'ZIFCV7020_DDL'
    
        let query = await tx.run(
            SELECT.from(entity)
            .limit(3)
            )

        card = [
            {
                "contents": [
                    {
                        "component": "title",
                        "text": "조회할 자재의 번호를 선택하세요"
                    },
                    {
                        "component": "description",
                        "text": "상위 3개의 자재 번호입니다."
                    }   
                ]
            }
        ]

        for(var i=0;i<3;i++){
            qrp.push({
                    "title": query[i].matnr,
                    "message": query[i].matnr,
                    "messageCode": "30/"+query[i].matnr
                })
        }
    } else {            // 최종 선택버튼 보내기
        let mtxt = mcode.split("/");

        card = [
            {
                "contents": [
                    {
                        "component": "description",
                        "text": "자재번호\t" + mtxt[1] + "의 조회하실 정보를 선택하세요."
                    },
                    {
                        "component": "buttons",
                        "text": "",
                        "buttons": [
                            {
                                "text": "가용 재고 조회",
                                "buttonEvent": "",
                                "message": "가용 재고 보여줘",
                                "messageCode": "31/" + mtxt[1]
                            },
                            {
                                "text": "자재 정보 조회",
                                "buttonEvent": "",
                                "message": "자재 정보 보여줘",
                                "messageCode": "32/" + mtxt[1]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

exports.stock_info1 = async function(p_matnr){
    const srv = await cds.connect.to('test');
    const tx = srv.transaction();
    let entity = 'ZIFCV7021_DDL'
    
    let query = await tx.run(
        SELECT.from(entity)
        .where({matnr:p_matnr})
        )
    
    if(query.length > 0){
    for(i=0;i<query.length;i++){

        let str = '플랜트 : ' + query[i].werks
            + '\n플랜트내역 : ' + query[i].werks_t
            + '\n저장위치 : ' + query[i].lgort
            + '\n저장위치내역 : ' + query[i].lgort_t
            + '\n자재 : ' + query[i].matnr
            + '\n자재내역 : ' + query[i].matnr_t
            + '\n단위 : ' + query[i].meins
            + '\n재고수량 : ' + query[i].labst
            + '\n확정수량 : ' + query[i].vmeng
            + '\n가용재고수량 : ' + (query[i].a_labst-query[i].vmeng)

            card.push({
                "contents" : [
                    {
                        "component": "description",
                        "text": str
                    } 
                ]
            });
        }  
    } else {
        let str = '자재 : ' + p_matnr
            + '\n가용재고 없음'

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

exports.stock_info2 = async function(p_matnr){
    const srv = await cds.connect.to('test');
    const tx = srv.transaction();
    let entity = 'ZIFCV7022_DDL'
    
    let query = await tx.run(
        SELECT.from(entity)
        .where({matnr:p_matnr})
        )
    
    for(i=0;i<query.length;i++){

        let str = '자재번호 : ' + query[i].matnr
            + '\n자재번호 내역 : ' + query[i].maktx
            + '\n유지보수상태1 : ' + query[i].vpsta
            + '\n유지보수상태2 : ' + query[i].pstat
            + '\n자재 유형 : ' + query[i].mtart
            + '\n산업 부문 : ' + query[i].mbrsh
            + '\n자재 그룹 : ' + query[i].matkl
            + '\n기본 단위 : ' + query[i].meins
            + '\n중량 단위 : ' + query[i].gewei
            + '\n총 중량 : ' + query[i].brgew
            + '\n순 중량 : ' + query[i].ntgew

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