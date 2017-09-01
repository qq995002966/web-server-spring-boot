package cn.thinkingdata.web.controller.demo;

import cn.thinkingdata.web.service.core.user.custom.inner.GameOperationService;
import cn.thinkingdata.web.service.core.user.custom.inner.PlayerAnalysisService;
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
 * @date 2017/2/8 17:03
 * @description InnerGameOperationController
 */
@RestController
@RequestMapping(value = "/v1/demo/inner/analysis")
public class InnerGamePlayerAnalysisController {

    @Autowired
    private PlayerAnalysisService playerAnalysisService;

    private static final int DEMO_GAME = 0;

    @RequestMapping(value = "/player/key",method = { RequestMethod.GET })
    public DataResult KeyPlayer(){
        return playerAnalysisService.getKeyPlayer(DEMO_GAME);
    }

    @RequestMapping(value = "/player/group",method = { RequestMethod.GET })
    public DataResult findPlayerGroup(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return playerAnalysisService.findPlayerGroup(gameId);
    }

    @RequestMapping(value = "/player/group/tag",method = { RequestMethod.GET })
    public DataResult findPlayerGroupTag(@RequestParam(value = "group", required = false) String group){
        return playerAnalysisService.findPlayerGroupTag(DEMO_GAME,group);
    }

    @RequestMapping(value = "/search/meta",method = { RequestMethod.GET })
    public DataResult findSearchMetaByService(){
        return playerAnalysisService.findSearchMetaByService(DEMO_GAME);
    }



    @RequestMapping(value = "/cluster/type",method = { RequestMethod.GET })
    public DataResult findPlayerClusterTypeByGameId(){
        return playerAnalysisService.findPlayerClusterTypeByGameId(DEMO_GAME);
    }

    @RequestMapping(value = "/player/cluster",method = { RequestMethod.GET })
    public DataResult findPlayerClusterByGameId(@RequestParam(value = "user_type", required = false,defaultValue = "active") String user_type,
                                                @RequestParam(value = "cluster_type", required = false,defaultValue = "") String cluster_type){
        return playerAnalysisService.findPlayerClusterByGameId(user_type,cluster_type,DEMO_GAME);
    }

    @RequestMapping(value = "/player/tag",method = { RequestMethod.GET })
    public DataResult findPlayerTagByGameId(@RequestParam(value = "user_type", required = false,defaultValue = "active") String user_type){
        return playerAnalysisService.findPlayerTagByGameId(user_type,DEMO_GAME);
    }

    @RequestMapping(value = "/player/data",method = { RequestMethod.GET })
    public DataResult findPlayerData(@RequestParam(value = "keyword", required = false) String keyword,
                                     @RequestParam(value = "user_type", required = false) String userType,
                                     @RequestParam(value = "column_type", required = false) String columnType,
                                     @RequestParam(value = "order_by_field", required = false) String orderField,
                                     @RequestParam(value = "order_type", required = false,defaultValue = "desc") String orderType,
                                     @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                     @RequestParam(value = "limit", required = false,defaultValue = "30") Integer limit,
                                     HttpServletRequest request){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        return playerAnalysisService.findPlayerData(DEMO_GAME,keyword,userType,columnType,index,limit,params,orderField,orderType);
    }

    @RequestMapping(value = "/player/search",method = { RequestMethod.GET })
    public DataResult findPlayerBySearch(@RequestParam(value = "keyword", required = false) String keyword,
                                         @RequestParam(value = "group", required = false) String group,
                                         @RequestParam(value = "column_name", required = false) String columnName,
                                         HttpServletRequest request){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        return playerAnalysisService.findPlayerBySearch(DEMO_GAME,keyword,group,columnName,params);
    }

    @RequestMapping(value = "/search/excel",method = { RequestMethod.GET })
    public void searchDataExcel(@RequestParam(value = "keyword", required = false) String keyword,
                                @RequestParam(value = "user_type", required = false) String userType,
                                @RequestParam(value = "column_type", required = false) String columnType,
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
            playerAnalysisService.searchDataExcel(DEMO_GAME,keyword,userType,columnType,index,limit,outputStream,params);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/player/distribution",method = { RequestMethod.GET })
    public DataResult findPlayerPlayerLostPayStat(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                                  @RequestParam(value = "user_type", required = false,defaultValue = "paid") String userType,
                                                  @RequestParam(value = "classify_name", required = false,defaultValue = "") String classifyName){
        return playerAnalysisService.findPlayerPlayerLostPayStat(gameId,classifyName,userType);
    }

    @RequestMapping(value = "/player/distribution/classify",method = { RequestMethod.GET })
    public DataResult findPlayerPlayerLostPayStatClassifyByUserType(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                                                    @RequestParam(value = "user_type", required = false,defaultValue = "paid") String userType){
        return playerAnalysisService.findPlayerPlayerLostPayStatClassifyByUserType(gameId,userType);
    }
}
