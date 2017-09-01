package cn.thinkingdata.web.job;

import cn.thinkingdata.web.service.cache.RefreshRedisService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


/**
 * Created by Xiaowu on 2016/9/7.
 */
@Component("refreshRedisJob")
public class RefreshRedisJob {

    protected static final Logger logger = LogManager.getLogger();

    @Autowired
    private RefreshRedisService refreshRedisService;

    @Scheduled(cron = "0 0/5 * * * ?")
//    @Scheduled(cron = "0 0/1 * * * ?")//这里是为了测试用的把时间改为了1分钟一次
    public void job() {
        logger.info("RefreshRedisService  refresh  start...");
        refreshRedisService.refresh();
        logger.info("RefreshRedisService  refresh  end...");
    }
}
