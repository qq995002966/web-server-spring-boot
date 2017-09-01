package cn.thinkingdata.web.domain.user.custom.inner;

import java.util.Date;

/**
 * Created by Xiaowu on 2016/8/24.
 */
public class Do_game_dim {
    private Integer game_id;
    private Integer project_id;
    private String game_abbr;
    private String game_name;
    private String game_platform;
    private String developer;
    private String distributor;
    private Date create_time;

    public Integer getGame_id() {
        return game_id;
    }

    public void setGame_id(Integer game_id) {
        this.game_id = game_id;
    }

    public Integer getProject_id() {
        return project_id;
    }

    public void setProject_id(Integer project_id) {
        this.project_id = project_id;
    }

    public String getGame_abbr() {
        return game_abbr;
    }

    public void setGame_abbr(String game_abbr) {
        this.game_abbr = game_abbr;
    }

    public String getGame_name() {
        return game_name;
    }

    public void setGame_name(String game_name) {
        this.game_name = game_name;
    }

    public String getGame_platform() {
        return game_platform;
    }

    public void setGame_platform(String game_platform) {
        this.game_platform = game_platform;
    }

    public String getDeveloper() {
        return developer;
    }

    public void setDeveloper(String developer) {
        this.developer = developer;
    }

    public String getDistributor() {
        return distributor;
    }

    public void setDistributor(String distributor) {
        this.distributor = distributor;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }
}
