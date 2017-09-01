package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

@Repository
public class Do_industry_article_classify_distri {
	private String main_class;
	private String sub_class;
	private Integer article_num;
	
	public String getMain_class() {
		return main_class;
	}
	public void setMain_class(String main_class) {
		this.main_class = main_class;
	}
	public String getSub_class() {
		return sub_class;
	}
	public void setSub_class(String sub_class) {
		this.sub_class = sub_class;
	}
	public Integer getArticle_num() {
		return article_num;
	}
	public void setArticle_num(Integer article_num) {
		this.article_num = article_num;
	}
	
	
}
