package cn.thinkingdata.web.util;

import org.apache.commons.codec.binary.Base64;

import java.util.Date;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Xiaowu on 2016/8/3.
 */
public class StringUtil {

    public enum AccountType {MOBILE,EMAIL,QQ,WX,ERROR};

    public static final Integer QQ_LENGTH = 32;
    public static final Integer WX_LENGTH = 28;

    public static String delUselessChar(String sourceStr) {
        sourceStr = sourceStr.replaceAll("\\\\\\\\r|\\\\\\\\n|\\\\\\\\t|\\\\r|\\\\n|\\\\t", " ");
        sourceStr = sourceStr.replaceAll(" +", " ");
        sourceStr = sourceStr.trim();
        return sourceStr;
    }

    public static String replaceSpecialChar(String sourceStr){
        sourceStr = sourceStr.replaceAll("\r|\n", "\\\\n");
        sourceStr = sourceStr.replaceAll("\t", "\\\\t");
        sourceStr = sourceStr.replaceAll("\001|\002|\003", " ");
        sourceStr = sourceStr.replaceAll("\\|", " ");
        return sourceStr.trim();

    }

    public static AccountType getAccountType(String loginName){
        loginName = loginName.trim();
        if(loginName.contains("@")){
            return AccountType.EMAIL;
        }else{
            Pattern p = Pattern.compile("^[1][3,4,5,7,8][0-9]{9}$");
            if(p.matcher(loginName).matches()){
                return AccountType.MOBILE;
            }else if(loginName.equals("demo")){
                return AccountType.MOBILE;
            }else if(loginName.trim().length() == QQ_LENGTH ){
                return AccountType.QQ;
            }else if(loginName.startsWith("ox") && loginName.length() == WX_LENGTH ){
                return AccountType.WX;
            }
            return AccountType.ERROR;
        }
    }

    public static String getUuId(){
        return UUID.randomUUID().toString();
    }


    public static String genOrderId(Long userId){
        long timestamp = new Date().getTime();
        String userStr = String.valueOf(userId);
        if(userStr.length() > 7){
            userStr = userStr.substring(0,7);
        }else if(userStr.length() < 7){
            int supplyNum = 7 - userStr.length();
            userStr = userStr + CommonUtil.getFixLengthRandStr(supplyNum);
        }

        String orderId = timestamp + userStr;
        return orderId;
    }

    public static String genInviteToken(Long userId){
        String baseStr = Base64.encodeBase64String(userId.toString().getBytes());
        Random rand = new Random();
        byte[] tokens = new byte[4];
        rand.nextBytes(tokens);
        String tokenStr = Base64.encodeBase64String(tokens);
        String resStr = (baseStr + tokenStr).replaceAll("/", "").replaceAll("\\+", "").replaceAll("=", "").toLowerCase();
        return resStr;
    }

    public static String bytesToHexString(byte[] src){
        StringBuilder stringBuilder = new StringBuilder("");
        if (src == null || src.length <= 0) {
            return null;
        }
        for (int i = 0; i < src.length; i++) {
            int v = src[i] & 0xFF;
            String hv = Integer.toHexString(v);
            if (hv.length() < 2) {
                stringBuilder.append(0);
            }
            stringBuilder.append(hv);
        }
        return stringBuilder.toString().toUpperCase();
    }
    /**
     * Convert hex string to byte[]
     * @param hexString the hex string
     * @return byte[]
     */
    public static byte[] hexStringToBytes(String hexString) {
        if (hexString == null || hexString.equals("")) {
            return null;
        }
        hexString = hexString.toUpperCase();
        int length = hexString.length() / 2;
        char[] hexChars = hexString.toCharArray();
        byte[] d = new byte[length];
        for (int i = 0; i < length; i++) {
            int pos = i * 2;
            d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
        }
        return d;
    }
    /**
     * Convert char to byte
     * @param c char
     * @return byte
     */
    private static byte charToByte(char c) {
        return (byte) "0123456789ABCDEF".indexOf(c);
    }

    public static String getSQLParams(String sql){
        String result = "";
        Pattern p=Pattern.compile("#\\{(.*?)\\}");
        Matcher m=p.matcher(sql);
        while(m.find()){
            String temp = m.group();
            if(temp.length() > 3){
                result += ","+temp.substring(2,temp.length()-1);
            }
        }
        if(result.length() > 1 ){
            return result.substring(1);
        }else {
            return result;
        }
    }
}
