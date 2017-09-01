package cn.thinkingdata.web.service.core.sys;

import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.WebUtil;
import com.alibaba.fastjson.JSON;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by Xiaowu on 2016/8/4.
 */
@Service
public class SysEventService {

    protected static final Logger logger = LogManager.getLogger();

    public void saveEvent(final HttpServletRequest request, final HttpServletResponse response,
                          final Exception ex, final Map mapLog, final Long endTime) {
        Double userTime = ((endTime - Long.valueOf(mapLog.get("startTime").toString())) / 1000.00);
        String _s=mapLog.get("userId")+"|"+mapLog.get("nickName")+"|"+mapLog.get("projectId")+"||"+mapLog.get("requestTime")+"|"+mapLog.get("requestUri")+ "|" + mapLog.get("parameters")+"|"+mapLog.get("clientHost")+"|"+mapLog.get("method")+"|"+mapLog.get("userAgent") + "|" + mapLog.get("status")+ "|" + userTime;
        logger.info(_s);
    }
}
