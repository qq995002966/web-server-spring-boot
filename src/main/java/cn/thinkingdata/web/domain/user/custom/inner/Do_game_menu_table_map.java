package cn.thinkingdata.web.domain.user.custom.inner;

/**
 * @author Carpenter
 * @date 2016/12/8 18:04
 * @description Do_game_menu_table_map
 */
public class Do_game_menu_table_map {

    private Integer menu_table_id;
    private String table_name;
    private String column_name;
    private String patam;
    private String data_type;
    private String menu;
    private String child_menu;
    private String title;
    private String tag;

    public Integer getMenu_table_id() {
        return menu_table_id;
    }

    public void setMenu_table_id(Integer menu_table_id) {
        this.menu_table_id = menu_table_id;
    }

    public String getTable_name() {
        return table_name;
    }

    public void setTable_name(String table_name) {
        this.table_name = table_name;
    }

    public String getColumn_name() {
        return column_name;
    }

    public void setColumn_name(String column_name) {
        this.column_name = column_name;
    }

    public String getPatam() {
        return patam;
    }

    public void setPatam(String patam) {
        this.patam = patam;
    }

    public String getData_type() {
        return data_type;
    }

    public void setData_type(String data_type) {
        this.data_type = data_type;
    }

    public String getMenu() {
        return menu;
    }

    public void setMenu(String menu) {
        this.menu = menu;
    }

    public String getChild_menu() {
        return child_menu;
    }

    public void setChild_menu(String child_menu) {
        this.child_menu = child_menu;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }
}
