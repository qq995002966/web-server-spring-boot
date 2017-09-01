package cn.thinkingdata.web.service.rest;

import cn.thinkingdata.web.util.DataResult;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Carpenter
 * @date 2017/5/10 17:31
 * @description IndustryRestService
 */
@Service
public class IndustryRestService extends RestBaseService{

    public DataResult findComplainDistriDetail(String platform, String detailType) {
        Map<String, Object> urlVariables =  new HashMap<>();
        urlVariables.put("platform",platform);
        urlVariables.put("detail_type",detailType);
        return getApiData("/v1/industry/complain/detail",urlVariables);
    }
}
