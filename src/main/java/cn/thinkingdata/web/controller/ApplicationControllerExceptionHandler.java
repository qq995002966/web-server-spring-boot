package cn.thinkingdata.web.controller;

import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import com.google.common.base.Throwables;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class ApplicationControllerExceptionHandler {

    protected static final Logger logger = LogManager.getLogger();

    @ExceptionHandler(value = Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public DataResult handlerError(HttpServletRequest req, Exception e) {
        logger.error("path:"+req.getRequestURI()+"|params:"+req.getParameterMap()+"|msg:"+ Throwables.getStackTraceAsString(e));
        return new DataResult(ReturnCodeDim.SYSTEM_ERROR,"");
    }
}
