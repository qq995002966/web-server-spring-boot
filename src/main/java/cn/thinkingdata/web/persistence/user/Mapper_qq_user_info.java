package cn.thinkingdata.web.persistence.user;

import cn.thinkingdata.web.domain.user.Do_qq_user_info;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

public interface Mapper_qq_user_info {
	public int insertUpdateQQUserInfo(Do_qq_user_info qqUSerInfo);

	public Map getQQNickName(@Param("open_id") String openId);
}
