package cn.thinkingdata.web.filter;

import cn.thinkingdata.web.constant.GameConstant;
import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.service.core.user.custom.inner.InnerCustomServiceService;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import cn.thinkingdata.web.util.WebUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Set;

//@Component
public class OutterGameAuthFilter implements Filter {

    protected static final Logger logger = LogManager.getLogger();

    @Autowired
    private InnerCustomServiceService innerCustomServiceService;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

    	String projectIdStr = request.getParameter("project_id");
    	if(projectIdStr == null){
            chain.doFilter(request, response);
            return;
        }
        int projectId = Integer.parseInt(projectIdStr);
        if(GameConstant.OUTTER_DEMO_PROJECT_SET.contains(projectId)){
            chain.doFilter(request, response);
            return;
        }
        String path = ((HttpServletRequest) request).getRequestURI();
        if(path.equals("/rest/v1/service/outer/reputation/introduce")){
            chain.doFilter(request, response);
            return;
        }

        Do_user userDo = WebUtil.getCurrentUser();
        if(userDo == null){
            authForbidden(response);
            return;
        }
        Set<Integer> outterGameSet = userDo.getOutterGameSet();
        if(projectId == 0 || outterGameSet.contains(projectId)){
            chain.doFilter(request, response);
            return;
        }else {
            authForbidden(response);
            return;
        }
    }

    private void authForbidden(ServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        String respStr = CommonUtil.getResultJsonStr(ReturnCodeDim.AUTHORITY_FORBIDDEN);
        out.print(respStr);
    }

    @Override
    public void destroy() {
    }

}
