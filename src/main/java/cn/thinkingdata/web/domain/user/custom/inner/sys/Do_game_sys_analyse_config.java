package cn.thinkingdata.web.domain.user.custom.inner.sys;

import cn.thinkingdata.web.constant.ChartForm;

import java.util.Date;

/**
 * @author Carpenter
 * @date 2017/3/1 10:47
 * @description Do_game_sys_analyse_config
 */
public class Do_game_sys_analyse_config {

    /**
     * 图表ID
     */
    private Integer chart_id;
    /**
     * 游戏ID
     */
    private Integer game_id;
    /**
     * 主菜单名称
     */
    private String menu;
    /**
     * 主菜单图标
     */
    private String menu_ico;
    /**
     * 子菜单名称
     */
    private String sub_menu;
    /**
     * 模块名称
     */
    private String table_name;
    /**
     * 模块ID
     */
    private Integer tabel_id;
    /**
     * 图表名称
     */
    private String chart_name;
    /**
     * 图表权重
     */
    private String chart_order;
    /**
     * 报表类型
     */
    private ChartForm form_type;
    /**
     * sql模版
     */
    private String sql_template;
    /**
     * 图表状态
     */
    private Boolean delete_flag;
    /**
     * 创建时间
     */
    private Date create_time;
    /**
     * 更新时间
     */
    private Date update_time;
    /**
     * 指标解释
     */
    private String chart_explain;

    public Integer getChart_id() {
        return chart_id;
    }

    public void setChart_id(Integer chart_id) {
        this.chart_id = chart_id;
    }

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public String getMenu() {
        return menu;
    }

    public void setMenu(String menu) {
        this.menu = menu;
    }

    public String getMenu_ico() {
        return menu_ico;
    }

    public void setMenu_ico(String menu_ico) {
        this.menu_ico = menu_ico;
    }

    public String getSub_menu() {
        return sub_menu;
    }

    public void setSub_menu(String sub_menu) {
        this.sub_menu = sub_menu;
    }

    public String getTable_name() {
        return table_name;
    }

    public void setTable_name(String table_name) {
        this.table_name = table_name;
    }

    public Integer getTabel_id() {
        return tabel_id;
    }

    public void setTabel_id(Integer tabel_id) {
        this.tabel_id = tabel_id;
    }

    public String getChart_name() {
        return chart_name;
    }

    public void setChart_name(String chart_name) {
        this.chart_name = chart_name;
    }

    public String getChart_order() {
        return chart_order;
    }

    public void setChart_order(String chart_order) {
        this.chart_order = chart_order;
    }

    public ChartForm getForm_type() {
        return form_type;
    }

    public void setForm_type(ChartForm form_type) {
        this.form_type = form_type;
    }

    public String getSql_template() {
        return sql_template;
    }

    public void setSql_template(String sql_template) {
        this.sql_template = sql_template;
    }

    public Boolean getDelete_flag() {
        return delete_flag;
    }

    public void setDelete_flag(Boolean delete_flag) {
        this.delete_flag = delete_flag;
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

    public String getChart_explain() {
        return chart_explain;
    }

    public void setChart_explain(String chart_explain) {
        this.chart_explain = chart_explain;
    }

    @Override
    public String toString() {
        return "Do_game_sys_analyse_config{" +
                "chart_id=" + chart_id +
                ", game_id=" + game_id +
                ", menu='" + menu + '\'' +
                ", menu_ico='" + menu_ico + '\'' +
                ", sub_menu='" + sub_menu + '\'' +
                ", table_name='" + table_name + '\'' +
                ", tabel_id=" + tabel_id +
                ", chart_name='" + chart_name + '\'' +
                ", chart_order='" + chart_order + '\'' +
                ", form_type=" + form_type +
                ", sql_template='" + sql_template + '\'' +
                ", delete_flag=" + delete_flag +
                ", create_time=" + create_time +
                ", update_time=" + update_time +
                ", chart_explain='" + chart_explain + '\'' +
                '}';
    }
}
