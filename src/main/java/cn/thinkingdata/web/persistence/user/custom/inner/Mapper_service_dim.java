package cn.thinkingdata.web.persistence.user.custom.inner;

import cn.thinkingdata.web.domain.user.custom.inner.Do_service_dim;
import org.apache.ibatis.annotations.Param;

/**
 * Created by Xiaowu on 2016/9/7.
 */
public interface Mapper_service_dim {

    public Do_service_dim getGameServiceById(@Param("service_id") Integer serviceId);
}
