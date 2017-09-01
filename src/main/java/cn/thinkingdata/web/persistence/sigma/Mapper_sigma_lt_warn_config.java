package cn.thinkingdata.web.persistence.sigma;


import cn.thinkingdata.web.domain.sigma.Do_sigma_lt_warn_config;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_sigma_lt_warn_config {

    public Do_sigma_lt_warn_config getSigmaItWarnConfig(@Param("project_id") Integer project_id, @Param("user_id") Integer user_id);

    public Integer insertSigmaItWarnConfig(Do_sigma_lt_warn_config doSigmaLtWarnConfig);

    public Integer updateSigmaItWarnConfig(Do_sigma_lt_warn_config doSigmaLtWarnConfig);

    public Integer findCountByUser(Integer user_id);

    public List<Do_sigma_lt_warn_config> getSigmaItWarnConfigByUser(@Param("user_id") Integer user_id,@Param("index") Integer index,@Param("limit") Integer limit);
}
