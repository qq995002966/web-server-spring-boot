package cn.thinkingdata.web.controller.demo;

import cn.thinkingdata.web.service.core.user.custom.inner.InnerCustomServiceService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.WebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.Map;

/**
 * @author Carpenter
 * @date 2017/1/17 17:09
 * @description InnerGameController
 */
@RestController
@RequestMapping(value = "/v1/demo/inner")
public class InnerGameController {

    @Autowired
    private InnerCustomServiceService innerCustomServiceService;

    private static final int DEMO_GAME = 0;

    @RequestMapping(value = "/chart",method = { RequestMethod.GET })
    public DataResult findChartByInnerServiceAndGame(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                                                     @RequestParam(value = "chart_type", required = false,defaultValue = "0") Integer chartType){
        return innerCustomServiceService.findChartByInnerServiceAndGame(serviceId,DEMO_GAME,chartType);
    }

    @RequestMapping(value = "/chart",method = { RequestMethod.POST })
    public DataResult setFormSequence(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                                      @RequestParam(value = "form_id", required = false,defaultValue = "") String formIds){
        return innerCustomServiceService.setFormSequence(serviceId,DEMO_GAME,formIds);
    }

    @RequestMapping(value = "/search",method = { RequestMethod.GET })
    public DataResult searchData(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                                 @RequestParam(value = "data_id", required = false) String dataId,
                                 @RequestParam(value = "order_by_field", required = false) String orderField,
                                 @RequestParam(value = "order_type", required = false,defaultValue = "desc") String orderType,
                                 @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                 @RequestParam(value = "limit", required = false,defaultValue = "30") Integer limit,
                                 HttpServletRequest request){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        return innerCustomServiceService.searchData(serviceId,DEMO_GAME,dataId,params,orderField,orderType,index,limit,null);
    }

    @RequestMapping(value = "/search/excel",method = { RequestMethod.GET })
    public void searchDataExcel(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                                @RequestParam(value = "data_id", required = false) String dataId,
                                @RequestParam(value = "order_by_field", required = false) String orderField,
                                @RequestParam(value = "order_type", required = false,defaultValue = "desc") String orderType,
                                @RequestParam(value = "type", required = false) String type,
                                @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit,
                                @RequestParam(value = "excel_name", required = false,defaultValue = "data") String name,
                                HttpServletRequest request,HttpServletResponse response){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        response.setCharacterEncoding("GBK");
        try {
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-disposition", "attachment;filename="+ URLEncoder.encode(name, "UTF-8")+".xls");
            OutputStream outputStream = response.getOutputStream();
            innerCustomServiceService.searchDataExcel(serviceId,DEMO_GAME,dataId,params,orderField,orderType,index,limit,type,outputStream);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/search/meta",method = { RequestMethod.GET })
    public DataResult findSearchMetaByService(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId){
        return innerCustomServiceService.findSearchMetaByService(serviceId,DEMO_GAME,null);
    }

    @RequestMapping(value = "/gamelog/type",method = { RequestMethod.GET })
    public DataResult findGameLogType(){
        return innerCustomServiceService.findGameLogType(DEMO_GAME);
    }

    @RequestMapping(value = "/gamelog/meta",method = { RequestMethod.GET })
    public DataResult findGameLogMeta(@RequestParam(value = "type", required = false) String type){
        return innerCustomServiceService.findGameLogMeta(DEMO_GAME,type);
    }

    @RequestMapping(value = "/gamelog/search",method = { RequestMethod.GET })
    public DataResult gameLogSearchData(@RequestParam(value = "type", required = false) String type,
                                        @RequestParam(value = "order_by_field", required = false) String orderField,
                                        @RequestParam(value = "order_type", required = false,defaultValue = "desc") String orderType,
                                        @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                        @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit,
                                        HttpServletRequest request){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        return innerCustomServiceService.gameLogSearchData(type,DEMO_GAME,params,orderField,orderType,index,limit);
    }

    @RequestMapping(value = "/property/detail",method = { RequestMethod.GET })
    public DataResult gamePropertySearchDetail(@RequestParam(value = "data_id", required = false) String dataId,
                                               HttpServletRequest request){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        return innerCustomServiceService.gamePropertySearchDetail(DEMO_GAME,params,dataId);
    }

    @RequestMapping(value = "/gamelog/chart",method = { RequestMethod.GET })
    public DataResult gameLogSearchChart(@RequestParam(value = "type", required = false) String type,
                                         @RequestParam(value = "start_date", required = false) String startDate,
                                         @RequestParam(value = "end_date", required = false) String endDate,
                                         HttpServletRequest request){
        return innerCustomServiceService.gameLogSearchChart(type,DEMO_GAME,startDate,endDate);
    }
}
