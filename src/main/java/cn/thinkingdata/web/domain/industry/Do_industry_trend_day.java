package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_trend_day {
	private String data_date;
	private Integer forum_post_num;
	private Integer chan_post_num;
	private Integer article_post_num;
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public Integer getForum_post_num() {
		return forum_post_num;
	}
	public void setForum_post_num(Integer forum_post_num) {
		this.forum_post_num = forum_post_num;
	}
	public Integer getChan_post_num() {
		return chan_post_num;
	}
	public void setChan_post_num(Integer chan_post_num) {
		this.chan_post_num = chan_post_num;
	}
	public Integer getArticle_post_num() {
		return article_post_num;
	}
	public void setArticle_post_num(Integer article_post_num) {
		this.article_post_num = article_post_num;
	}
	
	
}
