package cn.thinkingdata.web.persistence.sigma;


import cn.thinkingdata.web.domain.sigma.Do_sigma_lt_warn;

import java.util.List;

public interface Mapper_sigma_lt_warn {

    public List<Do_sigma_lt_warn> getSigmaItWarnByProjectId(Integer project_id);

}
