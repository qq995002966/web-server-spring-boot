package cn.thinkingdata.web.filter;

import cn.thinkingdata.web.service.core.user.custom.inner.InnerCustomServiceService;
import cn.thinkingdata.web.util.CommonUtil;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.PrintWriter;

//@Component
public class OperationFilter implements Filter {

    protected static final Logger logger = LogManager.getLogger();

    @Autowired
    private InnerCustomServiceService innerCustomServiceService;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

    	String game_id = request.getParameter("game_id");
        if(game_id != null ) {
            Integer gameId = Integer.valueOf(game_id);
            if(!innerCustomServiceService.gameAccessForbidden(gameId)){
                chain.doFilter(request, response);
            }else{
                response.setContentType("application/json;charset=UTF-8");
                PrintWriter out = response.getWriter();
                String respStr = CommonUtil.getResultJsonStr(ReturnCodeDim.AUTHORITY_FORBIDDEN);
                out.print(respStr);
            }
        }else {
            String path = ((HttpServletRequest) request).getRequestURI();
            if(path.contains("/rest/v1/service/inner/game")){
                chain.doFilter(request, response);
            }else {
                response.setContentType("application/json;charset=UTF-8");
                PrintWriter out = response.getWriter();
                String respStr = CommonUtil.getResultJsonStr(ReturnCodeDim.AUTHORITY_FORBIDDEN);
                out.print(respStr);
            }
        }
    }

    @Override
    public void destroy() {
    }

}
