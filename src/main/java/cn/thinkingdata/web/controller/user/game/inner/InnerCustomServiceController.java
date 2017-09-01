package cn.thinkingdata.web.controller.user.game.inner;

import cn.thinkingdata.web.service.core.user.custom.inner.InnerCustomServiceService;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.WebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.Map;

/**
 * Created by Xiaowu on 2016/8/24.
 */
@RestController
@RequestMapping(value = "/v1/service/inner")
public class InnerCustomServiceController {

    @Autowired
    private InnerCustomServiceService innerCustomServiceService;

    @RequestMapping(value = "/chart",method = { RequestMethod.GET })
    public DataResult findChartByInnerServiceAndGame(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                                  @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                  @RequestParam(value = "chart_type", required = false,defaultValue = "0") Integer chartType){
        return innerCustomServiceService.findChartByInnerServiceAndGame(serviceId,gameId,chartType);
    }

    @RequestMapping(value = "/chart",method = { RequestMethod.POST })
    public DataResult setFormSequence(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                                      @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                      @RequestParam(value = "form_id", required = false,defaultValue = "") String formIds){
        return innerCustomServiceService.setFormSequence(serviceId,gameId,formIds);
    }

    @RequestMapping(value = "/game",method = { RequestMethod.GET })
    public DataResult findGame(@RequestParam(value = "service_id", required = false,defaultValue = "0") Integer serviceId){
        return innerCustomServiceService.findGame(serviceId);
    }

    @RequestMapping(value = "/game/report",method = { RequestMethod.GET })
    public void findReportByGame(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                                 @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                 HttpServletResponse response){
        File file = innerCustomServiceService.findReportByGame(serviceId,gameId);
        response.setCharacterEncoding("UTF-8");
        if(null == file ){
            return;
        }
        try {
            response.setContentLength((int) file.length());
            response.setContentType("application/pdf");
            FileInputStream fileInputStream = new FileInputStream(file);
            BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
            byte[] b = new byte[bufferedInputStream.available()];
            bufferedInputStream.read(b);
            OutputStream outputStream = response.getOutputStream();
            outputStream.write(b);
            bufferedInputStream.close();
            outputStream.flush();
            outputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/search",method = { RequestMethod.GET })
    public DataResult searchData(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                                 @RequestParam(value = "data_id", required = false) String dataId,
                                 @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                 @RequestParam(value = "order_by_field", required = false) String orderField,
                                 @RequestParam(value = "order_type", required = false,defaultValue = "desc") String orderType,
                                 @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                 @RequestParam(value = "limit", required = false,defaultValue = "30") Integer limit,
                                 HttpServletRequest request){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        return innerCustomServiceService.searchData(serviceId,gameId,dataId,params,orderField,orderType,index,limit,null);
    }

    @RequestMapping(value = "/search/csv",method = { RequestMethod.GET })
    public void searchDataCSV(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                                    @RequestParam(value = "data_id", required = false) String dataId,
                                    @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                    @RequestParam(value = "order_by_field", required = false) String orderField,
                                    @RequestParam(value = "order_type", required = false,defaultValue = "desc") String orderType,
                                    @RequestParam(value = "type", required = false) String type,
                                    @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                    @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit,
                                     HttpServletRequest request,HttpServletResponse response){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        response.setCharacterEncoding("GBK");
        try {
            response.setContentType("application/csv");
            response.setHeader("Content-Disposition", "attachment;filename=data.csv");
            OutputStream outputStream = response.getOutputStream();
            innerCustomServiceService.searchDataCSV(serviceId,gameId,dataId,params,orderField,orderType,index,limit,type,outputStream);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/search/excel",method = { RequestMethod.GET })
    public void searchDataExcel(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                              @RequestParam(value = "data_id", required = false) String dataId,
                              @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
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
            response.setHeader("Content-disposition", "attachment;filename="+ URLEncoder.encode(name, "UTF-8")+".csv");
            OutputStream outputStream = response.getOutputStream();
            innerCustomServiceService.searchDataExcel(serviceId,gameId,dataId,params,orderField,orderType,index,limit,type,outputStream);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/search/meta",method = { RequestMethod.GET })
    public DataResult findSearchMetaByService(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                                              @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return innerCustomServiceService.findSearchMetaByService(serviceId,gameId,null);
    }

    @RequestMapping(value = "/csv",method = { RequestMethod.GET })
    public void ReadReport(@RequestParam(value = "service_id", required = false,defaultValue = "1") Integer serviceId,
                           @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                           HttpServletResponse response){
        File file = innerCustomServiceService.ReadFile(serviceId,gameId);
        response.setCharacterEncoding("UTF-8");
        if(null == file ){
            return;
        }
        try {
            response.setContentLength((int) file.length());
            response.setContentType("application/csv");
            response.setHeader("Content-Disposition", "attachment;filename="+file.getName());
            FileInputStream fileInputStream = new FileInputStream(file);
            BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);
            byte[] b = new byte[bufferedInputStream.available()];
            bufferedInputStream.read(b);
            OutputStream outputStream = response.getOutputStream();
            outputStream.write(b);
            bufferedInputStream.close();
            outputStream.flush();
            outputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/gamelog/type",method = { RequestMethod.GET })
    public DataResult findGameLogType(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return innerCustomServiceService.findGameLogType(gameId);
    }

    @RequestMapping(value = "/gamelog/meta",method = { RequestMethod.GET })
    public DataResult findGameLogMeta(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                      @RequestParam(value = "type", required = false) String type){
        return innerCustomServiceService.findGameLogMeta(gameId,type);
    }

    @RequestMapping(value = "/gamelog/search",method = { RequestMethod.GET })
    public DataResult gameLogSearchData(@RequestParam(value = "type", required = false) String type,
                                    @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                    @RequestParam(value = "order_by_field", required = false) String orderField,
                                    @RequestParam(value = "order_type", required = false,defaultValue = "desc") String orderType,
                                    @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                    @RequestParam(value = "limit", required = false,defaultValue = "10") Integer limit,
                                    HttpServletRequest request){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        return innerCustomServiceService.gameLogSearchData(type,gameId,params,orderField,orderType,index,limit);
    }

    @RequestMapping(value = "/property/detail",method = { RequestMethod.GET })
    public DataResult gamePropertySearchDetail(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                               @RequestParam(value = "data_id", required = false) String dataId,
                                        HttpServletRequest request){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        return innerCustomServiceService.gamePropertySearchDetail(gameId,params,dataId);
    }

    @RequestMapping(value = "/gamelog/chart",method = { RequestMethod.GET })
    public DataResult gameLogSearchChart(@RequestParam(value = "type", required = false) String type,
                                        @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                        @RequestParam(value = "start_date", required = false) String startDate,
                                        @RequestParam(value = "end_date", required = false) String endDate,
                                        HttpServletRequest request){
        return innerCustomServiceService.gameLogSearchChart(type,gameId,startDate,endDate);
    }
}
