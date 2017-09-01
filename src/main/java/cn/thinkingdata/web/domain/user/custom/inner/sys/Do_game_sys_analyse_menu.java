package cn.thinkingdata.web.domain.user.custom.inner.sys;

/**
 * @author Carpenter
 * @date 2016/12/5 14:24
 * @description Do_game_sys_analyse_menu
 */
public class Do_game_sys_analyse_menu {

    private Integer menu_id;
    private Integer parent_id;
    private Integer service_id;
    private Integer game_id;
    private String menu_name;
    private String menu_ico;

    public Integer getMenu_id() {
        return menu_id;
    }

    public void setMenu_id(Integer menu_id) {
        this.menu_id = menu_id;
    }

    public Integer getParent_id() {
        return parent_id;
    }

    public void setParent_id(Integer parent_id) {
        this.parent_id = parent_id;
    }

    public Integer getService_id() {
        return service_id;
    }

    public void setService_id(Integer service_id) {
        this.service_id = service_id;
    }

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public String getMenu_name() {
        return menu_name;
    }

    public void setMenu_name(String menu_name) {
        this.menu_name = menu_name;
    }

    public String getMenu_ico() {
        return menu_ico;
    }

    public void setMenu_ico(String menu_ico) {
        this.menu_ico = menu_ico;
    }
}
