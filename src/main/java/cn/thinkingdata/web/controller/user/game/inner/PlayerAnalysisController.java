package cn.thinkingdata.web.controller.user.game.inner;

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
 * @date 2017/2/27 11:56
 * @description PlayerAnalysisController
 */
@RestController
@RequestMapping(value = "/v1/service/inner/analysis")
public class PlayerAnalysisController {

    @Autowired
    private PlayerAnalysisService playerAnalysisService;

    @RequestMapping(value = "/player/key",method = { RequestMethod.GET })
    public DataResult KeyPlayer(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return playerAnalysisService.getKeyPlayer(gameId);
    }

    @RequestMapping(value = "/player/group",method = { RequestMethod.GET })
    public DataResult findPlayerGroup(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return playerAnalysisService.findPlayerGroup(gameId);
    }

    @RequestMapping(value = "/player/group/tag",method = { RequestMethod.GET })
    public DataResult findPlayerGroupTag(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                         @RequestParam(value = "group", required = false) String group){
        return playerAnalysisService.findPlayerGroupTag(gameId,group);
    }

    @RequestMapping(value = "/search/meta",method = { RequestMethod.GET })
    public DataResult findSearchMetaByService(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return playerAnalysisService.findSearchMetaByService(gameId);
    }

    @RequestMapping(value = "/cluster/type",method = { RequestMethod.GET })
    public DataResult findPlayerClusterTypeByGameId(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return playerAnalysisService.findPlayerClusterTypeByGameId(gameId);
    }

    @RequestMapping(value = "/player/cluster",method = { RequestMethod.GET })
    public DataResult findPlayerClusterByGameId(@RequestParam(value = "user_type", required = false,defaultValue = "active") String user_type,
                                                @RequestParam(value = "cluster_type", required = false,defaultValue = "") String cluster_type,
                                                @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return playerAnalysisService.findPlayerClusterByGameId(user_type,cluster_type,gameId);
    }

    @RequestMapping(value = "/player/tag",method = { RequestMethod.GET })
    public DataResult findPlayerTagByGameId(@RequestParam(value = "user_type", required = false,defaultValue = "active") String user_type,
                                            @RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return playerAnalysisService.findPlayerTagByGameId(user_type,gameId);
    }

    @RequestMapping(value = "/player/data",method = { RequestMethod.GET })
    public DataResult findPlayerData(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                     @RequestParam(value = "keyword", required = false) String keyword,
                                     @RequestParam(value = "user_type", required = false) String userType,
                                     @RequestParam(value = "column_type", required = false) String columnType,
                                     @RequestParam(value = "order_by_field", required = false) String orderField,
                                     @RequestParam(value = "order_type", required = false,defaultValue = "desc") String orderType,
                                     @RequestParam(value = "index", required = false,defaultValue = "0") Integer index,
                                     @RequestParam(value = "limit", required = false,defaultValue = "30") Integer limit,
                                     HttpServletRequest request){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        return playerAnalysisService.findPlayerData(gameId,keyword,userType,columnType,index,limit,params,orderField,orderType);
    }

    @RequestMapping(value = "/player/search",method = { RequestMethod.GET })
    public DataResult findPlayerBySearch(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                         @RequestParam(value = "keyword", required = false) String keyword,
                                         @RequestParam(value = "group", required = false) String group,
                                         @RequestParam(value = "column_name", required = false) String columnName,
                                         HttpServletRequest request){
        Map<String, Object> params = WebUtil.getParameterMap(request);
        return playerAnalysisService.findPlayerBySearch(gameId,keyword,group,columnName,params);
    }

    @RequestMapping(value = "/search/excel",method = { RequestMethod.GET })
    public void searchDataExcel(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                @RequestParam(value = "keyword", required = false) String keyword,
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
            response.setHeader("Content-disposition", "attachment;filename="+ URLEncoder.encode(name, "UTF-8")+".csv");
            OutputStream outputStream = response.getOutputStream();
            playerAnalysisService.searchDataExcel(gameId,keyword,userType,columnType,index,limit,outputStream,params);
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
