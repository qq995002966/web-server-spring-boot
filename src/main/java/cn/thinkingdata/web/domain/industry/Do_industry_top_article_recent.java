package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_top_article_recent {
	private String data_date;
	private String title;
	private String url;
	
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	
}
