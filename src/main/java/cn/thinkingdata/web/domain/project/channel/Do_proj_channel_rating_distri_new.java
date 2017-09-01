package cn.thinkingdata.web.domain.project.channel;

import java.util.Date;

public class Do_proj_channel_rating_distri_new {

	private Date data_date;
	private Integer agg_code;
	private Integer project_id;
	private Integer source_type;
	private String source_name;
	private String rating_name;
	private Integer num;
	private String es_field_name;
	private String es_field_val;
	private String rating_names;

	public Date getData_date() {
		return data_date;
	}

	public void setData_date(Date data_date) {
		this.data_date = data_date;
	}

	public Integer getAgg_code() {
		return agg_code;
	}

	public void setAgg_code(Integer agg_code) {
		this.agg_code = agg_code;
	}

	public Integer getProject_id() {
		return project_id;
	}

	public void setProject_id(Integer project_id) {
		this.project_id = project_id;
	}

	public Integer getSource_type() {
		return source_type;
	}

	public void setSource_type(Integer source_type) {
		this.source_type = source_type;
	}

	public String getSource_name() {
		return source_name;
	}

	public void setSource_name(String source_name) {
		this.source_name = source_name;
	}

	public String getRating_name() {
		return rating_name;
	}

	public void setRating_name(String rating_name) {
		this.rating_name = rating_name;
	}

	public Integer getNum() {
		return num;
	}

	public void setNum(Integer num) {
		this.num = num;
	}

	public String getEs_field_name() {
		return es_field_name;
	}

	public void setEs_field_name(String es_field_name) {
		this.es_field_name = es_field_name;
	}

	public String getEs_field_val() {
		return es_field_val;
	}

	public void setEs_field_val(String es_field_val) {
		this.es_field_val = es_field_val;
	}

	public String getRating_names() {
		return rating_names;
	}

	public void setRating_names(String rating_names) {
		this.rating_names = rating_names;
	}
}
