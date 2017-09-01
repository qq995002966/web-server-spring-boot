package cn.thinkingdata.web.domain.user.custom;

import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public class Do_user_custom_service{
	public static final int IN_TRY = 1;
	public static final int IN_BUY = 2;
	public static final int TRY_EXPIRED = 3;
	public static final int BUY_EXPIRED = 4;
	
	public static final int USER_PORTRAYAL = 1;
	public static final int KEYWORD_MONITOR = 2;
	public static final int CHAT_ANALYSIS = 3;
	public static final int HOTWORD_CUSTOM = 4;
	public static final int EMERGENT_MONITOR = 5;
	public static final int LOST_ANALYSIS = 6;
	public static final int GAME_REPORT = 7;
	
	private Integer user_id;
	private Integer service_type;
	private Integer try_tag;
	private Integer service_status;
	private Date create_time;
	private Date update_time;
	private String final_date;
	private Integer remain_times;
	private Integer report_id;
	private Integer project_id;
	private Integer remaining_days;
	private Integer use_format;

	public Integer getUser_id() {
		return user_id;
	}

	public void setUser_id(Integer user_id) {
		this.user_id = user_id;
	}

	public Integer getService_type() {
		return service_type;
	}

	public void setService_type(Integer service_type) {
		this.service_type = service_type;
	}

	public Integer getTry_tag() {
		return try_tag;
	}

	public void setTry_tag(Integer try_tag) {
		this.try_tag = try_tag;
	}

	public Integer getService_status() {
		return service_status;
	}

	public void setService_status(Integer service_status) {
		this.service_status = service_status;
	}

	public Date getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}

	public Date getUpdate_time() {
		return update_time;
	}

	public void setUpdate_time(Date update_time) {
		this.update_time = update_time;
	}

	public String getFinal_date() {
		return final_date;
	}

	public void setFinal_date(String final_date) {
		this.final_date = final_date;
	}

	public Integer getRemain_times() {
		return remain_times;
	}

	public void setRemain_times(Integer remain_times) {
		this.remain_times = remain_times;
	}

	public Integer getReport_id() {
		return report_id;
	}

	public void setReport_id(Integer report_id) {
		this.report_id = report_id;
	}

	public Integer getProject_id() {
		return project_id;
	}

	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}

	public Integer getRemaining_days() {
		return remaining_days;
	}

	public void setRemaining_days(Integer remaining_days) {
		this.remaining_days = remaining_days;
	}

	public Integer getUse_format() {
		return use_format;
	}

	public void setUse_format(Integer use_format) {
		this.use_format = use_format;
	}

	@Override
	public String toString() {
		return "Do_user_custom_service{" +
				"user_id=" + user_id +
				", service_type=" + service_type +
				", try_tag=" + try_tag +
				", service_status=" + service_status +
				", create_time=" + create_time +
				", update_time=" + update_time +
				", final_date='" + final_date + '\'' +
				", remain_times=" + remain_times +
				", report_id=" + report_id +
				", project_id=" + project_id +
				", remaining_days=" + remaining_days +
				", use_format=" + use_format +
				'}';
	}
}
