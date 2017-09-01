package cn.thinkingdata.web.domain.user.custom.inner.sys;

/**
 * @author Carpenter
 * @date 2016/12/5 14:13
 * @description Do_game_sys_analyse_chart
 */
public class Do_game_sys_analyse_chart {

    private Integer chart_id;
    private Integer table_id;
    private String chart_name;
    private Integer chart_order;
    private String chart_explain;
    private Integer form_type;
    private String sql_template;

    public Integer getChart_id() {
        return chart_id;
    }

    public void setChart_id(Integer chart_id) {
        this.chart_id = chart_id;
    }

    public Integer getTable_id() {
        return table_id;
    }

    public void setTable_id(Integer table_id) {
        this.table_id = table_id;
    }

    public String getChart_name() {
        return chart_name;
    }

    public void setChart_name(String chart_name) {
        this.chart_name = chart_name;
    }

    public Integer getChart_order() {
        return chart_order;
    }

    public void setChart_order(Integer chart_order) {
        this.chart_order = chart_order;
    }

    public String getChart_explain() {
        return chart_explain;
    }

    public void setChart_explain(String chart_explain) {
        this.chart_explain = chart_explain;
    }

    public Integer getForm_type() {
        return form_type;
    }

    public void setForm_type(Integer form_type) {
        this.form_type = form_type;
    }

    public String getSql_template() {
        return sql_template;
    }

    public void setSql_template(String sql_template) {
        this.sql_template = sql_template;
    }
}
