package cn.thinkingdata.web.service.core.gas;

import cn.thinkingdata.web.domain.gas.Do_gas_apps;
import cn.thinkingdata.web.domain.gas.Do_gas_crawler_info;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_apps;
import cn.thinkingdata.web.persistence.gas.Mapper_gas_crawler_info;
import cn.thinkingdata.web.util.DataResult;
import cn.thinkingdata.web.util.ReturnCodeDim;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by Xiaowu on 2016/8/10.
 */
@Service
public class GasService {

    @Autowired
    private Mapper_gas_crawler_info m_mapper_gas_crawler_info;

    @Autowired
    private Mapper_gas_apps m_mapper_gas_apps;

    public DataResult findGasCrawlerInfoAndGasApps(Integer projectId) {
        List<Do_gas_crawler_info> _ar = m_mapper_gas_crawler_info.getByProjectId(projectId);
        List<Map<String, Object>> gasCrawlerInfoList = new ArrayList<>();
        for(Do_gas_crawler_info do_crawler : _ar){
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("fourm_name", do_crawler.getCrawler_name());
            map.put("info_id", do_crawler.getInfo_id());
            String host = do_crawler.getHost();
            String addr = do_crawler.getAddr();
            String url = host + addr.replace("*", "1");
            map.put("forum_url", url);
            gasCrawlerInfoList.add(map);
        }
        List<Do_gas_apps> _ar2 = m_mapper_gas_apps.getByProjectId(projectId);
        List<Map<String, Object>> gasAppsList = new ArrayList<>();
        for(Do_gas_apps do_app : _ar2){
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("source_type", do_app.getType());
            gasAppsList.add(map);
        }
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("forum_info_list", gasCrawlerInfoList);
        dataMap.put("apps_list", gasAppsList);
        return new DataResult(ReturnCodeDim.SUCCESS, dataMap);
    }
}
