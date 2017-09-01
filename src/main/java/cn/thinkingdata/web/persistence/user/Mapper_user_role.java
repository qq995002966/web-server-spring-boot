package cn.thinkingdata.web.persistence.user;

import cn.thinkingdata.web.domain.user.Do_user_role;
import org.apache.ibatis.annotations.Param;

/**
 * Created by Xiaowu on 2016/8/4.
 */
public interface Mapper_user_role {
    Do_user_role getUserRole(@Param("name") String roleName);
}
