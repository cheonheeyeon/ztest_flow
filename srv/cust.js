const cds = require('@sap/cds');

let qrp = [];
let json = [];
let card = [];

exports.customer_info = async function(mcode){
    qrp = [], json = [], card = [];

    let mtxt = '';
    
    switch(mcode.substring(1,2)){
        case('0'):          // quickReplies
        await this.customer_info0(mcode);
            break;
        case('1'):          // 거래처 상세정보
        mtxt = mcode.split("/")
        await this.customer_info1(mtxt[1]);
            break;
        case('2'):          // 거래처 주문목록
        mtxt = mcode.split("/")
        await this.customer_info2(mtxt[1]);
            break;
        case('3'):          // 거래처 여신정보
            break;
        case('4'):          // 거래처 원장
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

exports.customer_info0 = async function(mcode){
    qrp = [], json = [], card = [];
    
    if(mcode.length<=2){            // 퀵리플라이 보내기
        const srv = await cds.connect.to('test');
        const tx = srv.transaction();
        let entity = 'ZIFCV7000_DDL'        // odata 엔티티
    
        let query = await tx.run(           // 던지는 쿼리
            SELECT.from(entity)
            .where({pernr:'00000001'})
            .limit(3)
            )

        card = [
            {
                "contents": [
                    {
                        "component": "title",
                        "text": "조회할 거래처의 번호를 선택하세요"
                    },
                    {
                        "component": "description",
                        "text": "상위 3개의 거래처 번호입니다."
                    }   
                ]
            }
        ]

        for(var i=0;i<3;i++){
            qrp.push({
                    "title": query[i].kunnr,
                    "message": query[i].kunnr,
                    "messageCode": "10/"+query[i].kunnr
                })
        }
    } else {            // 최종 선택버튼 보내기
        let mtxt = mcode.split("/");

        card = [
            {
                "contents": [
                    {
                        "component": "description",
                        "text": "고객번호\t" + mtxt[1] + "의 조회하실 정보를 선택하세요."
                    },
                    {
                        "component": "buttons",
                        "text": "",
                        "buttons": [
                            {
                                "text": "거래처 상세정보",
                                "buttonEvent": "",
                                "message": "거래처 상세정보 보여줘",
                                "messageCode": "11/" + mtxt[1]
                            },
                            {
                                "text": "거래처 주문목록",
                                "buttonEvent": "",
                                "message": "거래처 주문목록 보여줘",
                                "messageCode": "12/" + mtxt[1]
                            },
                            {
                                "text": "거래처 여신정보",
                                "buttonEvent": "",
                                "message": "거래처 여신정보 보여줘",
                                "messageCode": "13/" + mtxt[1]
                            },
                            {
                                "text": "거래처 원장",
                                "buttonEvent": "",
                                "message": "거래처 원장 보여줘",
                                "messageCode": "14/" + mtxt[1]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

exports.customer_info1 = async function(p_kunnr){
    const srv = await cds.connect.to('test');
    const tx = srv.transaction();
    let entity = 'ZIFCV7001_DDL'
    
    let query = await tx.run(
        SELECT.from(entity)
        .where({partner:p_kunnr})
        )
    
    for(i=0;i<query.length;i++){
        let str = '거래처코드 : ' + query[i].partner 
            + '\n거래처명 : ' + query[i].name_org1
            + '\n주소 : ' + query[i].city
            + '\n판매오더보류 : ' + query[i].aufsd
            + '\n판매오더보류내역 : ' + query[i].aufsd_t
            + '\n납품보류 : ' + query[i].lifsd
            + '\n납품보류내역 : ' + query[i].lifsd_t
            + '\n청구보류 : ' + query[i].faksd
            + '\n청구보류내역 : ' + query[i].faksd_t
            + '\n가격그룹 : ' + query[i].konda
            + '\n가격그룹내역 : ' + query[i].konda_t
            + '\n납품우선순위 : ' + query[i].lprio
            + '\n납품우선순위내역 : ' + query[i].lprio_t
            + '\n납품플랜트 : ' + query[i].vwerk
            + '\n출하조건 : ' + query[i].vsbed
            + '\n출하조건내역 : ' + query[i].vsbed_t
            + '\n인터콥스 : ' + query[i].inco1
            + '\n지급조건 : ' + query[i].zterm
            + '\n지급조건내역 : ' + query[i].zterm_t

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

exports.customer_info2 = async function(p_kunnr){
    const srv = await cds.connect.to('test');
    const tx = srv.transaction();
    let entity = 'ZIFCV7002_DDL'
    
    let query = await tx.run(
        SELECT.from(entity)
        .where({kunnr:p_kunnr,vkorg:'1710',vtweg:'10',spart:'00',pernr:'00000001'})
        )

    for(i=0;i<query.length;i++){
        let str = '판매문서 : ' + query[i].vbeln 
                + '\n판매문서유형 : ' + query[i].auart
                + '\n판매문서유형내역 : ' + query[i].auart_t
                + '\n판매처 : ' + query[i].kunnr
                + '\n판매처내역 : ' + query[i].kunnr_t
                + '\n증빙일 : ' + query[i].audat
                + '\n생성일 : ' + query[i].erdat
                + '\n영업조직 : ' + query[i].vkorg
                + '\n영업조직내역 : ' + query[i].vkorg_t
                + '\n유통경로 : ' + query[i].vtweg
                + '\n유통경로내역 : ' + query[i].vtweg_t
                + '\n영업사원 : ' + query[i].pernr
                + '\n영업사원내역 : ' + query[i].pernr_t
                + '\n주문금액 : ' + query[i].netwr_c

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