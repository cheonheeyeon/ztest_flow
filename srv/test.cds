using {test as external} from './external/test.csn';
 
service Test {
 
    entity data as projection on external.InputSet {
       userId, rgsnDttm, roomSrno, roomChatSrno, mobileYn, context, text, messageCode
    };
 
};