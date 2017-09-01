package cn.thinkingdata.web.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import org.apache.commons.lang.StringUtils;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.MessageDigest;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Xiaowu on 2016/8/3.
 */
public class CommonUtil {

    private static Random random = new Random();

    public static boolean IsEmpty(String s1){
        return s1==null || s1.equals("");
    }


    public static String encodeTransfer(String str) throws UnsupportedEncodingException {
        return new String(str.getBytes("gbk"), "utf-8");
    }

    private static DateFormat preciseDf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static int daysBetween(String smdate,String bdate) throws ParseException {
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        Calendar cal = Calendar.getInstance();
        cal.setTime(sdf.parse(smdate));
        long time1 = cal.getTimeInMillis();
        cal.setTime(sdf.parse(bdate));
        long time2 = cal.getTimeInMillis();
        long between_days=(time2-time1)/(1000*3600*24);

        return Integer.parseInt(String.valueOf(between_days));
    }

    public static String getResultJsonStr(int returnCode)  {
        Map<String, Object> map = new HashMap<>();
        map.put("return_code", returnCode);
        map.put("return_message", ReturnCodeDim.getRetMsg(returnCode));
        map.put("data", new HashMap<String, String>());
        String resp = JSON.toJSONString(map, SerializerFeature.DisableCircularReferenceDetect);
        return resp;
    }

    public static String getResultJsonStr(int returnCode,String returnMsg)  {
        Map<String, Object> map = new HashMap<>();
        map.put("return_code", returnCode);
        map.put("return_message", returnMsg);
        map.put("data", new HashMap<String, String>());
        String resp = JSON.toJSONString(map, SerializerFeature.DisableCircularReferenceDetect);
        return resp;
    }

    public static String getResultJsonStr(int returnCode,String returnMsg, String returnDataJsonStr)  {
        Map<String, Object> map = new HashMap<>();
        map.put("return_code", returnCode);
        map.put("return_message", returnMsg);
        map.put("data", returnDataJsonStr);
        String resp = JSON.toJSONString(map, SerializerFeature.DisableCircularReferenceDetect);
        return resp;
    }

    public static String getResultJsonStr(int returnCode,String returnMsg, Object returnObj)  {
        Map<String, Object> map = new HashMap<>();
        map.put("return_code", returnCode);
        map.put("return_message", returnMsg);
        map.put("data", returnObj);
        String resp = JSON.toJSONString(map, SerializerFeature.DisableCircularReferenceDetect);
        return resp;
    }

    public static String Repeat(String s, int times)
    {
        String ret="";
        for(int i=0; i<times; ++i)
        {
            ret+=s;
        }
        return ret;
    }

    public static String getResultJsonStr(int returnCode, String returnMsg, Map dataMap)  {
        if(dataMap == null){
            dataMap = new HashMap<String, String>();
        }
        Map<String, Object> map = new HashMap<>();
        map.put("return_code", returnCode);
        map.put("return_message", returnMsg);
        map.put("data", dataMap);
        String resp = JSON.toJSONString(map, SerializerFeature.DisableCircularReferenceDetect);
        return resp;

    }

    public static String getResultJsonStr(int returnCode,Map dataMap)  {
        if(dataMap == null){
            dataMap = new HashMap<String, String>();
        }
        Map<String, Object> map = new HashMap<>();
        map.put("return_code", returnCode);
        map.put("return_message", ReturnCodeDim.getRetMsg(returnCode));
        map.put("data", dataMap);
        String resp = JSON.toJSONString(map, SerializerFeature.DisableCircularReferenceDetect);//persistence.writeValueAsString(map);
        return resp;
    }

    public static String getResultJsonStr(int returnCode,List dataList)  {
        if(dataList == null){
            dataList = new ArrayList<String>();
        }

        Map<String, Object> map = new HashMap<>();
        map.put("return_code", returnCode);
        map.put("return_message", ReturnCodeDim.getRetMsg(returnCode));
        map.put("data", dataList);
        String resp = JSON.toJSONString(map, SerializerFeature.DisableCircularReferenceDetect);
        return resp;
    }

//    public static String getResultJsonStrByDoList(int returnCode,List dataList)  {
//
//        ArrayList<Map<String,Object>> jsonDataList = new ArrayList<>();
//        for(Object mapObj : dataList){
//            jsonDataList.add(((IMapObj)mapObj).toDataMap());
//        }
//
//        Map<String, Object> map = new HashMap<>();
//        map.put("return_code", returnCode);
//        map.put("return_message", ReturnCodeDim.getRetMsg(returnCode));
//        map.put("data", jsonDataList);
//        String resp = JSON.toJSONString(map, SerializerFeature.DisableCircularReferenceDetect);
//        return resp;
//    }

    public static String getMD5Str(String str) throws Exception{
        return getHexString(string2md5(str));
    }

    public static long ipToLong(String strIp) {
        long[] ip = new long[4];
        int position1 = strIp.indexOf(".");
        int position2 = strIp.indexOf(".", position1 + 1);
        int position3 = strIp.indexOf(".", position2 + 1);

        ip[0] = Long.parseLong(strIp.substring(0, position1));
        ip[1] = Long.parseLong(strIp.substring(position1+1, position2));
        ip[2] = Long.parseLong(strIp.substring(position2+1, position3));
        ip[3] = Long.parseLong(strIp.substring(position3+1));
        return (ip[0] << 24) + (ip[1] << 16) + (ip[2] << 8) + ip[3];
    }

