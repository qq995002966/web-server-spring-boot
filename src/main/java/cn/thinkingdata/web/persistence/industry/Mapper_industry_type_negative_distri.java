package cn.thinkingdata.web.persistence.industry;

import cn.thinkingdata.web.domain.industry.Do_industry_type_negative_distri;
import cn.thinkingdata.web.domain.industry.Do_industry_type_negative_distri_detail;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_industry_type_negative_distri {
	List<Do_industry_type_negative_distri> getNegTotalDistriList();
	
	List<Do_industry_type_negative_distri_detail> getNegDetailDistriList(@Param("platform") String platform, @Param("detail_type") String detailType);
}
