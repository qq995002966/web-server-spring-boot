package cn.thinkingdata.web.controller.demo;

import cn.thinkingdata.web.service.core.user.custom.inner.GameOperationService;
import cn.thinkingdata.web.service.rest.game.inner.GameOperationRestService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Carpenter
 * @date 2017/2/8 17:03
 * @description InnerGameOperationController
 */
@RestController
@RequestMapping(value = "/v1/demo/inner/operation")
public class InnerGameOperationController {

    @Autowired
    private GameOperationService gameOperationService;

    private static final int DEMO_GAME = 0;

    @Autowired
    private GameOperationRestService gameOperationRestService;

    @RequestMapping(value = "/evaluate",method = { RequestMethod.GET })
    public DataResult operationBaseRest(){
        return gameOperationRestService.getOperationBase(DEMO_GAME);
    }

    @RequestMapping(value = "/base",method = { RequestMethod.GET })
    public DataResult OperationBase(@RequestParam(value = "start_date", required = false) String startDate,
                                    @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationBase(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/kpi",method = { RequestMethod.GET })
    public DataResult OperationKPI(@RequestParam(value = "start_date", required = false) String startDate,
                                   @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationKPI(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/newuser",method = { RequestMethod.GET })
    public DataResult OperationNewUser(@RequestParam(value = "start_date", required = false) String startDate,
                                       @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationNewUser(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/activeuser",method = { RequestMethod.GET })
    public DataResult OperationActiveUser(@RequestParam(value = "start_date", required = false) String startDate,
                                          @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationActiveUser(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/retentionuser",method = { RequestMethod.GET })
    public DataResult OperationRetentionUser(@RequestParam(value = "start_date", required = false) String startDate,
                                             @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationRetentionUser(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/payuser",method = { RequestMethod.GET })
    public DataResult OperationPayUser(@RequestParam(value = "start_date", required = false) String startDate,
                                       @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationPayUser(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/lostuser",method = { RequestMethod.GET })
    public DataResult OperationLostUser(@RequestParam(value = "start_date", required = false) String startDate,
                                        @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationLostUser(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/habituser",method = { RequestMethod.GET })
    public DataResult OperationHabitUser(@RequestParam(value = "start_date", required = false) String startDate,
                                         @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationHabitUser(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/retentioncount",method = { RequestMethod.GET })
    public DataResult OperationHabitCount(@RequestParam(value = "start_date", required = false) String startDate,
                                          @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationHabitCount(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/paydata",method = { RequestMethod.GET })
    public DataResult OperationPayData(@RequestParam(value = "start_date", required = false) String startDate,
                                       @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationPayData(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/payratedata",method = { RequestMethod.GET })
    public DataResult OperationPayRateData(@RequestParam(value = "start_date", required = false) String startDate,
                                           @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationPayRateData(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/firstpay",method = { RequestMethod.GET })
    public DataResult OperationFirstPay(@RequestParam(value = "start_date", required = false) String startDate,
                                        @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationFirstPay(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/payhabit",method = { RequestMethod.GET })
    public DataResult OperationPayHabit(@RequestParam(value = "start_date", required = false) String startDate,
                                        @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationPayHabit(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/lostcount",method = { RequestMethod.GET })
    public DataResult OperationLostCount(@RequestParam(value = "start_date", required = false) String startDate,
                                         @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationLostCount(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/lostfunnel",method = { RequestMethod.GET })
    public DataResult OperationLostFunnel(@RequestParam(value = "data_date", required = false) String dataDate){
        return gameOperationService.getOperationLostFunnel(DEMO_GAME,dataDate);
    }

    @RequestMapping(value = "/channelquality",method = { RequestMethod.GET })
    public DataResult OperationChannelQuality(@RequestParam(value = "start_date", required = false) String startDate,
                                              @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationChannelQuality(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/channelpay",method = { RequestMethod.GET })
    public DataResult OperationChannelPay(@RequestParam(value = "start_date", required = false) String startDate,
                                          @RequestParam(value = "end_date", required = false) String endDate){
        return gameOperationService.getOperationChannelPay(DEMO_GAME,startDate,endDate);
    }

    @RequestMapping(value = "/menu",method = { RequestMethod.GET })
    public DataResult Menu(){
        return gameOperationService.getMenuByGameId(DEMO_GAME);
    }

    @RequestMapping(value = "/page",method = { RequestMethod.GET })
    public DataResult Page(@RequestParam(value = "menu_id", required = false,defaultValue = "0") Integer menuId,
                           @RequestParam(value = "start_date") String startDate,
                           @RequestParam(value = "end_date") String endDate){
        return gameOperationService.getPageByMenuId(DEMO_GAME,menuId,startDate,endDate);
    }
}
