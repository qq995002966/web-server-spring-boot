package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_article_hot_words {
	private String keyword;
	private Integer hot_score;
	private String related_words;
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	public Integer getHot_score() {
		return hot_score;
	}
	public void setHot_score(Integer hot_score) {
		this.hot_score = hot_score;
	}
	public String getRelated_words() {
		return related_words;
	}
	public void setRelated_words(String related_words) {
		this.related_words = related_words;
	}
	
}
