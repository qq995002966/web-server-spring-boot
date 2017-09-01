package cn.thinkingdata.web.service.interceptor;

import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.util.interceptor.JudgeRule;
import cn.thinkingdata.web.util.interceptor.JudgeRuleDim;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Xiaowu on 2016/8/5.
 */
@Service
public class VisitorInterceptorService {

    protected static final Logger logger = LogManager.getLogger();

    private static ConcurrentHashMap<String,VisitedInfo> concurrentHashMap = new ConcurrentHashMap<>();

    /**
     * @param spanLimit 临界时间（分钟）
     */
    @Transactional
    public static void cleanVisitedInfo(Integer spanLimit) {
        logger.info("start clean ip spam cache!");
        for (Map.Entry<String,VisitedInfo> entry : concurrentHashMap.entrySet() ){
            VisitedInfo visitedInfo = entry.getValue();
            Integer span = 0;
            //解封IP
            if(visitedInfo.getStatu()){
                span = DateUtil.minutesBetween(visitedInfo.getSealedTime(),new Date());
                Integer lockedTime = visitedInfo.getSealedGrade() * 60;
                if(lockedTime < span){
                    visitedInfo.setStatu(false);
                    visitedInfo.setSealedGrade(0);
                    visitedInfo.setSealedTime(null);
                }
            }else{
                //清理长时间未访问的ip  spanLimit分钟
                span = DateUtil.minutesBetween(visitedInfo.getLatest(),new Date());
                if(span  > spanLimit ){
                    concurrentHashMap.remove(entry.getKey());
                }
            }

        }
    }

    @Transactional
    public static Integer getIpTimes(String ip){
        VisitedInfo visitedInfo = concurrentHashMap.get(ip);
        Integer times = -1;
        if(visitedInfo != null){
            times = visitedInfo.getTimes();
        }
        return times;
    }

    @Transactional
    public static void setVisitedInfo(String ip) {
        VisitedInfo visitedInfo = concurrentHashMap.get(ip);
        if(visitedInfo == null){
            visitedInfo = new VisitedInfo();
            visitedInfo.setTimes(0);
            visitedInfo.setStatu(false);
            visitedInfo.setStart(new Date());
            visitedInfo.setLatest(new Date());
            visitedInfo.setMaxDateSpan(0);
        }else {
            visitedInfo.setTimes(visitedInfo.getTimes()+1);
            int secondSpan = DateUtil.secondsBetween(visitedInfo.getLatest(),new Date());
            if(secondSpan < 30*60){
                visitedInfo.setMaxDateSpan(secondSpan);
            }

            visitedInfo.setLatest(new Date());
            //封IP策略
            if(!visitedInfo.getStatu()){
                visitedInfo = judgeVisitor(visitedInfo);
            }
        }
        concurrentHashMap.put(ip,visitedInfo);
    }

    private static VisitedInfo judgeVisitor(VisitedInfo visitedInfo){
        //策略一
        Integer span = DateUtil.minutesBetween(visitedInfo.getStart(),visitedInfo.getLatest());
        List<JudgeRule> ruleList = JudgeRuleDim.getRuleList();
        for(JudgeRule judgeRule : ruleList){
            if(span<judgeRule.getTimeSpan()){
                if(visitedInfo.getTimes() > judgeRule.getTimes() ){
                    visitedInfo.setStatu(true);
                    visitedInfo.setSealedTime(new Date());
                    visitedInfo.setSealedGrade(judgeRule.getSealedGrade());
                }
            }
        }
        //策略二
        if(visitedInfo.getMaxDateSpan() < 60 && visitedInfo.getTimes() > 10000){
            visitedInfo.setStatu(true);
            visitedInfo.setSealedTime(new Date());
            visitedInfo.setSealedGrade(VisitedInfo.HALF_DAY);
        }
        return visitedInfo;
    }

    /**
     * @param ip
     * @return true：爬虫
     *
     */
    public static Boolean checkVisitor(String ip){
        return concurrentHashMap.get(ip).getStatu();
    }
}

class VisitedInfo{
    public static final int ONE_HOUR = 1;
    public static final int HALF_DAY = 6;
    public static final int ONE_DAY = 24;
    private Integer times;
    private Boolean statu;//true :锁 false:未锁
    private Date start;
    private Date latest;
    private Integer maxDateSpan = 0;
    private Date sealedTime;
    private Integer sealedGrade; //封IP等级：1：1小时  2：12小时 3:24小时

    public Integer getTimes() {
        return times;
    }

    public void setTimes(Integer times) {
        this.times = times;
    }

    public Boolean getStatu() {
        return statu;
    }

    public void setStatu(Boolean statu) {
        this.statu = statu;
    }

    public Date getStart() {
        return start;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getLatest() {
        return latest;
    }

    public void setLatest(Date latest) {
        this.latest = latest;
    }

    public Integer getMaxDateSpan() {
        return maxDateSpan;
    }

    public void setMaxDateSpan(Integer maxDateSpan) {
        if(maxDateSpan > this.getMaxDateSpan()){
            this.maxDateSpan = maxDateSpan;
        }
    }

    public Date getSealedTime() {
        return sealedTime;
    }

    public void setSealedTime(Date sealedTime) {
        this.sealedTime = sealedTime;
    }

    public Integer getSealedGrade() {
        return sealedGrade;
    }

    public void setSealedGrade(Integer sealedGrade) {
        this.sealedGrade = sealedGrade;
    }
}

