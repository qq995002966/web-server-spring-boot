package cn.thinkingdata.web.domain.gas;

import org.springframework.stereotype.Repository;

@Repository
public class Do_gas_crawler_info {
	
	private Long info_id;
	private Integer project_id;
	private String project_name;
	private String crawler_name;
	private String host;
	private String addr;
	private Integer status;
	private String forum_name;
	
	public Long getInfo_id() {
		return info_id;
	}
	public void setInfo_id(Long info_id) {
		this.info_id = info_id;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public String getProject_name() {
		return project_name;
	}
	public void setProject_name(String project_name) {
		this.project_name = project_name;
	}
	public String getCrawler_name() {
		return crawler_name;
	}
	public void setCrawler_name(String crawler_name) {
		this.crawler_name = crawler_name;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public String getAddr() {
		return addr;
	}
	public void setAddr(String addr) {
		this.addr = addr;
	}
	public String getForum_name() {
		return forum_name;
	}
	public void setForum_name(String forum_name) {
		this.forum_name = forum_name;
	}
	
	
}
