package cn.thinkingdata.web.controller.gas;

import cn.thinkingdata.web.service.core.gas.GasService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Xiaowu on 2016/8/10.
 */
@Controller
@RequestMapping(value = "/v1/gas")
public class GasController {

    @Autowired
    private GasService gasService;

    @RequestMapping(value = "/crawlerinfo/apps",method = { RequestMethod.GET })
    @ResponseBody
    public DataResult findGasCrawlerInfoAndGasApps(@RequestParam(value = "project_id", required = false,defaultValue = "0") Integer projectId){
        return gasService.findGasCrawlerInfoAndGasApps(projectId);
    }
}
