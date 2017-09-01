package cn.thinkingdata.web.domain.user.custom.inner.sys;

/**
 * @author Carpenter
 * @date 2016/12/5 14:31
 * @description Do_game_sys_analyse_table
 */
public class Do_game_sys_analyse_table {

    private Integer table_id;
    private Integer menu_id;
    private String table_name;
    private String table_type;

    public Integer getTable_id() {
        return table_id;
    }

    public void setTable_id(Integer table_id) {
        this.table_id = table_id;
    }

    public Integer getMenu_id() {
        return menu_id;
    }

    public void setMenu_id(Integer menu_id) {
        this.menu_id = menu_id;
    }

    public String getTable_name() {
        return table_name;
    }

    public void setTable_name(String table_name) {
        this.table_name = table_name;
    }

    public String getTable_type() {
        return table_type;
    }

    public void setTable_type(String table_type) {
        this.table_type = table_type;
    }
}
