package cn.thinkingdata.web.domain.apply;

/**
 * @author Carpenter
 * @date 2017/3/10 17:08
 * @description Do_apply_operation_user
 */
public class Do_apply_operation_user {

    //在申请开通的时候发现报错，只能这样了
    private Integer id;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    private String apply_product;
    private String user_company;
    private Integer company_type;
    private String user_name;
    private String user_phone;
    private String email;
    private Integer job_type;
    private String project_names;

    public String getApply_product() {
        return apply_product;
    }

    public void setApply_product(String apply_product) {
        this.apply_product = apply_product;
    }

    public String getUser_company() {
        return user_company;
    }

    public void setUser_company(String user_company) {
        this.user_company = user_company;
    }

    public Integer getCompany_type() {
        return company_type;
    }

    public void setCompany_type(Integer company_type) {
        this.company_type = company_type;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getUser_phone() {
        return user_phone;
    }

    public void setUser_phone(String user_phone) {
        this.user_phone = user_phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getJob_type() {
        return job_type;
    }

    public void setJob_type(Integer job_type) {
        this.job_type = job_type;
    }

    public String getProject_names() {
        return project_names;
    }

    public void setProject_names(String project_names) {
        this.project_names = project_names;
    }

    @Override
    public String toString() {
        return "Do_apply_operation_user{" +
                "apply_product='" + apply_product + '\'' +
                ", user_company='" + user_company + '\'' +
                ", company_type=" + company_type +
                ", user_name='" + user_name + '\'' +
                ", user_phone='" + user_phone + '\'' +
                ", email='" + email + '\'' +
                ", job_type=" + job_type +
                ", project_names='" + project_names + '\'' +
                '}';
    }
}
