package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_type_game_num_distri {
	private String platform;
	private String detail_type;
	private Float game_rate;
	private String talent_game_list;
	public String getPlatform() {
		return platform;
	}
	public void setPlatform(String platform) {
		this.platform = platform;
	}
	public String getDetail_type() {
		return detail_type;
	}
	public void setDetail_type(String detail_type) {
		this.detail_type = detail_type;
	}
	public Float getGame_rate() {
		return game_rate;
	}
	public void setGame_rate(Float game_rate) {
		this.game_rate = game_rate;
	}
	public String getTalent_game_list() {
		return talent_game_list;
	}
	public void setTalent_game_list(String talent_game_list) {
		this.talent_game_list = talent_game_list;
	}
	
	
}
