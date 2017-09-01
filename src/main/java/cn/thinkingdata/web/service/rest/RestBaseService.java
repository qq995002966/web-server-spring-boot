package cn.thinkingdata.web.service.rest;

import cn.thinkingdata.web.domain.user.Do_user;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.PropertiesUtil;
import cn.thinkingdata.web.util.WebUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Carpenter
 * @date 2017/4/13 18:01
 * @description RestBaseService
 */
public abstract class RestBaseService {
    private Logger logger = LogManager.getLogger();

    @Autowired
    private RestTemplate restTemplate;

    private static String restUrl = PropertiesUtil.getString("rest.url");

    protected DataResult getApiData(String apiPath) {
        return getApiData(apiPath, null);
    }

    protected DataResult getApiData(String apiPath, Map<String, Object> urlVariables) {
        Do_user user = WebUtil.getCurrentUser();
        if (null != user) {
            if (null == urlVariables) {
                urlVariables = new HashMap<>();
            }
            urlVariables.put("open_id", user.getTg_open_id());
        }
        apiPath = expandURL(restUrl + apiPath, urlVariables);
//        logger.info("apiPath = " + apiPath + "\t\t" + "urlVariables = " + urlVariables);
        return restTemplate.getForEntity(apiPath,
                DataResult.class, urlVariables).getBody();
    }

    protected DataResult postApiData(String apiPath, Map<String, Object> urlVariables) {
        MultiValueMap<String, Object> variables = null;
        Do_user user = WebUtil.getCurrentUser();
        if (null != user) {
            urlVariables.put("open_id", user.getTg_open_id());
        }
        if (urlVariables != null) {
            variables = new LinkedMultiValueMap<>();
            for (Map.Entry entry : urlVariables.entrySet()) {
                variables.add(entry.getKey().toString(), entry.getValue());
            }
        }
        return restTemplate.postForObject(restUrl + apiPath,
                variables,
                DataResult.class);
    }

    private static String expandURL(String url, Map<String, Object> map) {
        StringBuilder sb = new StringBuilder(url).append("?");
        for (Map.Entry entry : map.entrySet()) {
            sb.append(entry.getKey()).append("={").append(entry.getKey()).append("}&");
        }
        return sb.deleteCharAt(sb.length() - 1).toString();
    }

}
