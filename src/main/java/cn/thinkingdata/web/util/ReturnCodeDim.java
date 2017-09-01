package cn.thinkingdata.web.util;

import com.google.common.base.Throwables;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;



public class ReturnCodeDim {

    private static final Logger logger = LogManager.getLogger();

    private static Map<Integer,String> dimMap = new HashMap<Integer,String>();
    static{
        try{
            String dimPath = ReturnCodeDim.class.getResource("/").getPath() + "return_code_dim.txt";
            BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(dimPath), "UTF-8"));
            String line = "";
            while((line = reader.readLine()) != null){
                String tokens[] = line.split("\t");
                int returnCode = Integer.parseInt(tokens[0]);
                String returnMsg = tokens[1];
                dimMap.put(returnCode, returnMsg);
            }
            reader.close();
        }catch(Exception e){
            logger.error(Throwables.getStackTraceAsString(e));
        }
    }
    public static String getRetMsg(int returnCode){
        String returnMsg = dimMap.get(returnCode);
        if(returnMsg == null){
            return "";
        }else{
            return returnMsg;
        }

    }

    public static final int SUCCESS = 0;
    public static final int MULTI_STATUS = 207;
    public static final int INVALID_SESSION = -1001;
    public static final int ACCOUNT_LOCKED = -1002;
    public static final int PASSWORD_ERROR = -1003;
    public static final int SYSTEM_ERROR = -1004;
    public static final int TOO_FREQUENT = -1005;
    public static final int AUTHORITY_FORBIDDEN = -1006;
    public static final int ACCOUNT_DELETED = -1007;
    public static final int MOBILE_EXISTED = -1008;
    public static final int PARAMETER_ERROR = -1009;
    public static final int UPGRADE_GROUP_EXPIRE = 1001;
    public static final int ACCOUNT_NONEXIST = -1010;
    public static final int ACCOUNT_VERIFYING = -1011;
    public static final int MOBILE_ILLEGAL = -1012;
    public static final int EMAIL_ILLEGAL = -1013;
    public static final int EMAIL_EXISTED = -1014;
    public static final int ACCOUNT_ABNORMAL = -1015;
    public static final int DEMO_ACCOUNT_ONLY = -1016;
    public static final int CUSTOM_SERVICE_NOT_OPEN = -1017;
    public static final int CUSTOM_SERVICE_EXPIRED = -1018;
    public static final int COLLECTION_NUM_OVERHEAD = -1019;
    public static final int ILLEAGAL_ACTION = -1020;
    public static final int ITEM_NONEXIST = -1021;
    public static final int ITEM_OUT_STOCK = -1022;
    public static final int COUPON_EXPIRED = -1023;
    public static final int COUPON_IN_USE = -1024;
    public static final int COUPON_USED = -1025;
    public static final int COUPON_NONEXIST = -1026;
    public static final int ORDER_NONEXIST = -1027;
    public static final int UNSUPPORTED_PAY_CHANNEL = -1028;
    public static final int ORDER_HAS_PAID = -1029;
    public static final int ORDER_HAS_CANCELED = -1030;
    public static final int ORDER_HAS_FINISHED = -1031;
    public static final int ORDER_HAS_NOT_FINISHED = -1032;
    public static final int ORDER_HAS_INVOICE = -1033;
    public static final int CUSTOM_SERVICE_EXHAUST = -1034;
    public static final int DATA_NOT_PREPARED = -1035;
    public static final int COUPON_OVER_PRICE = -1036;
    public static final int INVOICE_NONEXIST  = -1037;
    public static final int COUPON_NOUSED  = -1038;
    public static final int COUPON_NOPOWER  = -1039;
    public static final int COUPON_ONUSE  = -1040;
    public static final int REPORT_NOT_BUY  = -1041;
    public static final int PROJECT_NO_DATA  = -1042;
    public static final int PROJECT_SETTING_DATA  = -1043;
    public static final int ITEM_HAD_BOOKED  = -1044;
    public static final int ITEM_CANT_BOOKED  = -1045;
    public static final int QQ_ILLEGAL  = -1046;
    public static final int MOBILE_NOT_BOUND  = -1047;
    public static final int ORDER_ABNORMAL  = -1048;
    public static final int MOBILE_HAD_BOUND  = -1049;
    public static final int GAME_EMAIL_MAX  = -1050;
    public static final int QQ_HAD_BOUND  = -1051;
    public static final int WX_HAD_BOUND  = -1052;
}
