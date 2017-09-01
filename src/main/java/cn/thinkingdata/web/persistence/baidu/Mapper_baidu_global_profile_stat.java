package cn.thinkingdata.web.persistence.baidu;


import cn.thinkingdata.web.domain.baidu.Do_baidu_global_profile_stat;

import java.util.List;

public interface Mapper_baidu_global_profile_stat {
	public Do_baidu_global_profile_stat getProjectGlobalProfile(int projectId);
	public List<Do_baidu_global_profile_stat> getProjectGlobalProfileList();
}
