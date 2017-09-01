package cn.thinkingdata.web.persistence.industry;

import cn.thinkingdata.web.domain.industry.Do_industry_article_topic;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_industry_article_topic {
	List<Do_industry_article_topic> getArticleTopicByDateSpan(@Param("start_date") String startDate, @Param("end_date") String endDate);
}
