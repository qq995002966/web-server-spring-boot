package cn.thinkingdata.web.shiro;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.subject.Subject;

import com.google.common.base.Throwables;

/**
 * Created by Xiaowu on 2016/8/3.
 */
public final class LoginHelper {
	private static final Logger logger = LogManager.getLogger();
    private LoginHelper() {
    }

    /** 用户登录 */
    public static final Boolean login(String account, String password,Boolean rememberMe) {
        try {
            UsernamePasswordToken token = new UsernamePasswordToken(account, password);
            token.setRememberMe(rememberMe);
            Subject subject = SecurityUtils.getSubject();
            subject.login(token);
            return subject.isAuthenticated();
        } catch (Exception e) {
//        	logger.warn(Throwables.getStackTraceAsString(e));
            return false;
        }
    }

    /** 用户退出 */
    public static final void logout() {
        SecurityUtils.getSubject().logout();
    }
}
