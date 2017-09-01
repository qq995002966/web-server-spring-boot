package cn.thinkingdata.web.persistence.industry;

import cn.thinkingdata.web.domain.industry.Do_industry_game_hot_rank;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface Mapper_industry_game_hot_rank {
	public List<Do_industry_game_hot_rank> getGameHotRankByPlatform(String platform);

	public List<Do_industry_game_hot_rank> getGameHotRankByPlatformAndDetailType(@Param("platform") String platform, @Param("detail_type") String detailType,@Param("index") Integer index, @Param("limit") Integer limit);
	public Integer getGameHotRankByPlatformAndDetailTypeCount(@Param("platform") String platform, @Param("detail_type") String detailType);

	public Do_industry_game_hot_rank getGameHotRankByProjectId(@Param("project_id") Integer projectId);
}
