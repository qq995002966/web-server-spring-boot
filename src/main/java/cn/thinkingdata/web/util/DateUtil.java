package cn.thinkingdata.web.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
    private static DateFormat partitionDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private static DateFormat shortDateFormat = new SimpleDateFormat("yyyyMMdd");
    private static DateFormat longDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");

    private static DateFormat preciseDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private static DateFormat minuteDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

    private static DateFormat timeFormatWithoutDate = new SimpleDateFormat("HH:mm:ss");

    public synchronized static Date parseDateString(String dateStr) {
        int length = dateStr.length();
        DateFormat format;

        if(8 == length){
            format = new SimpleDateFormat("yyyyMMdd");
            try {
                return format.parse(dateStr);
            } catch (ParseException e) {

            }
        }else if(14 == length){
            format = new SimpleDateFormat("yyyyMMddHHmmss");
            try {
                return format.parse(dateStr);
            } catch (ParseException e) {

            }
        }else if(10 == length){
            format = new SimpleDateFormat("yyyy-MM-dd");
            try {
                return format.parse(dateStr);
            } catch (ParseException e) {

            }

            format = new SimpleDateFormat("yyyy/MM/dd");
            try {
                return format.parse(dateStr);
            } catch (ParseException e) {

            }
        }else if(19 == length){
            format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            try {
                return format.parse(dateStr);
            } catch (ParseException e) {

            }
        }else if(19 == length){
            format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            try {
                return format.parse(dateStr);
            } catch (ParseException e) {

            }
        }else if(21 == length){
            format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
            try {
                return format.parse(dateStr);
            } catch (ParseException e) {

            }
        }

        throw new RuntimeException("can not parse date string :" + dateStr);
    }


    public synchronized static Date parseDateStringTwice(String dateStr) {
        try{
            Date date = preciseDateFormat.parse(dateStr);
            return date;
        }catch(Exception e){
        }

        try{
            Date date = partitionDateFormat.parse(dateStr);
            return date;
        }catch(Exception e){
        }
        throw new RuntimeException("can not parse date string :" + dateStr);
    }


    public synchronized static String getPartitionString(Date date) {
        return partitionDateFormat.format(date);
    }

    public synchronized static String getShortDateString(Date date) {
        return shortDateFormat.format(date);
    }
    public synchronized static String getLongDateString(Date date) {
        return longDateFormat.format(date);
    }
    
    public synchronized static String getPreciseDateString(Date date){
        return preciseDateFormat.format(date);
    }

    public synchronized static String getMinuteDateString(Date date){
        return minuteDateFormat.format(date) + ":00";
    }

    public synchronized static String getTimeStringWithoutDate(Date date){
        return timeFormatWithoutDate.format(date);
    }

    public synchronized static java.sql.Date toSQLDate(Date date) {
        return new java.sql.Date(date.getTime());
    }

    public synchronized static java.sql.Timestamp toSQLTimestamp(String dateString){
        return java.sql.Timestamp.valueOf(dateString);
    }

    public synchronized static java.sql.Date toSQLDate(String dateString) {
        Date date = parseDateString(dateString);
        return new java.sql.Date(date.getTime());
    }

    public synchronized static Date getOffsetDate(Date currentDate, int offsetDate){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DATE, offsetDate);
        return calendar.getTime();
    }

    public synchronized static String getOffsetDatePartitionString(Date currentDate, int offsetDate){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DATE, offsetDate);
        return partitionDateFormat.format(calendar.getTime());
    }

    public synchronized static String getOffsetDateShortString(Date currentDate, int offsetDate){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DATE, offsetDate);
        return shortDateFormat.format(calendar.getTime());
    }

    public synchronized static Date getOffsetHour(Date currentDate, int offsetHour){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.HOUR, offsetHour);
        return calendar.getTime();
    }

    public synchronized static String getOffsetMinute(String dateStr,int offsetMinute){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(parseDateString(dateStr));
        calendar.add(Calendar.MINUTE, offsetMinute);
        return getPreciseDateString(calendar.getTime());
    }

    public synchronized static String getOffsetMonthPartitionString(String dateStr,int offsetMonth){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(parseDateString(dateStr));
        calendar.add(Calendar.MONTH, offsetMonth);
        return partitionDateFormat.format(calendar.getTime());
    }

    public static int getYearFromDateStr(String dateStr){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(parseDateString(dateStr));
        return calendar.get(Calendar.YEAR);

    }

    public synchronized static int daysBetween(Date date1,Date date2){
        Calendar cal = Calendar.getInstance();
        cal.setTime(date1);
        long time1 = cal.getTimeInMillis();
        cal.setTime(date2);
        long time2 = cal.getTimeInMillis();
        Long between_days=(time2-time1)/(1000*3600*24);
        return Math.abs(between_days.intValue());
    }

    public synchronized static int minutesBetween(Date date1,Date date2){
        Calendar cal = Calendar.getInstance();
        cal.setTime(date1);
        long time1 = cal.getTimeInMillis();
        cal.setTime(date2);
        long time2 = cal.getTimeInMillis();
        Long between_minutes=(time2-time1)/(1000*60);
        return Math.abs(between_minutes.intValue());
    }

    public synchronized static int secondsBetween(Date date1,Date date2){
        Calendar cal = Calendar.getInstance();
        cal.setTime(date1);
        long time1 = cal.getTimeInMillis();
        cal.setTime(date2);
        long time2 = cal.getTimeInMillis();
        Long between_minutes=(time2-time1)/(1000);
        return Math.abs(between_minutes.intValue());
    }

    public synchronized static Date lastSunday(Date date){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        if(calendar.get(Calendar.DAY_OF_WEEK)==1){
            int day = calendar.get(Calendar.DATE);
            calendar.set(Calendar.DATE, day-1);
            calendar.setTime(calendar.getTime());
        }
        calendar.set(Calendar.DAY_OF_WEEK, 1);
        return calendar.getTime();
    }

    public synchronized static String getOffsetSunday(int offset){
        Date sunday = lastSunday(new Date());
        if (1 < offset){
            sunday = DateUtil.getOffsetDate(sunday,(offset-1)*7*(-1));
        }
        String dataDate = DateUtil.getPartitionString(sunday);
        return dataDate;
    }

}
