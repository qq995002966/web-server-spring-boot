package cn.thinkingdata.web.domain.industry;

import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public class Do_content_detail_realtime {
	public static final int FORUM = 1;
	public static final int CHANNEL = 2;
	public static final int ARTICLE = 3;
	
	private Date data_date;
	private Date post_time;
	private Integer post_type;
	private String source_id;
	private String source;
	private String content;
	private String author;
	public Date getData_date() {
		return data_date;
	}
	public void setData_date(Date data_date) {
		this.data_date = data_date;
	}
	public Date getPost_time() {
		return post_time;
	}
	public void setPost_time(Date post_time) {
		this.post_time = post_time;
	}
	public Integer getPost_type() {
		return post_type;
	}
	public void setPost_type(Integer post_type) {
		this.post_type = post_type;
	}
	
	public String getSource_id() {
		return source_id;
	}
	public void setSource_id(String source_id) {
		this.source_id = source_id;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}
}
