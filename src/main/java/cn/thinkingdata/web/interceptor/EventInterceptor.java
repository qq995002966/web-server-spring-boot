package cn.thinkingdata.web.interceptor;

import cn.thinkingdata.web.constant.Constants;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.service.core.sys.SysEventService;
import cn.thinkingdata.web.service.oss.OssService;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.StringUtil;
import cn.thinkingdata.web.util.WebUtil;
import com.alibaba.fastjson.JSON;

import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.NamedThreadLocal;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 日志拦截器
 * Created by Xiaowu on 2016/8/4.
 */
@Component
public class EventInterceptor extends BaseInterceptor {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private SysEventService sysEventService;

    private final ThreadLocal<Map> startTimeThreadLocal = new NamedThreadLocal<Map>("ThreadLocal StartTime");

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // 开始时间（该数据只有当前请求的线程可见）
        final Map useActionLog = new HashMap();
//        Do_user user = WebUtil.getCurrentUser();
        Do_user user = null;
        HttpSession session = request.getSession();
        if (session != null) {
            user = (Do_user) session.getAttribute(Constants.CURRENT_USER);
        }
        if (user != null) {
            useActionLog.put("userId", user.getUser_id().toString());
            useActionLog.put("nickName", user.getNick_name());
        } else {
            useActionLog.put("userId", "0");
            useActionLog.put("nickName", "");
        }
        useActionLog.put("requestTime", CommonUtil.getCurrentTimeStr());
        useActionLog.put("method", request.getMethod());
        useActionLog.put("requestUri", request.getRequestURI());
        useActionLog.put("clientHost", WebUtil.getHost(request));
        useActionLog.put("userAgent", request.getHeader("user-agent"));
        String params = "";
        Map map = WebUtil.getParameterMap(request);
        if (map != null) {
            Set set = map.keySet();
            for (Object o : set) {
                params += "&" + o.toString() + "=" + map.get(o);
            }
            if (params.length() > 1) {
                params = params.substring(1);
            }
        }
        useActionLog.put("parameters", params);
        useActionLog.put("status", response.getStatus());
        useActionLog.put("startTime", System.currentTimeMillis());
        String projectIdStr = request.getParameter("project_id");
        if (projectIdStr == null) {
            useActionLog.put("projectId", 0);
        } else {
            useActionLog.put("projectId", Integer.parseInt(projectIdStr));
        }
        startTimeThreadLocal.set(useActionLog);
        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        // 记录日志
        sysEventService.saveEvent(request, response, ex, startTimeThreadLocal.get(), System.currentTimeMillis());
        super.afterCompletion(request, response, handler, ex);
    }
}