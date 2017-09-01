package cn.thinkingdata.web.controller;

import cn.thinkingdata.web.service.core.HomeService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Xiaowu on 2016/8/16.
 */
@RestController
@RequestMapping(value = "/v1/home")
public class IndexController {

    @Autowired
    private HomeService homeService;

    @RequestMapping(value = "/content",method = { RequestMethod.GET })
    public DataResult CountryContentDetail(){
        return homeService.CountryContentDetail();
    }

    @RequestMapping(value = "/unauthorized",method = { RequestMethod.GET })
    public DataResult unauthorized(){
        return new DataResult(ReturnCodeDim.INVALID_SESSION,"");
    }

    @RequestMapping(value = "/forbidden",method = { RequestMethod.GET })
    public DataResult forbidden(){
        return new DataResult(ReturnCodeDim.AUTHORITY_FORBIDDEN,"");
    }
}
