package cn.thinkingdata.web.job;


import cn.thinkingdata.web.service.interceptor.VisitorInterceptorService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


@Component("cleanVisitedInfoJob")
public class CleanVisitedInfoJob {

    protected static final Logger logger = LogManager.getLogger();

    @Autowired
    private VisitorInterceptorService visitorInterceptorService;

    @Scheduled(cron = "0 0/5 * * * ?")
    public void job() {
        visitorInterceptorService.cleanVisitedInfo(120);
    }

}
