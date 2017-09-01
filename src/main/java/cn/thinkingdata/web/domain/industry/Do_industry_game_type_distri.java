package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_game_type_distri {
	private String data_date;
	private String platform;
	private String detail_type;
	private Float user_rate;
	private Float game_rate;
	private Integer post_num;
	
	//昨天同期数据
	private Float user_rate_yesterday;
	private Float game_rate_yesterday;
	private Integer post_num_yesterday; 
	
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
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
	public Float getUser_rate() {
		return user_rate;
	}
	public void setUser_rate(Float user_rate) {
		this.user_rate = user_rate;
	}
	public Float getGame_rate() {
		return game_rate;
	}
	public void setGame_rate(Float game_rate) {
		this.game_rate = game_rate;
	}
	public Integer getPost_num() {
		return post_num;
	}
	public void setPost_num(Integer post_num) {
		this.post_num = post_num;
	}
	public Float getUser_rate_yesterday() {
		return user_rate_yesterday;
	}
	public void setUser_rate_yesterday(Float user_rate_yesterday) {
		this.user_rate_yesterday = user_rate_yesterday;
	}
	public Float getGame_rate_yesterday() {
		return game_rate_yesterday;
	}
	public void setGame_rate_yesterday(Float game_rate_yesterday) {
		this.game_rate_yesterday = game_rate_yesterday;
	}
	public Integer getPost_num_yesterday() {
		return post_num_yesterday;
	}
	public void setPost_num_yesterday(Integer post_num_yesterday) {
		this.post_num_yesterday = post_num_yesterday;
	}
	
}
