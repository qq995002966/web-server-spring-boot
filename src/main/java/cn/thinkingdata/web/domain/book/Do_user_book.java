package cn.thinkingdata.web.domain.book;

import com.alibaba.fastjson.annotation.JSONField;

import java.util.Date;

/**
 * Created by Xiaowu on 2016/7/14.
 */
public class Do_user_book {

    @JSONField(serialize=false)
    private Long id;
    private Long user_id;
    private String book_id;
    private Long item_unit_id;
    private Integer project_num;
    private String project_list;
    @JSONField(format="yyyy-MM-dd HH:mm:ss")
    private Date create_time;
    @JSONField(serialize=false)
    private Date update_time;
    private Integer status;
    private String company_name;
    private String company_address;
    private String contact_name;
    private String contact_type;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public String getBook_id() {
        return book_id;
    }

    public void setBook_id(String book_id) {
        this.book_id = book_id;
    }

    public Long getItem_unit_id() {
        return item_unit_id;
    }

    public void setItem_unit_id(Long item_unit_id) {
        this.item_unit_id = item_unit_id;
    }

    public Integer getProject_num() {
        return project_num;
    }

    public void setProject_num(Integer project_num) {
        this.project_num = project_num;
    }

    public String getProject_list() {
        return project_list;
    }

    public void setProject_list(String project_list) {
        this.project_list = project_list;
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

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getCompany_name() {
        return company_name;
    }

    public void setCompany_name(String company_name) {
        this.company_name = company_name;
    }

    public String getCompany_address() {
        return company_address;
    }

    public void setCompany_address(String company_address) {
        this.company_address = company_address;
    }

    public String getContact_name() {
        return contact_name;
    }

    public void setContact_name(String contact_name) {
        this.contact_name = contact_name;
    }

    public String getContact_type() {
        return contact_type;
    }

    public void setContact_type(String contact_type) {
        this.contact_type = contact_type;
    }
}
