package cn.thinkingdata.web.domain.project.channel;

import org.springframework.stereotype.Repository;

@Repository
public class Do_proj_channel_senti_topwords {

	
	public String getData_date() {
		return data_date;
	}
	public void setData_date(String data_date) {
		this.data_date = data_date;
	}
	public String getSenti_type() {
		return senti_type;
	}
	public void setSenti_type(String senti_type) {
		this.senti_type = senti_type;
	}
	public String getKeyword() {
		return keyword;
	}
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	public Integer getNum() {
		return num;
	}
	public void setNum(Integer num) {
		this.num = num;
	}
	public String getChannel_name() {
		return channel_name;
	}
	public void setChannel_name(String channel_name) {
		this.channel_name = channel_name;
	}
	private Long info_id;
	private Integer project_id;
	private String data_date;
	private String senti_type;
	private String keyword;
	private Integer num;
	private Integer total_num;
	private String channel_name;
	
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
	public Integer getTotal_num() {
		return total_num;
	}
	public void setTotal_num(Integer total_num) {
		this.total_num = total_num;
	}
	
	

}
