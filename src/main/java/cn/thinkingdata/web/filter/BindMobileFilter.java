package cn.thinkingdata.web.filter;

import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.service.core.user.UserService;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.WebUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import java.io.IOException;
import java.io.PrintWriter;

//@Component
public class BindMobileFilter implements Filter {

    protected static final Logger logger = LogManager.getLogger();

    @Autowired
    private UserService userService;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        userService.authLogin();
        Do_user userInfo = WebUtil.getCurrentUser();
        if(userInfo == null ){
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter out = response.getWriter();
            String respStr = CommonUtil.getResultJsonStr(ReturnCodeDim.INVALID_SESSION);
            out.print(respStr);
        }else {
            if (!StringUtils.isNotBlank(userInfo.getMobile())) {
                response.setContentType("application/json;charset=UTF-8");
                PrintWriter out = response.getWriter();
                String respStr = CommonUtil.getResultJsonStr(ReturnCodeDim.MOBILE_NOT_BOUND);
                out.print(respStr);
            } else {
                chain.doFilter(request, response);
            }
        }
    }

    @Override
    public void destroy() {
    }

}
