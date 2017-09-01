package cn.thinkingdata.web.service.rest.game.inner;

import cn.thinkingdata.web.service.rest.RestBaseService;
import cn.thinkingdata.web.util.DataResult;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Carpenter
 * @date 2017/5/9 14:11
 * @description GameOperationRestService
 */
@Service
public class GameOperationRestService extends RestBaseService{

    public DataResult getOperationBase(Integer gameId) {
        Map<String, Object> urlVariables =  new HashMap<>();
        urlVariables.put("game_id",gameId);
        return getApiData("/v1/service/inner/operation/base",urlVariables);
    }
}
