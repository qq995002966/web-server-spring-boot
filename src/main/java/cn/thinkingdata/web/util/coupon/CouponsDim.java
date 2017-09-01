package cn.thinkingdata.web.util.coupon;


import cn.thinkingdata.web.util.DateUtil;
import com.google.common.base.Throwables;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class CouponsDim {

    private static final Logger logger = LogManager.getLogger();
    private static List<CouponsRule> ruleList = new ArrayList<CouponsRule>();
    static{
        try{
            String dimPath = CouponsDim.class.getResource("/").getPath() + "/config/coupon.txt";
            BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(dimPath), "UTF-8"));
            String line = "";
            int lineNum = 0;
            while((line = reader.readLine()) != null){
                lineNum++;
                if(lineNum == 1 ){
                    continue;
                }
                String tokens[] = line.split("\t");
                CouponsRule couponsRule = new CouponsRule();
                couponsRule.setItem_id(Integer.parseInt(tokens[0]));
                couponsRule.setPrice(Integer.parseInt(tokens[1]));
                couponsRule.setNum(Integer.parseInt(tokens[2]));
                couponsRule.setExpire_date(Integer.parseInt(tokens[3]));
                couponsRule.setStart_date(DateUtil.parseDateString(tokens[4]));
                couponsRule.setEnd_date(DateUtil.parseDateString(tokens[5]));
                ruleList.add(couponsRule);
            }
            reader.close();
        }catch(Exception e){
            logger.error(Throwables.getStackTraceAsString(e));
        }
    }
    public static List<CouponsRule> getRuleList(){
        return  ruleList;
    }
}