    public static String longToIP(long longIp){
        StringBuffer sb = new StringBuffer("");
        sb.append(String.valueOf((longIp >>> 24)));
        sb.append(".");
        sb.append(String.valueOf((longIp & 0x00FFFFFF) >>> 16));
        sb.append(".");
        sb.append(String.valueOf((longIp & 0x0000FFFF) >>> 8));
        sb.append(".");
        sb.append(String.valueOf((longIp & 0x000000FF)));
        return sb.toString();
    }

    public static String longToDateStr(long timestamp){
        if(timestamp <= 0){
            return "";
        }
        Date date = new Date(timestamp * 1000);
        return preciseDf.format(date);
    }

    public static long getCurrentTimestamp(){
        Date date = new Date();
        long timestamp = date.getTime() / 1000;
        return timestamp;
    }

    public static String getCurrentTimeStr()
    {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return df.format(new Date());
    }

    public static String getServerActionByUrl(String reqUrl){
        String tokens[] = reqUrl.split("/");
        return tokens[tokens.length - 1];
    }

    public static boolean isMobile(String mobile){
        Pattern p = Pattern.compile("^(1[0-9])\\d{9}$");
        Matcher m = p.matcher(mobile);
        return m.matches();
    }

    public static boolean isEmail(String email){
        if (email == null || email.equals("")){
            return false;
        }
        Pattern p =  Pattern.compile("\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
        Matcher m = p.matcher(email);
        return m.matches();
    }

    public static double setScale(double d, int scale){
        BigDecimal b = new BigDecimal(d);
        double res = b.setScale(scale,BigDecimal.ROUND_HALF_UP).doubleValue();
        return res;
    }

    public static String getFixLengthRandStr(int length){
        int min = (int) Math.pow(10, length - 1);
        int max = (int) Math.pow(10, length);
        int randNum = random.nextInt(max - min) + min;

        return randNum + "";
    }


    private static byte[] string2md5(String str) throws Exception{
        MessageDigest messageDigest = MessageDigest.getInstance("MD5");
        messageDigest.reset();
        return messageDigest.digest(str.getBytes("UTF-8"));
    }
    public static String getHexString(byte[] tmp){
        char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd',  'e', 'f'};
        char str[] = new char[16 * 2];
        int k = 0;
        for (int i = 0; i < 16; i++){

            byte byte0 = tmp[i];
            str[k++] = hexDigits[byte0 >>> 4 & 0xf];
            str[k++] = hexDigits[byte0 & 0xf];
        }
        return new String(str);
    }


    public static String hideMobile(String mobile){
        return mobile.substring(0, 3) + "****" + mobile.substring(7);
    }

    public static String hideEmail(String email){
        String tokens[] = email.split("@");
        int length = tokens.length;
        int hideLength = length / 2;

        return tokens[0].substring(0, length - hideLength) + StringUtils.repeat("*", hideLength) + "@" + tokens[1];

    }

    public static List Object2List(Object object){
        if(object instanceof List) {
            return (List) object;
        }else {
            return new LinkedList();
        }
    }

    public static Map Object2Map(Object object){
        if(object instanceof Map ){
            return (Map) object;
        }else {
            return new LinkedHashMap<>();
        }
    }

    public static String FloatSet2Scale(Float num){
        DecimalFormat df = new DecimalFormat("0.00");
        df.setRoundingMode(RoundingMode.HALF_UP);
        return df.format(num);
    }

    public static List<String> getDatesBetweenTwoDate(Date beginDate, Date endDate) {
        List lDate = new ArrayList();
        lDate.add(DateUtil.getPartitionString(beginDate));//把开始时间加入集合
        if(beginDate.equals(endDate)){
            return lDate;
        }
        Calendar cal = Calendar.getInstance();
        //使用给定的 Date 设置此 Calendar 的时间
        cal.setTime(beginDate);
        boolean bContinue = true;
        while (bContinue) {
            //根据日历的规则，为给定的日历字段添加或减去指定的时间量
            cal.add(Calendar.DAY_OF_MONTH, 1);
            // 测试此日期是否在指定日期之后
            if (endDate.after(cal.getTime())) {
                lDate.add(DateUtil.getPartitionString(cal.getTime()));
            } else {
                break;
            }
        }
        lDate.add(DateUtil.getPartitionString(endDate));//把结束时间加入集合
        return lDate;
    }

    public static List<Object> getXAxisDataWithYAxisMap(List<String> xAxisList,Map<String,Object> yAxisMap){
        List<Object> yAxisList = new ArrayList<>();
        for (String aAxis : xAxisList) {
            yAxisList.add(yAxisMap.getOrDefault(aAxis,0));
        }
        return yAxisList;
    }

    public static Float calculateRate(Float user_num,Float toatl_num){
        if(toatl_num <= 0){
            return 0.0f;
        }
        Float user_rate = Float.valueOf(user_num*100+"")/toatl_num;
        BigDecimal bigDecimal = new BigDecimal((double)user_rate);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public static Float calculateRate(Double user_num,Double toatl_num){
        if(toatl_num <= 0){
            return 0.0f;
        }
        Double user_rate = Double.valueOf(user_num*100+"")/toatl_num;
        BigDecimal bigDecimal = new BigDecimal((double)user_rate);
        return bigDecimal.setScale(2,  BigDecimal.ROUND_HALF_UP).floatValue();
    }

    public static Boolean checkStringToDouble(String intStr ){
        if(null == intStr){
            return false;
        }
        try {
            Double.valueOf(intStr);
        }catch (Exception e){
            return true;
        }
        return false;
    }
}
