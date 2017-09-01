package cn.thinkingdata.web.persistence.user;


import cn.thinkingdata.web.domain.user.Do_wx_user_info;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

public interface Mapper_wx_user_info {

    public int insertUpdateWXUserInfo(Do_wx_user_info wxUSerInfo);

    public Map getWXNickName(@Param("open_id") String openId);
}
