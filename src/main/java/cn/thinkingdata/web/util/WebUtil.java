package cn.thinkingdata.web.util;

import cn.thinkingdata.web.constant.Constants;
import cn.thinkingdata.web.domain.user.Do_user;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Map;

/**
 * Created by Xiaowu on 2016/8/4.
 */
public final class WebUtil {
    private WebUtil() {
    }

    /**
     * 获取指定Cookie的值
     *
     * @param cookieName cookie名字
     * @param defaultValue 缺省值
     * @return
     */
    public static final String getCookieValue(HttpServletRequest request, String cookieName, String defaultValue) {
        Cookie cookie = WebUtils.getCookie(request, cookieName);
        if (cookie == null) {
            return defaultValue;
        }
        return cookie.getValue();
    }

    /** 保存当前用户 */
    public static final void saveCurrentUser(Object user) {
        setSession(Constants.CURRENT_USER, user);
    }

    /** 获取当前用户 */
    public static final Do_user getCurrentUser() {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (null != session) {
                return (Do_user) session.getAttribute(Constants.CURRENT_USER);
            }
        }
        return null;
    }

    /**
     * 将一些数据放到ShiroSession中,以便于其它地方使用
     *
     */
    public static final void setSession(Object key, Object value) {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (null != session) {
                session.setAttribute(key, value);
            }
        }
    }

    public static final Object getSession(Object key) {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (null != session) {
                return  session.getAttribute(key);
            }
        }
        return null;
    }


    /** 移除当前用户 */
    public static final void removeCurrentUser(HttpServletRequest request) {
        request.getSession().removeAttribute(Constants.CURRENT_USER);
    }

    /**
     * 获得参数Map
     *
     * @param request
     * @return
     */
    public static final Map<String, Object> getParameterMap(HttpServletRequest request) {
        return WebUtils.getParametersStartingWith(request, null);
    }

    /** 获取客户端IP */
    public static final String getHost(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (StringUtils.isBlank(ip) || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if ("127.0.0.1".equals(ip)) {
            InetAddress inet = null;
            try { // 根据网卡取本机配置的IP
                inet = InetAddress.getLocalHost();
            } catch (UnknownHostException e) {
                e.printStackTrace();
            }
            ip = inet.getHostAddress();
        }
        // 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
        if (ip != null && ip.length() > 15) {
            if (ip.indexOf(",") > 0) {
                ip = ip.substring(0, ip.indexOf(","));
            }
        }
        return ip;
    }
}
