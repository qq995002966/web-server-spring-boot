package cn.thinkingdata.web.domain.article;

import org.springframework.stereotype.Repository;

@Repository
public class Do_article_source_dim {
	private String source;
	private String source_name;
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getSource_name() {
		return source_name;
	}
	public void setSource_name(String source_name) {
		this.source_name = source_name;
	}
	
}
