package cn.thinkingdata.web.controller.user.game.inner;

import cn.thinkingdata.web.service.core.user.custom.inner.GameOperationService;
import cn.thinkingdata.web.service.rest.game.inner.GameOperationRestService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Created by Xiaowu on 2016/10/31.
 */
@RestController
@RequestMapping(value = "/v1/service/inner/operation")
public class OperationController {

    @Autowired
    private GameOperationService gameOperationService;

    @Autowired
    private GameOperationRestService gameOperationRestService;

    @RequestMapping(value = "/evaluate",method = { RequestMethod.GET })
    public DataResult operationBaseRest(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return gameOperationRestService.getOperationBase(gameId);
    }

    @RequestMapping(value = "/base",method = { RequestMethod.GET })
    public DataResult OperationBase(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                    @RequestParam(value = "start_date", required = false) String startDate,
                                    @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationBase(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/kpi",method = { RequestMethod.GET })
    public DataResult OperationKPI(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                    @RequestParam(value = "start_date", required = false) String startDate,
                                    @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationKPI(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/newuser",method = { RequestMethod.GET })
    public DataResult OperationNewUser(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                   @RequestParam(value = "start_date", required = false) String startDate,
                                   @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationNewUser(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/activeuser",method = { RequestMethod.GET })
    public DataResult OperationActiveUser(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                       @RequestParam(value = "start_date", required = false) String startDate,
                                       @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationActiveUser(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/retentionuser",method = { RequestMethod.GET })
    public DataResult OperationRetentionUser(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                          @RequestParam(value = "start_date", required = false) String startDate,
                                          @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationRetentionUser(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/payuser",method = { RequestMethod.GET })
    public DataResult OperationPayUser(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                             @RequestParam(value = "start_date", required = false) String startDate,
                                             @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationPayUser(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/lostuser",method = { RequestMethod.GET })
    public DataResult OperationLostUser(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                       @RequestParam(value = "start_date", required = false) String startDate,
                                       @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationLostUser(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/habituser",method = { RequestMethod.GET })
    public DataResult OperationHabitUser(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                        @RequestParam(value = "start_date", required = false) String startDate,
                                        @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationHabitUser(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/retentioncount",method = { RequestMethod.GET })
    public DataResult OperationHabitCount(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                         @RequestParam(value = "start_date", required = false) String startDate,
                                         @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationHabitCount(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/paydata",method = { RequestMethod.GET })
    public DataResult OperationPayData(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                          @RequestParam(value = "start_date", required = false) String startDate,
                                          @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationPayData(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/payratedata",method = { RequestMethod.GET })
    public DataResult OperationPayRateData(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                       @RequestParam(value = "start_date", required = false) String startDate,
                                       @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationPayRateData(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/firstpay",method = { RequestMethod.GET })
    public DataResult OperationFirstPay(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                           @RequestParam(value = "start_date", required = false) String startDate,
                                           @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationFirstPay(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/payhabit",method = { RequestMethod.GET })
    public DataResult OperationPayHabit(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                        @RequestParam(value = "start_date", required = false) String startDate,
                                        @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationPayHabit(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/lostcount",method = { RequestMethod.GET })
    public DataResult OperationLostCount(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                        @RequestParam(value = "start_date", required = false) String startDate,
                                        @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationLostCount(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/lostfunnel",method = { RequestMethod.GET })
    public DataResult OperationLostFunnel(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                         @RequestParam(value = "data_date", required = false) String dataDate){
        return gameOperationService.getOperationLostFunnel(gameId,dataDate);
    }

    @RequestMapping(value = "/channelquality",method = { RequestMethod.GET })
    public DataResult OperationChannelQuality(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                              @RequestParam(value = "start_date", required = false) String startDate,
                                              @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationChannelQuality(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/channelpay",method = { RequestMethod.GET })
    public DataResult OperationChannelPay(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                                              @RequestParam(value = "start_date", required = false) String startDate,
                                              @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationChannelPay(gameId,startDate,endDate);
    }

    @RequestMapping(value = "/menu",method = { RequestMethod.GET })
    public DataResult Menu(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId){
        return gameOperationService.getMenuByGameId(gameId);
    }

    @RequestMapping(value = "/page",method = { RequestMethod.GET })
    public DataResult Page(@RequestParam(value = "game_id", required = false,defaultValue = "0") Integer gameId,
                           @RequestParam(value = "menu_id", required = false,defaultValue = "0") Integer menuId,
                           @RequestParam(value = "start_date") String startDate,
                           @RequestParam(value = "end_date") String endDate){
        return gameOperationService.getPageByMenuId(gameId,menuId,startDate,endDate);
    }

}
