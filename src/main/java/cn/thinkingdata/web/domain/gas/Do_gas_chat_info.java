package cn.thinkingdata.web.domain.gas;

import org.springframework.stereotype.Repository;

@Repository
public class Do_gas_chat_info {
	private Long info_id;
	private String info_name;
	private Integer user_id;
	private String company;
	private Integer project_id;
	private Integer status;
	private Integer source_type;
	private String file_name;
	private String group_name;
	private String object;
	private String real_file_name;
	private String start_date;
	private String end_date;
	private Long create_time;
	private Long update_time;
	private Integer succ_times;
	private Integer fail_times;
	private Long file_bytes;
	private String dt_create_time;
	private int del_flag;
	
	public Long getInfo_id() {
		return info_id;
	}
	public void setInfo_id(Long info_id) {
		this.info_id = info_id;
	}
	public String getInfo_name() {
		return info_name;
	}
	public void setInfo_name(String info_name) {
		this.info_name = info_name;
	}
	public Integer getUser_id() {
		return user_id;
	}
	public void setUser_id(Integer user_id) {
		this.user_id = user_id;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public Integer getProject_id() {
		return project_id;
	}
	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getSource_type() {
		return source_type;
	}
	public void setSource_type(Integer source_type) {
		this.source_type = source_type;
	}
	public String getFile_name() {
		return file_name;
	}
	public void setFile_name(String file_name) {
		this.file_name = file_name;
	}
	public String getGroup_name() {
		return group_name;
	}
	public void setGroup_name(String group_name) {
		this.group_name = group_name;
	}
	public String getObject() {
		return object;
	}
	public void setObject(String object) {
		this.object = object;
	}
	public String getStart_date() {
		return start_date;
	}
	public void setStart_date(String start_date) {
		this.start_date = start_date;
	}
	public String getEnd_date() {
		return end_date;
	}
	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}
	public Long getCreate_time() {
		return create_time;
	}
	public void setCreate_time(Long create_time) {
		this.create_time = create_time;
	}
	public Long getUpdate_time() {
		return update_time;
	}
	public void setUpdate_time(Long update_time) {
		this.update_time = update_time;
	}	
	public String getDt_create_time() {
		return dt_create_time;
	}
	public void setDt_create_time(String dt_create_time) {
		this.dt_create_time = dt_create_time;
	}
		
	public String getReal_file_name() {
		return real_file_name;
	}
	
	public void setReal_file_name(String real_file_name) {
		this.real_file_name = real_file_name;
	}	
	public Integer getSucc_times() {
		return succ_times;
	}
	public void setSucc_times(Integer succ_times) {
		this.succ_times = succ_times;
	}
	public Integer getFail_times() {
		return fail_times;
	}
	public void setFail_times(Integer fail_times) {
		this.fail_times = fail_times;
	}	
	public Long getFile_bytes() {
		return file_bytes;
	}
	public void setFile_bytes(Long file_bytes) {
		this.file_bytes = file_bytes;
	}
	public int getDel_flag() {
		return del_flag;
	}
	public void setDel_flag(int del_flag) {
		this.del_flag = del_flag;
	}
	
	
}
