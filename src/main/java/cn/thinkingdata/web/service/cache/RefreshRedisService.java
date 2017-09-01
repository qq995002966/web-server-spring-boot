package cn.thinkingdata.web.service.cache;

import cn.thinkingdata.web.domain.table.Do_table_flush_info;
import cn.thinkingdata.web.persistence.table.Mapper_table_flush_info;
import cn.thinkingdata.web.util.DateUtil;
import cn.thinkingdata.web.util.PropertiesUtil;
import cn.thinkingdata.web.util.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

/**
 * @author Carpenter
 * @date 2017/1/4 15:40
 * @description RefreshRedisService
 */
@Service
public class RefreshRedisService {

    @Autowired
    private Mapper_table_flush_info mapperTableFlushInfo;

    @Autowired
    protected RedisService redisService;

    public void refresh() {
        List<Do_table_flush_info> tableFlushInfoList = mapperTableFlushInfo.getAllTableFlushInfo();
        for (Do_table_flush_info tableFlushInfo : tableFlushInfoList) {
            String key = tableFlushInfo.getDb_name() + "." + tableFlushInfo.getTable_name();
            String value = DateUtil.getPreciseDateString(tableFlushInfo.getUpdate_time());
//            Optional<Serializable> dateTime = Optional.ofNullable(RedisUtil.getValue(key));
            Optional dateTime = Optional.ofNullable(redisService.getValue(key));
            if (dateTime.isPresent()) {
                if (!value.equals(dateTime.get())) {
                    insertCache(key, value);
                }
            } else {
                insertCache(key, value);
            }
        }
    }

    private void insertCache(String key, String value) {
        String cacheKeyStr = PropertiesUtil.getString(key);
        if (null != cacheKeyStr && cacheKeyStr.length() > 0) {
            String[] cacheKeyArr = cacheKeyStr.split(",");
            for (String cacheKey : cacheKeyArr) {
                RedisUtil.delAll(cacheKey);
            }
//            RedisUtil.insertKey(key, value);
            redisService.insertKey(key, value);
        }
    }
}
