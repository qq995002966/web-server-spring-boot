package cn.thinkingdata.web.interceptor;

import cn.thinkingdata.web.service.interceptor.VisitorInterceptorService;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.WebUtil;
import eu.bitwalker.useragentutils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *  恶意请求拦截器
 * Created by Xiaowu on 2016/8/5.
 */
@Component
public class MaliciousRequestInterceptor extends BaseInterceptor  {

    @Autowired
    private VisitorInterceptorService visitorInterceptorService;


    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String ip = WebUtil.getHost(request);
        String uri = request.getRequestURI();
        UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("User-Agent"));
        if(uri.startsWith("/rest/v1") && !uri.contains("callback")) {
            if (checkUserAgent(uri,userAgent)) {
                visitorInterceptorService.setVisitedInfo(ip);
                if (visitorInterceptorService.checkVisitor(ip)) {
                    logger.info("ban request, ip: " + ip + ", uri: " + uri);
                    response.setStatus(ReturnCodeDim.MULTI_STATUS);
                    return false;
                }
            } else {
                logger.info("ban request, ip: " + ip + ", uri: " + uri);
                response.setStatus(ReturnCodeDim.MULTI_STATUS);
                return false;
            }
        }
        return super.preHandle(request, response, handler);
    }

    private boolean checkUserAgent(String uri,UserAgent userAgent){
        boolean result = true;
        Browser browser = userAgent.getBrowser();
        OperatingSystem os = userAgent.getOperatingSystem();
        if (browser.getBrowserType().equals(BrowserType.ROBOT)||browser.getBrowserType().equals(BrowserType.TOOL)||browser.getBrowserType().equals(BrowserType.UNKNOWN)){
            logger.info("error browser type!");
            result = false;
        }
        if(os.getDeviceType().equals(DeviceType.UNKNOWN)){
            logger.info("error os type!");
            result = false;
        }
        return result;
    }
}
